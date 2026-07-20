'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const VideoSchema = z.object({
  youtubeId: z.string().min(1, 'YouTube ID is required'),
  title: z.string().min(1, 'Title is required'),
  contentHtml: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function getVideos() {
  return prisma.video.findMany({
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getVideo(id: string) {
  if (id === 'yeni') return null;
  return prisma.video.findUnique({
    where: { id },
  });
}

export async function saveVideo(id: string, data: any) {
  try {
    const validatedData = VideoSchema.parse(data);

    if (id === 'yeni') {
      const newVideo = await prisma.video.create({
        data: validatedData,
      });
      revalidatePath('/admin/videolar');
      revalidatePath('/videolar');
      return { success: true, id: newVideo.id };
    }

    await prisma.video.update({
      where: { id },
      data: validatedData,
    });
    
    revalidatePath('/admin/videolar');
    revalidatePath(`/admin/videolar/${id}`);
    revalidatePath('/videolar');
    if (validatedData.slug) {
      revalidatePath(`/videolar/${validatedData.slug}`);
    }

    return { success: true, id };
  } catch (error: any) {
    console.error('Failed to save video:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteVideo(id: string) {
  try {
    await prisma.video.delete({
      where: { id },
    });
    revalidatePath('/admin/videolar');
    revalidatePath('/videolar');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function syncYouTubeChannel() {
  try {
    const { Innertube } = await import('youtubei.js');
    const youtube = await Innertube.create();
    const channel = await youtube.getChannel('UCPjdRlsO9Fu0p5ZxQm-ZMTA'); // @profdrgokceozel
    
    const playlistsTab = await channel.getPlaylists();
    const playlists = playlistsTab.playlists || playlistsTab.content?.contents;
    
    if (!playlists || playlists.length === 0) {
      return { success: false, error: 'No playlists found' };
    }

    let syncedCount = 0;

    for (const pl of playlists) {
      if (pl.type === 'LockupView' && pl.content_id) {
        const playlistId = pl.content_id;
        const playlistTitle = pl.metadata?.title?.toString() || 'Kategori';
        
        const playlistData = await youtube.getPlaylist(playlistId);
        
        for (const item of playlistData.items) {
          let videoId = '';
          let videoTitle = '';

          if (item.type === 'LockupView' && item.content_type === 'VIDEO') {
            videoId = item.content_id as string;
            videoTitle = (item as any).metadata?.title?.toString() || '';
          } else if (item.id && item.title) {
            videoId = item.id as string;
            videoTitle = item.title.toString();
          } else if (item.type === 'PlaylistVideo' || item.type === 'Video') {
            videoId = (item as any).id || (item as any).video_id;
            videoTitle = (item as any).title?.toString() || '';
          }

          if (!videoId || !videoTitle) continue;
          
          const titleStr = videoTitle;
          
          // Generate a slug
          const slugBase = titleStr
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
          
          // Use youtubeId in slug to guarantee uniqueness
          const slug = `${slugBase}-${videoId}`;

          await prisma.video.upsert({
            where: { youtubeId: videoId },
            update: {
              playlistId,
              playlistTitle,
              // don't overwrite title and slug if they exist and user edited them, but we update playlist info
            },
            create: {
              youtubeId: videoId,
              title: titleStr,
              slug,
              playlistId,
              playlistTitle,
              isActive: true,
              sortOrder: syncedCount,
            }
          });
          
          syncedCount++;
        }
      }
    }
    
    revalidatePath('/admin/videolar');
    revalidatePath('/videolar');
    return { success: true, count: syncedCount };

  } catch (error: any) {
    console.error('Failed to sync YouTube:', error);
    return { success: false, error: error.message };
  }
}

export async function translateVideo(id: string) {
  try {
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) return { success: false, error: 'Video bulunamadı.' };

    const locales = ['en', 'de', 'fr', 'ru', 'ar'];
    const currentTranslations: any = (video.translations as any) || {};

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return { success: false, error: 'OpenAI API key eksik.' };
    }

    const payload = {
      title: video.title,
      contentHtml: video.contentHtml || '',
    };

    for (const locale of locales) {
      const systemPrompt = `Translate the following JSON object's string values to ${locale.toUpperCase()}. DO NOT change any of the JSON keys, only translate the values. Preserve all HTML tags and attributes exactly as they are in the contentHtml field. Return ONLY valid JSON without any markdown formatting or explanation.`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(payload) }
          ],
          temperature: 0.3,
        })
      });

      if (res.ok) {
        const data = await res.json();
        let result = data.choices[0].message.content.trim();
        if (result.startsWith('```json')) result = result.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        if (result.startsWith('```')) result = result.replace(/^```\n?/, '').replace(/\n?```$/, '');
        
        try {
          const parsed = JSON.parse(result);
          currentTranslations[locale] = {
            title: parsed.title,
            contentHtml: parsed.contentHtml
          };
        } catch (e) {
          console.error(`Failed to parse translation for ${locale}`, result);
        }
      }
    }

    await prisma.video.update({
      where: { id },
      data: { translations: currentTranslations },
    });

    revalidatePath(`/admin/videolar/${id}`);
    revalidatePath('/videolar');
    if (video.slug) {
      revalidatePath(`/videolar/${video.slug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to translate video:', error);
    return { success: false, error: error.message };
  }
}
