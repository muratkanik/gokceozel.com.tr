import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

const baseUrl = 'https://gokceozel.com.tr';

const titles: Record<string, string> = {
  tr: 'Sık Sorulan Sorular | Prof. Dr. Gökçe Özel',
  en: 'Frequently Asked Questions | Prof. Dr. Gökçe Özel',
  ar: 'الأسئلة الشائعة | أ.د. غوكتشه أوزيل',
  ru: 'Часто задаваемые вопросы | Проф. д-р Гёкче Озель',
  fr: 'Questions fréquentes | Prof. Dr. Gökçe Özel',
  de: 'Häufige Fragen | Prof. Dr. Gökçe Özel',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/sss` };
  allLocales.forEach(loc => { languages[loc] = loc === 'tr' ? `${baseUrl}/sss` : `${baseUrl}/${loc}/sss`; });

  return {
    title: titles[locale] || titles.tr,
    description: locale === 'tr'
      ? 'Rinoplasti, Endolift, Botoks ve estetik uygulamalar hakkında merak edilen soruların cevapları.'
      : 'Answers to frequently asked questions about rhinoplasty, Endolift, Botox and aesthetic procedures.',
    alternates: { canonical: locale === 'tr' ? `${baseUrl}/sss` : `${baseUrl}/${locale}/sss`, languages },
  };
}

// Statik fallback SSS (DB'den alınana kadar)
const staticFaqs: Record<string, { q: string; a: string }[]> = {
  tr: [
    { q: 'Rinoplasti ameliyatı ne kadar sürer?', a: 'Rinoplasti ameliyatı ortalama 2–3 saat sürer. Genel anestezi altında gerçekleştirilir. İyileşme süreci 7–14 gündür ve ilk haftanın ardından günlük hayata dönmek mümkündür.' },
    { q: 'Endolift lazer işlemi acıtıyor mu?', a: 'Endolift lazer lokal anestezi uygulanarak gerçekleştirildiğinden işlem sırasında ağrı hissedilmez. Sonrasında hafif bir hassasiyet normaldir ve genellikle 1–2 gün içinde geçer.' },
    { q: 'Botoks ne sıklıkla tekrarlanmalıdır?', a: 'Botoks etkisi 4–6 ay sürer. Düzenli uygulama yapıldığında kaslar zaman içinde "eğitildiği" için aralar uzayabilir ve ihtiyaç duyulan doz azalabilir.' },
    { q: 'Alt blefaroplasti genel anestezi gerektiriyor mu?', a: 'Alt blefaroplasti sedasyonla ya da genel anestezi altında uygulanabilir. Üst blefaroplasti ise çoğunlukla lokal anestezi ile gerçekleştirilebilir. Karar muayene sonrası belirlenir.' },
    { q: 'Dudak dolgusu kalıcı mı?', a: 'Hyalüronik asit tabanlı dudak dolguları kalıcı değildir; etki süresi kişiye ve kullanılan ürüne göre 6–18 ay arasında değişir. İstenmesi halinde enzimle çözülebilir.' },
    { q: 'PRP gençlik aşısı nasıl çalışır?', a: 'PRP (Platelet Rich Plasma) yöntemi, hastanın kendi kanından elde edilen trombosit açısından zengin plazmanın cilde enjekte edilmesiyle gerçekleştirilir. Kollajen sentezini ve doku yenilenmesini uyarır.' },
    { q: 'Kepçe kulak ameliyatı için yaş sınırı var mı?', a: 'Kulağın gelişimini tamamlamasının ardından (genellikle 5–6 yaş) ameliyat uygulanabilir. Yetişkinlerde herhangi bir üst yaş sınırı yoktur.' },
    { q: 'Operasyon öncesi ne yapılması gerekiyor?', a: 'Ameliyat öncesinde kan sulandırıcı ilaçlar ve aspirin kesilmeli, alkol tüketiminden kaçınılmalıdır. Detaylı talimatlar ön görüşme sırasında paylaşılır.' },
  ],
  en: [
    { q: 'How long does rhinoplasty surgery take?', a: 'Rhinoplasty typically takes 2–3 hours under general anesthesia. Recovery takes 7–14 days, and most patients return to daily activities after the first week.' },
    { q: 'Is the Endolift laser procedure painful?', a: 'Endolift is performed under local anesthesia so no pain is felt during the procedure. Mild sensitivity is normal afterwards and usually resolves within 1–2 days.' },
    { q: 'How often should Botox be repeated?', a: 'Botox effects last 4–6 months. With regular treatments, muscles gradually require less product and intervals between sessions may lengthen.' },
  ],
};

export default async function SssPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch FAQs from DB (global, not page-specific)
  let dbFaqs: { question: string; answer: string; id: string }[] = [];
  try {
    dbFaqs = await prisma.faq.findMany({
      where: { pageId: null, locale },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, question: true, answer: true },
    });
    // Fallback to TR if no locale FAQs
    if (dbFaqs.length === 0 && locale !== 'tr') {
      dbFaqs = await prisma.faq.findMany({
        where: { pageId: null, locale: 'tr' },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, question: true, answer: true },
      });
    }
  } catch (e) {
    console.error('SSS: faq fetch failed', e);
  }

  const faqs = dbFaqs.length > 0
    ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
    : (staticFaqs[locale] || staticFaqs.tr);

  // FAQPage JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const heading: Record<string, string> = {
    tr: 'Sık Sorulan Sorular',
    en: 'Frequently Asked Questions',
    ar: 'الأسئلة الشائعة',
    ru: 'Часто задаваемые вопросы',
    fr: 'Questions fréquentes',
    de: 'Häufige Fragen',
  };

  const subheading: Record<string, string> = {
    tr: 'Rinoplasti, Endolift, Botoks ve estetik uygulamalar hakkında merak edilen sorular',
    en: 'Your questions about rhinoplasty, Endolift, Botox and aesthetic treatments answered',
    ar: 'إجابات على أسئلتكم حول تجميل الأنف، Endolift، البوتوكس والعلاجات التجميلية',
    ru: 'Ответы на вопросы о ринопластике, Endolift, ботоксе и эстетических процедурах',
    fr: 'Réponses à vos questions sur la rhinoplastie, l\'Endolift, le Botox et les traitements esthétiques',
    de: 'Antworten auf Ihre Fragen zu Rhinoplastik, Endolift, Botox und ästhetischen Behandlungen',
  };

  const ctaLabel: Record<string, string> = {
    tr: 'Randevu Al',
    en: 'Book Appointment',
    ar: 'احجز موعداً',
    ru: 'Записаться',
    fr: 'Prendre RDV',
    de: 'Termin buchen',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="min-h-screen bg-[#0a0a0a] text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <section className="py-24 px-4 text-center border-b border-[#2a2a2a]">
          <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-4 font-semibold">FAQ · SSS</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-5">{heading[locale] || heading.tr}</h1>
          <p className="text-[#9a8f7c] max-w-xl mx-auto text-lg">{subheading[locale] || subheading.tr}</p>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }, i) => (
              <details key={i} className="group bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#b8893c]/40 transition-colors">
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 font-semibold text-[#e9e4d8] list-none select-none">
                  <span className="text-base">{q}</span>
                  <span className="text-[#b8893c] shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-6 text-[#9a8f7c] leading-relaxed border-t border-[#2a2a2a] pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 px-4 border-t border-[#2a2a2a]">
          <p className="text-[#9a8f7c] mb-6">
            {locale === 'tr' ? 'Sorunuz cevap bulamadı mı?' : 'Didn\'t find your answer?'}
          </p>
          <a
            href={`/${locale}/iletisim`}
            className="inline-block bg-gradient-to-r from-[#d4b97a] to-[#8f6b2e] text-[#1a1410] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            {ctaLabel[locale] || ctaLabel.tr}
          </a>
        </section>
      </main>
    </>
  );
}
