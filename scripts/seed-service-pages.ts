/**
 * Seeds all service pages from service-slugs.ts into the Page table.
 * Safe to run multiple times (upsert by slug).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SERVICE_PAGES: Array<{ slug: string; titleInternal: string; category: string }> = [
  { slug: 'rinoplasti', titleInternal: 'Rinoplasti (Burun Estetiği)', category: 'cerrahi' },
  { slug: 'revizyon-rinoplasti', titleInternal: 'Revizyon Rinoplasti', category: 'cerrahi' },
  { slug: 'septorinoplasti', titleInternal: 'Septorinoplasti', category: 'cerrahi' },
  { slug: 'sinuzit-ameliyati', titleInternal: 'Sinüzit Ameliyatı', category: 'cerrahi' },
  { slug: 'goz-kapagi-estetigi', titleInternal: 'Göz Kapağı Estetiği (Blefaroplasti)', category: 'cerrahi' },
  { slug: 'alt-blefaroplasti', titleInternal: 'Alt Blefaroplasti', category: 'cerrahi' },
  { slug: 'kas-kaldirma', titleInternal: 'Kaş Kaldırma (Üst Blefaroplasti)', category: 'cerrahi' },
  { slug: 'ameliyatsiz-kas-kaldirma', titleInternal: 'Ameliyatsız Kaş Kaldırma', category: 'ameliyatsiz' },
  { slug: 'botoks-ile-kas-kaldirma', titleInternal: 'Botoks ile Kaş Kaldırma', category: 'ameliyatsiz' },
  { slug: 'botulinum-toksin-uygulamasi', titleInternal: 'Botulinum Toksin Uygulaması', category: 'ameliyatsiz' },
  { slug: 'botoks', titleInternal: 'Botoks', category: 'ameliyatsiz' },
  { slug: 'dolgu-i-slemleri', titleInternal: 'Dolgu İşlemleri', category: 'ameliyatsiz' },
  { slug: 'dolgu', titleInternal: 'Dolgu', category: 'ameliyatsiz' },
  { slug: 'dolgu-ile-kas-kaldirma', titleInternal: 'Dolgu ile Kaş Kaldırma', category: 'ameliyatsiz' },
  { slug: 'dudak-dolgusu', titleInternal: 'Dudak Dolgusu', category: 'ameliyatsiz' },
  { slug: 'dudak-estetigi-liplift', titleInternal: 'Dudak Kaldırma (Lip Lift)', category: 'cerrahi' },
  { slug: 'endolift', titleInternal: 'Endolift Lazer', category: 'ameliyatsiz' },
  { slug: 'mezoterapi', titleInternal: 'Mezoterapi', category: 'ameliyatsiz' },
  { slug: 'yuz-mezoterapisi', titleInternal: 'Yüz Mezoterapisi', category: 'ameliyatsiz' },
  { slug: 'lipoliz-i-nceltme-mezoterapisi', titleInternal: 'Lipoliz (İnceltme Mezoterapisi)', category: 'ameliyatsiz' },
  { slug: 'i-ple-yuz-germe-fransiz-aski', titleInternal: 'İple Yüz Germe (Fransız Askı)', category: 'ameliyatsiz' },
  { slug: 'i-ple-kas-kaldirma', titleInternal: 'İple Kaş Kaldırma', category: 'ameliyatsiz' },
  { slug: 'gamze-estetigi', titleInternal: 'Gamze Estetiği', category: 'cerrahi' },
  { slug: 'kepce-kulak-estetigi-otoplasti', titleInternal: 'Kepçe Kulak Estetiği (Otoplasti)', category: 'cerrahi' },
  { slug: 'prp-uygulamasi', titleInternal: 'PRP Uygulaması', category: 'ameliyatsiz' },
  { slug: 'cilt-yenileme', titleInternal: 'Cilt Yenileme', category: 'ameliyatsiz' },
  { slug: 'mikro-i-gneleme', titleInternal: 'Mikro İğneleme (Dermapen)', category: 'ameliyatsiz' },
  { slug: 'cilt-soyma-kimyasal-peeling-i-slemleri', titleInternal: 'Kimyasal Peeling', category: 'ameliyatsiz' },
  { slug: 'skar-revizyonu-yara-izi-estetigi', titleInternal: 'Skar Revizyonu / Yara İzi Estetiği', category: 'cerrahi' },
  { slug: 'ozon-uygulamasi', titleInternal: 'Ozon Uygulaması', category: 'ameliyatsiz' },
  { slug: 'damar-icine-glutatyon-uygulamasi', titleInternal: 'Glutatyon IV Uygulaması', category: 'ameliyatsiz' },
  { slug: 'yuz-germe-facelift', titleInternal: 'Yüz Germe (Facelift)', category: 'cerrahi' },
  { slug: 'bisektomi', titleInternal: 'Bisektomi (Yanak İnceltme)', category: 'cerrahi' },
  { slug: 'cene-estetigi-mentoplasti', titleInternal: 'Çene Estetiği (Mentoplasti)', category: 'cerrahi' },
  { slug: 'gidi-liposuction', titleInternal: 'Çift Çene Liposuction', category: 'cerrahi' },
  { slug: 'badem-goz-estetigi', titleInternal: 'Badem Göz Estetiği', category: 'cerrahi' },
  { slug: 'goz-alti-isik-dolgusu', titleInternal: 'Göz Altı Işık Dolgusu', category: 'ameliyatsiz' },
  { slug: 'migren-tedavisi', titleInternal: 'Migren Tedavisi', category: 'kbb' },
];

async function main() {
  console.log(`Seeding ${SERVICE_PAGES.length} service pages…`);
  let created = 0;
  let skipped = 0;

  for (const page of SERVICE_PAGES) {
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.page.create({
      data: {
        slug: page.slug,
        titleInternal: page.titleInternal,
        type: 'SERVICE',
        status: 'PUBLISHED',
        seoScore: 0,
      },
    });
    created++;
    console.log(`  ✓ ${page.slug}`);
  }

  console.log(`\nDone: ${created} created, ${skipped} already existed.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
