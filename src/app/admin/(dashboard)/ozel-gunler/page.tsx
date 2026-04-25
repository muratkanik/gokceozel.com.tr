import { getEvents, deleteEvent } from './actions';
import Link from 'next/link';

export const metadata = {
  title: 'Özel Günler | Admin Panel'
};

export default async function ÖzelGünlerPage() {
  const events = await getEvents();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-[#1a1410] mb-2">Özel Günler</h1>
          <p className="text-[#6a5f54] text-sm">Site girişinde gösterilecek pop-up etkinliklerini yönetin.</p>
        </div>
        <Link 
          href="/admin/ozel-gunler/yeni"
          className="bg-gradient-to-r from-[#b8893c] to-[#9a7332] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-[#b8893c]/20 transition-all"
        >
          + Yeni Etkinlik Ekle
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e9e4d8] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafaf7] text-[#6a5f54] text-xs uppercase tracking-widest border-b border-[#e9e4d8]">
              <th className="px-6 py-4 font-semibold">Etkinlik Adı</th>
              <th className="px-6 py-4 font-semibold">Başlangıç</th>
              <th className="px-6 py-4 font-semibold">Bitiş</th>
              <th className="px-6 py-4 font-semibold">Durum</th>
              <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e9e4d8]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#9a8f7c]">
                  Henüz özel gün eklenmemiş.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-[#fafaf7]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#1a1410] text-[15px]">{event.event_name}</div>
                    <div className="text-xs text-[#9a8f7c] mt-1">Tema: {event.theme_class || 'Yok'}</div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6a5f54]">
                    {new Date(event.start_date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6a5f54]">
                    {new Date(event.end_date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${event.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {event.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/ozel-gunler/${event.id}`}
                        className="text-[#b8893c] hover:text-[#8f6b2e] text-sm font-semibold transition-colors"
                      >
                        Düzenle
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteEvent(event.id);
                      }}>
                        <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                          Sil
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
