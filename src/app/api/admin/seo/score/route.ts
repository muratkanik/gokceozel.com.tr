import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calcSeoScore } from '@/lib/seo-score';

/**
 * GET /api/admin/seo/score
 * Calculate SEO scores for all service pages using TR zengin_metin content.
 * Saves updated seoScore to each Page row and returns the full list.
 */
export async function GET() {
  const pages = await prisma.page.findMany({
    where: { type: 'SERVICE' },
    include: {
      blocks: {
        where: {
          componentType: { in: ['zengin_metin', 'rich_text', 'legacy_content'] },
        },
        include: {
          translations: { where: { locale: 'tr' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
      seoMeta: { where: { locale: 'tr' } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const results = await Promise.all(
    pages.map(async (page) => {
      // Pick the first zengin_metin/rich_text block with a TR translation
      let html: string | null = null;
      for (const block of page.blocks) {
        const tr = block.translations[0];
        if (tr) {
          try {
            const parsed = JSON.parse(tr.contentData);
            html = parsed.text || parsed.content || null;
          } catch {
            html = tr.contentData;
          }
          if (html) break;
        }
      }

      const result = calcSeoScore(html);

      // Persist score
      await prisma.page.update({
        where: { id: page.id },
        data: { seoScore: result.total },
      });

      const trSeo = page.seoMeta[0];

      return {
        id: page.id,
        slug: page.slug,
        title: trSeo?.metaTitle || page.titleInternal,
        titleInternal: page.titleInternal,
        seoScore: result.total,
        grade: result.grade,
        breakdown: result.breakdown,
        hasContent: !!html,
        contentLength: html?.length ?? 0,
      };
    })
  );

  return NextResponse.json(results);
}

/**
 * POST /api/admin/seo/score
 * Body: { pageId }
 * Recalculate score for a single page.
 */
export async function POST(req: Request) {
  const { pageId } = await req.json();
  if (!pageId) return NextResponse.json({ error: 'pageId required' }, { status: 400 });

  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: {
      blocks: {
        where: {
          componentType: { in: ['zengin_metin', 'rich_text', 'legacy_content'] },
        },
        include: {
          translations: { where: { locale: 'tr' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

  let html: string | null = null;
  for (const block of page.blocks) {
    const tr = block.translations[0];
    if (tr) {
      try {
        const parsed = JSON.parse(tr.contentData);
        html = parsed.text || parsed.content || null;
      } catch {
        html = tr.contentData;
      }
      if (html) break;
    }
  }

  const result = calcSeoScore(html);
  await prisma.page.update({ where: { id: pageId }, data: { seoScore: result.total } });

  return NextResponse.json({ seoScore: result.total, grade: result.grade, breakdown: result.breakdown });
}
