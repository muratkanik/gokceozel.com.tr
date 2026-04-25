'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
