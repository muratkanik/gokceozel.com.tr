import type { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prof. Dr. Gökçe Özel | Ankara Yüz Estetiği ve Rinoplasti",
  description: "Ankara'da ameliyatsız yüz germe, gıdı eritme, Endolift Lazer ve Rinoplasti için KBB Uzmanı Prof. Dr. Gökçe Özel kliniği.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 1. Fetch current special events or check for forced preview
  // In a real scenario, you could check searchParams for ?preview_event=ID
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
    <html lang="tr">
      <body className={themeClass}>
        
        {/* Navigation Bar */}
        <nav className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <img src="/images/logo.png" alt="Prof. Dr. Gökçe Özel Logo" style={{ height: '50px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px' }}>
             <a href="#treatments" className="nav-link">Tedaviler</a>
             <a href="#about" className="nav-link">Hakkında</a>
             <a href="#contact" className="nav-link">İletişim</a>
          </div>
        </nav>

        {children}

        {/* Dynamic Popup for Special Events */}
        {activeEvent && activeEvent.popup_translations && activeEvent.popup_translations.tr && (
          <div className="event-popup glass" style={{
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, 
            padding: '20px', borderRadius: '15px', maxWidth: '300px',
            border: '1px solid var(--color-gold)'
          }}>
            <h4 className="gold-gradient-text" style={{ marginBottom: '10px' }}>{activeEvent.popup_translations.tr.title}</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{activeEvent.popup_translations.tr.body}</p>
            <button className="btn-primary" style={{ marginTop: '15px', padding: '5px 15px', fontSize: '12px' }}>Kapat</button>
          </div>
        )}
      </body>
    </html>
  );
}
