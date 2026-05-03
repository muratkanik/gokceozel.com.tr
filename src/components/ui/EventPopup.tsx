'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface PopupTheme {
  headerBg: string;      // CSS color for the image-header background
  accentColor: string;   // Title text color
  btnBg: string;         // Button background
  btnText: string;       // Button text color
  btnHover: string;      // Button hover bg (Tailwind arbitrary or inline style)
  shadowColor: string;   // Button shadow (rgba)
  style: 'hero' | 'card'; // hero = large center modal, card = bottom-right chip
  defaultImage: string;  // Fallback Unsplash image URL for the header
}

export const POPUP_THEMES: Record<string, PopupTheme> = {
  // ── Milli bayramlar ───────────────────────────────────────────────
  national_day:           { headerBg: '#E30A17', accentColor: '#E30A17', btnBg: '#E30A17', btnText: '#fff', btnHover: '#C00000', shadowColor: 'rgba(227,10,23,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
  'theme-23nisan':        { headerBg: '#E30A17', accentColor: '#E30A17', btnBg: '#E30A17', btnText: '#fff', btnHover: '#C00000', shadowColor: 'rgba(227,10,23,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
  'theme-19mayis':        { headerBg: '#E30A17', accentColor: '#E30A17', btnBg: '#E30A17', btnText: '#fff', btnHover: '#C00000', shadowColor: 'rgba(227,10,23,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
  'theme-30agustos':      { headerBg: '#003580', accentColor: '#003580', btnBg: '#003580', btnText: '#fff', btnHover: '#002060', shadowColor: 'rgba(0,53,128,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop' },
  'theme-cumhuriyet':     { headerBg: '#E30A17', accentColor: '#E30A17', btnBg: '#E30A17', btnText: '#fff', btnHover: '#C00000', shadowColor: 'rgba(227,10,23,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
  // ── Dini bayramlar ────────────────────────────────────────────────
  'theme-ramazan-bayrami':{ headerBg: '#1a5c2e', accentColor: '#1a5c2e', btnBg: '#1a5c2e', btnText: '#fff', btnHover: '#134422', shadowColor: 'rgba(26,92,46,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
  'theme-kurban-bayrami': { headerBg: '#1a5c2e', accentColor: '#1a5c2e', btnBg: '#1a5c2e', btnText: '#fff', btnHover: '#134422', shadowColor: 'rgba(26,92,46,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
  // ── Sosyal özel günler ────────────────────────────────────────────
  'theme-yilbasi':        { headerBg: '#c62828', accentColor: '#c62828', btnBg: '#c62828', btnText: '#fff', btnHover: '#9a1e1e', shadowColor: 'rgba(198,40,40,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
  'theme-sevgililer':     { headerBg: '#e63946', accentColor: '#c2185b', btnBg: '#e63946', btnText: '#fff', btnHover: '#c2185b', shadowColor: 'rgba(230,57,70,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop' },
  'theme-kadinlar-gunu':  { headerBg: '#7b2d8b', accentColor: '#7b2d8b', btnBg: '#7b2d8b', btnText: '#fff', btnHover: '#5a1f69', shadowColor: 'rgba(123,45,139,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop' },
  'theme-anneler-gunu':   { headerBg: '#e91e8c', accentColor: '#ad1457', btnBg: '#e91e8c', btnText: '#fff', btnHover: '#ad1457', shadowColor: 'rgba(233,30,140,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
  'theme-babalar-gunu':   { headerBg: '#003580', accentColor: '#003580', btnBg: '#003580', btnText: '#fff', btnHover: '#002060', shadowColor: 'rgba(0,53,128,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
  'theme-ogretmenler-gunu':{ headerBg: '#1565c0', accentColor: '#1565c0', btnBg: '#1565c0', btnText: '#fff', btnHover: '#0d47a1', shadowColor: 'rgba(21,101,192,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop' },
  // ── Sağlık & estetik ──────────────────────────────────────────────
  'theme-saglik-gunu':    { headerBg: '#00897b', accentColor: '#00695c', btnBg: '#00897b', btnText: '#fff', btnHover: '#00695c', shadowColor: 'rgba(0,137,123,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop' },
  'theme-guzellik-gunu':  { headerBg: '#b8893c', accentColor: '#8f6b2e', btnBg: '#b8893c', btnText: '#fff', btnHover: '#8f6b2e', shadowColor: 'rgba(184,137,60,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1596704017234-0c5a4c3e9c0c?q=80&w=1200&auto=format&fit=crop' },
  'theme-tip-bayrami':    { headerBg: '#0277bd', accentColor: '#01579b', btnBg: '#0277bd', btnText: '#fff', btnHover: '#01579b', shadowColor: 'rgba(2,119,189,0.35)', style: 'hero', defaultImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop' },
  'theme-1mayis':         { headerBg: '#e30a17', accentColor: '#e30a17', btnBg: '#e30a17', btnText: '#fff', btnHover: '#C00000', shadowColor: 'rgba(227,10,23,0.35)', style: 'card', defaultImage: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
};

const DEFAULT_THEME: PopupTheme = {
  headerBg: '#1a1410', accentColor: '#b8893c', btnBg: 'transparent', btnText: '#b8893c',
  btnHover: '#fff', shadowColor: 'transparent', style: 'card',
  defaultImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
};

interface EventPopupProps {
  title: string;
  body: string;
  imageUrl?: string;
  themeClass?: string;
}

export default function EventPopup({ title, body, imageUrl, themeClass }: EventPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closed = sessionStorage.getItem('eventPopupClosed');
    if (!closed) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const theme = POPUP_THEMES[themeClass || ''] || DEFAULT_THEME;
  const img = imageUrl || theme.defaultImage;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('eventPopupClosed', 'true');
  };

  if (theme.style === 'hero') {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            ✕
          </button>

          {/* Header image */}
          <div className="relative h-48 w-full" style={{ backgroundColor: theme.headerBg }}>
            <Image
              src={img}
              alt="Etkinlik Görseli"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            {/* Logo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-white p-2 shadow-xl border-2 border-white">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image src="/images/logo.png" alt="Prof. Dr. Gökçe Özel" width={56} height={56} className="w-12 h-12 object-contain" />
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold shadow-md" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: theme.accentColor }}>
                Prof. Dr. Gökçe Özel
              </span>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8 text-center">
            <h3 className="text-2xl font-serif font-bold mb-3 leading-tight" style={{ color: theme.accentColor }}>
              {title}
            </h3>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-6 font-medium">{body}</p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-colors"
              style={{ backgroundColor: theme.btnBg, color: theme.btnText, boxShadow: `0 8px 24px ${theme.shadowColor}` }}
            >
              Teşekkürler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Card popup (bottom-right) ─────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[1000] rounded-2xl max-w-xs shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
      style={{ backgroundColor: theme.headerBg === '#1a1410' ? '#1a1410' : '#fff', border: `1px solid ${theme.headerBg}33` }}
    >
      {/* Colored top bar */}
      <div className="h-2 w-full" style={{ backgroundColor: theme.btnBg }} />
      <div className="p-5">
        {img && (
          <div className="relative h-28 w-full rounded-xl overflow-hidden mb-4">
            <Image src={img} alt="Etkinlik" fill className="object-cover" />
          </div>
        )}
        <h4 className="font-serif text-lg font-bold mb-2" style={{ color: theme.headerBg === '#1a1410' ? theme.accentColor : theme.accentColor }}>
          {title}
        </h4>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: theme.headerBg === '#1a1410' ? 'rgba(233,228,216,0.85)' : '#4a5550' }}>
          {body}
        </p>
        <button
          onClick={handleClose}
          className="text-xs font-bold tracking-widest uppercase transition-colors"
          style={{ color: theme.btnBg }}
        >
          Kapat ✕
        </button>
      </div>
    </div>
  );
}
