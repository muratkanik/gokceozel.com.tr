'use client';

import { useEffect, useState } from 'react';
import MediaBrowser from '@/components/admin/MediaBrowser';

type BeforeAfterCase = {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: string | null;
  serviceId: string | null;
  consent: boolean;
  isPublic: boolean;
};

type Filter = 'all' | 'public' | 'pending';

export default function OnceSonraAdmin() {
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // New case form
  const [form, setForm] = useState({
    beforeUrl: '',
    afterUrl: '',
    caption: '',
    serviceId: '',
    consent: false,
    isPublic: false,
  });

  async function load(f: Filter = filter) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/once-sonra?filter=${f}`);
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(filter); }, [filter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.beforeUrl || !form.afterUrl) {
      setError('Önce ve sonra görsellerini galeriden seçin');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/once-sonra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Hata');
      }
      setForm({ beforeUrl: '', afterUrl: '', caption: '', serviceId: '', consent: false, isPublic: false });
      load(filter);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleField(id: string, field: 'consent' | 'isPublic', value: boolean) {
    try {
      await fetch('/api/admin/once-sonra', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value }),
      });
      setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    } catch {
      setError('Güncelleme başarısız');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await fetch(`/api/admin/once-sonra?id=${id}`, { method: 'DELETE' });
      setCases(prev => prev.filter(c => c.id !== id));
    } catch {
      setError('Silme başarısız');
    }
  }

  const filterBtnClass = (f: Filter) =>
    `px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
      filter === f
        ? 'bg-[#b8893c] text-white'
        : 'bg-[#f0ede6] text-[#6a5840] hover:bg-[#e8e2d6]'
    }`;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1410]">Öncesi &amp; Sonrası Görselleri</h1>
        <p className="text-[#7a6a52] text-sm mt-1">
          Hasta görselleri yalnızca yazılı onay (consent) ile yayınlanabilir. Hukuki zorunluluk: KVKK + Sağlık Bakanlığı reklam yönetmeliği.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button className={filterBtnClass('all')} onClick={() => setFilter('all')}>Tümü ({cases.length})</button>
        <button className={filterBtnClass('public')} onClick={() => setFilter('public')}>Yayında</button>
        <button className={filterBtnClass('pending')} onClick={() => setFilter('pending')}>Onay Bekliyor</button>
      </div>

      {/* Add form */}
      <div className="bg-white border border-[#e8e2d6] rounded-2xl p-6">
        <h2 className="text-[15px] font-bold text-[#1a1410] mb-4">Yeni Görsel Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GalleryImagePicker
              label="Önce Görsel *"
              value={form.beforeUrl}
              onChange={(url) => setForm(p => ({ ...p, beforeUrl: url }))}
            />
            <GalleryImagePicker
              label="Sonra Görsel *"
              value={form.afterUrl}
              onChange={(url) => setForm(p => ({ ...p, afterUrl: url }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#6a5840] mb-1">Açıklama (isteğe bağlı)</label>
              <input
                type="text"
                value={form.caption}
                onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                placeholder="Rinoplasti · 3. ay sonuç"
                className="w-full border border-[#ddd6c8] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#b8893c]/40"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#6a5840] mb-1">Hizmet ID (isteğe bağlı)</label>
              <input
                type="text"
                value={form.serviceId}
                onChange={e => setForm(p => ({ ...p, serviceId: e.target.value }))}
                placeholder="Hizmet ID (örn. rinoplasti)"
                className="w-full border border-[#ddd6c8] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#b8893c]/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#3a2e22]">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={e => setForm(p => ({ ...p, consent: e.target.checked }))}
                className="accent-[#b8893c] w-4 h-4"
              />
              <span>Yazılı hasta onayı alındı (KVKK)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#3a2e22]">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))}
                className="accent-[#b8893c] w-4 h-4"
              />
              <span>Sitede yayınla</span>
            </label>
          </div>
          {!form.consent && form.isPublic && (
            <p className="text-amber-600 text-[12px] bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⚠ Hasta onayı olmadan yayınlanamazsınız. Lütfen önce onay alın.
            </p>
          )}
          {error && (
            <p className="text-red-600 text-[12px] bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={saving || (!form.consent && form.isPublic)}
            className="bg-[#b8893c] text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#a07832] transition-colors disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Görsel Ekle'}
          </button>
        </form>
      </div>

      {/* Cases grid */}
      {loading ? (
        <div className="text-center py-12 text-[#9a8f7c]">Yükleniyor...</div>
      ) : cases.length === 0 ? (
        <div className="text-center py-12 text-[#9a8f7c] bg-white border border-[#e8e2d6] rounded-2xl">
          Henüz görsel eklenmemiş.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map(c => (
            <div key={c.id} className="bg-white border border-[#e8e2d6] rounded-2xl overflow-hidden shadow-sm">
              {/* Image pair */}
              <div className="grid grid-cols-2">
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full z-10">Önce</div>
                  <img
                    src={c.beforeUrl}
                    alt="Önce"
                    className="w-full aspect-square object-cover object-top"
                    onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0ede6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Görsel</text></svg>'; }}
                  />
                </div>
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-[#b8893c]/90 text-white text-[10px] px-2 py-0.5 rounded-full z-10">Sonra</div>
                  <img
                    src={c.afterUrl}
                    alt="Sonra"
                    className="w-full aspect-square object-cover object-top"
                    onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0ede6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Görsel</text></svg>'; }}
                  />
                </div>
              </div>

              {/* Info + controls */}
              <div className="p-4 space-y-3">
                {c.caption && (
                  <p className="text-[12px] text-[#6a5840]">{c.caption}</p>
                )}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#3a2e22]">
                    <input
                      type="checkbox"
                      checked={c.consent}
                      onChange={e => toggleField(c.id, 'consent', e.target.checked)}
                      className="accent-[#b8893c] w-3.5 h-3.5"
                    />
                    <span>Hasta onayı</span>
                    {c.consent && <span className="text-emerald-600 font-semibold">✓</span>}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#3a2e22]">
                    <input
                      type="checkbox"
                      checked={c.isPublic}
                      disabled={!c.consent}
                      onChange={e => toggleField(c.id, 'isPublic', e.target.checked)}
                      className="accent-[#b8893c] w-3.5 h-3.5 disabled:opacity-40"
                    />
                    <span>Sitede yayınla</span>
                    {c.isPublic && c.consent && <span className="text-emerald-600 font-semibold">Yayında</span>}
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <span className="text-[11px] text-[#9a8f7c] font-mono truncate flex-1" title={c.id}>#{c.id.slice(-6)}</span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:text-red-700 text-[12px] font-medium transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#6a5840] mb-1">{label}</label>
      <div className="rounded-xl border border-[#ddd6c8] bg-[#fbfaf7] overflow-hidden">
        <div className="relative aspect-[4/3] bg-[#f0ede6] grid place-items-center">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="text-center px-4">
              <div className="text-3xl text-[#b8893c] mb-2">⊞</div>
              <p className="text-[12px] font-semibold text-[#6a5840]">Galeriden görsel seçin</p>
            </div>
          )}
        </div>
        <div className="p-3 flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 bg-[#1a1410] text-[#e9e4d8] px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-[#b8893c] hover:text-white transition-colors"
          >
            Galeriden Seç
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-[#f0ede6] text-[#6a5840] hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-y-auto relative p-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
              aria-label="Galeriyi kapat"
            >
              ✕
            </button>
            <MediaBrowser
              onSelect={(url) => {
                onChange(url);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
