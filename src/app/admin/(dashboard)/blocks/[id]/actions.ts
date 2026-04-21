'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveTranslations(blockId: string, translations: Record<string, string>) {
  for (const [locale, contentData] of Object.entries(translations)) {
    await prisma.translation.upsert({
      where: {
        blockId_locale: {
          blockId,
          locale
        }
      },
      update: { contentData },
      create: {
        blockId,
        locale,
        contentData
      }
    });
  }

  try {
    revalidatePath('/admin/blocks');
    revalidatePath(`/admin/blocks/${blockId}`);
    revalidatePath('/', 'layout'); // clear all frontend cache just in case
    return { success: true };
  } catch (err: any) {
    console.error('saveTranslations error:', err);
    throw new Error('Server component revalidation failed.');
  }
}
