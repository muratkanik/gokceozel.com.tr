import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { aiComplete } from '@/lib/ai-providers';
import { calcSeoScore } from '@/lib/seo-score';
import { blogCoverFor } from '@/lib/blog-cover';

type SerpResult = {
  title: string;
  link: string;
  snippet: string;
};

type GeneratedArticle = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  readTime?: string;
  seoKeyword: string;
  faq?: Array<{ question: string; answer: string }>;
};

const DAILY_TOPICS = [
  'rinoplasti sonrası iyileşme süreci',
  'burun estetiği öncesi dikkat edilmesi gerekenler',
  'revizyon rinoplasti kimler için uygundur',
  'doğal burun estetiği nasıl planlanır',
  'göz kapağı estetiği iyileşme süreci',
  'badem göz estetiği hakkında merak edilenler',
  'endolift lazer yüz gençleştirme',
  'botoks uygulaması ne kadar sürer',
  'dolgu uygulamalarında doğal sonuç',
  'dudak dolgusu sonrası dikkat edilmesi gerekenler',
  'ip askı ile yüz gençleştirme',
  'gıdı liposuction kimler için uygundur',
  'mezoterapi ve cilt yenileme',
  'PRP cilt gençleştirme etkileri',
  'kepçe kulak ameliyatı iyileşme süreci',
  'burun estetiği ve nefes alma problemleri',
  'septorinoplasti nedir',
  'yüz estetiğinde kişiye özel planlama',
  'ameliyatsız yüz gençleştirme yöntemleri',
  'Ankara rinoplasti uzmanı seçerken nelere dikkat edilmeli',
  'Antalya burun estetiği ve rinoplasti süreci',
  'KBB uzmanı ile rinoplasti planlaması',
  'burun ucu estetiği nasıl yapılır',
  'erkek burun estetiğinde doğal görünüm',
  'medikal estetik uygulamalarında güvenli klinik seçimi',
];

const CURATED_INTERNAL_LINKS = [
  { title: 'Rinoplasti', href: '/hizmetler/rinoplasti' },
  { title: 'Revizyon Rinoplasti', href: '/hizmetler/revizyon-rinoplasti' },
  { title: 'Septorinoplasti', href: '/hizmetler/septorinoplasti' },
  { title: 'Göz Kapağı Estetiği', href: '/hizmetler/goz-kapagi-estetigi' },
  { title: 'Endolift Lazer', href: '/hizmetler/endolift' },
  { title: 'Botoks', href: '/hizmetler/botoks' },
  { title: 'Dolgu Uygulamaları', href: '/hizmetler/dolgu' },
  { title: 'Dudak Dolgusu', href: '/hizmetler/dudak-dolgusu' },
  { title: 'İp Askılama', href: '/hizmetler/ip-aski' },
  { title: 'Prof. Dr. Gökçe Özel Kimdir?', href: '/gokce-ozel-kimdir' },
  { title: 'Randevu ve İletişim', href: '/iletisim' },
];

function slugify(input: string) {
  const map: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };

  return input
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => map[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 90);
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function wordCount(html: string) {
  const text = stripHtml(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function readingTimeLabel(words: number) {
  return `${Math.max(1, Math.ceil(words / 220))} dk okuma`;
}

function uniqueSlug(base: string, existingSlugs: Set<string>) {
  let slug = base || 'makale';
  let counter = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

async function fetchSerpResults(keyword: string): Promise<{ provider: string; results: SerpResult[] }> {
  const serperKey = process.env.SERPER_API_KEY || process.env.SERAPI_API_KEY;
  if (serperKey) {
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': serperKey,
        },
        body: JSON.stringify({
          q: keyword,
          num: 10,
          gl: 'tr',
          hl: 'tr',
        }),
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Serper HTTP ${res.status}`);
      const data = await res.json();
      const results = (data.organic || []).slice(0, 8).map((item: any) => ({
        title: item.title || '',
        link: item.link || '',
        snippet: item.snippet || '',
      })).filter((item: SerpResult) => item.title || item.snippet);
      return { provider: 'serper', results };
    } catch (error: any) {
      console.warn('[daily-ai-blog] Serper failed, trying next SERP provider:', error?.message || error);
    }
  }

  const serpApiKey = process.env.SERPAPI_API_KEY;
  if (serpApiKey) {
    const params = new URLSearchParams({
      engine: 'google',
      q: keyword,
      google_domain: 'google.com.tr',
      gl: 'tr',
      hl: 'tr',
      num: '10',
      api_key: serpApiKey,
    });
    const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`SerpApi HTTP ${res.status}`);
    const data = await res.json();
    const results = (data.organic_results || []).slice(0, 8).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
    })).filter((item: SerpResult) => item.title || item.snippet);
    return { provider: 'serpapi', results };
  }

  const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
  const googleCx = process.env.GOOGLE_SEARCH_CX;
  if (googleKey && googleCx) {
    const params = new URLSearchParams({
      key: googleKey,
      cx: googleCx,
      q: keyword,
      gl: 'tr',
      hl: 'tr',
      num: '10',
    });
    const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Google Custom Search HTTP ${res.status}`);
    const data = await res.json();
    const results = (data.items || []).slice(0, 8).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
    })).filter((item: SerpResult) => item.title || item.snippet);
    return { provider: 'google-custom-search', results };
  }

  return { provider: 'keyword-intent-fallback', results: [] };
}

function buildSerpBrief(keyword: string, provider: string, results: SerpResult[]) {
  if (results.length === 0) {
    return [
      `Anahtar kelime: ${keyword}`,
      'Gerçek SERP API anahtarı bulunamadı; bu üretimde Google sonucu scrape edilmedi.',
      'Arama niyeti: bilgi edinme, işlem öncesi güven kazanma, iyileşme süreci ve klinik/doktor seçimi.',
      'İçerik boşluğu: hastaların anlayacağı net süreç anlatımı, risklerin dürüstçe açıklanması, sık sorular, Ankara/Antalya yerel bağlamı, KBB uzmanlığı ve yüz plastik cerrahi perspektifi.',
    ].join('\n');
  }

  return [
    `Anahtar kelime: ${keyword}`,
    `SERP sağlayıcı: ${provider}`,
    'İlk sonuçlardan başlık/snippet özeti:',
    ...results.map((result, index) => `${index + 1}. ${result.title}\n   ${result.snippet}\n   ${result.link}`),
  ].join('\n');
}

async function chooseKeyword(forceKeyword?: string) {
  if (forceKeyword?.trim()) return forceKeyword.trim();

  const existing = await prisma.page.findMany({
    where: { type: 'BLOG' },
    select: { slug: true, titleInternal: true, seoMeta: { select: { keywords: true } } },
  });

  const haystack = new Set<string>();
  existing.forEach((page) => {
    haystack.add(slugify(page.slug));
    haystack.add(slugify(page.titleInternal));
    page.seoMeta.forEach((seo) => {
      if (seo.keywords) haystack.add(slugify(seo.keywords));
    });
  });

  return DAILY_TOPICS.find((topic) => !haystack.has(slugify(topic))) || `${DAILY_TOPICS[new Date().getDate() % DAILY_TOPICS.length]} ${new Date().getFullYear()}`;
}

function parseArticle(raw: string): GeneratedArticle {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  }

  if (!parsed?.title || !parsed?.content) {
    throw new Error('AI geçerli makale JSON yanıtı üretmedi.');
  }

  return {
    title: String(parsed.title).trim(),
    metaTitle: String(parsed.metaTitle || parsed.title).trim(),
    metaDescription: String(parsed.metaDescription || parsed.excerpt || '').trim().slice(0, 170),
    excerpt: String(parsed.excerpt || parsed.metaDescription || '').trim(),
    content: String(parsed.content).trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((tag: any) => String(tag)).slice(0, 8) : [],
    category: String(parsed.category || 'Blog'),
    readTime: parsed.readTime ? String(parsed.readTime) : undefined,
    seoKeyword: String(parsed.seoKeyword || '').trim(),
    faq: Array.isArray(parsed.faq) ? parsed.faq.slice(0, 6) : [],
  };
}

async function parseArticleWithRepair(raw: string, keyword: string) {
  try {
    return parseArticle(raw);
  } catch (error) {
    const { content: repairedRaw } = await aiComplete(
      [
        {
          role: 'system',
          content: `Bozuk bir JSON makale çıktısını düzelten editörsün.
Sadece geçerli JSON döndür. Markdown, açıklama veya code fence kullanma.
İçerik anlamını koru; alan adlarını değiştirme. content alanındaki HTML'i string olarak kaçış karakterleriyle geçerli JSON içinde tut.`,
        },
        {
          role: 'user',
          content: `Odak anahtar kelime: ${keyword}

Aşağıdaki çıktı JSON parse hatası verdi. Aynı şemayı koruyarak geçerli JSON'a dönüştür:

${raw}`,
        },
      ],
      { temperature: 0, json: true }
    );

    return parseArticle(repairedRaw);
  }
}

async function generateArticle(keyword: string, serpBrief: string, internalLinks: Array<{ title: string; href: string }>) {
  const internalLinkBrief = internalLinks
    .slice(0, 12)
    .map((item) => `- ${item.title}: ${item.href}`)
    .join('\n');

  const systemPrompt = `Sen Prof. Dr. Gökçe Özel kliniği için çalışan kıdemli medikal SEO editörü ve içerik stratejistisin.
Alan: KBB, rinoplasti, yüz plastik cerrahisi, medikal estetik.

Amaç:
- Google ve AI cevap motorlarında görünürlük hedefleyen, hasta odaklı, E-E-A-T sinyali güçlü bir Türkçe makale üret.
- Ortalama 2000 kelime hedefle. Kabul edilebilir aralık: 1800-2300 kelime.
- İçerik tıbbi tavsiye/teşhis gibi yazılmasın; bilgilendirme ve muayene yönlendirmesi dili kullanılsın.
- Garanti sonuç, kesin fiyat, kesin iyileşme süresi gibi iddialardan kaçın.

Format:
- Sadece geçerli JSON döndür. Markdown ve code fence kullanma.
- content alanı saf HTML olsun: <h2>, <h3>, <p>, <strong>, <ul>, <li>, <ol>, <a> kullanabilirsin.
- H1 content içinde olmasın; title ayrı.
- Girişte hızlı cevap/özet bölümü, sonra detaylı açıklamalar, adaylık kriterleri, süreç, iyileşme, riskler, doktor seçimi, sık sorular olsun.
- En az 5 H2, en az 6 H3, en az 2 liste, en az 5 FAQ sorusu üret.
- İç linkleri doğal şekilde kullan; link verirken sadece aşağıdaki site içi URL'leri kullan. Bunların dışında URL uydurma.

JSON şeması:
{
  "title": "maks 70 karakterlik başlık",
  "metaTitle": "maks 60 karakter",
  "metaDescription": "maks 155 karakter",
  "excerpt": "2 cümlelik özet",
  "content": "<p>...</p>",
  "tags": ["..."],
  "category": "Blog",
  "readTime": "9 dk okuma",
  "seoKeyword": "${keyword}",
  "faq": [{"question": "...", "answer": "..."}]
}`;

  const userPrompt = `Odak anahtar kelime: ${keyword}

SERP / arama niyeti analizi:
${serpBrief}

Kullanılabilecek site içi bağlantılar:
${internalLinkBrief || '- /hizmetler/rinoplasti'}

Makaleyi üret.`;

  const { content: rawContent, provider } = await aiComplete(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { temperature: 0.55, json: true }
  );

  let article = await parseArticleWithRepair(rawContent, keyword);
  let words = wordCount(article.content);

  if (words < 1800) {
    const { content: extendedRaw } = await aiComplete(
      [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Bu makale hedef uzunluğun altında kaldı (${words} kelime). Aynı JSON şemasıyla, mevcut makaleyi 1900-2200 kelime aralığına genişlet. Gereksiz dolgu yapma; SERP boşluklarını, hasta sorularını, süreçleri, riskleri, doktor seçimini ve iyileşme önerilerini derinleştir. Link verirsen yalnızca izin verilen iç linkleri kullan.\n\nİzin verilen iç linkler:\n${internalLinkBrief}\n\nMevcut JSON:\n${JSON.stringify(article)}`,
        },
      ],
      { temperature: 0.45, json: true }
    );
    article = await parseArticleWithRepair(extendedRaw, keyword);
    words = wordCount(article.content);
  }

  return { article, provider, wordCount: words };
}

// AI-written medical articles are saved as drafts and must be reviewed in
// /admin/icerikler before they go live. Set DAILY_AI_BLOG_AUTOPUBLISH=true to
// publish them immediately instead.
const AUTO_PUBLISH = process.env.DAILY_AI_BLOG_AUTOPUBLISH === 'true';

export async function runDailyAiBlogJob(options: { force?: boolean; keyword?: string } = {}) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const settingKey = 'daily_ai_blog_last_success_date';

  if (!options.force) {
    const lastRun = await prisma.setting.findUnique({ where: { key: settingKey } });
    if (lastRun?.value === todayKey) {
      return { skipped: true, reason: 'Bugün zaten otomatik makale üretildi.', date: todayKey };
    }
  }

  const keyword = await chooseKeyword(options.keyword);
  const serp = await fetchSerpResults(keyword);
  const serpBrief = buildSerpBrief(keyword, serp.provider, serp.results);

  const internalLinks = CURATED_INTERNAL_LINKS;

  const { article, provider, wordCount: words } = await generateArticle(keyword, serpBrief, internalLinks);
  const existingSlugs = new Set((await prisma.page.findMany({ select: { slug: true } })).map((page) => page.slug));
  const slug = uniqueSlug(slugify(article.title || keyword), existingSlugs);
  const cover = blogCoverFor({
    slug,
    title: article.title,
    description: article.metaDescription,
  });
  const seoScore = calcSeoScore(article.content).total;
  const now = new Date();

  const page = await prisma.page.create({
    data: {
      slug,
      titleInternal: article.title,
      type: 'BLOG',
      status: AUTO_PUBLISH ? 'PUBLISHED' : 'DRAFT',
      seoScore,
      blocks: {
        create: [
          {
            componentType: 'zengin_metin',
            sortOrder: 0,
            isActive: true,
            translations: {
              create: {
                locale: 'tr',
                contentData: JSON.stringify({
                  text: article.content,
                  source: 'daily-ai-blog',
                  keyword,
                  serpProvider: serp.provider,
                  generatedAt: now.toISOString(),
                  wordCount: words,
                }),
              },
            },
          },
        ],
      },
      seoMeta: {
        create: {
          locale: 'tr',
          metaTitle: article.metaTitle.slice(0, 70),
          metaDescription: article.metaDescription.slice(0, 170),
          ogImage: cover,
          canonicalUrl: `https://gokceozel.com.tr/blog/${slug}`,
          robots: 'index,follow',
          keywords: [article.seoKeyword || keyword, ...article.tags].filter(Boolean).join(', '),
          shortAnswer: article.excerpt.slice(0, 300),
          aiSummary150: stripHtml(article.content).slice(0, 900),
          aiSummary75: article.excerpt.slice(0, 450),
          aiSummary30: article.excerpt.slice(0, 220),
          faqJson: article.faq?.length ? JSON.stringify(article.faq) : undefined,
          structuredData: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            headline: article.title,
            description: article.metaDescription,
            datePublished: now.toISOString(),
            dateModified: now.toISOString(),
            inLanguage: 'tr',
            author: {
              '@type': 'Physician',
              name: 'Prof. Dr. Gökçe Özel',
              jobTitle: 'KBB Uzmanı',
            },
          }),
        },
      },
    },
    include: { seoMeta: true, blocks: true },
  });

  await prisma.setting.upsert({
    where: { key: settingKey },
    update: { value: todayKey },
    create: { key: settingKey, value: todayKey },
  });

  if (AUTO_PUBLISH) {
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/', 'layout');
  }

  return {
    skipped: false,
    status: AUTO_PUBLISH ? 'PUBLISHED' : 'DRAFT',
    slug,
    pageId: page.id,
    keyword,
    provider,
    serpProvider: serp.provider,
    serpResultCount: serp.results.length,
    wordCount: words,
    seoScore,
    url: `https://gokceozel.com.tr/blog/${slug}`,
  };
}
