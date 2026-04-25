import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function NotFound() {
  // Check Redirect table for dynamic 301/302
  try {
    const headersList = await headers();
    const referer = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';

    if (referer) {
      const hit = await prisma.redirect.findUnique({ where: { fromPath: referer } });
      if (hit) {
        // Increment hit counter (fire-and-forget)
        prisma.redirect.update({ where: { id: hit.id }, data: { hitCount: { increment: 1 } } }).catch(() => {});
        redirect(hit.toPath);
      }
    }
  } catch (_) {
    // Silently fail — show 404 page
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-4 font-semibold">404</p>
      <h1 className="font-serif text-4xl md:text-6xl text-white mb-5">Sayfa Bulunamadı</h1>
      <p className="text-[#9a8f7c] max-w-md mb-10">
        Aradığınız sayfa taşınmış ya da kaldırılmış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="px-7 py-3.5 rounded-full font-bold text-sm text-[#1a1410]" style={{ background: 'linear-gradient(135deg,#d4b97a,#8f6b2e)' }}>
          Ana Sayfaya Dön
        </Link>
        <Link href="/hizmetler" className="px-7 py-3.5 rounded-full font-semibold text-sm text-[#e9e4d8] border border-[#b8893c]/40 hover:border-[#b8893c] transition-colors">
          Hizmetleri İncele
        </Link>
      </div>
    </main>
  );
}
