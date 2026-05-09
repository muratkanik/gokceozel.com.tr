'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveSetting(formData: FormData) {
  const key = formData.get('key') as string;
  const value = formData.get('value') as string;

  if (!key) return;

  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });

  revalidatePath('/admin/settings');
  revalidatePath('/[locale]', 'layout');
}

export async function deleteSetting(formData: FormData) {
  const key = formData.get('key') as string;
  if (!key) return;

  await prisma.setting.delete({ where: { key } });
  revalidatePath('/admin/settings');
}

export async function saveLocationSettings(lat: string, lng: string) {
  await prisma.setting.upsert({ where: { key: 'contact_lat' }, update: { value: lat }, create: { key: 'contact_lat', value: lat } });
  await prisma.setting.upsert({ where: { key: 'contact_lng' }, update: { value: lng }, create: { key: 'contact_lng', value: lng } });
  revalidatePath('/admin/settings');
  revalidatePath('/[locale]', 'layout');
}
