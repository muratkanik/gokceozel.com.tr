'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function ensureHeroBlockExists() {
  // 1. Ensure the page exists
  let page = await prisma.page.findUnique({
    where: { slug: 'home' }
  });

  if (!page) {
    page = await prisma.page.create({
      data: {
        slug: 'home',
        titleInternal: 'Ana Sayfa',
        seoScore: 100
      }
    });
  }

  // 2. Ensure the hero block exists
  let block = await prisma.contentBlock.findFirst({
    where: {
      pageId: page.id,
      componentType: 'hero'
    },
    include: {
      translations: true
    }
  });

  if (!block) {
    block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'hero',
        sortOrder: 1
      },
      include: {
        translations: true
      }
    });
  }

  return block;
}
