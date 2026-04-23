import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fixes common UTF-8 double-encoding issues from Latin-1 dumps
function fixEncoding(text: string): string {
  if (!text) return text;
  return text
    .replace(/Ã¼/g, 'ü').replace(/Ã§/g, 'ç').replace(/ÅŸ/g, 'ş')
    .replace(/ÄŸ/g, 'ğ').replace(/Ä±/g, 'ı').replace(/Ã–/g, 'Ö')
    .replace(/Ã‡/g, 'Ç').replace(/Åž/g, 'Ş').replace(/Ä°/g, 'İ')
    .replace(/Ãœ/g, 'Ü').replace(/Ã¶/g, 'ö');
}

async function migrateContentEntries() {
  console.log('[INFO] Migrating content_entries to Prisma...');
  
  const entries = await prisma.content_entries.findMany();
  console.log(`[INFO] Found ${entries.length} content_entries.`);

  for (const entry of entries) {
    const type = entry.type;
    let slug = entry.slug || `entry-${entry.id}`;
    let titleInternal = `${type} - ${slug}`;

    // Format slug based on type
    if (type === 'service') slug = `hizmetler/${slug}`;
    if (type === 'blog') slug = `blog/${slug}`;

    console.log(`[INFO] Migrating: ${slug}`);

    // Create or find Page
    const page = await prisma.page.upsert({
      where: { slug },
      update: { titleInternal },
      create: { slug, titleInternal }
    });

    // Create Service metadata if applicable
    if (type === 'service') {
      await prisma.service.upsert({
        where: { pageId: page.id },
        update: { category: 'genel' },
        create: {
          pageId: page.id,
          category: 'genel',
          iconKey: entry.image_url
        }
      });
    }

    // Determine block type
    let componentType = 'text_block';
    if (type === 'hero') componentType = 'hero';

    // Create ContentBlock
    let block = await prisma.contentBlock.findFirst({
      where: { pageId: page.id, componentType }
    });

    if (!block) {
      block = await prisma.contentBlock.create({
        data: {
          pageId: page.id,
          componentType,
          sortOrder: 0
        }
      });
    }

    // Create Translations
    const translations = (entry.translations as Record<string, any>) || {};
    for (const [locale, data] of Object.entries(translations)) {
      if (!data) continue;
      
      const contentDataStr = JSON.stringify({
        title: data.title || '',
        content: data.content || '',
        image: entry.image_url || data.image || ''
      });

      await prisma.translation.upsert({
        where: {
          blockId_locale: {
            blockId: block.id,
            locale
          }
        },
        update: { contentData: contentDataStr },
        create: {
          blockId: block.id,
          locale,
          contentData: contentDataStr
        }
      });
    }
  }

  console.log('[SUCCESS] content_entries migration complete.');
}

async function migrateArchiveJson() {
  const archivePath = path.join(__dirname, '../archive/icerik.json');
  
  if (!fs.existsSync(archivePath)) {
    console.warn(`[WARN] ${archivePath} bulunamadı, arşiv migrasyonu atlanıyor.`);
    return;
  }

  const rawData = fs.readFileSync(archivePath, 'utf8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (e) {
    console.error('JSON parse hatası:', e);
    return;
  }

  console.log(`[INFO] Found ${data.length} entries in archive/icerik.json.`);

  for (const row of data) {
    let slug = row.tr_slug;
    if (!slug) continue;
    
    // Category mapping: 1=service, 2=page, 3=blog
    let type = 'page';
    if (row.kategori === '1') {
      type = 'service';
      slug = `hizmetler/${slug}`;
    } else if (row.kategori === '3') {
      type = 'blog';
      slug = `blog/${slug}`;
    }

    const titleInternal = `Archive - ${slug}`;

    const page = await prisma.page.upsert({
      where: { slug },
      update: { titleInternal },
      create: { slug, titleInternal }
    });

    if (type === 'service') {
      await prisma.service.upsert({
        where: { pageId: page.id },
        update: { category: 'arşiv' },
        create: { pageId: page.id, category: 'arşiv' }
      });
    }

    let block = await prisma.contentBlock.findFirst({
      where: { pageId: page.id, componentType: 'text_block' }
    });

    if (!block) {
      block = await prisma.contentBlock.create({
        data: { pageId: page.id, componentType: 'text_block', sortOrder: 0 }
      });
    }

    // Handle TR
    if (row.tr_baslik || row.tr_icerik) {
      const trData = JSON.stringify({
        title: fixEncoding(row.tr_baslik),
        content: fixEncoding(row.tr_icerik)
      });
      await prisma.translation.upsert({
        where: { blockId_locale: { blockId: block.id, locale: 'tr' } },
        update: {}, // don't overwrite if it already exists
        create: { blockId: block.id, locale: 'tr', contentData: trData }
      });
    }

    // Handle EN
    if (row.en_baslik || row.en_icerik) {
      const enData = JSON.stringify({
        title: fixEncoding(row.en_baslik),
        content: fixEncoding(row.en_icerik)
      });
      await prisma.translation.upsert({
        where: { blockId_locale: { blockId: block.id, locale: 'en' } },
        update: {},
        create: { blockId: block.id, locale: 'en', contentData: enData }
      });
    }
  }

  console.log('[SUCCESS] archive/icerik.json migration complete.');
}

async function main() {
  try {
    await migrateContentEntries();
    await migrateArchiveJson();
    console.log('[INFO] All migrations finished successfully!');
  } catch (error) {
    console.error('[ERROR] Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
