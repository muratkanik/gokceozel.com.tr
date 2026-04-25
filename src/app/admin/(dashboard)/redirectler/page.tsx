'use client';
import { useEffect, useState } from 'react';

type Redirect = {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  locale: string | null;
  hitCount: number;
  createdAt: string;
};

export default function RedirectlerPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fromPath: '', toPath: '', statusCode: 301, locale: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/redirectler')
      .then(r => r.json())
      .then(d => { setRedirects(d.redirects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/redirectler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const d = await res.json();
      setRedirects(prev => [d.redirect, ...prev]);
      setForm({ fromPath: '', toPath: '', statusCode: 301, locale: '' });
      setMsg('✓ Yönlendirme eklendi');
    } else {
      setMsg('Hata oluştu');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/admin/redirectler?id=${id}`, { method: 'DELETE' });
    setRedirects(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-serif text-[#1a1410] mb-2">Yönlendirme Yöneticisi</h1>
      <p className="text-[#7a6a52] text-sm mb-8">301/302 redirect'leri buradan yönetin. Eski site URL'lerinden yeni adreslere yönlendirme ekleyin.</p>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white border border-[#e8e1d4] rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-[#1a1410] mb-4">Yeni Yönlendirme Ekle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-[#7a6a52] block mb-1">Kaynak URL (from)</label>
            <input
              value={form.fromPath}
              onChange={e => setForm(p => ({ ...p, fromPath: e.target.value }))}
              placeholder="/eski-url"
              required
              className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#7a6a52] block mb-1">Hedef URL (to)</label>
            <input
              value={form.toPath}
              onChange={e => setForm(p => ({ ...p, toPath: e.target.value }))}
              placeholder="/yeni-url"
              required
              className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#7a6a52] block mb-1">Durum Kodu</label>
            <select
              value={form.statusCode}
              onChange={e => setForm(p => ({ ...p, statusCode: Number(e.target.value) }))}
              className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]"
            >
              <option value={301}>301 — Kalıcı</option>
              <option value={302}>302 — Geçici</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#7a6a52] block mb-1">Dil (boş = hepsi)</label>
            <select
              value={form.locale}
              onChange={e => setForm(p => ({ ...p, locale: e.target.value }))}
              className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]"
            >
              <option value="">Tüm diller</option>
              <option value="tr">TR</option>
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="ru">RU</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#b8893c] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#a07830] transition-colors disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor…' : 'Ekle'}
          </button>
          {msg && <span className="text-sm text-green-600">{msg}</span>}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white border border-[#e8e1d4] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#f7f4ee] border-b border-[#e8e1d4]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-[#7a6a52]">Kaynak</th>
              <th className="text-left px-4 py-3 font-semibold text-[#7a6a52]">Hedef</th>
              <th className="text-center px-4 py-3 font-semibold text-[#7a6a52]">Kod</th>
              <th className="text-center px-4 py-3 font-semibold text-[#7a6a52]">Hit</th>
              <th className="text-center px-4 py-3 font-semibold text-[#7a6a52]">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="text-center py-8 text-[#9a8f7c]">Yükleniyor…</td></tr>
            )}
            {!loading && redirects.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-[#9a8f7c]">Henüz yönlendirme eklenmemiş.</td></tr>
            )}
            {redirects.map(r => (
              <tr key={r.id} className="border-b border-[#e8e1d4] last:border-0 hover:bg-[#faf9f6]">
                <td className="px-4 py-3 font-mono text-xs text-[#3a2c1e] max-w-[180px] truncate">{r.fromPath}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#3a2c1e] max-w-[180px] truncate">{r.toPath}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.statusCode === 301 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.statusCode}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-[#9a8f7c]">{r.hitCount}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
