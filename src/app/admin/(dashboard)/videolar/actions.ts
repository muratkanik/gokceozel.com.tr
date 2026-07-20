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
          if (!item.id || !item.title) continue;
          
          const titleStr = item.title.toString();
          
          // Generate a slug
          const slugBase = titleStr
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
          
          // Use youtubeId in slug to guarantee uniqueness
          const slug = `${slugBase}-${item.id}`;

          await prisma.video.upsert({
            where: { youtubeId: item.id },
            update: {
              playlistId,
              playlistTitle,
              // don't overwrite title and slug if they exist and user edited them, but we update playlist info
            },
            create: {
              youtubeId: item.id,
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
