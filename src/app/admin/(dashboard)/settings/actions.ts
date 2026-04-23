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
