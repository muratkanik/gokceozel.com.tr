import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/services — list all service pages with content health
export async function GET() {
  const services = await prisma.page.findMany({
    where: { type: 'SERVICE' },
    include: {
      blocks: { include: { translations: true }, orderBy: { sortOrder: 'asc' } },
      seoMeta: true,
      faqs: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

  const result = services.map((service) => {
    const blockTypes = service.blocks.map((b) => b.componentType);
    const hasRichText = blockTypes.some((t) =>
      ['zengin_metin', 'rich_text', 'legacy_content'].includes(t)
    );
    const hasHero = blockTypes.includes('hero_slider');
    const faqLocales = [...new Set(service.faqs.map((f) => f.locale))];
    const seoLocales = [...new Set(service.seoMeta.map((s) => s.locale))];
    const trSeo = service.seoMeta.find((s) => s.locale === 'tr');

    // Check hero coverage across locales
    const heroBlock = service.blocks.find((b) => b.componentType === 'hero_slider');
    const heroLocales = heroBlock ? heroBlock.translations.map((t) => t.locale) : [];
    const missingHeroLocales = LOCALES.filter((l) => !heroLocales.includes(l));

    // Check rich text coverage
    const richBlock = service.blocks.find((b) =>
      ['zengin_metin', 'rich_text', 'legacy_content'].includes(b.componentType)
    );
    const richLocales = richBlock ? richBlock.translations.map((t) => t.locale) : [];
    const missingRichLocales = LOCALES.filter((l) => !richLocales.includes(l));

    const healthScore = Math.round(
      ((hasRichText ? 30 : 0) +
        (hasHero ? 20 : 0) +
        (seoLocales.length / 6) * 20 +
        (faqLocales.length / 6) * 15 +
        (richLocales.length / 6) * 15)
    );

    return {
      id: service.id,
      slug: service.slug,
      titleInternal: service.titleInternal,
      title: trSeo?.metaTitle || service.titleInternal,
      hasRichText,
      hasHero,
      blockCount: service.blocks.length,
      faqCount: service.faqs.length,
      seoLocales,
      faqLocales,
      heroLocales,
      richLocales,
      missingHeroLocales,
      missingRichLocales,
      healthScore,
    };
  });

  return NextResponse.json(result);
}
