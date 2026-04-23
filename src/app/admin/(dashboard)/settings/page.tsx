import prisma from '@/lib/prisma';
import { saveSetting, deleteSetting } from './actions';

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany({
    orderBy: { key: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Genel Ayarlar</h1>
        <p className="text-slate-500 mt-1">Sitenizin temel SEO ve dil ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Yeni Ayar Ekle</h2>
        <form action={saveSetting} className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Anahtar (Key)</label>
            <input type="text" name="key" required placeholder="örn: contact_email" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all" />
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Değer (Value)</label>
            <textarea name="value" required placeholder="Değer..." rows={1} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all resize-y"></textarea>
          </div>
          <div className="pt-7 w-full md:w-auto">
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Global SEO Settings */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Global SEO Ayarları</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody>
              {['seo_meta_title', 'seo_meta_description', 'seo_meta_keywords'].map(key => {
                const setting = settings.find(s => s.key === key);
                return (
                  <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-700 w-48 align-middle">{key}</td>
                    <td className="py-4 px-4 align-middle">
                      <form action={saveSetting} className="flex gap-3">
                        <input type="hidden" name="key" value={key} />
                        <input type="text" name="value" defaultValue={setting?.value || ''} placeholder={key.replace(/_/g, ' ')} className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors whitespace-nowrap">Güncelle</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Language Settings */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Aktif Diller (Multi-Language)</h2>
        <div className="flex gap-4 flex-wrap">
          {['tr', 'en', 'de', 'ar', 'fr', 'ru'].map(lang => {
            const key = `lang_${lang}_active`;
            const setting = settings.find(s => s.key === key);
            const isActive = setting?.value === 'true';
            
            return (
              <form key={lang} action={saveSetting} className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col items-center gap-3 min-w-[120px] transition-all hover:border-slate-300 shadow-sm">
                <strong className="uppercase text-lg text-slate-800">{lang}</strong>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {isActive ? 'Aktif' : 'Pasif'}
                </span>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="value" value={isActive ? 'false' : 'true'} />
                <button type="submit" className={`mt-2 w-full font-medium py-2 px-3 rounded-md text-sm transition-colors ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
                  {isActive ? 'Kapat' : 'Aç'}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Gelişmiş Ayarlar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                <th className="py-4 px-4 font-semibold">Anahtar</th>
                <th className="py-4 px-4 font-semibold">Değer</th>
                <th className="py-4 px-4 font-semibold w-32">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting) => (
                <tr key={setting.key} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700">{setting.key}</td>
                  <td className="py-4 px-4">
                    <form action={saveSetting} className="flex gap-3">
                      <input type="hidden" name="key" value={setting.key} />
                      <input type="text" name="value" defaultValue={setting.value} className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm" />
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">Güncelle</button>
                    </form>
                  </td>
                  <td className="py-4 px-4">
                    {setting.key !== 'maintenance_mode' && (
                      <form action={deleteSetting}>
                        <input type="hidden" name="key" value={setting.key} />
                        <button type="submit" className="bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-lg text-sm transition-colors w-full">Sil</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {settings.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500">Henüz kayıtlı ayar bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
