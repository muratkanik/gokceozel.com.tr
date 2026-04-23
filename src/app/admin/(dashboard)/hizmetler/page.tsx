import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function HizmetlerManagementPage() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from('content_entries')
    .select('*, translations:content_translations(*)')
    .eq('type', 'service')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hizmetler Yönetimi</h1>
          <p className="text-slate-500 mt-1">
            Sitenizde listelenen hizmetleri (Rinoplasti, Endolift vb.) buradan yönetebilirsiniz.
          </p>
        </div>
        <Link 
          href="/admin/hizmetler/yeni" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Yeni Hizmet Ekle
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          İçerikler yüklenirken hata oluştu: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
              <th className="py-4 px-6 font-semibold">Hizmet Adı</th>
              <th className="py-4 px-6 font-semibold">URL (Slug)</th>
              <th className="py-4 px-6 font-semibold w-32 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {services?.map((service) => {
              const trTranslation = service.translations?.find((t: any) => t.locale === 'tr');
              return (
                <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    {trTranslation?.title || 'İsimsiz Hizmet'}
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-sm">
                    /{service.slug}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link 
                      href={`/admin/hizmetler/${service.id}`}
                      className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              );
            })}
            {services?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">Henüz hiç hizmet eklenmemiş.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
