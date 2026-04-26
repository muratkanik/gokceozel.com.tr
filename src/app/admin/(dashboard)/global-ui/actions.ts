'use server';

import prisma from '@/lib/prisma';

export async function ensureGlobalUIBlockExists() {
  let page = await prisma.page.findUnique({
    where: { slug: 'global-settings' }
  });

  if (!page) {
    page = await prisma.page.create({
      data: {
        slug: 'global-settings',
        titleInternal: 'Genel Ayarlar',
        seoScore: 100
      }
    });
  }

  let block = await prisma.contentBlock.findFirst({
    where: {
      pageId: page.id,
      componentType: 'global_ui_strings'
    },
    include: {
      translations: true
    }
  });

  if (!block) {
    block = await prisma.contentBlock.create({
      data: {
        pageId: page.id,
        componentType: 'global_ui_strings',
        sortOrder: 1
      },
      include: {
        translations: true
      }
    });
  }

  return block;
}
