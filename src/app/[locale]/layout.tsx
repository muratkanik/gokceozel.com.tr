import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import Image from 'next/image';
import { GoogleAnalytics } from '@next/third-parties/google';
import { createClient } from '@supabase/supabase-js';
import EventPopup from '@/components/ui/EventPopup';
import MobileNav from '@/components/ui/MobileNav';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import "../globals.css";

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const localePath = (locale: string, path = '') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    tr: 'Prof. Dr. Gökçe Özel | Ankara KBB ve Rinoplasti Uzmanı',
    en: 'Prof. Dr. Gökçe Özel | ENT & Rhinoplasty Specialist Ankara',
    ar: 'أ.د. غوكتشه أوزيل | أخصائية أنف وأذن وحنجرة في أنقرة',
    ru: 'Проф. д-р Гёкче Озель | ЛОР и ринопластика в Анкаре',
    fr: 'Prof. Dr. Gökçe Özel | Spécialiste ORL et rhinoplastie à Ankara',
    de: 'Prof. Dr. Gökçe Özel | HNO und Rhinoplastik-Spezialistin in Ankara',
  };

  const descriptions: Record<string, string> = {
    tr: "Ankara'da ameliyatsız estetik uygulamaları, Endolift Lazer ve Rinoplasti için KBB Uzmanı Prof. Dr. Gökçe Özel kliniği.",
    en: 'Ankara ENT specialist Prof. Dr. Gökçe Özel offers rhinoplasty, Endolift laser and non-surgical aesthetic procedures.',
    ar: 'عيادة أ.د. غوكتشه أوزيل في أنقرة متخصصة في تجميل الأنف وليفت الوجه بالليزر وعلاجات التجميل غير الجراحية.',
    ru: 'Клиника проф. д-ра Гёкче Озель в Анкаре: ринопластика, лазер Endolift и нехирургическая эстетика.',
    fr: "La clinique du Prof. Dr. Gökçe Özel à Ankara propose la rhinoplastie, le laser Endolift et les traitements esthétiques non chirurgicaux.",
    de: 'Die Klinik von Prof. Dr. Gökçe Özel in Ankara bietet Rhinoplastik, Endolift-Laser und nicht-chirurgische Ästhetik.',
  };

  const languages: Record<string, string> = { 'x-default': baseUrl };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? baseUrl : `${baseUrl}/${loc}`;
  });

  return {
    title: titles[locale] || titles.tr,
    description: descriptions[locale] || descriptions.tr,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    alternates: { canonical: locale === 'tr' ? baseUrl : `${baseUrl}/${locale}`, languages },
    openGraph: {
      siteName: 'Prof. Dr. Gökçe Özel Klinik',
      locale,
      type: 'website',
      images: [{ url: `${baseUrl}/images/og-default.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const { getTranslations } = await import('next-intl/server');
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });
  const tContact = await getTranslations({ locale, namespace: 'Contact' });
  const tFooter = await getTranslations({ locale, namespace: 'Footer' });
  const tServices = await getTranslations({ locale, namespace: 'Services' });

  // Medical Clinic + Physician Schema for AEO (ChatGPT, Perplexity, Gemini)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "@id": "https://gokceozel.com.tr/#clinic",
      "name": "Prof. Dr. Gökçe Özel Klinik",
      "alternateName": "Gökçe Özel Rinoplasti & Estetik Merkezi",
      "url": "https://gokceozel.com.tr",
      "logo": "https://gokceozel.com.tr/images/logo.png",
      "image": "https://gokceozel.com.tr/images/klinik.jpg",
      "description": "Ankara Ümitköy'de Prof. Dr. Gökçe Özel liderliğinde KBB ve yüz estetiği kliniği. Rinoplasti, Endolift Lazer, Blefaroplasti ve ameliyatsız estetik hizmetleri.",
      "telephone": "+90-534-209-69-35",
      "email": "info@gokceozel.com.tr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ümitköy Mahallesi",
        "addressLocality": "Çankaya",
        "addressRegion": "Ankara",
        "postalCode": "06810",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "39.8938",
        "longitude": "32.6897"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          "opens": "10:00",
          "closes": "18:00"
        }
      ],
      "priceRange": "₺₺₺",
      "currenciesAccepted": "TRY, USD, EUR",
      "paymentAccepted": "Cash, Credit Card",
      "medicalSpecialty": ["Otolaryngologic", "PlasticSurgery"],
      "hasMap": "https://maps.google.com/?q=Ümitköy+Ankara+Gökçe+Özel",
      "sameAs": [
        "https://www.instagram.com/drgokceozel",
        "https://www.youtube.com/@drgokceozel"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "87",
        "bestRating": "5",
        "worstRating": "1"
      },
      "founder": {
        "@type": "Physician",
        "@id": "https://gokceozel.com.tr/#physician",
        "name": "Prof. Dr. Gökçe Özel",
        "givenName": "Gökçe",
        "familyName": "Özel",
        "honorificPrefix": "Prof. Dr.",
        "jobTitle": "KBB Uzmanı ve Yüz Plastik Cerrahı",
        "description": "Ankara Üniversitesi öğretim üyesi Prof. Dr. Gökçe Özel, 15+ yıllık deneyimi ve 100'den fazla uluslararası yayınıyla Türkiye'nin önde gelen KBB ve rinoplasti uzmanlarından biridir.",
        "url": "https://gokceozel.com.tr/gokce-ozel-kimdir",
        "image": "https://gokceozel.com.tr/images/dr-gokce-ozel.jpg",
        "telephone": "+90-534-209-69-35",
        "worksFor": { "@id": "https://gokceozel.com.tr/#clinic" },
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "Ankara Üniversitesi Tıp Fakültesi"
        },
        "hasCredential": [
          { "@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "name": "KBB Uzmanlık Eğitimi" },
          { "@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": "TYPCD Üyeliği" },
          { "@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": "CMAC Üyeliği" }
        ],
        "knowsAbout": [
          "Rinoplasti", "Septorinoplasti", "Blefaroplasti", "Endolift Lazer",
          "Botoks", "Dolgu Uygulamaları", "Dudak Estetiği", "KBB Cerrahisi",
          "Kepçe Kulak Ameliyatı", "Yüz Gençleştirme", "PRP", "Mezoterapi"
        ],
        "sameAs": [
          "https://www.instagram.com/drgokceozel",
          "https://scholar.google.com/citations?user=gokceozel"
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://gokceozel.com.tr/#website",
      "url": "https://gokceozel.com.tr",
      "name": "Prof. Dr. Gökçe Özel",
      "description": "Ankara rinoplasti ve yüz estetiği uzmanı Prof. Dr. Gökçe Özel resmi web sitesi",
      "inLanguage": ["tr", "en", "ar", "ru", "fr", "de"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gokceozel.com.tr/arama?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];
  
  const today = new Date().toISOString().split('T')[0];
  let events: any[] | null = null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const result = await supabase
        .from('special_events')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .limit(1);
      events = result.data;
    } catch (e) {
      console.error('Special events fetch failed', e);
    }
  }

  const activeEvent = events && events.length > 0 ? events[0] : null;
  const themeClass = activeEvent?.theme_class || '';

  let eventTitle = '';
  let eventBody = '';
  let eventImage = '';

  if (activeEvent && activeEvent.popup_translations) {
    try {
      const translations = typeof activeEvent.popup_translations === 'string' 
        ? JSON.parse(activeEvent.popup_translations) 
        : activeEvent.popup_translations;
        
      const currentTranslation = translations[locale] || translations['tr'];
      if (currentTranslation) {
        eventTitle = currentTranslation.title;
        eventBody = currentTranslation.body;
        eventImage = currentTranslation.imageUrl || '';
      }
    } catch (e) {
      console.error("Failed to parse event translations", e);
    }
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" type="application/rss+xml" title="Prof. Dr. Gökçe Özel Blog (TR)" href="/feed.xml?locale=tr" />
        <link rel="alternate" type="application/rss+xml" title="Prof. Dr. Gökçe Özel Blog (EN)" href="/feed.xml?locale=en" />
      </head>
      <body className={`clinic-shell font-sans antialiased leading-relaxed ${themeClass}`}>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* Top Navigation */}
          <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111714] backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="max-w-7xl mx-auto px-5 lg:px-6 flex items-center justify-between h-20">
              <a href={localePath(locale)} className="flex items-center gap-3 no-underline group min-w-0">
                <div className="w-11 h-11 rounded-full bg-white border border-[#e1c996]/35 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden p-1.5 shadow-sm">
                  <Image src="/images/logo.png" alt="Prof. Dr. Gökçe Özel Logo" width={34} height={34} className="opacity-85 w-full h-full object-contain" />
                </div>
                <div className="font-serif text-[18px] font-semibold text-white leading-tight">
                  Prof. Dr. Gökçe Özel
                  <small className="block text-[10px] tracking-widest text-[#e1c996] font-semibold uppercase mt-0.5">
                    KBB Uzmanı · Rinoplasti
                  </small>
                </div>
              </a>
              <MobileNav locale={locale} />
              <ul className="hidden lg:flex gap-5 list-none text-[13px] font-semibold text-[#e8efe9]">
                <li><a href={localePath(locale, '/hizmetler')} className="hover:text-[#b88746] transition-colors py-1.5 relative">{tNav('services')}</a></li>
                <li><a href={localePath(locale, '/gokce-ozel-kimdir')} className="hover:text-[#b88746] transition-colors py-1.5 relative">{tNav('about')}</a></li>
                <li><a href={localePath(locale, '/hasta-yorumlari')} className="hover:text-[#b88746] transition-colors py-1.5 relative">{tNav('reviews')}</a></li>
                <li><a href={localePath(locale, '/blog')} className="hover:text-[#b88746] transition-colors py-1.5 relative">{tNav('blog')}</a></li>
                <li><a href={localePath(locale, '/sss')} className="hover:text-[#b88746] transition-colors py-1.5 relative">{tNav('faq')}</a></li>
                <li><a href={localePath(locale, '/iletisim')} className="hover:text-[#b88746] transition-colors py-1.5 relative">{tNav('contact')}</a></li>
              </ul>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <a href={localePath(locale, '/iletisim')} className="hidden sm:inline-flex bg-[#e1c996] text-[#111714] px-5 py-2.5 rounded-full font-semibold text-[13px] tracking-wide hover:bg-white transition-colors shadow-sm">
                  {tContact('appointment')}
                </a>
              </div>
            </div>
          </nav>

          <main className="min-h-screen">
            {children}
            {activeEvent && eventTitle && (
              <EventPopup 
                title={eventTitle} 
                body={eventBody} 
                imageUrl={eventImage}
                isNationalDay={activeEvent.theme_class === 'national_day'} 
              />
            )}
          </main>

          {/* Global Footer */}
          <footer className="dark-panel border-t border-[#d7bb7b]/20 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-white/95 border border-[#d7bb7b]/30 flex items-center justify-center overflow-hidden p-1.5">
                      <Image src="/images/logo.png" alt="Prof. Dr. Gökçe Özel" width={32} height={32} className="opacity-80 w-full h-full object-contain" />
                    </div>
                    <div className="font-serif text-[17px] text-paper">Prof. Dr. Gökçe Özel</div>
                  </div>
                  <p className="text-[#9a8f7c] text-[13px] mb-5">{tFooter('description')}</p>
                  <div className="flex gap-4 text-sm font-medium text-gold-soft">
                    <a href="https://www.instagram.com/drgokceozel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                    <a href="https://www.youtube.com/@drgokceozel" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-serif text-gold-soft text-[17px] mb-5">{tNav('services')}</h4>
                  <ul className="space-y-3 text-[13px]">
                    <li><a href={localePath(locale, '/hizmetler/rinoplasti')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tServices('rhinoplasty')}</a></li>
                    <li><a href={localePath(locale, '/hizmetler/gz-kapa-estetii')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tServices('blepharoplasty')}</a></li>
                    <li><a href={localePath(locale, '/hizmetler/endolift')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tServices('endolift')}</a></li>
                    <li><a href={localePath(locale, '/hizmetler/botoks')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tServices('botox')}</a></li>
                    <li><a href={localePath(locale, '/hizmetler')} className="text-gold-soft font-medium hover:text-white transition-colors mt-2 inline-block">{tServices('viewAll')} →</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif text-gold-soft text-[17px] mb-5">{tFooter('clinic')}</h4>
                  <ul className="space-y-3 text-[13px]">
                    <li><a href={localePath(locale, '/gokce-ozel-kimdir')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tNav('about')}</a></li>
                    <li><a href={localePath(locale, '/blog')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tNav('blog')}</a></li>
                    <li><a href={localePath(locale, '/hasta-yorumlari')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tNav('reviews')}</a></li>
                    <li><a href={localePath(locale, '/once-sonra')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tNav('beforeAfter')}</a></li>
                    <li><a href={localePath(locale, '/sss')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tNav('faq')}</a></li>
                    <li><a href={localePath(locale, '/iletisim')} className="text-[#b9c3bd] hover:text-gold-soft transition-colors">{tNav('contact')}</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif text-gold-soft text-[17px] mb-5">{tContact('title')}</h4>
                  <ul className="space-y-3 text-[13px] text-[#9a8f7c]">
                    <li>{tContact('address')}</li>
                    <li><a href={`tel:${tContact('phone').replace(/\s+/g, '')}`} className="hover:text-gold-soft transition-colors">{tContact('phone')}</a></li>
                    <li><a href={`mailto:${tContact('email')}`} className="hover:text-gold-soft transition-colors">{tContact('email')}</a></li>
                    <li className="pt-2 text-stone/50">{tContact('hours')}</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-[#aeb9b3]">
                <div>© {new Date().getFullYear()} Prof. Dr. Gökçe Özel · {tFooter('privacy')}</div>
                <div className="flex gap-3 font-medium">
                  <a href="/" className="hover:text-gold-soft transition-colors">TR</a>
                  <a href="/en" className="hover:text-gold-soft transition-colors">EN</a>
                  <a href="/de" className="hover:text-gold-soft transition-colors">DE</a>
                  <a href="/fr" className="hover:text-gold-soft transition-colors">FR</a>
                  <a href="/ar" className="hover:text-gold-soft transition-colors">AR</a>
                  <a href="/ru" className="hover:text-gold-soft transition-colors">RU</a>
                </div>
              </div>
            </div>
          </footer>



          {/* Floating WhatsApp Button */}
          <a 
            href="https://wa.me/905342096935" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[1000]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </a>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
