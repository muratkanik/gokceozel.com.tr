const fs = require('fs');

const f = '/Users/mkanik/Documents/GitHub/gokceozel.com.tr/src/app/admin/(dashboard)/settings/page.tsx';
let content = fs.readFileSync(f, 'utf8');

if (!content.includes('İletişim Ayarları')) {
  content = content.replace(
    /\{\/\* Multi-Language Settings \*\/\}/,
    `{/* Contact Settings */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">İletişim Ayarları</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody>
              {['contact_address', 'contact_phone', 'contact_email'].map(key => {
                const setting = settings.find(s => s.key === key);
                return (
                  <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-700 w-48 align-middle">{key.replace('contact_', 'İletişim ')}</td>
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

      {/* Multi-Language Settings */}`
  );
  fs.writeFileSync(f, content);
  console.log("Settings page updated.");
}
