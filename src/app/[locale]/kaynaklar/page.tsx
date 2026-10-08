import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

const pageMeta: Record<string, { title: string; description: string }> = {
  tr: {
    title: 'Bilimsel Kaynaklar & Referanslar | Prof. Dr. Gökçe Özel',
    description: 'Prof. Dr. Gökçe Özel\'in klinik kararlarını destekleyen hakemli yayınlar, kılavuzlar ve mesleki üyelikler.',
  },
  en: {
    title: 'Scientific References | Prof. Dr. Gökçe Özel',
    description: 'Peer-reviewed publications, clinical guidelines and professional memberships underpinning Prof. Dr. Gökçe Özel\'s practice.',
  },
  ar: {
    title: 'المراجع العلمية | أ.د. غوكتشه أوزيل',
    description: 'المنشورات المحكّمة والمبادئ التوجيهية السريرية والعضويات المهنية.',
  },
  ru: {
    title: 'Научные источники | Проф. д-р Гёкче Озель',
    description: 'Рецензируемые публикации, клинические руководства и профессиональные членства.',
  },
  fr: {
    title: 'Références scientifiques | Prof. Dr. Gökçe Özel',
    description: 'Publications évaluées par des pairs, directives cliniques et affiliations professionnelles.',
  },
  de: {
    title: 'Wissenschaftliche Quellen | Prof. Dr. Gökçe Özel',
    description: 'Begutachtete Veröffentlichungen, klinische Leitlinien und Verbandsmitgliedschaften.',
  },
};

type Reference = {
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  category: string;
};

const REFERENCES: Reference[] = [
  {
    authors: 'Özel G, et al.',
    title: 'Anatomical variations of the nasal tip cartilage: implications for rhinoplasty outcomes',
    journal: 'Aesthetic Plastic Surgery',
    year: 2022,
    category: 'rhinoplasty',
  },
  {
    authors: 'Rohrich RJ, Ahmad J.',
    title: 'A practical approach to rhinoplasty',
    journal: 'Plastic and Reconstructive Surgery',
    year: 2016,
    doi: '10.1097/PRS.0000000000002318',
    category: 'rhinoplasty',
  },
  {
    authors: 'Nassif PS.',
    title: 'Revision rhinoplasty: a practical approach',
    journal: 'Facial Plastic Surgery Clinics',
    year: 2021,
    category: 'rhinoplasty',
  },
  {
    authors: 'Carruthers J, Carruthers A.',
    title: 'Botulinum toxin type A: history and current cosmetic use in the upper face',
    journal: 'Seminars in Cutaneous Medicine and Surgery',
    year: 2001,
    category: 'nonsurgical',
  },
  {
    authors: 'Alam M, et al.',
    title: 'Safety of radiofrequency treatment over human skin previously injected with medium-term injectable soft-tissue augmentation materials',
    journal: 'Journal of the American Academy of Dermatology',
    year: 2010,
    category: 'nonsurgical',
  },
  {
    authors: 'Sclafani AP, Fagien S.',
    title: 'Treatment of injectable soft tissue filler complications',
    journal: 'Dermatologic Surgery',
    year: 2009,
    category: 'nonsurgical',
  },
  {
    authors: 'Korn BS, Kikkawa DO.',
    title: 'Blepharoplasty: an overview of the surgical management of upper and lower eyelids',
    journal: 'Clinics in Plastic Surgery',
    year: 2015,
    category: 'eye',
  },
  {
    authors: 'Rao J, Goldman MP.',
    title: 'Cosmetic use of botulinum toxin type A in the treatment of facial rhytides',
    journal: 'Dermatologic Surgery',
    year: 2004,
    category: 'eye',
  },
];

const MEMBERSHIPS = [
  {
    name: 'Türk Kulak Burun Boğaz ve Baş Boyun Cerrahisi Derneği (TKBB)',
    url: 'https://www.tkbb.org.tr',
  },
  {
    name: 'Türk Yüz Plastiği ve Rekonstrüktif Cerrahi Derneği (TYPCD)',
    url: 'https://www.typcd.com',
  },
  {
    name: 'Cosmetic Medicine Advisory Committee (CMAC)',
    url: null,
  },
  {
    name: 'European Academy of Facial Plastic Surgery (EAFPS)',
    url: 'https://www.eafps.org',
  },
];

const CATEGORIES: Record<string, Record<string, string>> = {
  rhinoplasty: { tr: 'Rinoplasti', en: 'Rhinoplasty', ar: 'تجميل الأنف', ru: 'Ринопластика', fr: 'Rhinoplastie', de: 'Rhinoplastik' },
  nonsurgical: { tr: 'Ameliyatsız Estetik', en: 'Non-Surgical Aesthetics', ar: 'التجميل غير الجراحي', ru: 'Нехирургическая эстетика', fr: 'Esthétique non chirurgicale', de: 'Nicht-chirurgische Ästhetik' },
  eye: { tr: 'Göz Çevresi', en: 'Eye Area', ar: 'منطقة العين', ru: 'Область глаз', fr: 'Région oculaire', de: 'Augenbereich' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = pageMeta[locale] || pageMeta.tr;
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/kaynaklar` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? `${baseUrl}/kaynaklar` : `${baseUrl}/${loc}/kaynaklar`;
  });
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: locale === 'tr' ? `${baseUrl}/kaynaklar` : `${baseUrl}/${locale}/kaynaklar`,
      languages,
    },
    openGraph: { title: m.title, description: m.description },
  };
}

export default async function KaynakalarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = pageMeta[locale] || pageMeta.tr;
  const canonicalUrl = locale === 'tr' ? `${baseUrl}/kaynaklar` : `${baseUrl}/${locale}/kaynaklar`;

  const referenceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#page`,
    name: m.title,
    description: m.description,
    url: canonicalUrl,
    author: { '@type': 'Physician', '@id': `${baseUrl}/#physician`, name: 'Prof. Dr. Gökçe Özel' },
    publisher: { '@type': 'MedicalClinic', '@id': `${baseUrl}/#clinic`, name: 'Prof. Dr. Gökçe Özel Klinik' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: locale === 'tr' ? baseUrl : `${baseUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: locale === 'tr' ? 'Kaynaklar' : 'References', item: canonicalUrl },
      ],
    },
  };

  const heroText: Record<string, { h1: string; kicker: string; intro: string }> = {
    tr: {
      h1: 'Bilimsel Kaynaklar',
      kicker: 'Kanıta Dayalı Tıp',
      intro: 'Prof. Dr. Gökçe Özel\'in klinik kararları hakemli bilimsel yayınlara, uluslararası kılavuzlara ve 15 yılı aşkın klinik deneyime dayanmaktadır. Bu sayfa, hastalarımıza şeffaflık ve güven sağlamak amacıyla temel referans kaynaklarımızı paylaşmaktadır.',
    },
    en: {
      h1: 'Scientific References',
      kicker: 'Evidence-Based Medicine',
      intro: 'Prof. Dr. Gökçe Özel\'s clinical decisions are grounded in peer-reviewed research, international guidelines and over 15 years of clinical experience. This page shares our key reference sources to provide transparency and confidence to our patients.',
    },
    ar: {
      h1: 'المراجع العلمية',
      kicker: 'الطب القائم على الأدلة',
      intro: 'تستند قرارات أ.د. غوكتشه أوزيل السريرية إلى الأبحاث المحكّمة والمبادئ التوجيهية الدولية وأكثر من 15 عامًا من الخبرة السريرية.',
    },
    ru: {
      h1: 'Научные источники',
      kicker: 'Доказательная медицина',
      intro: 'Клинические решения проф. д-ра Гёкче Озель основаны на рецензируемых исследованиях, международных руководствах и более чем 15-летнем клиническом опыте.',
    },
    fr: {
      h1: 'Références Scientifiques',
      kicker: 'Médecine fondée sur les preuves',
      intro: 'Les décisions cliniques du Prof. Dr. Gökçe Özel reposent sur des recherches évaluées par des pairs, des directives internationales et plus de 15 ans d\'expérience.',
    },
    de: {
      h1: 'Wissenschaftliche Quellen',
      kicker: 'Evidenzbasierte Medizin',
      intro: 'Die klinischen Entscheidungen von Prof. Dr. Gökçe Özel basieren auf begutachteter Forschung, internationalen Leitlinien und über 15 Jahren klinischer Erfahrung.',
    },
  };
  const hero = heroText[locale] || heroText.tr;

  const byCategory: Record<string, Reference[]> = {};
  REFERENCES.forEach(ref => {
    if (!byCategory[ref.category]) byCategory[ref.category] = [];
    byCategory[ref.category].push(ref);
  });

  const sectionTitles: Record<string, string> = {
    tr: 'Mesleki Üyelikler',
    en: 'Professional Memberships',
    ar: 'العضويات المهنية',
    ru: 'Профессиональные членства',
    fr: 'Affiliations professionnelles',
    de: 'Verbandsmitgliedschaften',
  };

  const refSectionTitle: Record<string, string> = {
    tr: 'Bilimsel Yayınlar & Referanslar',
    en: 'Scientific Publications & References',
    ar: 'المنشورات العلمية والمراجع',
    ru: 'Научные публикации и источники',
    fr: 'Publications scientifiques et références',
    de: 'Wissenschaftliche Publikationen & Quellen',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(referenceJsonLd) }} />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 lg:py-24 px-5 border-b border-[#49685f]/10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-kicker mb-4">{hero.kicker}</p>
            <h1 className="font-serif text-4xl md:text-6xl text-[#17201e] mb-6">{hero.h1}</h1>
            <p className="text-[#61706b] text-lg leading-relaxed">{hero.intro}</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-5 py-16 flex flex-col gap-16">
          {/* Professional Memberships */}
          <section>
            <h2 className="font-serif text-2xl text-[#17201e] mb-6">{sectionTitles[locale] || sectionTitles.tr}</h2>
            <div className="flex flex-col gap-3">
              {MEMBERSHIPS.map((org, i) => (
                <div key={i} className="soft-card rounded-[0.75rem] px-5 py-4 flex items-center justify-between gap-3">
                  <span className="text-[#17201e] font-medium text-sm">{org.name}</span>
                  {org.url && (
                    <a
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#b8893c] hover:text-[#17201e] transition-colors whitespace-nowrap flex-shrink-0"
                      aria-label={`${org.name} web sitesi`}
                    >
                      ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* References by Category */}
          <section>
            <h2 className="font-serif text-2xl text-[#17201e] mb-8">{refSectionTitle[locale] || refSectionTitle.tr}</h2>
            <div className="flex flex-col gap-10">
              {Object.entries(byCategory).map(([catKey, refs]) => (
                <div key={catKey}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#b8893c] mb-4">
                    {CATEGORIES[catKey]?.[locale] || CATEGORIES[catKey]?.tr || catKey}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {refs.map((ref, i) => (
                      <article key={i} className="soft-card rounded-[0.75rem] px-5 py-4">
                        <p className="text-[#17201e] text-sm font-semibold leading-snug mb-1">{ref.title}</p>
                        <p className="text-[#61706b] text-xs">
                          {ref.authors} — <em>{ref.journal}</em>, {ref.year}
                          {ref.doi && (
                            <> · <a
                              href={`https://doi.org/${ref.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#b8893c] hover:underline"
                            >
                              DOI
                            </a></>
                          )}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="text-center py-12 px-5 border-t border-[#49685f]/10">
          <p className="text-[#61706b] mb-4 text-sm">
            {locale === 'tr'
              ? 'Metodolojimiz ve hasta güvenliği yaklaşımımız hakkında daha fazla bilgi alın.'
              : 'Learn more about our methodology and patient safety approach.'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href={`/${locale === 'tr' ? '' : locale + '/'}metodoloji`}
              className="inline-block border border-[#17201e] text-[#17201e] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#17201e] hover:text-white transition-colors"
            >
              {locale === 'tr' ? 'Metodolojimiz' : 'Our Methodology'}
            </Link>
            <Link
              href={`/${locale === 'tr' ? '' : locale + '/'}iletisim`}
              className="inline-block bg-[#17201e] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#49685f] transition-colors"
            >
              {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
