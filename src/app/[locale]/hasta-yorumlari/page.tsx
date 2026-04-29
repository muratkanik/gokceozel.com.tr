import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

const baseUrl = 'https://gokceozel.com.tr';
const localePath = (locale: string, path = '') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
};

const titles: Record<string, string> = {
  tr: 'Hasta Yorumları | Prof. Dr. Gökçe Özel',
  en: 'Patient Reviews | Prof. Dr. Gökçe Özel',
  ar: 'تقييمات المرضى | أ.د. غوكتشه أوزيل',
  ru: 'Отзывы пациентов | Проф. д-р Гёкче Озель',
  fr: 'Avis patients | Prof. Dr. Gökçe Özel',
  de: 'Patientenbewertungen | Prof. Dr. Gökçe Özel',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/hasta-yorumlari` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? `${baseUrl}/hasta-yorumlari` : `${baseUrl}/${loc}/hasta-yorumlari`;
  });

  return {
    title: titles[locale] || titles.tr,
    description: locale === 'tr'
      ? 'Prof. Dr. Gökçe Özel kliniğinde tedavi görmüş hastaların gerçek yorumları ve deneyimleri.'
      : 'Real reviews and experiences from patients treated at Prof. Dr. Gökçe Özel clinic.',
    alternates: {
      canonical: locale === 'tr' ? `${baseUrl}/hasta-yorumlari` : `${baseUrl}/${locale}/hasta-yorumlari`,
      languages,
    },
  };
}

const starColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e'];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating}/5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill={i <= rating ? '#b8893c' : '#2a2a2a'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

export default async function HastaYorumlariPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let testimonials: { id: string; author: string; rating: number; text: string; source: string | null; createdAt: Date }[] = [];
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { approved: true, locale },
      orderBy: { createdAt: 'desc' },
      select: { id: true, author: true, rating: true, text: true, source: true, createdAt: true },
    });
    if (testimonials.length === 0 && locale !== 'tr') {
      testimonials = await prisma.testimonial.findMany({
        where: { approved: true, locale: 'tr' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, author: true, rating: true, text: true, source: true, createdAt: true },
      });
    }
  } catch (e) {
    console.error('hasta-yorumlari: fetch failed', e);
  }

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  // AggregateRating + Review JSON-LD
  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'Prof. Dr. Gökçe Özel Klinik',
    url: baseUrl,
    aggregateRating: testimonials.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: testimonials.length,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    review: testimonials.slice(0, 10).map(t => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.author },
      reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.text,
      datePublished: t.createdAt.toISOString().split('T')[0],
    })),
  };

  const heading: Record<string, string> = {
    tr: 'Hasta Yorumları', en: 'Patient Reviews', ar: 'تقييمات المرضى',
    ru: 'Отзывы пациентов', fr: 'Avis patients', de: 'Patientenbewertungen',
  };

  const emptyMsg: Record<string, string> = {
    tr: 'Henüz yorum yayınlanmamış.', en: 'No reviews published yet.',
    ar: 'لا توجد تقييمات منشورة بعد.', ru: 'Отзывов пока нет.',
    fr: "Aucun avis publié pour l'instant.", de: 'Noch keine Bewertungen veröffentlicht.',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />

      <main className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <section className="py-20 lg:py-24 px-5 text-center border-b border-[#49685f]/10">
          <p className="section-kicker mb-4">
            {locale === 'tr' ? 'Gerçek Hastalar · Gerçek Deneyimler' : 'Real Patients · Real Experiences'}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#17201e] mb-5">{heading[locale] || heading.tr}</h1>
          {testimonials.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Stars rating={Math.round(Number(avgRating))} />
              <span className="text-[#b8893c] font-bold text-xl">{avgRating}</span>
              <span className="text-[#61706b] text-sm">/ 5 · {testimonials.length} {locale === 'tr' ? 'yorum' : 'reviews'}</span>
            </div>
          )}
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16">
          {testimonials.length === 0 ? (
            <p className="text-center text-[#61706b]">{emptyMsg[locale] || emptyMsg.tr}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map(t => (
                <article
                  key={t.id}
                  className="soft-card rounded-[1.35rem] p-7 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-[#17201e]">{t.author}</p>
                      {t.source && <p className="text-xs text-[#61706b] mt-0.5">{t.source}</p>}
                    </div>
                    <Stars rating={t.rating} />
                  </div>
                  <p className="text-[#61706b] leading-relaxed text-sm">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-[#9a9084] text-xs mt-4">{t.createdAt.toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale)}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="text-center py-12 px-4 border-t border-[#49685f]/10">
          <a
            href={localePath(locale, '/iletisim')}
            className="inline-block bg-[#17201e] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-[#49685f] transition-colors"
          >
            {locale === 'tr' ? 'Randevu Al' : locale === 'en' ? 'Book Appointment' : locale === 'ar' ? 'احجز موعداً' : locale === 'ru' ? 'Записаться' : 'Randevu Al'}
          </a>
        </section>
      </main>
    </>
  );
}
