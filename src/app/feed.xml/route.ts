import prisma from '@/lib/prisma';

const baseUrl = 'https://gokceozel.com.tr';

// Supported locales + their feed metadata
const feeds: Record<string, { lang: string; title: string; description: string }> = {
  tr: { lang: 'tr', title: 'Prof. Dr. Gökçe Özel — Blog', description: 'Rinoplasti, Endolift ve estetik uygulamalar hakkında uzman makaleler.' },
  en: { lang: 'en', title: 'Prof. Dr. Gökçe Özel — Blog', description: 'Expert articles on rhinoplasty, Endolift and facial aesthetics.' },
  ar: { lang: 'ar', title: 'أ.د. غوكتشه أوزيل — المدونة', description: 'مقالات متخصصة في تجميل الأنف وعلاجات الوجه التجميلية.' },
  ru: { lang: 'ru', title: 'Проф. д-р Гёкче Озель — Блог', description: 'Экспертные статьи о ринопластике и эстетике лица.' },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') || 'tr';
  const meta = feeds[locale] || feeds.tr;

  let posts: { slug: string; updatedAt: Date; seoMeta: { locale: string; metaTitle: string; metaDescription: string; ogImage?: string | null }[] }[] = [];
  try {
    posts = await prisma.page.findMany({
      where: { type: 'BLOG' },
      select: {
        slug: true,
        updatedAt: true,
        seoMeta: {
          where: { locale },
          select: { locale: true, metaTitle: true, metaDescription: true, ogImage: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });
  } catch (e) {
    console.error('feed.xml: prisma error', e);
  }

  const items = posts.map(post => {
    const seo = post.seoMeta[0];
    const url = locale === 'tr' ? `${baseUrl}/blog/${post.slug}` : `${baseUrl}/${locale}/blog/${post.slug}`;
    const title = seo?.metaTitle || post.slug;
    const desc = seo?.metaDescription || '';
    const image = seo?.ogImage || '';
    const date = post.updatedAt.toUTCString();

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${date}</pubDate>
      ${image ? `<enclosure url="${image}" type="image/jpeg" length="0"/>` : ''}
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${meta.title}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${meta.description}]]></description>
    <language>${meta.lang}</language>
    <atom:link href="${baseUrl}/feed.xml?locale=${locale}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
