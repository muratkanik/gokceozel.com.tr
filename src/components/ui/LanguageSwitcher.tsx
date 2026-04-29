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
  const isLocale = (segment: string | undefined) => !!segment && LOCALES.some(l => l.code === segment);

  let rest = isLocale(segments[0]) ? segments.slice(1) : segments;

  // Clean up URLs produced by the previous switcher bug, e.g. /en/tr -> /en.
  while (isLocale(rest[0])) {
    rest = rest.slice(1);
  }

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
        className="flex items-center gap-1.5 text-[13px] font-semibold text-white hover:text-[#e1c996] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/10"
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
        <div className="absolute top-full right-0 mt-2 w-44 bg-[#fbf7ef] border border-[#b8893c]/20 rounded-xl shadow-2xl overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-150">
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
                    ? 'bg-[#b8893c]/15 text-[#b88746] font-semibold'
                    : 'text-[#17201e] hover:bg-white/70 hover:text-[#b88746]'
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
