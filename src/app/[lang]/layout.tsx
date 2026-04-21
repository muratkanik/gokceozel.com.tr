import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import "../globals.css";

export const metadata: Metadata = {
  title: "Prof. Dr. Gökçe Özel | Ankara Yüz Estetiği ve Rinoplasti",
  description: "Ankara'da ameliyatsız yüz germe, gıdı eritme, Endolift Lazer ve Rinoplasti için KBB Uzmanı Prof. Dr. Gökçe Özel kliniği.",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  
  const { lang } = await params;

  // Medical Clinic Schema for AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Prof. Dr. Gökçe Özel Klinik",
    "image": "https://gokceozel.com.tr/images/logo.png",
    "description": "Ankara'nın en iyi KBB ve Yüz Estetiği kliniği. Rinoplasti, Endolift Lazer ve ameliyatsız yüz germe hizmetleri.",
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
    <html lang={lang}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={themeClass}>
        
        {/* Navigation Bar */}
        <nav className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <a href={`/${lang}`}>
              <img src="/images/logo.png" alt="Prof. Dr. Gökçe Özel Logo" style={{ height: '50px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </a>
          </div>
          <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px' }}>
             <a href={`/${lang}/hizmetler`} className="nav-link">Hizmetler</a>
             <a href={`/${lang}/blog`} className="nav-link">Blog</a>
             <a href={`/${lang}/kurumsal`} className="nav-link">Kurumsal</a>
             <a href={`/${lang}/iletisim`} className="nav-link">İletişim</a>
          </div>
        </nav>

        {children}

        {/* Global Footer */}
        <footer style={{
          backgroundColor: '#0a0a0a',
          borderTop: '1px solid #222',
          padding: '60px 40px',
          color: '#aaa',
          fontSize: '14px',
          marginTop: '60px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            
            {/* Brand / Logo */}
            <div>
              <img src="/images/logo.png" alt="Gökçe Özel" style={{ height: '50px', filter: 'brightness(0) invert(1)', marginBottom: '20px' }} />
              <p style={{ lineHeight: 1.6, marginBottom: '20px' }}>Ankara'nın Yüz Estetiği ve Plastik Cerrahi Merkezi. Doğal güzelliğinizi uzman ellerde yeniden tasarlayın.</p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '18px', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>İletişim</h4>
              <p style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Adres:</strong> Prof. Dr. Gökçe Özel Kliniği<br/>Kavaklıdere Mahallesi, Ankara</p>
              <p style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Telefon:</strong> <a href="tel:+905342096935" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white">+90 534 209 69 35</a></p>
              <p style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>E-posta:</strong> <a href="mailto:info@gokceozel.com.tr" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white">info@gokceozel.com.tr</a></p>
              
              <div style={{ marginTop: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.4079879796033!2d32.8576426!3d39.9098906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34faa87034c51%3A0x8e82d733a1e09df!2zS2F2YWtsxLFkZXJlLCBDYW5rYXlhL0Fua2FyYQ!5e0!3m2!1str!2str!4v1713693240000!5m2!1str!2str" 
                  width="100%" 
                  height="150" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                ></iframe>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: 'var(--color-gold)', fontSize: '18px', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Hızlı Bağlantılar</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><a href={`/${lang}/hizmetler`} className="hover:text-white" style={{ textDecoration: 'none', color: 'inherit' }}>Hizmetlerimiz</a></li>
                <li><a href={`/${lang}/kurumsal`} className="hover:text-white" style={{ textDecoration: 'none', color: 'inherit' }}>Hakkımızda</a></li>
                <li><a href={`/${lang}/iletisim`} className="hover:text-white" style={{ textDecoration: 'none', color: 'inherit' }}>İletişim</a></li>
                <li><a href={`/${lang}/blog`} className="hover:text-white" style={{ textDecoration: 'none', color: 'inherit' }}>Blog</a></li>
              </ul>
            </div>
            
          </div>
          
          <div style={{ maxWidth: '1200px', margin: '40px auto 0', borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', fontSize: '12px' }}>
            <p>© {new Date().getFullYear()} Prof. Dr. Gökçe Özel. Tüm hakları saklıdır.</p>
          </div>
        </footer>

        {/* Dynamic Popup for Special Events */}
        {activeEvent && activeEvent.popup_translations && activeEvent.popup_translations[lang] && (
          <div className="event-popup glass" style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, 
            padding: '20px', borderRadius: '15px', maxWidth: '300px',
            border: '1px solid var(--color-gold)'
          }}>
            <h4 className="gold-gradient-text" style={{ marginBottom: '10px' }}>{activeEvent.popup_translations[lang].title}</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{activeEvent.popup_translations[lang].body}</p>
            <button className="btn-primary" style={{ marginTop: '15px', padding: '5px 15px', fontSize: '12px' }}>Kapat</button>
          </div>
        )}

        {/* Floating WhatsApp Button */}
        <a 
          href="https://wa.me/905342096935" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '25px',
            left: '25px',
            backgroundColor: '#25D366',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            transition: 'transform 0.3s ease'
          }}
          className="whatsapp-float hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
