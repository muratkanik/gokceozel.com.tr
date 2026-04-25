const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Starting content cleanup...');

  // 1. Delete empty placeholder pages (PAGE 61, 62 etc)
  const emptyPages = await prisma.content_entries.findMany({
    where: {
      type: 'page',
      slug: {
        startsWith: 'page-'
      }
    }
  });

  for (const page of emptyPages) {
    let title = '';
    if (page.translations && page.translations.tr) {
      title = page.translations.tr.title || '';
    }
    
    // Only delete if the title is actually "PAGE XX"
    if (title.toUpperCase().startsWith('PAGE')) {
      await prisma.content_entries.delete({ where: { id: page.id } });
      console.log(`Deleted empty page: ${page.slug} (${title})`);
    }
  }

  // 2. Classify informational pages as "blog"
  const blogSlugs = [
    'estetik-operasyonlar-psikolojiyi-nasl-etkiliyor',
    'neden-estetii-tercih-ettiniz',
    'ameliyat-sreci-nasl-liyor',
    'yz-estetii-mi-dnyorsunuz',
    'lemim-nerede-yaplacak',
    'yz-prosedrleri'
  ];

  for (const slug of blogSlugs) {
    await prisma.content_entries.updateMany({
      where: { slug: slug },
      data: { type: 'blog' }
    });
    console.log(`Updated slug ${slug} to type: blog`);
  }

  // 3. Classify biography and clinic as "page"
  // They are already "page", but let's ensure they are labeled BIOGRAPHY if we were using Prisma Page model.
  // Since we are moving to Prisma Page, let's sync all `content_entries` to Prisma `Page` model.

  const allEntries = await prisma.content_entries.findMany();
  for (const entry of allEntries) {
    let newType = 'PAGE';
    if (entry.type === 'service') newType = 'SERVICE';
    if (entry.type === 'blog') newType = 'BLOG';
    if (entry.slug === 'gke-zel-kimdir' || entry.slug === 'prof-dr-gke-zel-klinii') newType = 'BIOGRAPHY';

    let titleInternal = entry.slug;
    if (entry.translations && entry.translations.tr && entry.translations.tr.title) {
      titleInternal = entry.translations.tr.title;
    }

    // Upsert into Prisma Page
    await prisma.page.upsert({
      where: { slug: entry.slug },
      create: {
        slug: entry.slug,
        type: newType,
        titleInternal: titleInternal
      },
      update: {
        type: newType,
        titleInternal: titleInternal
      }
    });
  }

  console.log('Successfully synced and cleaned up all pages into Prisma Page model.');
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
