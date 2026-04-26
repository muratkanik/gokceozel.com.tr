'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const LOCALES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (LOCALES.some(l => l.code === first)) return first;
  return 'tr';
}

function switchLocale(pathname: string, newLocale: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = LOCALES.some(l => l.code === segments[0]) ? segments[0] : 'tr';

  // Remove current locale prefix if present
  const rest = currentLocale !== 'tr' && segments[0] === currentLocale
    ? segments.slice(1)
    : segments;

  if (newLocale === 'tr') {
    return rest.length ? `/${rest.join('/')}` : '/';
  }
  return rest.length ? `/${newLocale}/${rest.join('/')}` : `/${newLocale}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentCode = getLocaleFromPath(pathname);
  const current = LOCALES.find(l => l.code === currentCode) || LOCALES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[13px] font-semibold text-[#e9e4d8] hover:text-[#d4b97a] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Dil seç"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="tracking-wide">{current.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 text-[#b8893c] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-[#0d0b08] border border-[#b8893c]/25 rounded-xl shadow-2xl overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-150">
          {LOCALES.map((locale) => {
            const href = switchLocale(pathname, locale.code);
            const isActive = locale.code === currentCode;
            return (
              <a
                key={locale.code}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors
                  ${isActive
                    ? 'bg-[#b8893c]/15 text-[#d4b97a] font-semibold'
                    : 'text-[#e9e4d8] hover:bg-white/5 hover:text-[#d4b97a]'
                  }`}
              >
                <span className="text-base">{locale.flag}</span>
                <span>{locale.label}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 text-[#b8893c] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
