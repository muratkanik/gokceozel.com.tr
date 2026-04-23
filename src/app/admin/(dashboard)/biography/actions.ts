'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function ensureBiographyBlockExists() {
  // 1. Ensure the page exists
  let page = await prisma.page.findUnique({
    where: { slug: 'gokce-ozel-kimdir' }
  });

  if (!page) {
    page = await prisma.page.create({
      data: {
        slug: 'gokce-ozel-kimdir',
        titleInternal: 'Biyografi Sayfası',
        seoScore: 100
      }
    });
  }

  // 2. Ensure the biography block exists
  let block = await prisma.contentBlock.findFirst({
    where: {
      pageId: page.id,
      componentType: 'biography'
    },
    include: {
      translations: true
    }
  });

  if (!block) {
    block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'biography',
        sortOrder: 1
      },
      include: {
        translations: true
      }
    });
  }

  return block;
}
