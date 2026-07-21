import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase();
    const locale = searchParams.get('locale') || 'tr';

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = new Map();

    const addResult = (url: string, title: string, snippet: string, type: string) => {
      if (!results.has(url)) {
        results.set(url, { url, title, snippet, type });
      }
    };

    // 1. Search in SeoMeta (Pages & Services)
    const seoResults = await prisma.seoMeta.findMany({
      where: {
        locale,
        OR: [
          { metaTitle: { contains: q, mode: 'insensitive' } },
          { metaDescription: { contains: q, mode: 'insensitive' } },
          { keywords: { contains: q, mode: 'insensitive' } },
        ]
      },
      include: {
        page: true
      }
    });

    for (const seo of seoResults) {
      if (seo.page && seo.page.slug) {
        const prefix = locale === 'tr' ? '' : `/${locale}`;
        let url = `${prefix}/${seo.page.slug}`;
        if (seo.page.slug === 'home' || seo.page.slug === 'index') {
          url = prefix || '/';
        } else if (seo.page.type === 'SERVICE') {
          url = `${prefix}/hizmetler/${seo.page.slug}`;
          // Basic localization of service path
          if (locale === 'en') url = `/en/services/${seo.page.slug}`;
          if (locale === 'fr') url = `/fr/soins/${seo.page.slug}`;
          if (locale === 'de') url = `/de/leistungen/${seo.page.slug}`;
          if (locale === 'ru') url = `/ru/services/${seo.page.slug}`;
          if (locale === 'ar') url = `/ar/services/${seo.page.slug}`;
        }
        
        let snippet = seo.metaDescription || '';
        if (snippet.length > 120) snippet = snippet.substring(0, 120) + '...';

        addResult(url, seo.metaTitle || seo.page.titleInternal, snippet, seo.page.type === 'SERVICE' ? 'Hizmet' : 'Sayfa');
      }
    }

    // 2. Search in Translations (Page content blocks)
    const translationResults = await prisma.translation.findMany({
      where: {
        locale,
        contentData: { contains: q, mode: 'insensitive' }
      },
      include: {
        block: {
          include: {
            page: true
          }
        }
      },
      take: 20
    });

    for (const t of translationResults) {
      const page = t.block?.page;
      if (page && page.slug) {
        const prefix = locale === 'tr' ? '' : `/${locale}`;
        let url = `${prefix}/${page.slug}`;
        if (page.slug === 'home' || page.slug === 'index') {
          url = prefix || '/';
        } else if (page.type === 'SERVICE') {
          url = `${prefix}/hizmetler/${page.slug}`;
          if (locale === 'en') url = `/en/services/${page.slug}`;
          if (locale === 'fr') url = `/fr/soins/${page.slug}`;
          if (locale === 'de') url = `/de/leistungen/${page.slug}`;
          if (locale === 'ru') url = `/ru/services/${page.slug}`;
          if (locale === 'ar') url = `/ar/services/${page.slug}`;
        }

        let snippet = '';
        try {
          const data = JSON.parse(t.contentData);
          const values = Object.values(data).filter(v => typeof v === 'string') as string[];
          const match = values.find(v => v.toLowerCase().includes(q));
          if (match) {
            const idx = match.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 40);
            const end = Math.min(match.length, idx + 80);
            snippet = (start > 0 ? '...' : '') + match.substring(start, end) + (end < match.length ? '...' : '');
          }
        } catch (e) {
        }

        addResult(url, page.titleInternal, snippet || 'İçerikte bulundu', page.type === 'SERVICE' ? 'Hizmet' : 'Sayfa');
      }
    }

    // 3. Search in Content Entries (Blog / Videos)
    const entries = await prisma.content_entries.findMany({
      where: {
        visible_locales: { has: locale }
      }
    });

    for (const entry of entries) {
      if (entry.translations && entry.slug) {
        const strData = JSON.stringify(entry.translations).toLowerCase();
        if (strData.includes(q)) {
          const prefix = locale === 'tr' ? '' : `/${locale}`;
          let base = 'blog';
          let typeLabel = 'Blog';
          if (entry.type === 'video') {
            base = 'videolar';
            typeLabel = 'Video';
          }
          
          let title = entry.slug;
          let snippet = '';
          try {
            const tData = entry.translations as any;
            const locData = tData[locale] || tData['tr'];
            if (locData) {
              title = locData.title || title;
              snippet = locData.excerpt || locData.content || '';
              if (snippet.length > 120) snippet = snippet.substring(0, 120) + '...';
            }
          } catch(e) {}

          const url = `${prefix}/${base}/${entry.slug}`;
          addResult(url, title, snippet.replace(/<[^>]+>/g, ''), typeLabel);
        }
      }
    }

    // 4. Search in FAQs
    const faqs = await prisma.faq.findMany({
      where: {
        locale,
        OR: [
          { question: { contains: q, mode: 'insensitive' } },
          { answer: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: 10
    });

    for (const faq of faqs) {
      const prefix = locale === 'tr' ? '' : `/${locale}`;
      let url = `${prefix}/sss`;
      if (locale === 'en') url = `/en/faq`;
      if (locale === 'fr') url = `/fr/faq`;
      if (locale === 'de') url = `/de/faq`;
      
      let snippet = faq.answer;
      if (snippet.length > 120) snippet = snippet.substring(0, 120) + '...';

      addResult(url, faq.question, snippet, 'SSS');
    }

    return NextResponse.json({
      results: Array.from(results.values())
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Arama sırasında bir hata oluştu', results: [] }, { status: 500 });
  }
}
