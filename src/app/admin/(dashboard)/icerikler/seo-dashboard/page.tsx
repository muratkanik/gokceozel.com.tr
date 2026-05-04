import prisma from '@/lib/prisma';
import { calcSeoScore } from '@/lib/seo-score';
import SeoDashboardClient from './SeoDashboardClient';

export const dynamic = 'force-dynamic';

export default async function SeoDashboardPage() {
  const pages = await prisma.page.findMany({
    where: { type: 'SERVICE' },
    include: {
      blocks: {
        where: {
          componentType: { in: ['zengin_metin', 'rich_text', 'legacy_content'] },
        },
        include: { translations: true },
        orderBy: { sortOrder: 'asc' },
      },
      seoMeta: { where: { locale: 'tr' } },
    },
    orderBy: { titleInternal: 'asc' },
  });

  const LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

  const rows = pages.map((page) => {
    const richBlock = page.blocks[0] ?? null;
    const trT = richBlock?.translations.find((t) => t.locale === 'tr');

    let trHtml: string | null = null;
    if (trT) {
      try {
        const d = JSON.parse(trT.contentData);
        trHtml = d.text || d.content || null;
      } catch {
        trHtml = trT.contentData;
      }
    }

    const score = calcSeoScore(trHtml);
    const coveredLocales = richBlock
      ? richBlock.translations.map((t) => t.locale)
      : [];
    const missingLocales = LOCALES.filter((l) => !coveredLocales.includes(l));

    const trSeo = page.seoMeta[0];

    return {
      id: page.id,
      slug: page.slug,
      titleInternal: page.titleInternal,
      title: trSeo?.metaTitle || page.titleInternal,
      seoScore: score.total,
      grade: score.grade,
      breakdown: score.breakdown,
      hasContent: !!trHtml,
      contentChars: trHtml?.length ?? 0,
      coveredLocales,
      missingLocales,
    };
  });

  return <SeoDashboardClient rows={rows} />;
}
