/**
 * scripts/migrate-icerik.ts
 *
 * Eski MySQL dump (archive/icerik.json) → Prisma Page/ContentBlock/Translation/SeoMeta
 *
 * Çalıştırma:
 *   npx tsx scripts/migrate-icerik.ts
 *
 * Özellikler:
 *   - Latin-1 olarak yanlış yorumlanmış UTF-8 karakterleri düzeltir
 *   - HTML entity'leri çözer
 *   - URL-safe slug üretir
 *   - Her kaydı Page + hero_slider bloğu + zengin_metin bloğu olarak ekler
 *   - TR ve EN çevirilerini ayrı Translation kayıtları olarak oluşturur
 *   - SeoMeta (metaTitle, metaDescription) ekler
 *   - Eski URL'den yeni URL'ye Redirect kaydı oluşturur
 *   - Mevcut slug varsa atlar (idempotent)
 */

import prisma from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// ─── Encoding Fix ────────────────────────────────────────────────────────────

function fixEncoding(s: string | null | undefined): string {
  if (!s) return '';
  let result = s;
  // Try Latin-1 → UTF-8 re-interpretation
  try {
    const bytes = Buffer.from(result, 'latin1');
    const decoded = bytes.toString('utf-8');
    // Only use decoded if it looks more valid (less replacement chars)
    if ((decoded.match(/[şğüçöıİŞĞÜÇÖ]/g) || []).length > 0) {
      result = decoded;
    }
  } catch {}
  // Unescape HTML entities
  result = result
    .replace(/&Uuml;/g, 'Ü').replace(/&uuml;/g, 'ü')
    .replace(/&Ouml;/g, 'Ö').replace(/&ouml;/g, 'ö')
    .replace(/&Auml;/g, 'Ä').replace(/&auml;/g, 'ä')
    .replace(/&ccedil;/g, 'ç').replace(/&Ccedil;/g, 'Ç')
    .replace(/&scaron;/g, 'š').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&apos;/g, "'").replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"');
  // Second pass: try latin1 again after entity fix
  try {
    const bytes2 = Buffer.from(result, 'latin1');
    const decoded2 = bytes2.toString('utf-8');
    if ((decoded2.match(/[şğüçöıİŞĞÜÇÖ]/g) || []).length >= (result.match(/[şğüçöıİŞĞÜÇÖ]/g) || []).length) {
      result = decoded2;
    }
  } catch {}
  // Unescape HTML entities again
  result = result
    .replace(/&Uuml;/g, 'Ü').replace(/&uuml;/g, 'ü')
    .replace(/&Ouml;/g, 'Ö').replace(/&ouml;/g, 'ö')
    .replace(/&ccedil;/g, 'ç').replace(/&Ccedil;/g, 'Ç')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return result.trim();
}

// ─── Slug Generator ──────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/İ/g, 'i').replace(/Ğ/g, 'g').replace(/Ü/g, 'u')
    .replace(/Ş/g, 's').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ─── Page Type Classifier ─────────────────────────────────────────────────────

function classifyPage(title: string, cat: string): 'SERVICE' | 'PAGE' | 'BIOGRAPHY' {
  const t = title.toLowerCase();
  const serviceKeywords = [
    'rinoplasti', 'blefaroplasti', 'botoks', 'botulinum', 'dolgu', 'endolift',
    'mezoterapi', 'dudak', 'gamze', 'kepçe', 'otoplasti', 'lazer', 'prp',
    'liposuction', 'facelift', 'mentoplasti', 'bişektomi', 'peeling', 'skar',
    'liplift', 'kaş kaldırma', 'septoplasti', 'sinüzit', 'migren', 'ozon',
    'glutatyon', 'mikro iğneleme', 'gıdı', 'yüz germe', 'yüz boyun', 'badem göz',
    'revizyon', 'septorinoplasti',
  ];
  if (serviceKeywords.some(kw => t.includes(kw))) return 'SERVICE';
  if (t.includes('kimdir') || t.includes('biyografi') || t.includes('biography')) return 'BIOGRAPHY';
  return 'PAGE';
}

// ─── Service Category Classifier ─────────────────────────────────────────────

function serviceCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('rinoplasti') || t.includes('burun') || t.includes('septoplasti') || t.includes('sinüzit') || t.includes('septorinoplasti')) return 'burun';
  if (t.includes('blefaroplasti') || t.includes('göz kapağı') || t.includes('badem göz')) return 'goz';
  if (t.includes('dudak') || t.includes('liplift') || t.includes('gamze')) return 'dudak';
  if (t.includes('botoks') || t.includes('botulinum') || t.includes('dolgu') || t.includes('endolift') || t.includes('mezoterapi') || t.includes('prp') || t.includes('lazer') || t.includes('ip') || t.includes('ozon') || t.includes('glutatyon')) return 'cerrahsiz';
  if (t.includes('kepçe') || t.includes('otoplasti')) return 'kulak';
  if (t.includes('facelift') || t.includes('liposuction') || t.includes('peeling') || t.includes('skar') || t.includes('bişektomi') || t.includes('mentoplasti') || t.includes('yüz boyun') || t.includes('gıdı') || t.includes('mikro') || t.includes('kaş')) return 'cilt';
  return 'diger';
}

// ─── Main Migration ───────────────────────────────────────────────────────────

async function main() {
  const jsonPath = path.join(process.cwd(), 'archive', 'icerik.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ archive/icerik.json bulunamadı');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📂 ${raw.length} kayıt okundu`);

  let created = 0, skipped = 0, errors = 0;

  for (const record of raw) {
    // Başlık: önce tr_baslik, yoksa tr_slug
    const rawTitle = record.tr_baslik || record.tr_slug || '';
    const title = fixEncoding(rawTitle);
    if (!title || title.length < 3) { skipped++; continue; }

    const slug = slugify(title);
    if (!slug) { skipped++; continue; }

    const trContent = fixEncoding(record.tr_icerik || '');
    const enTitle = fixEncoding(record.en_baslik || record.en_slug || title);
    const enContent = fixEncoding(record.en_icerik || '');
    const trSeoTitle = fixEncoding(record.tr_seo_title || title);
    const trSeoDesc = fixEncoding(record.tr_seo_description || '');
    const oldSlug = record.tr_slug || '';

    const pageType = classifyPage(title, record.kategori || '');

    try {
      // Idempotent: slug zaten varsa atla
      const existing = await prisma.page.findUnique({ where: { slug } });
      if (existing) {
        console.log(`  ⏭  Skip (exists): ${slug}`);
        skipped++;
        continue;
      }

      // 1. Page
      const page = await prisma.page.create({
        data: {
          slug,
          type: pageType,
          titleInternal: title,
          seoScore: trSeoTitle ? 50 : 10,
        },
      });

      // 2. ContentBlock: hero_slider
      const heroBlock = await prisma.contentBlock.create({
        data: {
          pageId: page.id,
          componentType: 'hero_slider',
          sortOrder: 0,
          isActive: true,
          schemaDef: '{}',
        },
      });

      // 3. Translation TR for hero
      await prisma.translation.create({
        data: {
          blockId: heroBlock.id,
          locale: 'tr',
          contentData: JSON.stringify({ title, subtitle: '' }),
        },
      });
      if (enTitle) {
        await prisma.translation.create({
          data: {
            blockId: heroBlock.id,
            locale: 'en',
            contentData: JSON.stringify({ title: enTitle, subtitle: '' }),
          },
        });
      }

      // 4. ContentBlock: zengin_metin (if content exists)
      if (trContent || enContent) {
        const textBlock = await prisma.contentBlock.create({
          data: {
            pageId: page.id,
            componentType: 'zengin_metin',
            sortOrder: 1,
            isActive: true,
            schemaDef: '{}',
          },
        });
        if (trContent) {
          await prisma.translation.create({
            data: {
              blockId: textBlock.id,
              locale: 'tr',
              contentData: JSON.stringify({ text: trContent }),
            },
          });
        }
        if (enContent) {
          await prisma.translation.create({
            data: {
              blockId: textBlock.id,
              locale: 'en',
              contentData: JSON.stringify({ text: enContent }),
            },
          });
        }
      }

      // 5. SeoMeta TR
      if (trSeoTitle) {
        await prisma.seoMeta.create({
          data: {
            pageId: page.id,
            locale: 'tr',
            metaTitle: trSeoTitle.slice(0, 60),
            metaDescription: trSeoDesc.slice(0, 160),
            robots: 'index,follow',
          },
        });
      }

      // 6. Service record (if SERVICE type)
      if (pageType === 'SERVICE') {
        await prisma.service.upsert({
          where: { pageId: page.id },
          update: {},
          create: {
            pageId: page.id,
            category: serviceCategory(title),
            sortOrder: created,
          },
        });
      }

      // 7. Redirect: eski slug → yeni slug (if different)
      if (oldSlug && oldSlug !== slug) {
        const fromPath = `/icerik/${record.id}/${oldSlug}`;
        const toPath = pageType === 'SERVICE' ? `/hizmetler/${slug}` : `/${slug}`;
        try {
          await prisma.redirect.upsert({
            where: { fromPath },
            update: { toPath },
            create: { fromPath, toPath, statusCode: 301 },
          });
        } catch {}
        // Also: direct old slug redirect
        try {
          await prisma.redirect.upsert({
            where: { fromPath: `/${oldSlug}` },
            update: { toPath },
            create: { fromPath: `/${oldSlug}`, toPath, statusCode: 301 },
          });
        } catch {}
      }

      console.log(`  ✅ ${pageType.padEnd(9)} ${slug}`);
      created++;
    } catch (err: any) {
      console.error(`  ❌ HATA [${slug}]: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Sonuç: ${created} oluşturuldu, ${skipped} atlandı, ${errors} hata`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
