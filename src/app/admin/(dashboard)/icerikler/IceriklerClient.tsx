'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Page {
  id: string;
  slug: string;
  titleInternal: string | null;
  type: string;
  createdAt: string;
}

interface ServiceHealth {
  id: string;
  slug: string;
  title: string | null;
  description: string;
  hasRichText: boolean;
  hasHero: boolean;
  healthScore: number;
  missingRichLocales: string[];
  faqCount: number;
}

interface Props {
  pages: Page[];
}

const TYPE_LABELS: Record<string, { label: string; badge: string }> = {
  SERVICE: { label: 'Hizmet', badge: 'bg-emerald-100 text-emerald-700' },
  BLOG: { label: 'Blog', badge: 'bg-blue-100 text-blue-700' },
  BIOGRAPHY: { label: 'Biyografi', badge: 'bg-purple-100 text-purple-700' },
  PAGE: { label: 'Sayfa', badge: 'bg-slate-100 text-slate-600' },
};

function HealthBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-500">{score}%</span>
    </div>
  );
}

export default function IceriklerClient({ pages }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth[] | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<string>('');

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      const matchType = typeFilter === 'ALL' || p.type === typeFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (p.titleInternal || '').toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [pages, search, typeFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: pages.length };
    for (const p of pages) {
      c[p.type] = (c[p.type] || 0) + 1;
    }
    return c;
  }, [pages]);

  const loadHealthData = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) setServiceHealth(await res.json());
    } catch {}
    setHealthLoading(false);
  };

  const generateRichText = async (service: ServiceHealth) => {
    setAiGenerating(service.id);
    setAiStatus(`"${service.title}" için AI içerik üretiliyor…`);

    // Clean service name (strip location suffixes like "Ankara | ...")
    const cleanName = (service.title || service.slug)
      .replace(/\s*[|–-].*$/, '')
      .replace(/Ankara.*|Antalya.*/i, '')
      .trim();

    const servicePrompt = `Prof. Dr. Gökçe Özel kliniğinin resmi web sitesi için "${cleanName}" hizmet sayfasına özel, SEO odaklı zengin metin içeriği üret.

SAYFA KONTEKSTİ:
- Hizmet adı: ${cleanName}
- Slug: ${service.slug}
- Kısa açıklama: ${service.description || `${cleanName} alanında uzman medikal estetik hizmeti`}
- Klinik: Prof. Dr. Gökçe Özel — KBB ve Baş-Boyun Cerrahisi uzmanı, Ankara ve Antalya

İÇERİK YAPISI (tam olarak bu sırayla oluştur):
1. <h2>${cleanName} Nedir?</h2> — tanımı, amacı, kimler için uygun
2. <h2>${cleanName} Kimlere Uygulanır?</h2> — endikasyonlar, uygun adaylar, kontrendikasyonlar
3. <h2>${cleanName} Nasıl Yapılır?</h2> — prosedür adımları, kullanılan teknikler
4. <h2>${cleanName} Sonrası Süreç</h2> — iyileşme, dikkat edilmesi gerekenler, beklenen sonuç
5. <h2>Prof. Dr. Gökçe Özel ile ${cleanName}</h2> — uzman yaklaşımı, kişisel planlama, doğal sonuç felsefesi

KALİTE KURALLARI:
- SADECE bu hizmet hakkında yaz, genel klinik tanıtımı YAPMA
- Toplam 500-700 kelime
- Sadece saf HTML kullan: <h2>, <p>, <strong>, <ul>, <li>
- Tıbbi terminoloji + anlaşılır dil dengesi
- Ankara ve Antalya'da uygulandığını belirt
- Son paragrafta muayene randevusu için iletişim sayfasına yönlendir`;

    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: 'tr',
          prompt: servicePrompt,
        }),
      });
      const data = await res.json();
      if (data.content) {
        // Save via page editor — navigate
        setAiStatus(`✓ İçerik üretildi (${data.provider}). Düzenleme sayfasına yönlendiriliyorsunuz…`);
        // Store in sessionStorage for the editor to pick up
        sessionStorage.setItem(`ai_draft_${service.slug}`, data.content);
        setTimeout(() => {
          window.location.href = `/admin/icerikler/${service.slug}`;
        }, 1200);
      } else {
        setAiStatus(`❌ Hata: ${data.error}`);
      }
    } catch (e: any) {
      setAiStatus(`❌ Hata: ${e.message}`);
    }
    setAiGenerating(null);
  };

  const tabs = [
    { key: 'ALL', label: 'Tümü' },
    { key: 'SERVICE', label: 'Hizmet' },
    { key: 'BLOG', label: 'Blog' },
    { key: 'PAGE', label: 'Sayfa' },
    { key: 'BIOGRAPHY', label: 'Biyografi' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">İçerik Yönetimi</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            {pages.length} içerik — hizmetler, blog yazıları ve sayfalarınız
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={loadHealthData}
            disabled={healthLoading}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {healthLoading ? 'Yükleniyor…' : 'SEO Sağlık Raporu'}
          </button>
          <Link
            href="/admin/icerikler/yeni"
            className="flex items-center gap-2 bg-[#1a1410] hover:bg-[#2d241d] text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Yeni İçerik
          </Link>
        </div>
      </div>

      {/* AI Status */}
      {aiStatus && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${aiStatus.startsWith('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {aiStatus}
        </div>
      )}

      {/* SEO Health panel */}
      {serviceHealth && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-amber-500">⚡</span> Hizmet SEO Sağlık Raporu
            </h2>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1" />
                Sağlıklı ≥80
              </span>
              <span>
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1" />
                Orta 50-79
              </span>
              <span>
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" />
                Eksik &lt;50
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
            {serviceHealth.sort((a, b) => a.healthScore - b.healthScore).map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800 text-sm truncate">{s.title || s.slug}</span>
                    {!s.hasRichText && (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-600">Zengin metin yok</span>
                    )}
                    {!s.hasHero && (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">Hero yok</span>
                    )}
                    {s.faqCount === 0 && (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">SSS yok</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">/{s.slug}</div>
                </div>
                <HealthBar score={s.healthScore} />
                <div className="flex gap-2">
                  {!s.hasRichText && (
                    <button
                      onClick={() => generateRichText(s)}
                      disabled={!!aiGenerating}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors disabled:opacity-40 whitespace-nowrap"
                    >
                      {aiGenerating === s.id ? '⏳ Üretiliyor…' : '✨ AI Üret'}
                    </button>
                  )}
                  <Link
                    href={`/admin/icerikler/${s.slug}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + Type tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Başlık, slug veya tür ile ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b8893c]/30 focus:border-[#b8893c]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              ✕
            </button>
          )}
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                typeFilter === tab.key
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {counts[tab.key] != null && (
                <span className="ml-1.5 text-xs text-slate-400">{counts[tab.key]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
              <th className="py-3.5 px-5 font-semibold">Başlık</th>
              <th className="py-3.5 px-5 font-semibold">Tür</th>
              <th className="py-3.5 px-5 font-semibold hidden md:table-cell">URL (Slug)</th>
              <th className="py-3.5 px-5 font-semibold w-28 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((page) => {
              const typeInfo = TYPE_LABELS[page.type] || TYPE_LABELS.PAGE;
              const health = serviceHealth?.find((s) => s.id === page.id);
              return (
                <tr key={page.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">
                        {page.titleInternal || 'İsimsiz İçerik'}
                      </span>
                      {health && health.healthScore < 50 && (
                        <span title={`SEO skoru: ${health.healthScore}`} className="text-amber-400 text-xs">⚠</span>
                      )}
                    </div>
                    {health && (
                      <div className="mt-1">
                        <HealthBar score={health.healthScore} />
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${typeInfo.badge}`}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono text-xs hidden md:table-cell">
                    /{page.slug}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href={`/admin/icerikler/${page.slug}`}
                      className="text-slate-500 hover:text-[#b8893c] font-semibold text-sm transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Düzenle →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                  {search ? `"${search}" için sonuç bulunamadı.` : 'Henüz içerik eklenmemiş.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
            {filtered.length === pages.length
              ? `${pages.length} içerik listeleniyor`
              : `${filtered.length} / ${pages.length} içerik gösteriliyor`}
          </div>
        )}
      </div>
    </div>
  );
}
