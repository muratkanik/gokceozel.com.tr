'use client';
import { useEffect, useState } from 'react';

type Faq = { id: string; locale: string; question: string; answer: string; sortOrder: number };

const localeOptions = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

export default function AdminSssPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState('tr');
  const [form, setForm] = useState({ question: '', answer: '', locale: 'tr', sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/sss')
      .then(r => r.json())
      .then(d => { setFaqs(d.faqs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/sss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const d = await res.json();
      setFaqs(prev => [...prev, d.faq]);
      setForm(p => ({ ...p, question: '', answer: '' }));
      setMsg('✓ SSS eklendi');
    } else { setMsg('Hata oluştu'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Soru silinsin mi?')) return;
    await fetch(`/api/admin/sss?id=${id}`, { method: 'DELETE' });
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const filtered = faqs.filter(f => f.locale === activeLocale);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-serif text-[#1a1410] mb-2">SSS Yöneticisi</h1>
      <p className="text-[#7a6a52] text-sm mb-6">Genel SSS soruları (herhangi bir sayfaya bağlı olmayan) buradan yönetilir. Sayfaya özel SSS'ler Sayfa Editörü'nden eklenir.</p>

      {/* Locale Tabs */}
      <div className="flex gap-1 mb-6 bg-[#f7f4ee] p-1 rounded-lg w-fit border border-[#e8e1d4]">
        {localeOptions.map(l => (
          <button
            key={l}
            onClick={() => setActiveLocale(l)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${activeLocale === l ? 'bg-[#b8893c] text-white shadow-sm' : 'text-[#7a6a52] hover:text-[#1a1410]'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white border border-[#e8e1d4] rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="font-semibold text-[#1a1410] mb-4">Yeni Soru Ekle</h2>
        <div className="flex gap-3 mb-3">
          <select
            value={form.locale}
            onChange={e => { setForm(p => ({ ...p, locale: e.target.value })); setActiveLocale(e.target.value); }}
            className="border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]"
          >
            {localeOptions.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <input
            type="number"
            value={form.sortOrder}
            onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))}
            placeholder="Sıra"
            className="w-20 border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8893c]"
          />
        </div>
        <input
          value={form.question}
          onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
          placeholder="Soru..."
          required
          className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[#b8893c]"
        />
        <textarea
          value={form.answer}
          onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
          placeholder="Cevap..."
          rows={4}
          required
          className="w-full border border-[#e8e1d4] rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-[#b8893c] resize-none"
        />
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-[#b8893c] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#a07830] transition-colors disabled:opacity-50">
            {saving ? 'Kaydediliyor…' : 'Ekle'}
          </button>
          {msg && <span className="text-sm text-green-600">{msg}</span>}
        </div>
      </form>

      {/* FAQ list */}
      <div className="flex flex-col gap-3">
        {loading && <p className="text-[#9a8f7c] text-sm">Yükleniyor…</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-[#9a8f7c] text-sm">{activeLocale.toUpperCase()} dilinde henüz soru eklenmemiş.</p>
        )}
        {filtered.map(f => (
          <div key={f.id} className="bg-white border border-[#e8e1d4] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between gap-3 mb-2">
              <p className="font-semibold text-[#1a1410] text-sm">{f.question}</p>
              <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700 text-xs font-medium shrink-0">Sil</button>
            </div>
            <p className="text-[#7a6a52] text-sm leading-relaxed">{f.answer}</p>
            <p className="text-[#c9c0ae] text-xs mt-2">Sıra: {f.sortOrder}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
