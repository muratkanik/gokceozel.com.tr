import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

// Slug → görsel eşlemesi (bilinen hizmetler için)
const SERVICE_IMAGES: Record<string, string> = {
  'rinoplasti':            '/images/content/service-02.jpg',
  'septorinoplasti':       '/images/content/service-02.jpg',
  'gz-kapa-estetii':       '/uploads/gozaltiisik.png',
  'blefaroplasti':         '/uploads/gozaltiisik.png',
  'alt-blefaroplasti':     '/uploads/gozaltiisik.png',
  'ust-blefaroplasti':     '/uploads/gozaltiisik.png',
  'endolift':              '/uploads/endolift_lazer.png',
  'endolift-lazer':        '/uploads/endolift_lazer.png',
  'botoks':                '/uploads/botillinhum.png',
  'dolgu':                 '/uploads/dolgu.jpg',
  'dudak-dolgusu':         '/uploads/dudakdolgusu.png',
  'dudak-kaldirma':        '/uploads/dudakdolgusu.png',
  'ip-aski':               '/uploads/ip_aski.png',
  'ip-ile-yuz-askılama':   '/uploads/ip_aski.png',
  'kepce-kulak':           '/uploads/otoplasti.png',
  'otoplasti':             '/uploads/otoplasti.png',
  'prp':                   '/uploads/cilt_yenileme.png',
  'mezoterapi':            '/uploads/mezoterapi.png',
  'cilt-yenileme':         '/uploads/cilt_yenileme.png',
  'lazerle-yuz-germe':     '/uploads/endolift_lazer.png',
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

export default async function HizmetlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const services = await prisma.page.findMany({
    where: { type: 'SERVICE' },
    include: { seoMeta: true },
    orderBy: { createdAt: 'asc' },
  });

  const heading: Record<string, string> = {
    tr: 'Hizmetlerimiz', en: 'Our Services',
    ar: 'خدماتنا', ru: 'Наши услуги',
    fr: 'Nos services', de: 'Unsere Leistungen',
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-3 font-semibold">
            Prof. Dr. Gökçe Özel Klinik
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            {heading[locale] || heading.tr}
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#b8893c] to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const seo = service.seoMeta.find(s => s.locale === locale) || service.seoMeta.find(s => s.locale === 'tr');
            const title = seo?.metaTitle || service.titleInternal;
            const description = seo?.metaDescription || '';
            const imgSrc = SERVICE_IMAGES[service.slug] ?? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

            return (
              <Link key={service.id} href={`/${locale}/hizmetler/${service.slug}`} className="group block">
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#b8893c]/60 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col shadow-lg hover:shadow-[#b8893c]/10 hover:shadow-xl">
                  {/* Görsel */}
                  <div className="aspect-video relative overflow-hidden bg-[#111]">
                    <Image
                      src={imgSrc}
                      alt={title || service.slug}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
                    {/* Logo watermark */}
                    <div className="absolute top-3 right-3 w-8 h-8 opacity-40">
                      <Image src="/images/logo.png" alt="" width={32} height={32} className="invert w-full h-full object-contain" />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-[#d4b97a] transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-[#9a8f7c] text-sm line-clamp-3 leading-relaxed flex-1">
                        {description}
                      </p>
                    )}
                    <div className="mt-4 text-[#b8893c] text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
                      {locale === 'tr' ? 'İncele' : locale === 'en' ? 'Explore' : locale === 'ar' ? 'اقرأ المزيد' : 'Mehr'}
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
