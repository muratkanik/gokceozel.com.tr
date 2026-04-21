'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPage(formData: FormData) {
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
}

export async function deletePage(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  await prisma.page.delete({ where: { id } });
  revalidatePath('/admin/pages');
}
