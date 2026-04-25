import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-[#fafaf7] text-[#1a1410] font-sans text-sm">
      {/* ── Sidebar ── */}
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
          {/* Group: Dashboard */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#7a6a52] px-3 mb-2 font-semibold">Dashboard</div>
            <Link href="/admin" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>◎</span> Özet
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>📈</span> Analitik
            </Link>
          </div>

          {/* Group: İçerik */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#7a6a52] px-3 mb-2 font-semibold">İçerik Yönetimi</div>
            <Link href="/admin/icerikler" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] bg-gradient-to-r from-[#b8893c]/15 to-transparent text-[#f0d48e] border-l-2 border-[#b8893c] mb-0.5">
              <span>▥</span> Tüm İçerikler
            </Link>
            <Link href="/admin/iletisim" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>★</span> İletişim Formları
            </Link>
            <Link href="/admin/sss" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>❓</span> SSS Yöneticisi
            </Link>
            <Link href="/admin/yorumlar" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>★</span> Hasta Yorumları
            </Link>
            <Link href="/admin/once-sonra" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>⊞</span> Öncesi &amp; Sonrası
            </Link>
            <Link href="/admin/ozel-gunler" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>🎈</span> Özel Günler
            </Link>
          </div>

          {/* Group: Medya & SEO */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#7a6a52] px-3 mb-2 font-semibold">Medya & SEO</div>
            <Link href="/admin/media" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>⊡</span> Medya Kütüphanesi
            </Link>
            <Link href="/admin/seo" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>⌘</span> SEO Merkezi
            </Link>
            <Link href="/admin/redirectler" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>↪</span> Yönlendirmeler
            </Link>
          </div>

          {/* Group: Sistem */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#7a6a52] px-3 mb-2 font-semibold">Sistem</div>
            <Link href="/admin/settings" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] text-[#c9c0ae] hover:bg-[#b8893c]/10 hover:text-[#e9e4d8] transition-colors mb-0.5">
              <span>⚙</span> Ayarlar
            </Link>
          </div>
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

      {/* ── Main ── */}
      <main className="flex flex-col min-h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
