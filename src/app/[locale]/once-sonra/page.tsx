import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

const baseUrl = 'https://gokceozel.com.tr';

const titles: Record<string, string> = {
  tr: 'Öncesi & Sonrası | Prof. Dr. Gökçe Özel',
  en: 'Before & After | Prof. Dr. Gökçe Özel',
  ar: 'قبل وبعد | أ.د. غوكتشه أوزيل',
  ru: 'До и после | Проф. д-р Гёкче Озель',
  fr: 'Avant & Après | Prof. Dr. Gökçe Özel',
  de: 'Vorher & Nachher | Prof. Dr. Gökçe Özel',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/once-sonra` };
  allLocales.forEach(l => {
    languages[l] = l === 'tr' ? `${baseUrl}/once-sonra` : `${baseUrl}/${l}/once-sonra`;
  });
  return {
    title: titles[locale] || titles.tr,
    description: locale === 'tr'
      ? 'Prof. Dr. Gökçe Özel klinik hastalarından gerçek operasyon öncesi ve sonrası sonuçları.'
      : 'Real before and after results from patients of Prof. Dr. Gökçe Özel clinic.',
    robots: 'noindex, follow', // Yasal gereklilik: önce-sonra görselleri indekslenmemeli
    alternates: { canonical: locale === 'tr' ? `${baseUrl}/once-sonra` : `${baseUrl}/${locale}/once-sonra`, languages },
  };
}

const categoryLabels: Record<string, Record<string, string>> = {
  tr: { rinoplasti: 'Rinoplasti', blepharoplasty: 'Göz Kapağı', endolift: 'Endolift', botox: 'Botoks/Dolgu', other: 'Diğer' },
  en: { rinoplasti: 'Rhinoplasty', blepharoplasty: 'Blepharoplasty', endolift: 'Endolift', botox: 'Botox/Filler', other: 'Other' },
};

export default async function OnceSonraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let cases: { id: string; beforeUrl: string; afterUrl: string; caption: string | null; serviceId: string }[] = [];
  try {
    cases = await prisma.beforeAfter.findMany({
      where: { isPublic: true, consent: true },
      orderBy: { id: 'desc' },
    });
  } catch (e) {
    console.error('once-sonra: fetch failed', e);
  }

  const heading: Record<string, string> = {
    tr: 'Öncesi & Sonrası', en: 'Before & After', ar: 'قبل وبعد',
    ru: 'До и после', fr: 'Avant & Après', de: 'Vorher & Nachher',
  };
  const subheading: Record<string, string> = {
    tr: 'Tüm görseller gerçek hastalardan alınmış ve hasta onayı ile yayınlanmaktadır. Kişisel tanımlayıcı bilgiler gizlenmiştir.',
    en: 'All images are real patient results published with written consent. Personal identifying information has been removed.',
    ar: 'جميع الصور من مرضى حقيقيين ومنشورة بموافقتهم. تم إخفاء المعلومات الشخصية.',
    ru: 'Все фотографии — реальные результаты пациентов, опубликованные с их письменного согласия.',
    fr: 'Toutes les images sont des résultats réels de patients publiés avec consentement écrit.',
    de: 'Alle Bilder zeigen echte Patientenergebnisse, veröffentlicht mit schriftlicher Einwilligung.',
  };
  const emptyMsg: Record<string, string> = {
    tr: 'Henüz görsel yayınlanmamış. Yakında eklenecek.',
    en: 'No cases published yet. Coming soon.',
    ar: 'لم يتم نشر أي حالات بعد.',
    ru: 'Пока нет опубликованных случаев.',
    fr: 'Aucun cas publié pour l\'instant.',
    de: 'Noch keine Fälle veröffentlicht.',
  };
  const disclaimer: Record<string, string> = {
    tr: '⚠ Bu görseller yalnızca bilgilendirme amaçlıdır. Sonuçlar kişiden kişiye farklılık gösterebilir. Görseller 6563 sayılı KVKK ve 3359 sayılı Sağlık Hizmetleri Kanunu kapsamında hasta onayı ile paylaşılmaktadır.',
    en: '⚠ These images are for informational purposes only. Results may vary between individuals. Images are shared with patient consent under applicable health and privacy regulations.',
    ar: '⚠ هذه الصور لأغراض إعلامية فقط. قد تختلف النتائج من شخص لآخر.',
    ru: '⚠ Изображения предоставлены исключительно в информационных целях. Результаты могут отличаться.',
    fr: '⚠ Ces images sont à des fins informatives uniquement. Les résultats peuvent varier d\'un individu à l\'autre.',
    de: '⚠ Diese Bilder dienen ausschließlich zu Informationszwecken. Ergebnisse können variieren.',
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <section className="py-24 px-4 text-center border-b border-[#2a2a2a]">
        <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-4 font-semibold">Hasta Sonuçları</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-5">{heading[locale] || heading.tr}</h1>
        <p className="text-[#9a8f7c] max-w-2xl mx-auto text-sm leading-relaxed">{subheading[locale] || subheading.tr}</p>
      </section>

      {/* Cases grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {cases.length === 0 ? (
          <p className="text-center text-[#9a8f7c] py-16">{emptyMsg[locale] || emptyMsg.tr}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map(c => (
              <article key={c.id} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#b8893c]/30 transition-colors">
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative">
                    <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-[#9a8f7c] border border-[#2a2a2a] z-10">
                      {locale === 'tr' ? 'Önce' : locale === 'en' ? 'Before' : locale === 'ar' ? 'قبل' : locale === 'ru' ? 'До' : 'Avant'}
                    </div>
                    <img src={c.beforeUrl} alt="Önce" className="w-full aspect-square object-cover object-top" loading="lazy" />
                  </div>
                  <div className="relative">
                    <div className="absolute top-3 left-3 bg-[#b8893c]/90 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-white border border-[#b8893c] z-10 font-semibold">
                      {locale === 'tr' ? 'Sonra' : locale === 'en' ? 'After' : locale === 'ar' ? 'بعد' : locale === 'ru' ? 'После' : 'Après'}
                    </div>
                    <img src={c.afterUrl} alt="Sonra" className="w-full aspect-square object-cover object-top" loading="lazy" />
                  </div>
                </div>
                {c.caption && (
                  <p className="px-5 py-3.5 text-sm text-[#9a8f7c] border-t border-[#2a2a2a]">{c.caption}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Legal disclaimer */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <p className="text-xs text-[#3a3028] leading-relaxed text-center">{disclaimer[locale] || disclaimer.tr}</p>
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-4 border-t border-[#2a2a2a]">
        <a
          href={`/${locale}/iletisim`}
          className="inline-block bg-gradient-to-r from-[#d4b97a] to-[#8f6b2e] text-[#1a1410] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          {locale === 'tr' ? 'Randevu Al' : locale === 'en' ? 'Book Appointment' : locale === 'ar' ? 'احجز موعداً' : locale === 'ru' ? 'Записаться' : 'Randevu Al'}
        </a>
      </section>
    </main>
  );
}
