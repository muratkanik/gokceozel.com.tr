import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlockRenderer from '@/components/ui/BlockRenderer';

export const revalidate = 60;

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;

  const page = await prisma.page.findUnique({
    where: { slug, type: 'SERVICE' },
    include: { seoMeta: true }
  });

  if (!page) return { title: 'Bulunamadı' };

  const seo = page.seoMeta.find(s => s.locale === locale) || page.seoMeta.find(s => s.locale === 'tr');

  // hreflang alternates
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/hizmetler/${slug}` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr'
      ? `${baseUrl}/hizmetler/${slug}`
      : `${baseUrl}/${loc}/hizmetler/${slug}`;
  });

  return {
    title: seo?.metaTitle || page.titleInternal,
    description: seo?.metaDescription || '',
    keywords: seo?.keywords || '',
    robots: seo?.robots || 'index,follow',
    openGraph: {
      title: seo?.metaTitle || page.titleInternal,
      description: seo?.metaDescription || '',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      locale,
      type: 'website',
    },
    alternates: { canonical: seo?.canonicalUrl || `${baseUrl}/${locale === 'tr' ? '' : locale + '/'}hizmetler/${slug}`, languages },
  };
}

export default async function HizmetDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;

  const page = await prisma.page.findUnique({
    where: { slug, type: 'SERVICE' },
    include: {
      blocks: { include: { translations: true }, orderBy: { sortOrder: 'asc' } },
      seoMeta: true,
      faqs: { where: { locale }, orderBy: { sortOrder: 'asc' } },
    }
  });

  if (!page) notFound();

  const seo = page.seoMeta.find(s => s.locale === locale) || page.seoMeta.find(s => s.locale === 'tr');

  // FAQPage JSON-LD
  const faqJsonLd = page.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  // MedicalProcedure JSON-LD — critical for AEO (AI assistants cite this)
  const procedureJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: seo?.metaTitle || page.titleInternal,
    description: seo?.metaDescription || '',
    url: locale === 'tr' ? `${baseUrl}/hizmetler/${slug}` : `${baseUrl}/${locale}/hizmetler/${slug}`,
    image: seo?.ogImage || `${baseUrl}/images/og-default.jpg`,
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
    ...(page.faqs.length > 0 && {
      followup: page.faqs.slice(0, 3).map(f => f.question).join('; '),
    }),
  };

  const backLabel = { tr: 'Tüm Hizmetler', en: 'All Services', ar: 'جميع الخدمات', ru: 'Все услуги', fr: 'Tous les services', de: 'Alle Leistungen' };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {seo?.shortAnswer && (
        <div className="sr-only" data-aeo-summary>{seo.shortAnswer}</div>
      )}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <Link href={`/${locale}/hizmetler`} className="text-[#d4af37] hover:text-white transition-colors inline-flex items-center gap-2 text-sm uppercase tracking-wider font-semibold">
            &larr; {backLabel[locale as keyof typeof backLabel] || backLabel.tr}
          </Link>
        </div>
        <BlockRenderer blocks={page.blocks} locale={locale} faqs={page.faqs} />
      </div>
    </main>
  );
}
