'use client';
import { useEffect, useState } from 'react';

type Testimonial = {
  id: string;
  author: string;
  rating: number;
  locale: string;
  text: string;
  source: string | null;
  approved: boolean;
  createdAt: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? 'text-[#b8893c]' : 'text-[#e8e1d4]'}>★</span>
      ))}
    </span>
  );
}

export default function AdminYorumlarPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [form, setForm] = useState({ author: '', rating: 5, locale: 'tr', text: '', source: '' });
  const [saving, setSaving] = useState(false);
  const [importingGoogle, setImportingGoogle] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/yorumlar')
      .then(r => r.json())
      .then(d => { setTestimonials(d.testimonials || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string, approved: boolean) => {
    await fetch('/api/admin/yorumlar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    });
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved } : t));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yorum silinsin mi?')) return;
    await fetch(`/api/admin/yorumlar?id=${id}`, { method: 'DELETE' });
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/yorumlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, approved: true }),
    });
    if (res.ok) {
      const d = await res.json();
      setTestimonials(prev => [d.testimonial, ...prev]);
      setForm({ author: '', rating: 5, locale: 'tr', text: '', source: '' });
      setMsg('✓ Yorum eklendi');
    } else { setMsg('Hata'); }
    setSaving(false);
  };

  const handleGoogleImport = async () => {
    setImportingGoogle(true);
    setMsg('');
    const res = await fetch('/api/admin/yorumlar/google-import', { method: 'POST' });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setMsg(`✓ Google içe aktarma tamamlandı: ${data.imported || 0} yeni, ${data.skipped || 0} atlandı.`);
      const refreshed = await fetch('/api/admin/yorumlar').then(r => r.json()).catch(() => null);
      if (refreshed?.testimonials) setTestimonials(refreshed.testimonials);
    } else {
      setMsg(data.error || 'Google yorumları içe aktarılamadı.');
    }

    setImportingGoogle(false);
  };

  const filtered = testimonials.filter(t =>
    filter === 'all' ? true : filter === 'pending' ? !t.approved : t.approved
  );

  const pendingCount = testimonials.filter(t => !t.approved).length;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-serif text-[#1a1410] mb-2">Hasta Yorumları</h1>
      <p className="text-[#7a6a52] text-sm mb-6">Onay bekleyen yorumları onaylayın, yönetin veya manuel yorum ekleyin (Google, WhatsApp vb. kaynaklardan).</p>

      <div className="mb-6 rounded-xl border border-[#e8e1d4] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#1a1410]">Google yorumlarını yedekle</h2>
            <p className="mt-1 text-xs leading-5 text-[#7a6a52]">
              Google Places API erişimi tanımlıysa yorumları içe aktarır ve veritabanında saklar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGoogleImport}
            disabled={importingGoogle}
            className="rounded-lg border border-[#b8893c] bg-[#b8893c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a07830] disabled:cursor-wait disabled:opacity-60"
          >
            {importingGoogle ? 'Google’dan çekiliyor...' : 'Google yorumlarını içe aktar'}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === f ? 'bg-[#b8893c] border-[#b8893c] text-white' : 'border-[#e8e1d4] text-[#7a6a52] hover:border-[#b8893c]'}`}
          >
            {f === 'pending' ? `Bekleyenler (${pendingCount})` : f === 'approved' ? 'Onaylananlar' : 'Tümü'}
          </button>
        ))}
      </div>

      {/* Add form */}
      <details className="bg-white border border-[#e8e1d4] rounded-xl mb-6 shadow-sm overflow-hidden">
        <summary className="px-6 py-4 font-semibold text-[#1a1410] cursor-pointer list-none flex justify-between items-center">
          Manuel Yorum Ekle
          <span className="text-[#b8893c]">+</span>
        </summary>
        <form onSubmit={handleAdd} className="px-6 pb-6 border-t border-[#e8e1d4] pt-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={form.author} onChange={e => setForm(p => ({...p, author: e.target.value}))} placeholder="Hasta adı" required className="border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]" />
            <input value={form.source || ''} onChange={e => setForm(p => ({...p, source: e.target.value}))} placeholder="Kaynak (Google, WhatsApp…)" className="border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]" />
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#7a6a52]">Puan:</label>
              <select value={form.rating} onChange={e => setForm(p => ({...p, rating: Number(e.target.value)}))} className="border border-[#e8e1d4] rounded-lg px-2 py-2 text-sm focus:outline-none">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <select value={form.locale} onChange={e => setForm(p => ({...p, locale: e.target.value}))} className="border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none">
              {['tr','en','ar','ru','fr','de'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>
          <textarea value={form.text} onChange={e => setForm(p => ({...p, text: e.target.value}))} placeholder="Yorum metni…" required rows={3} className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[#b8893c] resize-none" />
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="bg-[#b8893c] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#a07830] transition-colors disabled:opacity-50">
              {saving ? 'Kaydediliyor…' : 'Ekle (Onaylı)'}
            </button>
            {msg && <span className="text-sm text-green-600">{msg}</span>}
          </div>
        </form>
      </details>

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading && <p className="text-[#9a8f7c] text-sm">Yükleniyor…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-[#9a8f7c] text-sm">Bu filtrede yorum yok.</p>
        )}
        {filtered.map(t => (
          <div key={t.id} className={`bg-white border rounded-xl p-5 shadow-sm ${t.approved ? 'border-[#e8e1d4]' : 'border-[#b8893c]/40'}`}>
            <div className="flex justify-between gap-3 mb-2">
              <div>
                <p className="font-semibold text-[#1a1410] text-sm">{t.author}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Stars rating={t.rating} />
                  {t.source && <span className="text-xs text-[#9a8f7c]">{t.source}</span>}
                  <span className="text-xs uppercase font-bold text-[#c9c0ae]">{t.locale}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {!t.approved ? (
                  <button onClick={() => handleApprove(t.id, true)} className="text-green-600 hover:text-green-800 text-xs font-semibold border border-green-200 px-2.5 py-1 rounded-lg">Onayla</button>
                ) : (
                  <button onClick={() => handleApprove(t.id, false)} className="text-[#9a8f7c] hover:text-[#1a1410] text-xs font-semibold border border-[#e8e1d4] px-2.5 py-1 rounded-lg">Gizle</button>
                )}
                <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold border border-red-100 px-2.5 py-1 rounded-lg">Sil</button>
              </div>
            </div>
            <p className="text-[#7a6a52] text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            <p className="text-[#c9c0ae] text-xs mt-2">{new Date(t.createdAt).toLocaleDateString('tr-TR')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
