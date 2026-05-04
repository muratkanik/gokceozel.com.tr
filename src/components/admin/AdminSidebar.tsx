'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    group: 'Dashboard',
    links: [
      { href: '/admin', label: 'Özet', icon: '◎', exact: true },
      { href: '/admin/analytics', label: 'Analitik', icon: '📈' },
    ],
  },
  {
    group: 'İçerik Yönetimi',
    links: [
      { href: '/admin/icerikler', label: 'Tüm İçerikler', icon: '▥' },
      { href: '/admin/global-ui', label: 'Genel Metinler', icon: '🌐' },
      { href: '/admin/home-strings', label: 'Ana Sayfa Metinleri', icon: '🏠' },
      { href: '/admin/iletisim', label: 'İletişim Formları', icon: '★' },
      { href: '/admin/rezervasyonlar', label: 'Randevular', icon: '◷' },
      { href: '/admin/sss', label: 'SSS Yöneticisi', icon: '❓' },
      { href: '/admin/yorumlar', label: 'Hasta Yorumları', icon: '★' },
      { href: '/admin/once-sonra', label: 'Öncesi & Sonrası', icon: '⊞' },
      { href: '/admin/ozel-gunler', label: 'Özel Günler', icon: '🎈' },
    ],
  },
  {
    group: 'Medya & SEO',
    links: [
      { href: '/admin/media', label: 'Medya Kütüphanesi', icon: '⊡' },
      { href: '/admin/icerikler/seo-dashboard', label: 'SEO Skorları', icon: '◈' },
      { href: '/admin/seo', label: 'SEO Merkezi', icon: '⌘' },
      { href: '/admin/redirectler', label: 'Yönlendirmeler', icon: '↪' },
    ],
  },
  {
    group: 'Sistem',
    links: [
      { href: '/admin/settings', label: 'Ayarlar', icon: '⚙' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="bg-[#1a1410] text-[#e9e4d8] py-6 px-4 h-screen sticky top-0 flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#b8893c] to-[#6a4d1f] grid place-items-center text-white font-bold text-sm shadow-md">
          GÖ
        </div>
        <div className="font-serif text-[15px] font-semibold leading-tight">
          Admin Panel
          <small className="block text-[10px] tracking-[0.14em] text-[#b8893c] uppercase mt-0.5">Gökçe Özel</small>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-5">
        {NAV_ITEMS.map(({ group, links }) => (
          <div key={group}>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#7a6a52] px-3 mb-2 font-semibold">{group}</div>
            {links.map(({ href, label, icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] transition-colors mb-0.5 ${
                    active
                      ? 'bg-gradient-to-r from-[#b8893c]/15 to-transparent text-[#f0d48e] border-l-2 border-[#b8893c]'
                      : 'text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8]'
                  }`}
                >
                  <span>{icon}</span> {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-4 space-y-2 border-t border-[#3d2f22]">
        <a href="/" target="_blank" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors">
          <span>⇱</span> Siteyi Gör
        </a>
        <form action="/auth/signout" method="post">
          <button type="submit" className="w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#d24040] hover:bg-[#d24040]/10 transition-colors">
            <span>⎋</span> Güvenli Çıkış
          </button>
        </form>
      </div>
    </aside>
  );
}
