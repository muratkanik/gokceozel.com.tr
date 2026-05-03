import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlockRenderer from '@/components/ui/BlockRenderer';
import { canonicalServiceSlug, hasDisplayableServiceText, serviceDescriptionFor, serviceTitleFor } from '@/lib/service-display';
import { canonicalFromLocalized, localizedServiceSlug } from '@/lib/service-slugs';
import { OLD_SITE_SERVICE_IMAGES } from '@/lib/old-site-media';

export const revalidate = 60;

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const localePath = (locale: string, path = '') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
};

function normalizeLocale(locale: string) {
  return allLocales.includes(locale) ? locale : 'tr';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug: requestedSlug, locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const slug = canonicalServiceSlug(canonicalFromLocalized(requestedSlug, locale));

  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: requestedSlug, type: 'SERVICE' },
      include: { seoMeta: true }
    });
    if (!page && slug !== requestedSlug) {
      page = await prisma.page.findUnique({
        where: { slug, type: 'SERVICE' },
        include: { seoMeta: true }
      });
    }
  } catch (e) {
    console.error('Service metadata fetch failed', e);
  }

  if (!page && !hasDisplayableServiceText(slug)) return { title: 'Bulunamadı' };

  const seo = page?.seoMeta.find(s => s.locale === locale) || page?.seoMeta.find(s => s.locale === 'tr');

  // hreflang alternates with localized slugs
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/hizmetler/${slug}` };
  allLocales.forEach(loc => {
    const locSlug = localizedServiceSlug(slug, loc);
    languages[loc] = loc === 'tr'
      ? `${baseUrl}/hizmetler/${locSlug}`
      : `${baseUrl}/${loc}/hizmetler/${locSlug}`;
  });

  const title = serviceTitleFor(slug, locale, [seo?.metaTitle, page?.titleInternal]);
  const description = serviceDescriptionFor(slug, locale, [seo?.metaDescription]);

  return {
    title,
    description,
    keywords: seo?.keywords || '',
    robots: seo?.robots || 'index,follow',
    openGraph: {
      title,
      description,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      locale,
      type: 'website',
    },
    alternates: { canonical: seo?.canonicalUrl || `${baseUrl}/${locale === 'tr' ? '' : locale + '/'}hizmetler/${localizedServiceSlug(slug, locale)}`, languages },
  };
}

export default async function HizmetDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug: requestedSlug, locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const slug = canonicalServiceSlug(canonicalFromLocalized(requestedSlug, locale));

  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug: requestedSlug, type: 'SERVICE' },
      include: {
        blocks: { include: { translations: true }, orderBy: { sortOrder: 'asc' } },
        seoMeta: true,
        faqs: { where: { locale }, orderBy: { sortOrder: 'asc' } },
      }
    });
    if (!page && slug !== requestedSlug) {
      page = await prisma.page.findUnique({
        where: { slug, type: 'SERVICE' },
        include: {
          blocks: { include: { translations: true }, orderBy: { sortOrder: 'asc' } },
          seoMeta: true,
          faqs: { where: { locale }, orderBy: { sortOrder: 'asc' } },
        }
      });
    }
  } catch (e) {
    console.error('Service detail fetch failed', e);
  }

  if (!page && !hasDisplayableServiceText(slug)) notFound();

  const seo = page?.seoMeta.find(s => s.locale === locale) || page?.seoMeta.find(s => s.locale === 'tr');
  const title = serviceTitleFor(slug, locale, [seo?.metaTitle, page?.titleInternal]);
  const description = serviceDescriptionFor(slug, locale, [seo?.metaDescription]);

  // FAQPage JSON-LD
  const faqs = page?.faqs || [];
  const blocks = page?.blocks || [];
  const image = seo?.ogImage || OLD_SITE_SERVICE_IMAGES[slug] || `${baseUrl}/images/og-default.jpg`;

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  // MedicalProcedure JSON-LD — critical for AEO (AI assistants cite this)
  const procedureJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: title,
    description,
    url: locale === 'tr' ? `${baseUrl}/hizmetler/${localizedServiceSlug(slug, locale)}` : `${baseUrl}/${locale}/hizmetler/${localizedServiceSlug(slug, locale)}`,
    image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    procedureType: 'https://schema.org/SurgicalProcedure',
    status: 'https://schema.org/EventScheduled',
    recognizingAuthority: {
      '@type': 'MedicalOrganization',
      name: 'Türk KBB ve BBC Derneği',
    },
    performer: {
      '@type': 'Physician',
      name: 'Prof. Dr. Gökçe Özel',
      url: `${baseUrl}/gokce-ozel-kimdir`,
    },
    provider: {
      '@type': 'MedicalClinic',
      name: 'Prof. Dr. Gökçe Özel Klinik',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ankara',
        addressRegion: 'Ankara',
        addressCountry: 'TR',
      },
    },
    relevantSpecialty: {
      '@type': 'MedicalSpecialty',
      name: 'Otolaryngologic',
    },
    ...(faqs.length > 0 && {
      followup: faqs.slice(0, 3).map(f => f.question).join('; '),
    }),
  };

  const backLabel = { tr: 'Tüm Hizmetler', en: 'All Services', ar: 'جميع الخدمات', ru: 'Все услуги', fr: 'Tous les services', de: 'Alle Leistungen' };

  return (
    <main className="min-h-screen py-20 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {seo?.shortAnswer && (
        <div className="sr-only" data-aeo-summary>{seo.shortAnswer}</div>
      )}
      <div className="container mx-auto px-5 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <Link href={localePath(locale, '/hizmetler')} className="text-[#b88746] hover:text-[#17201e] transition-colors inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold">
            &larr; {backLabel[locale as keyof typeof backLabel] || backLabel.tr}
          </Link>
        </div>
        <header className="mb-10 md:mb-14">
          <p className="section-kicker mb-3">
            {locale === 'tr' ? 'Hizmet Detayı' : 'Service Detail'}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#17201e] leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[#61706b] text-lg leading-relaxed mt-5 max-w-3xl">
              {description}
            </p>
          )}
        </header>
        {blocks.length > 0 ? (
          <BlockRenderer blocks={blocks} locale={locale} faqs={faqs} />
        ) : (
          <section className="soft-card rounded-[1.5rem] overflow-hidden">
            <div className="relative aspect-[16/9] bg-[#dbe7e7]">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-7 md:p-10">
              <h2 className="font-serif text-3xl text-[#17201e] mb-4">{title}</h2>
              <p className="text-[#61706b] leading-relaxed max-w-3xl">
                {description || 'Bu hizmet için detaylı değerlendirme kişiye özel muayene ve beklenti analizi sonrasında planlanır.'}
              </p>
              <Link href={localePath(locale, '/iletisim')} className="inline-flex mt-7 bg-[#151714] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#315a52] transition-colors">
                {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
