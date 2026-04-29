import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlockRenderer from '@/components/ui/BlockRenderer';
import { blogCoverFor } from '@/lib/blog-cover';

export const revalidate = 60;

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;

  const page = await prisma.page.findUnique({
    where: { slug, type: 'BLOG' },
    include: { seoMeta: true }
  });

  if (!page) return { title: 'Bulunamadı' };

  const seo = page.seoMeta.find(s => s.locale === locale) || page.seoMeta.find(s => s.locale === 'tr');
  const cover = blogCoverFor({
    slug,
    title: seo?.metaTitle || page.titleInternal,
    description: seo?.metaDescription,
    ogImage: seo?.ogImage,
  });

  const languages: Record<string, string> = { 'x-default': `${baseUrl}/blog/${slug}` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? `${baseUrl}/blog/${slug}` : `${baseUrl}/${loc}/blog/${slug}`;
  });

  return {
    title: seo?.metaTitle || page.titleInternal,
    description: seo?.metaDescription || '',
    keywords: seo?.keywords || '',
    robots: seo?.robots || 'index,follow',
    openGraph: {
      title: seo?.metaTitle || page.titleInternal,
      description: seo?.metaDescription || '',
      images: [{ url: cover }],
      locale,
      type: 'article',
    },
    alternates: { canonical: seo?.canonicalUrl || `${baseUrl}/${locale === 'tr' ? '' : locale + '/'}blog/${slug}`, languages },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;

  const page = await prisma.page.findUnique({
    where: { slug, type: 'BLOG' },
    include: {
      blocks: { include: { translations: true }, orderBy: { sortOrder: 'asc' } },
      seoMeta: true,
    }
  });

  if (!page) notFound();

  const seo = page.seoMeta.find(s => s.locale === locale) || page.seoMeta.find(s => s.locale === 'tr');
  const cover = blogCoverFor({
    slug,
    title: seo?.metaTitle || page.titleInternal,
    description: seo?.metaDescription,
    ogImage: seo?.ogImage,
  });

  const canonicalUrl = locale === 'tr' ? `${baseUrl}/blog/${slug}` : `${baseUrl}/${locale}/blog/${slug}`;

  // Article JSON-LD (E-E-A-T signals: author is Physician)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: seo?.metaTitle || page.titleInternal,
    description: seo?.metaDescription || '',
    image: cover.startsWith('http') ? cover : `${baseUrl}${cover}`,
    url: canonicalUrl,
    author: {
      '@type': 'Physician',
      name: 'Prof. Dr. Gökçe Özel',
      url: `${baseUrl}/gokce-ozel-kimdir`,
      honorificPrefix: 'Prof. Dr.',
      jobTitle: 'KBB Uzmanı',
      worksFor: { '@type': 'MedicalClinic', name: 'Prof. Dr. Gökçe Özel Klinik' },
    },
    publisher: {
      '@type': 'MedicalClinic',
      name: 'Prof. Dr. Gökçe Özel Klinik',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/images/logo.png` },
    },
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
    inLanguage: locale,
    medicalAudience: { '@type': 'Patient' },
    about: {
      '@type': 'MedicalCondition',
      name: page.titleInternal,
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: locale === 'tr' ? baseUrl : `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: locale === 'tr' ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: seo?.metaTitle || page.titleInternal, item: canonicalUrl },
    ],
  };

  const backLabel = { tr: 'Bloga Dön', en: 'Back to Blog', ar: 'العودة إلى المدونة', ru: 'Назад в блог', fr: 'Retour au blog', de: 'Zurück zum Blog' };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <Link href={`/${locale}/blog`} className="text-[#d4af37] hover:text-white transition-colors inline-flex items-center gap-2 text-sm uppercase tracking-wider font-semibold">
            &larr; {backLabel[locale as keyof typeof backLabel] || backLabel.tr}
          </Link>
        </div>
        <div className="relative aspect-[16/8] rounded-[1.5rem] overflow-hidden mb-10 border border-white/10 bg-[#111714]">
          <img src={cover} alt={seo?.metaTitle || page.titleInternal} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/65 via-transparent to-transparent" />
        </div>
        <BlockRenderer blocks={page.blocks} locale={locale} />
      </div>
    </main>
  );
}
