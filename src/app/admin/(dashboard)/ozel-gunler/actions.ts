'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function getEvents() {
  return await prisma.special_events.findMany({
    orderBy: { start_date: 'desc' }
  });
}

export async function getEventById(id: string) {
  return await prisma.special_events.findUnique({
    where: { id }
  });
}

export async function upsertEvent(data: any) {
  const { id, event_name, start_date, end_date, theme_class, popup_translations, is_active } = data;

  const isoStartDate = new Date(start_date).toISOString();
  const isoEndDate = new Date(end_date).toISOString();

  if (id) {
    await prisma.special_events.update({
      where: { id },
      data: {
        event_name,
        start_date: isoStartDate,
        end_date: isoEndDate,
        theme_class,
        popup_translations,
        is_active,
      }
    });
  } else {
    await prisma.special_events.create({
      data: {
        event_name,
        start_date: isoStartDate,
        end_date: isoEndDate,
        theme_class,
        popup_translations,
        is_active,
      }
    });
  }
  
  revalidatePath('/', 'layout');
  revalidatePath('/admin/ozel-gunler');
}

export async function deleteEvent(id: string) {
  await prisma.special_events.delete({
    where: { id }
  });
  
  revalidatePath('/', 'layout');
  revalidatePath('/admin/ozel-gunler');
}
