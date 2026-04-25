'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MobileNavProps {
  locale: string;
}

export default function MobileNav({ locale }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  
  const links = [
    { href: `/${locale}/hizmetler`, label: 'Hizmetler' },
    { href: `/${locale}/gokce-ozel-kimdir`, label: 'Hakkımda' },
    { href: `/${locale}/hasta-yorumlari`, label: 'Yorumlar' },
    { href: `/${locale}/blog`, label: 'Blog' },
    { href: `/${locale}/sss`, label: 'SSS' },
    { href: `/${locale}/iletisim`, label: 'İletişim' }
  ];

  return (
    <>
      <button 
        className="md:hidden p-2 text-paper focus:outline-none focus:ring-2 focus:ring-gold-soft rounded" 
        onClick={() => setOpen(true)} 
        aria-label="Menüyü aç"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      
      {open && (
        <div className="fixed inset-0 z-[200] md:hidden flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 bottom-0 w-72 bg-[#0f0d0b] border-l border-gold/20 flex flex-col p-8 pt-16 shadow-2xl animate-in slide-in-from-right duration-300">
            <button 
              className="absolute top-4 right-4 text-paper p-2 hover:text-white transition-colors" 
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gold/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2a1f0a] to-[#1a1208] border border-[#b8893c]/40 flex items-center justify-center overflow-hidden p-1.5">
                <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="invert w-full h-full object-contain" />
              </div>
              <div className="font-serif text-[16px] font-semibold text-paper leading-tight">
                Prof. Dr. Gökçe Özel
              </div>
            </div>

            <nav className="flex flex-col gap-6">
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                   className="text-lg font-serif text-[#e9e4d8] hover:text-gold-soft transition-colors tracking-wide">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto pt-8 border-t border-gold/20 flex flex-col gap-4">
              <div className="flex justify-center gap-3 text-xs font-semibold tracking-widest text-gold-soft mb-2">
                <a href="/tr" className="hover:text-white transition-colors p-2">TR</a>
                <a href="/en" className="hover:text-white transition-colors p-2">EN</a>
                <a href="/de" className="hover:text-white transition-colors p-2">DE</a>
                <a href="/fr" className="hover:text-white transition-colors p-2">FR</a>
                <a href="/ar" className="hover:text-white transition-colors p-2">AR</a>
              </div>
              <a href={`/${locale}/iletisim`} onClick={() => setOpen(false)} className="block bg-gold text-white hover:bg-gold-soft transition-colors px-6 py-3.5 rounded-full font-bold text-sm text-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                Randevu Al
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
