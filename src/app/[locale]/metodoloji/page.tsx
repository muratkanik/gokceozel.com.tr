import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

const baseUrl = 'https://gokceozel.com.tr';

const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

const meta: Record<string, { title: string; description: string }> = {
  tr: {
    title: 'Muayene Metodolojisi | Prof. Dr. Gökçe Özel',
    description: 'Prof. Dr. Gökçe Özel\'in doğal sonuçlar için uyguladığı kanıta dayalı muayene ve tedavi planlama yaklaşımı.',
  },
  en: {
    title: 'Clinical Methodology | Prof. Dr. Gökçe Özel',
    description: 'Prof. Dr. Gökçe Özel\'s evidence-based examination and treatment planning approach for natural, lasting results.',
  },
  ar: {
    title: 'منهجية الفحص | أ.د. غوكتشه أوزيل',
    description: 'النهج العلمي المبني على الأدلة في الفحص وتخطيط العلاج.',
  },
  ru: {
    title: 'Методология | Проф. д-р Гёкче Озель',
    description: 'Научно обоснованный подход к обследованию и планированию лечения.',
  },
  fr: {
    title: 'Méthodologie clinique | Prof. Dr. Gökçe Özel',
    description: 'L\'approche basée sur les preuves pour un examen et une planification thérapeutique précis.',
  },
  de: {
    title: 'Klinische Methodik | Prof. Dr. Gökçe Özel',
    description: 'Evidenzbasierter Ansatz für Untersuchung und Behandlungsplanung für natürliche Ergebnisse.',
  },
};

const content = {
  tr: {
    hero: 'Muayene Metodolojimiz',
    heroSub: 'Kanıta Dayalı · Kişiye Özgü · Doğal Sonuçlar',
    intro: 'Prof. Dr. Gökçe Özel\'in her hastaya uyguladığı değerlendirme süreci, 15 yılı aşkın klinik deneyim ve 100\'den fazla uluslararası yayından elde edilen kanıtlara dayanmaktadır. Amaç; standart bir estetik sunmak değil, hastanın anatomik yapısı, beklentileri ve yaşam tarzıyla uyumlu, kalıcı ve doğal sonuçlar elde etmektir.',
    steps: [
      {
        num: '01',
        title: 'Ayrıntılı Beklenti Analizi',
        body: 'İlk görüşmede hastanın estetik hedefleri, endişeleri ve önceki tedavi deneyimleri (varsa) sistematik biçimde değerlendirilir. Gerçekçi olmayan beklentiler açıkça ele alınarak hasta eğitimi yapılır.',
      },
      {
        num: '02',
        title: 'Anatomi Değerlendirmesi',
        body: 'Yüz oranları, doku kalitesi, kemik ve kıkırdak yapısı fotoğraflama ve ölçüm protokolleriyle belgelenir. Asimetri, anatomik sınırlılıklar ve risk faktörleri bu aşamada saptanır.',
      },
      {
        num: '03',
        title: 'Kanıta Dayalı Teknik Seçimi',
        body: 'Birden fazla uygulanabilir teknik bulunduğunda hangisinin hastanın durumuna en uygun olduğu, klinik kanıtlar ve mevcut literatür ışığında tartışılır. "Tek boyutlu" yaklaşım yerine kişiselleştirilmiş tedavi planı oluşturulur.',
      },
      {
        num: '04',
        title: 'Şeffaf Risk Bilgilendirmesi',
        body: 'Her prosedürün olası riskleri, iyileşme süreci, alternatifler ve gerçekçi sonuç beklentileri yazılı ve sözlü olarak aktarılır. Hasta, bilgilendirilmiş onam formunu okuyup anlayarak imzalar.',
      },
      {
        num: '05',
        title: 'Takip Protokolü',
        body: 'Operasyon veya uygulama sonrasında belirlenen kontrollerle iyileşme süreci takip edilir. Uzun vadeli sonuçların değerlendirilmesi için 6–12 aylık fotoğraf karşılaştırması standart protokolümüzün parçasıdır.',
      },
    ],
    principlesTitle: 'Temel Prensipler',
    principles: [
      'Doğallık: Her uygulamada öncelik, sonucun aşırı veya yapay görünmemesidir.',
      'Kanıt temelli yaklaşım: Teknik kararlar yalnızca estetik tercihe değil, klinik veriye dayanır.',
      'Hasta özerkliği: Hasta, tedavi sürecinin her aşamasında bilgilendirilmiş karar alır.',
      'Sürekli eğitim: Uluslararası kongre katılımı ve literatür takibi, güncel tekniklerin uygulanmasını sağlar.',
    ],
    ctaText: 'Randevu Al',
    ctaLink: '/iletisim',
    backText: '← Ana Sayfa',
    backLink: '/',
  },
  en: {
    hero: 'Our Clinical Methodology',
    heroSub: 'Evidence-Based · Personalised · Natural Results',
    intro: 'Prof. Dr. Gökçe Özel\'s evaluation process is grounded in over 15 years of clinical experience and evidence from 100+ international publications. The goal is not a standardised aesthetic, but durable, natural results aligned with each patient\'s anatomy, expectations and lifestyle.',
    steps: [
      { num: '01', title: 'In-Depth Expectation Analysis', body: 'During the initial consultation, the patient\'s aesthetic goals, concerns and prior treatments are systematically reviewed. Unrealistic expectations are addressed openly through patient education.' },
      { num: '02', title: 'Anatomical Assessment', body: 'Facial proportions, tissue quality, bone and cartilage structure are documented via standardised photography and measurement protocols. Asymmetry, anatomical limitations and risk factors are identified at this stage.' },
      { num: '03', title: 'Evidence-Based Technique Selection', body: 'When multiple approaches are viable, the most appropriate technique is selected based on clinical evidence and current literature. A personalised treatment plan is created rather than a one-size-fits-all solution.' },
      { num: '04', title: 'Transparent Risk Communication', body: 'Potential risks, recovery timelines, alternatives and realistic outcome expectations for each procedure are communicated verbally and in writing. Patients sign an informed consent form after understanding all information.' },
      { num: '05', title: 'Follow-Up Protocol', body: 'Healing is monitored through scheduled follow-up appointments. Six- to twelve-month photographic comparisons are standard practice for assessing long-term outcomes.' },
    ],
    principlesTitle: 'Core Principles',
    principles: [
      'Naturalness: Every procedure prioritises results that never look overdone or artificial.',
      'Evidence-based decisions: Technical choices are guided by clinical data, not only aesthetic preference.',
      'Patient autonomy: Patients make informed decisions at every stage of their treatment.',
      'Continuous education: International conference participation and literature review ensure up-to-date techniques.',
    ],
    ctaText: 'Book Appointment',
    ctaLink: '/iletisim',
    backText: '← Home',
    backLink: '/',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale] || meta.tr;
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/metodoloji` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? `${baseUrl}/metodoloji` : `${baseUrl}/${loc}/metodoloji`;
  });
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: locale === 'tr' ? `${baseUrl}/metodoloji` : `${baseUrl}/${locale}/metodoloji`,
      languages,
    },
    openGraph: {
      title: m.title,
      description: m.description,
      images: [{ url: `${baseUrl}/images/dr-gokce-ozel.jpg` }],
    },
  };
}

export default async function MetodolojiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = content[locale as keyof typeof content] || content.tr;

  const canonicalUrl = locale === 'tr' ? `${baseUrl}/metodoloji` : `${baseUrl}/${locale}/metodoloji`;

  const methodologyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    name: (meta[locale] || meta.tr).title,
    description: (meta[locale] || meta.tr).description,
    url: canonicalUrl,
    author: {
      '@type': 'Physician',
      '@id': `${baseUrl}/#physician`,
      name: 'Prof. Dr. Gökçe Özel',
    },
    publisher: {
      '@type': 'MedicalClinic',
      '@id': `${baseUrl}/#clinic`,
      name: 'Prof. Dr. Gökçe Özel Klinik',
    },
    about: {
      '@type': 'MedicalClinic',
      '@id': `${baseUrl}/#clinic`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: locale === 'tr' ? baseUrl : `${baseUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Metodoloji', item: canonicalUrl },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(methodologyJsonLd) }} />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 lg:py-28 px-5 border-b border-[#49685f]/10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-kicker mb-4">{c.heroSub}</p>
            <h1 className="font-serif text-4xl md:text-6xl text-[#17201e] mb-6">{c.hero}</h1>
            <p className="text-[#61706b] text-lg leading-relaxed">{c.intro}</p>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-3xl mx-auto px-5 py-16">
          <div className="flex flex-col gap-10">
            {c.steps.map(step => (
              <article key={step.num} className="soft-card rounded-[1.25rem] p-7 flex gap-6 items-start">
                <span
                  className="flex-shrink-0 font-serif text-3xl font-bold leading-none"
                  style={{ color: '#b8893c', minWidth: '2.5rem' }}
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <div>
                  <h2 className="font-semibold text-[#17201e] text-lg mb-2">{step.title}</h2>
                  <p className="text-[#61706b] leading-relaxed text-sm">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="max-w-3xl mx-auto px-5 pb-16">
          <h2 className="font-serif text-2xl text-[#17201e] mb-6">{c.principlesTitle}</h2>
          <ul className="flex flex-col gap-3">
            {c.principles.map((p, i) => (
              <li key={i} className="flex gap-3 text-[#61706b] text-sm leading-relaxed">
                <span className="flex-shrink-0 text-[#b8893c] font-bold mt-0.5">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center py-12 px-5 border-t border-[#49685f]/10">
          <Link
            href={`/${locale}${c.ctaLink}`}
            className="inline-block bg-[#17201e] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-[#49685f] transition-colors"
          >
            {c.ctaText}
          </Link>
        </section>
      </main>
    </>
  );
}
