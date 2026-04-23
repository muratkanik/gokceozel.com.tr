'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPage(formData: FormData) {
  try {
    const slug = formData.get('slug') as string;
    const titleInternal = formData.get('titleInternal') as string;
    const seoScore = parseInt(formData.get('seoScore') as string) || 0;

    if (!slug || !titleInternal) return;

    await prisma.page.create({
      data: {
        slug: slug.toLowerCase().replace(/[^a-z0-9/-]/g, '-'),
        titleInternal,
        seoScore
      }
    });

    revalidatePath('/admin/pages');
  } catch (e: any) {
    if (e.message && e.message.includes('NEXT_REDIRECT')) throw e;
    console.error('createPage error:', e);
    redirect(`/admin/pages?error=${encodeURIComponent(e.message || 'Bilinmeyen Hata')}`);
  }
}

export async function deletePage(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    if (!id) return;

    await prisma.page.delete({ where: { id } });
    revalidatePath('/admin/pages');
  } catch (e: any) {
    if (e.message && e.message.includes('NEXT_REDIRECT')) throw e;
    console.error('deletePage error:', e);
    redirect(`/admin/pages?error=${encodeURIComponent(e.message || 'Bilinmeyen Hata')}`);
  }
}
