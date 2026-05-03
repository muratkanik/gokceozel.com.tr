import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { canonicalServiceSlug, hasDisplayableServiceText, serviceDescriptionFor, serviceTitleFor } from '@/lib/service-display';
import { hizmetlerSegment, localizedServiceSlug } from '@/lib/service-slugs';
import { OLD_SITE_SERVICE_IMAGES } from '@/lib/old-site-media';

export const revalidate = 60;
const localePath = (locale: string, path = '') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
};

const FALLBACK_IMAGES = [
  '/images/content/service-04.jpg',
  '/images/content/service-05.jpg',
  '/images/content/service-06.jpg',
  '/images/content/service-07.jpg',
  '/images/content/service-08.jpg',
  '/images/content/service-09.jpg',
  '/images/content/service-10.jpg',
];
const FALLBACK_SERVICES = [
  { id: 'rinoplasti', slug: 'rinoplasti', titleInternal: 'Rinoplasti', seoMeta: [{ locale: 'tr', metaTitle: 'Rinoplasti', metaDescription: 'Burun estetiğinde doğal görünüm ve nefes fonksiyonunu birlikte değerlendiren kişiye özel cerrahi planlama.' }] },
  { id: 'endolift', slug: 'endolift', titleInternal: 'Endolift Lazer', seoMeta: [{ locale: 'tr', metaTitle: 'Endolift Lazer', metaDescription: 'Kesi olmadan yüz ve gıdı hattında sıkılaşma ve kontür desteği sağlayan lazer uygulaması.' }] },
  { id: 'blefaroplasti', slug: 'gz-kapa-estetii', titleInternal: 'Göz Kapağı Estetiği', seoMeta: [{ locale: 'tr', metaTitle: 'Göz Kapağı Estetiği', metaDescription: 'Üst ve alt göz kapağında daha dinlenmiş, doğal ve açık bir ifade hedefleyen estetik yaklaşım.' }] },
  { id: 'botoks', slug: 'botoks', titleInternal: 'Botoks', seoMeta: [{ locale: 'tr', metaTitle: 'Botoks', metaDescription: 'Mimik çizgilerini yumuşatırken yüz ifadesini korumaya odaklanan medikal estetik uygulama.' }] },
  { id: 'dolgu', slug: 'dolgu', titleInternal: 'Dolgu', seoMeta: [{ locale: 'tr', metaTitle: 'Dolgu Uygulamaları', metaDescription: 'Yüz hacmi, dudak ve kontür ihtiyaçlarına göre planlanan hyalüronik asit dolgu uygulamaları.' }] },
  { id: 'ip-aski', slug: 'ip-aski', titleInternal: 'İp Askılama', seoMeta: [{ locale: 'tr', metaTitle: 'İp Askılama', metaDescription: 'Yüz ovalini destekleyen ve hafif sarkmaları toparlamayı hedefleyen ameliyatsız askılama uygulaması.' }] },
];

const EXPLORE_LABEL: Record<string, string> = {
  tr: 'İncele',
  en: 'Explore',
  ar: 'اقرأ المزيد',
  ru: 'Подробнее',
  fr: 'Découvrir',
  de: 'Mehr erfahren',
};

export default async function HizmetlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let services: any[] = [];
  try {
    services = await prisma.page.findMany({
      where: { type: 'SERVICE' },
      include: { seoMeta: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (e) {
    console.error('Services fetch failed', e);
    services = FALLBACK_SERVICES;
  }

  const heading: Record<string, string> = {
    tr: 'Hizmetlerimiz', en: 'Our Services',
    ar: 'خدماتنا', ru: 'Наши услуги',
    fr: 'Nos services', de: 'Unsere Leistungen',
  };

  return (
    <main className="min-h-screen py-20 lg:py-24">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="text-center mb-14">
          <p className="section-kicker mb-3">
            Prof. Dr. Gökçe Özel Klinik
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-[#17201e] mb-4">
            {heading[locale] || heading.tr}
          </h1>
          <p className="text-[#61706b] max-w-2xl mx-auto">
            {locale === 'tr'
              ? 'Yüzün doğal oranlarını, nefes fonksiyonunu ve kişisel beklentileri birlikte değerlendiren kapsamlı estetik uygulamalar.'
              : 'Comprehensive aesthetic treatments planned around natural facial balance, function and personal expectations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter((service) => {
            const seo = service.seoMeta.find((s: { locale: string }) => s.locale === locale) || service.seoMeta.find((s: { locale: string }) => s.locale === 'tr');

            return hasDisplayableServiceText(service.slug, [
              seo?.metaTitle,
              seo?.metaDescription,
              service.titleInternal,
            ]);
          }).map((service, idx) => {
            const seo = service.seoMeta.find((s: { locale: string }) => s.locale === locale) || service.seoMeta.find((s: { locale: string }) => s.locale === 'tr');
            const slug = canonicalServiceSlug(service.slug, [seo?.metaTitle, service.titleInternal]);
            const title = serviceTitleFor(slug, locale, [
              seo?.metaTitle,
              service.titleInternal,
            ]);
            const description = serviceDescriptionFor(slug, locale, [
              seo?.metaDescription,
            ]);
            const imgSrc = OLD_SITE_SERVICE_IMAGES[slug] ?? OLD_SITE_SERVICE_IMAGES[service.slug] ?? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

            const localSlug = localizedServiceSlug(slug, locale);
            const seg = hizmetlerSegment(locale);
            return (
              <Link key={service.id} href={localePath(locale, `/${seg}/${localSlug}`)} className="group block">
                <div className="soft-card rounded-[1.35rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-[#111]">
                    <Image
                      src={imgSrc}
                      alt={title || service.slug}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101614]/75 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-serif text-[#17201e] mb-2 group-hover:text-[#b88746] transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-[#61706b] text-sm line-clamp-3 leading-relaxed flex-1">
                        {description}
                      </p>
                    )}
                    <div className="mt-5 text-[#b88746] text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                      {EXPLORE_LABEL[locale] || EXPLORE_LABEL.tr}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
