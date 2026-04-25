import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function ContentManagementPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">İçerik Yönetimi</h1>
          <p className="text-slate-500 mt-1">
            Hizmetler, Blog yazıları ve genel sayfalarınızı buradan yönetebilirsiniz.
          </p>
        </div>
        <Link 
          href="/admin/icerikler/yeni" 
          className="bg-[#1a1410] hover:bg-[#2d241d] text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Yeni İçerik Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
              <th className="py-4 px-6 font-semibold">Başlık</th>
              <th className="py-4 px-6 font-semibold">Tür</th>
              <th className="py-4 px-6 font-semibold">URL (Slug)</th>
              <th className="py-4 px-6 font-semibold w-32 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => {
              let typeBadgeClass = "bg-slate-100 text-slate-600";
              let typeLabel = page.type;
              
              if (page.type === 'SERVICE') {
                typeBadgeClass = "bg-emerald-100 text-emerald-700";
                typeLabel = "Hizmet";
              } else if (page.type === 'BLOG') {
                typeBadgeClass = "bg-blue-100 text-blue-700";
                typeLabel = "Blog";
              } else if (page.type === 'BIOGRAPHY') {
                typeBadgeClass = "bg-purple-100 text-purple-700";
                typeLabel = "Biyografi";
              }

              return (
                <tr key={page.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    {page.titleInternal || 'İsimsiz İçerik'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${typeBadgeClass}`}>
                      {typeLabel}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-sm">
                    /{page.slug}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link 
                      href={`/admin/icerikler/${page.slug}`}
                      className="text-slate-600 hover:text-[#b8893c] font-medium text-sm transition-colors"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              );
            })}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">Henüz hiç içerik eklenmemiş.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
