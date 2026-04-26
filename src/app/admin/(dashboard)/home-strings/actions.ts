'use server';

import prisma from '@/lib/prisma';

export async function ensureHomePageBlockExists() {
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

  let block = await prisma.contentBlock.findFirst({
    where: {
      pageId: page.id,
      componentType: 'home_page_strings'
    },
    include: {
      translations: true
    }
  });

  if (!block) {
    block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'home_page_strings',
        sortOrder: 2
      },
      include: {
        translations: true
      }
    });
  }

  return block;
}
