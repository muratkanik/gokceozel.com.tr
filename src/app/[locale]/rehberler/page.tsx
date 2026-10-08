import prisma from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 120;

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

const pageMeta: Record<string, { title: string; description: string }> = {
  tr: {
    title: 'Estetik Rehberler | Prof. Dr. Gökçe Özel',
    description: 'Rinoplasti, yüz gençleştirme, blefaroplasti ve ameliyatsız estetik hakkında uzman rehberler. Prof. Dr. Gökçe Özel tarafından hazırlanmıştır.',
  },
  en: {
    title: 'Aesthetic Guides | Prof. Dr. Gökçe Özel',
    description: 'Expert guides on rhinoplasty, facial rejuvenation, blepharoplasty and non-surgical aesthetics by Prof. Dr. Gökçe Özel.',
  },
  ar: {
    title: 'أدلة تجميلية | أ.د. غوكتشه أوزيل',
    description: 'أدلة متخصصة حول تجميل الأنف وتجديد شباب الوجه وجراحة الجفون.',
  },
  ru: {
    title: 'Руководства по эстетике | Проф. д-р Гёкче Озель',
    description: 'Экспертные руководства по ринопластике, омоложению лица и неинвазивным процедурам.',
  },
  fr: {
    title: 'Guides esthétiques | Prof. Dr. Gökçe Özel',
    description: 'Guides d\'expert sur la rhinoplastie, le rajeunissement facial et les procédures non chirurgicales.',
  },
  de: {
    title: 'Ästhetik-Ratgeber | Prof. Dr. Gökçe Özel',
    description: 'Expertenratgeber zur Rhinoplastik, Gesichtsverjüngung und nicht-chirurgischen Ästhetik.',
  },
};

type Category = {
  key: string;
  label: Record<string, string>;
  keywords: string[];
  serviceSlug?: string;
};

const CATEGORIES: Category[] = [
  {
    key: 'rinoplasti',
    label: { tr: 'Rinoplasti & Burun Estetiği', en: 'Rhinoplasty & Nasal Aesthetics', ar: 'تجميل الأنف', ru: 'Ринопластика', fr: 'Rhinoplastie', de: 'Rhinoplastik' },
    keywords: ['rinoplasti', 'rhinoplasty', 'burun', 'nasal', 'septum', 'septorinoplasti'],
    serviceSlug: 'rinoplasti',
  },
  {
    key: 'ameliyatsiz',
    label: { tr: 'Ameliyatsız Yüz Estetiği', en: 'Non-Surgical Face Aesthetics', ar: 'تجميل الوجه غير الجراحي', ru: 'Нехирургическая эстетика', fr: 'Esthétique non chirurgicale', de: 'Nicht-chirurgische Ästhetik' },
    keywords: ['botoks', 'botox', 'dolgu', 'filler', 'endolift', 'mezoterapi', 'prp', 'ip-askı', 'lazer'],
    serviceSlug: 'botoks',
  },
  {
    key: 'goz-cevresi',
    label: { tr: 'Göz Çevresi Estetiği', en: 'Eye Area Aesthetics', ar: 'تجميل منطقة العين', ru: 'Эстетика вокруг глаз', fr: 'Esthétique du regard', de: 'Augenbereich-Ästhetik' },
    keywords: ['blefaroplasti', 'blepharoplasty', 'göz', 'eye', 'badem', 'cantoplasty'],
    serviceSlug: 'blefaroplasti',
  },
  {
    key: 'saglik-turizmi',
    label: { tr: 'Sağlık Turizmi & Yabancı Hastalar', en: 'Medical Tourism & International Patients', ar: 'السياحة الطبية', ru: 'Медицинский туризм', fr: 'Tourisme médical', de: 'Medizintourismus' },
    keywords: ['turkey', 'türkiye', 'international', 'yabancı', 'tourism', 'turizm', 'medikal'],
    serviceSlug: 'medikal-turizm',
  },
];

function classifyPost(slug: string, title: string): string {
  const text = `${slug} ${title}`.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => text.includes(kw))) return cat.key;
  }
  return 'diger';
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = pageMeta[locale] || pageMeta.tr;
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/rehberler` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? `${baseUrl}/rehberler` : `${baseUrl}/${loc}/rehberler`;
  });
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: locale === 'tr' ? `${baseUrl}/rehberler` : `${baseUrl}/${locale}/rehberler`,
      languages,
    },
    openGraph: { title: m.title, description: m.description },
  };
}

export default async function RehberlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let posts: { slug: string; titleInternal: string; seoMeta: { locale: string; metaTitle: string | null; metaDescription: string | null }[] }[] = [];
  try {
    posts = await prisma.page.findMany({
      where: { type: 'BLOG', status: { not: 'DRAFT' } },
      include: { seoMeta: true },
      orderBy: { createdAt: 'desc' },
    }) as any;
  } catch (e) {
    console.error('rehberler: fetch failed', e);
  }

  // Filter duplicates (same logic as sitemap)
  const slugSet = new Set(posts.map(p => p.slug));
  const dedupedPosts = posts.filter(p => {
    const m = p.slug.match(/^(.+)-(\d+)$/);
    return !(m && Number(m[2]) >= 2 && slugSet.has(m[1]));
  });

  // Classify posts into categories
  const byCategory: Record<string, typeof dedupedPosts> = {};
  for (const post of dedupedPosts) {
    const seo = post.seoMeta.find(s => s.locale === locale) || post.seoMeta.find(s => s.locale === 'tr');
    const title = seo?.metaTitle || post.titleInternal;
    const cat = classifyPost(post.slug, title);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(post);
  }

  const m = pageMeta[locale] || pageMeta.tr;
  const canonicalUrl = locale === 'tr' ? `${baseUrl}/rehberler` : `${baseUrl}/${locale}/rehberler`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#page`,
    name: m.title,
    description: m.description,
    url: canonicalUrl,
    publisher: {
      '@type': 'MedicalClinic',
      '@id': `${baseUrl}/#clinic`,
      name: 'Prof. Dr. Gökçe Özel Klinik',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: locale === 'tr' ? baseUrl : `${baseUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Rehberler', item: canonicalUrl },
      ],
    },
  };

  const heroText: Record<string, { h1: string; sub: string }> = {
    tr: { h1: 'Estetik Rehberler', sub: 'Prof. Dr. Gökçe Özel tarafından hazırlanan kapsamlı bilgi merkezi' },
    en: { h1: 'Aesthetic Guides', sub: 'A comprehensive knowledge hub by Prof. Dr. Gökçe Özel' },
    ar: { h1: 'أدلة تجميلية', sub: 'مركز معرفي شامل من إعداد أ.د. غوكتشه أوزيل' },
    ru: { h1: 'Руководства', sub: 'Комплексный центр знаний от проф. д-ра Гёкче Озель' },
    fr: { h1: 'Guides Esthétiques', sub: 'Centre de connaissances par Prof. Dr. Gökçe Özel' },
    de: { h1: 'Ästhetik-Ratgeber', sub: 'Umfassendes Wissenszentrum von Prof. Dr. Gökçe Özel' },
  };
  const hero = heroText[locale] || heroText.tr;

  const readMore: Record<string, string> = {
    tr: 'Devamını Oku', en: 'Read More', ar: 'اقرأ المزيد',
    ru: 'Читать далее', fr: 'Lire', de: 'Lesen',
  };

  const localeBlogPath = (slug: string) =>
    locale === 'tr' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 lg:py-24 px-5 border-b border-[#49685f]/10 text-center">
          <p className="section-kicker mb-4">
            {locale === 'tr' ? 'Kanıta Dayalı · Uzman İçerik' : 'Evidence-Based · Expert Content'}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#17201e] mb-4">{hero.h1}</h1>
          <p className="text-[#61706b] max-w-xl mx-auto">{hero.sub}</p>
        </section>

        {/* Categories */}
        <div className="max-w-5xl mx-auto px-5 py-16 flex flex-col gap-16">
          {CATEGORIES.map(cat => {
            const catPosts = byCategory[cat.key] || [];
            if (catPosts.length === 0) return null;
            return (
              <section key={cat.key}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="font-serif text-2xl text-[#17201e]">
                    {cat.label[locale] || cat.label.tr}
                  </h2>
                  {cat.serviceSlug && (
                    <Link
                      href={`/${locale === 'tr' ? '' : locale + '/'}hizmetler/${cat.serviceSlug}`}
                      className="text-xs font-semibold uppercase tracking-wider text-[#b8893c] hover:text-[#17201e] transition-colors whitespace-nowrap"
                    >
                      {locale === 'tr' ? 'Hizmete Git →' : 'View Service →'}
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catPosts.slice(0, 6).map(post => {
                    const seo = post.seoMeta.find((s: any) => s.locale === locale) || post.seoMeta.find((s: any) => s.locale === 'tr');
                    const title = seo?.metaTitle || post.titleInternal;
                    const description = seo?.metaDescription || '';
                    return (
                      <Link
                        key={post.slug}
                        href={localeBlogPath(post.slug)}
                        className="soft-card rounded-[1rem] p-5 hover:border-[#b8893c]/30 transition-colors flex flex-col gap-2"
                      >
                        <h3 className="font-semibold text-[#17201e] leading-snug">{title}</h3>
                        {description && (
                          <p className="text-[#61706b] text-sm leading-relaxed line-clamp-2">{description}</p>
                        )}
                        <span className="text-xs font-semibold text-[#b8893c] mt-auto pt-1">{readMore[locale] || readMore.tr} →</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Uncategorised / Diğer */}
          {byCategory['diger'] && byCategory['diger'].length > 0 && (
            <section>
              <h2 className="font-serif text-2xl text-[#17201e] mb-6">
                {locale === 'tr' ? 'Diğer Makaleler' : locale === 'en' ? 'More Articles' : 'Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {byCategory['diger'].slice(0, 4).map(post => {
                  const seo = post.seoMeta.find((s: any) => s.locale === locale) || post.seoMeta.find((s: any) => s.locale === 'tr');
                  const title = seo?.metaTitle || post.titleInternal;
                  return (
                    <Link
                      key={post.slug}
                      href={localeBlogPath(post.slug)}
                      className="soft-card rounded-[1rem] p-5 hover:border-[#b8893c]/30 transition-colors"
                    >
                      <h3 className="font-semibold text-[#17201e] leading-snug">{title}</h3>
                      <span className="text-xs font-semibold text-[#b8893c] block mt-2">{readMore[locale] || readMore.tr} →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* CTA */}
        <section className="text-center py-12 px-5 border-t border-[#49685f]/10">
          <p className="text-[#61706b] mb-4 text-sm">
            {locale === 'tr' ? 'Kişisel değerlendirme için randevu alın.' : 'Book a consultation for a personalised assessment.'}
          </p>
          <Link
            href={`/${locale === 'tr' ? '' : locale + '/'}iletisim`}
            className="inline-block bg-[#17201e] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-[#49685f] transition-colors"
          >
            {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
          </Link>
        </section>
      </main>
    </>
  );
}
