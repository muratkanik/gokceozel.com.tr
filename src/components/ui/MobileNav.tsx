'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const NAV_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  tr: [
    { label: 'Hizmetlerimiz', href: '/hizmetler' },
    { label: 'Hakkımızda', href: '/gokce-ozel-kimdir' },
    { label: 'Hasta Yorumları', href: '/hasta-yorumlari' },
    { label: 'Öncesi & Sonrası', href: '/once-sonra' },
    { label: 'Blog', href: '/blog' },
    { label: 'Sık Sorulan Sorular', href: '/sss' },
    { label: 'İletişim', href: '/iletisim' },
  ],
  en: [
    { label: 'Services', href: '/en/services' },
    { label: 'About', href: '/en/gokce-ozel-kimdir' },
    { label: 'Patient Reviews', href: '/en/hasta-yorumlari' },
    { label: 'Before & After', href: '/en/once-sonra' },
    { label: 'Blog', href: '/en/blog' },
    { label: 'FAQ', href: '/en/sss' },
    { label: 'Contact', href: '/en/iletisim' },
  ],
  ar: [
    { label: 'الخدمات', href: '/ar/services' },
    { label: 'من نحن', href: '/ar/gokce-ozel-kimdir' },
    { label: 'آراء المرضى', href: '/ar/hasta-yorumlari' },
    { label: 'قبل وبعد', href: '/ar/once-sonra' },
    { label: 'المدونة', href: '/ar/blog' },
    { label: 'الأسئلة الشائعة', href: '/ar/sss' },
    { label: 'اتصل بنا', href: '/ar/iletisim' },
  ],
  ru: [
    { label: 'Услуги', href: '/ru/services' },
    { label: 'О нас', href: '/ru/gokce-ozel-kimdir' },
    { label: 'Отзывы', href: '/ru/hasta-yorumlari' },
    { label: 'До и после', href: '/ru/once-sonra' },
    { label: 'Блог', href: '/ru/blog' },
    { label: 'ЧаВо', href: '/ru/sss' },
    { label: 'Контакты', href: '/ru/iletisim' },
  ],
  fr: [
    { label: 'Services', href: '/fr/soins' },
    { label: 'À propos', href: '/fr/gokce-ozel-kimdir' },
    { label: 'Avis patients', href: '/fr/hasta-yorumlari' },
    { label: 'Avant & Après', href: '/fr/once-sonra' },
    { label: 'Blog', href: '/fr/blog' },
    { label: 'FAQ', href: '/fr/sss' },
    { label: 'Contact', href: '/fr/iletisim' },
  ],
  de: [
    { label: 'Leistungen', href: '/de/leistungen' },
    { label: 'Über uns', href: '/de/gokce-ozel-kimdir' },
    { label: 'Patientenbewertungen', href: '/de/hasta-yorumlari' },
    { label: 'Vorher & Nachher', href: '/de/once-sonra' },
    { label: 'Blog', href: '/de/blog' },
    { label: 'FAQ', href: '/de/sss' },
    { label: 'Kontakt', href: '/de/iletisim' },
  ],
};

const LANG_CONFIG = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', href: '/' },
  { code: 'en', label: 'English', flag: '🇬🇧', href: '/en' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', href: '/ar' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', href: '/ru' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', href: '/fr' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', href: '/de' },
];

const CTA: Record<string, string> = {
  tr: 'Randevu Al', en: 'Book Appointment', ar: 'احجز موعداً',
  ru: 'Записаться', fr: 'Prendre RDV', de: 'Termin buchen',
};

interface MobileNavProps {
  locale: string;
}

export default function MobileNav({ locale }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const links = NAV_LINKS[locale] || NAV_LINKS.tr;
  const ctaLabel = CTA[locale] || CTA.tr;
  const contactHref = locale === 'tr' ? '/iletisim' : `/${locale}/iletisim`;
  const isRtl = locale === 'ar';

  return (
    <>
      {/* Hamburger button */}
      <button
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-lg hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Menüyü aç"
        aria-expanded={isOpen}
      >
        <span className="w-5 h-[2px] bg-white rounded-full" />
        <span className="w-5 h-[2px] bg-white rounded-full" />
        <span className="w-3.5 h-[2px] bg-[#e1c996] rounded-full" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[990] bg-black/45 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 ${isRtl ? 'left-0' : 'right-0'} h-full w-[320px] max-w-[85vw] z-[995] bg-[#fbf7ef] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden border-${isRtl ? 'r' : 'l'} border-[#b8893c]/20
          ${isOpen ? 'translate-x-0' : isRtl ? '-translate-x-full' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigasyon menüsü"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#b8893c]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2a1f0a] to-[#1a1208] border border-[#b8893c]/40 flex items-center justify-center overflow-hidden p-1">
              <Image src="/images/logo.png" alt="Logo" width={24} height={24} className="invert opacity-85 w-full h-full object-contain" />
            </div>
            <span className="font-serif text-[14px] text-[#17201e]">Prof. Dr. Gökçe Özel</span>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#66716d] hover:text-[#17201e] hover:bg-[#49685f]/10 transition-colors"
            aria-label="Menüyü kapat"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-0.5">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#17201e] hover:text-[#b88746] hover:bg-white/70 transition-all text-[15px] font-semibold group"
                >
                  <span className="w-1 h-1 rounded-full bg-[#b8893c]/40 group-hover:bg-[#b8893c] transition-colors flex-shrink-0" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer: CTA + language switcher */}
        <div className="px-5 py-4 border-t border-[#b8893c]/15">
          <a
            href={contactHref}
            onClick={close}
            className="block w-full text-center bg-[#17201e] hover:bg-[#49685f] text-white font-bold text-[13px] tracking-widest uppercase py-3 rounded-full transition-colors"
          >
            {ctaLabel}
          </a>
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {LANG_CONFIG.map((lang) => (
              <a
                key={lang.code}
                href={lang.href}
                onClick={close}
                className={`text-[11px] font-semibold tracking-widest uppercase transition-colors px-1
                  ${locale === lang.code ? 'text-[#b8893c]' : 'text-[#66716d] hover:text-[#17201e]'}`}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
