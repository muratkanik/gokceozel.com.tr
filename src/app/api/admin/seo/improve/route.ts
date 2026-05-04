import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { aiComplete } from '@/lib/ai-providers';
import { calcSeoScore } from '@/lib/seo-score';

const LOCALES = ['en', 'ar', 'ru', 'fr', 'de'] as const;

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', ar: 'Arabic', ru: 'Russian', fr: 'French', de: 'German',
};

async function translateHtml(html: string, targetLocale: string): Promise<string> {
  const { content } = await aiComplete(
    [
      {
        role: 'system',
        content: `You are a professional medical translator. Translate the following HTML content to ${LOCALE_NAMES[targetLocale] || targetLocale}.
Rules:
- Preserve ALL HTML tags and attributes exactly
- Only translate the visible text content
- Keep medical terminology accurate
- Return ONLY the translated HTML, no explanations`,
      },
      { role: 'user', content: html },
    ],
    { temperature: 0.2 }
  );
  return content;
}

/**
 * POST /api/admin/seo/improve
 * Body: { pageId }
 *
 * 1. Fetches existing TR zengin_metin content
 * 2. Sends to AI for SEO improvement
 * 3. Translates improved content to EN, AR, RU, FR, DE in parallel
 * 4. Saves all 6 locales back to DB
 * 5. Recalculates and saves SEO score
 * 6. Returns new score + improved content preview
 *
 * Uses streaming via ReadableStream so the client can show progress.
 */
export async function POST(req: Request) {
  const { pageId } = await req.json();
  if (!pageId) return NextResponse.json({ error: 'pageId required' }, { status: 400 });

  // --- 1. Load page + zengin_metin block ---
  const page = await prisma.page.findUnique({
    where: { id: pageId },
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
  });

  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

  const richBlock = page.blocks[0];
  if (!richBlock) return NextResponse.json({ error: 'No rich text block found' }, { status: 404 });

  const trTranslation = richBlock.translations.find((t) => t.locale === 'tr');
  let currentHtml = '';
  if (trTranslation) {
    try {
      const parsed = JSON.parse(trTranslation.contentData);
      currentHtml = parsed.text || parsed.content || '';
    } catch {
      currentHtml = trTranslation.contentData;
    }
  }

  const trSeo = page.seoMeta[0];
  const serviceTitle = trSeo?.metaTitle || page.titleInternal;

  // Streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // --- 2. AI improvement ---
        send('progress', { step: 'improve', message: 'AI ile içerik geliştiriliyor…' });

        const improvePrompt = `Sen Prof. Dr. Gökçe Özel kliniğinin SEO uzmanı içerik yazarısın.
Klinik: KBB ve Estetik/Plastik Cerrahi — Ankara ve Antalya.
Hizmet: ${serviceTitle}

Aşağıdaki mevcut HTML içeriği SEO açısından GÜÇLENDIR ve GENİŞLET:

SEO İYİLEŞTİRME HEDEFLERİ:
1. En az 4 adet güçlü <h2> başlığı (her biri 25-60 karakter, hizmetle doğrudan ilgili)
2. Her H2 altında 2-3 adet <h3> alt başlık
3. Her bölümde 3-5 paragraf (<p>) — her biri en az 2-3 cümle
4. En az 2 adet madde listesi (<ul><li>) — somut faydalar veya teknik detaylar
5. <strong> ile vurgulanan kilit terimler (prosedür adı, klinik avantajlar)
6. Toplam min 1200 kelime, min 6000 karakter
7. Medikal SEO: spesifik teknikler, hasta soruları, klinik üstünlükler

MEVCUT İÇERİK (geliştir ve genişlet — baştan yazabilirsin):
${currentHtml || '(boş — sıfırdan yaz)'}

ÖNEMLİ: Sadece saf HTML döndür — <h2>, <h3>, <p>, <strong>, <ul>, <li> etiketleri.
Markdown, açıklama veya \`\`\` kullanma.`;

        const { content: improvedHtml } = await aiComplete(
          [{ role: 'user', content: improvePrompt }],
          { temperature: 0.65 }
        );

        send('progress', { step: 'improved', message: 'İçerik geliştirildi, çeviriler başlıyor…' });

        // --- 3. Translate to all other locales in parallel ---
        const translations = await Promise.allSettled(
          LOCALES.map(async (locale) => {
            send('progress', { step: `translate_${locale}`, message: `${LOCALE_NAMES[locale]} diline çevriliyor…` });
            const translated = await translateHtml(improvedHtml, locale);
            send('progress', { step: `translated_${locale}`, message: `${LOCALE_NAMES[locale]} ✓` });
            return { locale, html: translated };
          })
        );

        // Build locale → html map
        const contentByLocale: Record<string, string> = { tr: improvedHtml };
        for (const result of translations) {
          if (result.status === 'fulfilled') {
            contentByLocale[result.value.locale] = result.value.html;
          }
        }

        // --- 4. Save to DB ---
        send('progress', { step: 'saving', message: 'Veritabanına kaydediliyor…' });

        await Promise.all(
          Object.entries(contentByLocale).map(([locale, html]) =>
            prisma.translation.upsert({
              where: { blockId_locale: { blockId: richBlock.id, locale } },
              update: { contentData: JSON.stringify({ text: html }) },
              create: {
                blockId: richBlock.id,
                locale,
                contentData: JSON.stringify({ text: html }),
              },
            })
          )
        );

        // --- 5. Recalculate SEO score ---
        const scoreResult = calcSeoScore(improvedHtml);
        await prisma.page.update({
          where: { id: pageId },
          data: { seoScore: scoreResult.total },
        });

        send('done', {
          seoScore: scoreResult.total,
          grade: scoreResult.grade,
          breakdown: scoreResult.breakdown,
          savedLocales: Object.keys(contentByLocale),
          previewHtml: improvedHtml.slice(0, 500) + '…',
        });
      } catch (err: any) {
        send('error', { message: err?.message || 'Bilinmeyen hata' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
