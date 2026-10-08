'use client';
import { useEffect, useState } from 'react';

type Faq = { id: string; locale: string; question: string; answer: string; sortOrder: number };

const localeOptions = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

const emptyForm = { question: '', answer: '', locale: 'tr', sortOrder: 0 };

export default function AdminSssPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState('tr');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/sss')
      .then(r => r.json())
      .then(d => { setFaqs(d.faqs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer, locale: faq.locale, sortOrder: faq.sortOrder });
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    if (editingId) {
      const res = await fetch('/api/admin/sss', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      if (res.ok) {
        const d = await res.json();
        setFaqs(prev => prev.map(f => f.id === editingId ? d.faq : f));
        setMsg('✓ Güncellendi');
        setEditingId(null);
        setForm(emptyForm);
      } else { setMsg('Hata oluştu'); }
    } else {
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
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Soru silinsin mi?')) return;
    await fetch(`/api/admin/sss?id=${id}`, { method: 'DELETE' });
    setFaqs(prev => prev.filter(f => f.id !== id));
    if (editingId === id) cancelEdit();
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

      {/* Add / Edit form */}
      <form onSubmit={handleSubmit} className={`bg-white border rounded-xl p-6 mb-6 shadow-sm ${editingId ? 'border-[#b8893c]' : 'border-[#e8e1d4]'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1a1410]">{editingId ? '✏️ Soruyu Düzenle' : 'Yeni Soru Ekle'}</h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-xs text-[#9ca3af] hover:text-[#61706b]">✕ İptal</button>
          )}
        </div>
        <div className="flex gap-3 mb-3">
          <select
            value={form.locale}
            onChange={e => { setForm(p => ({ ...p, locale: e.target.value })); if (!editingId) setActiveLocale(e.target.value); }}
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
            {saving ? 'Kaydediliyor…' : editingId ? 'Kaydet' : 'Ekle'}
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
          <div key={f.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${editingId === f.id ? 'border-[#b8893c] ring-2 ring-[#b8893c]/20' : 'border-[#e8e1d4]'}`}>
            <div className="flex justify-between gap-3 mb-2">
              <p className="font-semibold text-[#1a1410] text-sm">{f.question}</p>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => editingId === f.id ? cancelEdit() : startEdit(f)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${editingId === f.id ? 'bg-[#b8893c] text-white' : 'bg-[#f4f0e8] text-[#61706b] hover:bg-[#e8e1d4]'}`}
                >
                  {editingId === f.id ? 'Düzenleniyor' : 'Düzenle'}
                </button>
                <button onClick={() => handleDelete(f.id)} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Sil</button>
              </div>
            </div>
            <p className="text-[#7a6a52] text-sm leading-relaxed">{f.answer}</p>
            <p className="text-[#c9c0ae] text-xs mt-2">Sıra: {f.sortOrder}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
