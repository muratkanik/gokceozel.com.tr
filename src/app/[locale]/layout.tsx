import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import EventPopup from '@/components/ui/EventPopup';
import "../globals.css";

export const metadata: Metadata = {
  title: "Prof. Dr. Gökçe Özel | Ankara KBB ve Rinoplasti Uzmanı",
  description: "Ankara'da ameliyatsız estetik uygulamaları, gıdı eritme, Endolift Lazer ve Rinoplasti için KBB Uzmanı Prof. Dr. Gökçe Özel kliniği.",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Medical Clinic Schema for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Prof. Dr. Gökçe Özel Klinik",
    "image": "https://gokceozel.com.tr/images/logo.png",
    "description": "Ankara'nın en iyi KBB kliniği. Rinoplasti, Endolift Lazer ve estetik hizmetleri.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ankara",
      "addressCountry": "TR"
    },
    "medicalSpecialty": "Otolaryngologic",
    "founder": {
      "@type": "Physician",
      "name": "Prof. Dr. Gökçe Özel",
      "jobTitle": "KBB Uzmanı"
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const { data: events } = await supabase
    .from('special_events')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .limit(1);

  const activeEvent = events && events.length > 0 ? events[0] : null;
  const themeClass = activeEvent?.theme_class || '';

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`bg-dark text-paper font-sans antialiased leading-relaxed ${themeClass}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* Top Navigation */}
          <nav className="sticky top-0 z-50 backdrop-blur-md bg-dark/75 border-b border-gold/20">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
              <a href={`/${locale}`} className="flex items-center gap-3 no-underline group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-[#6a4d1f] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                  GÖ
                </div>
                <div className="font-serif text-[18px] font-semibold text-paper">
                  Prof. Dr. Gökçe Özel
                  <small className="block text-[10px] tracking-widest text-gold-soft font-medium uppercase mt-0.5">
                    KBB Uzmanı
                  </small>
                </div>
              </a>
              <ul className="hidden md:flex gap-8 list-none text-sm font-medium">
                <li><a href={`/${locale}/hizmetler`} className="text-[#e9e4d8] hover:text-gold-soft transition-colors py-1.5 relative">Hizmetler</a></li>
                <li><a href={`/${locale}/gokce-ozel-kimdir`} className="text-[#e9e4d8] hover:text-gold-soft transition-colors py-1.5 relative">Hakkımda</a></li>
                <li><a href={`/${locale}/blog`} className="text-[#e9e4d8] hover:text-gold-soft transition-colors py-1.5 relative">Blog</a></li>
                <li><a href={`/${locale}/iletisim`} className="text-[#e9e4d8] hover:text-gold-soft transition-colors py-1.5 relative">İletişim</a></li>
              </ul>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-1 text-[11px] font-semibold tracking-wider px-3 py-1.5 border border-gold/30 rounded-full text-gold-soft">
                  <a href="/tr" className="hover:text-white transition-colors">TR</a>
                  <span>·</span>
                  <a href="/en" className="hover:text-white transition-colors">EN</a>
                  <span>·</span>
                  <a href="/de" className="hover:text-white transition-colors">DE</a>
                  <span>·</span>
                  <a href="/fr" className="hover:text-white transition-colors">FR</a>
                  <span>·</span>
                  <a href="/ar" className="hover:text-white transition-colors">AR</a>
                </div>
                <a href={`/${locale}/iletisim`} className="bg-gold text-white px-5 py-2.5 rounded-full font-semibold text-[13px] tracking-wide hover:bg-gold-soft transition-colors">
                  Randevu Al
                </a>
              </div>
            </div>
          </nav>

          <main className="min-h-screen">
            {children}
          </main>

          {/* Global Footer */}
          <footer className="bg-[#0a0908] border-t border-gold/15 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-[#6a4d1f] flex items-center justify-center text-white font-bold">GÖ</div>
                    <div className="font-serif text-[17px] text-paper">Prof. Dr. Gökçe Özel</div>
                  </div>
                  <p className="text-[#9a8f7c] text-[13px] mb-5">Ankara'nın KBB cerrahisi referans merkezi.</p>
                  <div className="flex gap-4 text-sm font-medium text-gold-soft">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">YouTube</a>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-serif text-gold-soft text-[17px] mb-5">Hizmetler</h4>
                  <ul className="space-y-3 text-[13px]">
                    <li><a href={`/${locale}/hizmetler/rinoplasti`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">Rinoplasti</a></li>
                    <li><a href={`/${locale}/hizmetler/gz-kapa-estetii`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">Blefaroplasti</a></li>
                    <li><a href={`/${locale}/hizmetler/endolift`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">Endolift Lazer</a></li>
                    <li><a href={`/${locale}/hizmetler/botoks`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">Botoks & Dolgu</a></li>
                    <li><a href={`/${locale}/hizmetler`} className="text-gold-soft font-medium hover:text-white transition-colors mt-2 inline-block">Tümünü Gör →</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif text-gold-soft text-[17px] mb-5">Klinik</h4>
                  <ul className="space-y-3 text-[13px]">
                    <li><a href={`/${locale}/gokce-ozel-kimdir`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">Hakkımda</a></li>
                    <li><a href={`/${locale}/blog`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">Blog & Makaleler</a></li>
                    <li><a href={`/${locale}/iletisim`} className="text-[#9a8f7c] hover:text-gold-soft transition-colors">İletişim</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif text-gold-soft text-[17px] mb-5">İletişim</h4>
                  <ul className="space-y-3 text-[13px] text-[#9a8f7c]">
                    <li>Ümitköy · Ankara</li>
                    <li><a href="tel:+905342096935" className="hover:text-gold-soft transition-colors">+90 534 209 69 35</a></li>
                    <li><a href="mailto:info@gokceozel.com.tr" className="hover:text-gold-soft transition-colors">info@gokceozel.com.tr</a></li>
                    <li className="pt-2 text-stone/50">Pzt-Cmt · 10:00-18:00</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-muted">
                <div>© {new Date().getFullYear()} Prof. Dr. Gökçe Özel · KVKK · Gizlilik</div>
                <div className="flex gap-3 font-medium">
                  <a href="/tr" className="hover:text-gold-soft transition-colors">TR</a>
                  <a href="/en" className="hover:text-gold-soft transition-colors">EN</a>
                  <a href="/de" className="hover:text-gold-soft transition-colors">DE</a>
                  <a href="/fr" className="hover:text-gold-soft transition-colors">FR</a>
                  <a href="/ar" className="hover:text-gold-soft transition-colors">AR</a>
                  <a href="/ru" className="hover:text-gold-soft transition-colors">RU</a>
                </div>
              </div>
            </div>
          </footer>

          {/* Dynamic Popup for Special Events */}
          {activeEvent && activeEvent.popup_translations && activeEvent.popup_translations[locale] ? (
            <EventPopup 
              title={activeEvent.popup_translations[locale].title} 
              body={activeEvent.popup_translations[locale].body} 
              isNationalDay={activeEvent.id === '23-nisan'} 
            />
          ) : (
            // Fallback to local 23 Nisan popup if today is around April 23 and no DB event is matching exactly.
            <EventPopup 
              title="23 Nisan Ulusal Egemenlik ve Çocuk Bayramı" 
              body="Geleceğimizin teminatı çocuklarımızın 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kutlu olsun!" 
              isNationalDay={true} 
            />
          )}

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
