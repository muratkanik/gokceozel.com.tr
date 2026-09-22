'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function ensureHizmetlerBlockExists() {
  // 1. Ensure the page exists
  let page = await prisma.page.findUnique({
    where: { slug: 'hizmetler' }
  });

  if (!page) {
    page = await prisma.page.create({
      data: {
        slug: 'hizmetler',
        titleInternal: 'Hizmetler Sayfası',
        seoScore: 100
      }
    });
  }

  // 2. Ensure the services block exists
  let block = await prisma.contentBlock.findFirst({
    where: {
      pageId: page.id,
      componentType: 'services_grid'
    },
    include: {
      translations: true
    }
  });

  if (!block) {
    block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'services_grid',
        sortOrder: 1
      },
      include: {
        translations: true
      }
    });
  }

  return block;
}

// Publish or unpublish a page (used to review AI-generated blog drafts).
export async function setPageStatus(pageId: string, status: 'PUBLISHED' | 'DRAFT') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz işlem');
  if (status !== 'PUBLISHED' && status !== 'DRAFT') throw new Error('Geçersiz durum');

  const page = await prisma.page.update({
    where: { id: pageId },
    data: { status },
    select: { slug: true, type: true },
  });

  revalidatePath('/admin/icerikler');
  if (page.type === 'BLOG') {
    revalidatePath('/blog');
    revalidatePath(`/blog/${page.slug}`);
    revalidatePath('/sitemap.xml');
    revalidatePath('/feed.xml');
  }
  return { ok: true };
}
