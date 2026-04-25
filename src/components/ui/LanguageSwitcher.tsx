'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  
  const locales = [
    { code: 'tr', label: 'TR', flag: '🇹🇷' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'ar', label: 'AR', flag: '🇸🇦' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' }
  ];

  // Helper to replace the locale prefix in the pathname
  const getPathnameForLocale = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`;
    
    // Split the path into segments
    const segments = pathname.split('/');
    
    // If the first segment is an existing locale, replace it
    const existingLocaleIndex = locales.findIndex(l => l.code === segments[1]);
    if (existingLocaleIndex !== -1) {
      segments[1] = newLocale;
      return segments.join('/');
    }
    
    // If no locale found in path, prepend the new locale
    return `/${newLocale}${pathname === '/' ? '' : pathname}`;
  };

  return (
    <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold tracking-wider px-3 py-1.5 border border-gold/30 rounded-full text-gold-soft bg-dark/50">
      {locales.map((locale, index) => {
        const isCurrent = pathname?.startsWith(`/${locale.code}`) || (pathname === '/' && locale.code === 'tr');
        return (
          <span key={locale.code} className="flex items-center">
            <Link 
              href={getPathnameForLocale(locale.code)} 
              className={`flex items-center gap-1 hover:text-white transition-colors p-1 rounded-md ${isCurrent ? 'text-white bg-gold/20' : ''}`}
              title={locale.label}
            >
              <span className="text-[14px] leading-none">{locale.flag}</span>
              <span className="hidden lg:inline">{locale.label}</span>
            </Link>
            {index < locales.length - 1 && <span className="mx-1 opacity-50 hidden lg:inline">·</span>}
          </span>
        );
      })}
    </div>
  );
}
