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
