'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { SeoBreakdown, gradeColor, scoreBarColor } from '@/lib/seo-score';

interface Row {
  id: string;
  slug: string;
  titleInternal: string;
  title: string | null;
  seoScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: SeoBreakdown;
  hasContent: boolean;
  contentChars: number;
  coveredLocales: string[];
  missingLocales: string[];
}

interface Props { rows: Row[] }

const LOCALE_FLAG: Record<string, string> = {
  tr: '🇹🇷', en: '🇬🇧', ar: '🇸🇦', ru: '🇷🇺', fr: '🇫🇷', de: '🇩🇪',
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${scoreBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500 w-7 text-right">{score}</span>
    </div>
  );
}

function GradeBadge({ grade, score }: { grade: string; score: number }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold ${gradeColor(grade)}`}>
      {grade} · {score}
    </span>
  );
}

function BreakdownPopover({ breakdown, open }: { breakdown: SeoBreakdown; open: boolean }) {
  if (!open) return null;
  const items = [
    { label: 'Kelime sayısı',  val: `${breakdown.wordCount.words} kelime`,  score: breakdown.wordCount.score,  max: breakdown.wordCount.max },
    { label: 'Karakter uzunluğu', val: `${breakdown.charLength.chars} kar`, score: breakdown.charLength.score, max: breakdown.charLength.max },
    { label: 'H2 başlıkları', val: `${breakdown.h2Headings.count} adet`,    score: breakdown.h2Headings.score, max: breakdown.h2Headings.max },
    { label: 'H3 başlıkları', val: `${breakdown.h3Headings.count} adet`,    score: breakdown.h3Headings.score, max: breakdown.h3Headings.max },
    { label: 'Paragraflar',   val: `${breakdown.paragraphs.count} adet`,    score: breakdown.paragraphs.score, max: breakdown.paragraphs.max },
    { label: 'Listeler',      val: `${breakdown.lists.count} liste`,        score: breakdown.lists.score,      max: breakdown.lists.max },
    { label: 'Kalın metin',   val: breakdown.boldText.hasBold ? 'Var' : 'Yok', score: breakdown.boldText.score, max: breakdown.boldText.max },
    { label: 'Bağlantılar',   val: `${breakdown.links.count} link`,         score: breakdown.links.score,      max: breakdown.links.max },
  ];
  return (
    <div className="absolute z-50 left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs">
      <div className="font-semibold text-slate-700 mb-2">SEO Detayları</div>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between mb-1.5">
          <span className="text-slate-600 truncate flex-1">{item.label}</span>
          <span className="text-slate-400 mx-2 text-[10px]">{item.val}</span>
          <span className={`font-mono text-[11px] font-bold ${item.score === item.max ? 'text-emerald-600' : item.score >= item.max * 0.6 ? 'text-amber-600' : 'text-red-500'}`}>
            {item.score}/{item.max}
          </span>
        </div>
      ))}
    </div>
  );
}

interface ImprovingState {
  message: string;
  done: boolean;
  error?: string;
  newScore?: number;
  newGrade?: string;
}

export default function SeoDashboardClient({ rows: initialRows }: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [openBreakdown, setOpenBreakdown] = useState<string | null>(null);
  const [improving, setImproving] = useState<Record<string, ImprovingState>>({});
  const [recalculating, setRecalculating] = useState(false);
  const [sortKey, setSortKey] = useState<'score' | 'title' | 'chars'>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [filter, setFilter] = useState('');
  const [_isPending, startTransition] = useTransition();

  const sorted = [...rows]
    .filter((r) => {
      if (!filter) return true;
      return (r.title || r.titleInternal || '').toLowerCase().includes(filter.toLowerCase())
        || r.slug.toLowerCase().includes(filter.toLowerCase());
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'score') cmp = a.seoScore - b.seoScore;
      else if (sortKey === 'title') cmp = (a.title || '').localeCompare(b.title || '');
      else cmp = a.contentChars - b.contentChars;
      return sortAsc ? cmp : -cmp;
    });

  const avgScore = Math.round(rows.reduce((s, r) => s + r.seoScore, 0) / (rows.length || 1));
  const aCount = rows.filter((r) => r.grade === 'A').length;
  const bCount = rows.filter((r) => r.grade === 'B').length;
  const cCount = rows.filter((r) => r.grade === 'C').length;
  const dCount = rows.filter((r) => r.grade === 'D').length;
  const fCount = rows.filter((r) => r.grade === 'F').length;

  const recalculateAll = async () => {
    setRecalculating(true);
    try {
      const res = await fetch('/api/admin/seo/score');
      if (res.ok) {
        const data = await res.json();
        setRows((prev) =>
          prev.map((row) => {
            const updated = data.find((d: any) => d.id === row.id);
            return updated ? { ...row, seoScore: updated.seoScore, grade: updated.grade, breakdown: updated.breakdown } : row;
          })
        );
      }
    } finally {
      setRecalculating(false);
    }
  };

  const improveWithAI = async (pageId: string) => {
    setImproving((prev) => ({ ...prev, [pageId]: { message: 'Başlatılıyor…', done: false } }));

    const res = await fetch('/api/admin/seo/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId }),
    });

    if (!res.body) {
      setImproving((prev) => ({ ...prev, [pageId]: { message: 'Bağlantı hatası', done: true, error: 'no stream' } }));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.message) {
              setImproving((prev) => ({ ...prev, [pageId]: { message: payload.message, done: false } }));
            }
            if (payload.seoScore !== undefined) {
              // Final done event
              setImproving((prev) => ({
                ...prev,
                [pageId]: { message: `✓ Tamamlandı — yeni skor: ${payload.seoScore}`, done: true, newScore: payload.seoScore, newGrade: payload.grade },
              }));
              startTransition(() => {
                setRows((prev) =>
                  prev.map((r) =>
                    r.id === pageId
                      ? { ...r, seoScore: payload.seoScore, grade: payload.grade, breakdown: payload.breakdown, coveredLocales: payload.savedLocales || r.coveredLocales }
                      : r
                  )
                );
              });
            }
            if (payload.message?.startsWith('error') || line.includes('event: error')) {
              setImproving((prev) => ({ ...prev, [pageId]: { message: payload.message, done: true, error: payload.message } }));
            }
          } catch {}
        }
      }
    }
  };

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-serif font-semibold text-slate-800">SEO Skor Paneli</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tüm hizmet sayfaları için SEO skoru — AI ile tek tıkla geliştir ve tüm dillere uygula
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/icerikler"
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← İçeriklere Dön
          </Link>
          <button
            onClick={recalculateAll}
            disabled={recalculating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {recalculating ? (
              <><span className="animate-spin inline-block">↻</span> Hesaplanıyor…</>
            ) : (
              <><span>↻</span> Tüm Skorları Güncelle</>
            )}
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Ortalama', val: `${avgScore}/100`, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
          { label: 'A (85+)', val: aCount, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'B (70+)', val: bCount, color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
          { label: 'C (55+)', val: cCount, color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
          { label: 'D (40+)', val: dCount, color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200' },
          { label: 'F (<40)', val: fCount, color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg border p-3 text-center ${s.bg}`}>
            <div className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="search"
          placeholder="Hizmet ara…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 max-w-xs border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400"
        />
        <span className="text-xs text-slate-400 self-center">{sorted.length} / {rows.length} hizmet</span>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-pointer select-none hover:text-slate-700"
                onClick={() => toggleSort('title')}
              >
                Hizmet {sortKey === 'title' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-pointer select-none hover:text-slate-700"
                onClick={() => toggleSort('score')}
              >
                SEO Skoru {sortKey === 'score' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500">
                Bar
              </th>
              <th
                className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-pointer select-none hover:text-slate-700"
                onClick={() => toggleSort('chars')}
              >
                İçerik {sortKey === 'chars' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-semibold text-slate-500">
                Diller
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold text-slate-500" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const state = improving[row.id];
              const isImproving = state && !state.done;
              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Service name */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800 text-[13px] leading-tight">
                      {row.title || row.titleInternal}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{row.slug}</div>
                    {state && (
                      <div className={`text-[11px] mt-1 ${state.error ? 'text-red-500' : state.done ? 'text-emerald-600' : 'text-blue-500'}`}>
                        {state.message}
                      </div>
                    )}
                  </td>

                  {/* Grade badge + breakdown toggle */}
                  <td className="px-4 py-3 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenBreakdown(openBreakdown === row.id ? null : row.id)}
                        className="focus:outline-none"
                      >
                        <GradeBadge grade={row.grade} score={row.seoScore} />
                      </button>
                      <BreakdownPopover breakdown={row.breakdown} open={openBreakdown === row.id} />
                    </div>
                  </td>

                  {/* Score bar */}
                  <td className="px-4 py-3">
                    <ScoreBar score={row.seoScore} />
                  </td>

                  {/* Content size */}
                  <td className="px-4 py-3 text-center">
                    {row.hasContent ? (
                      <span className="text-xs text-slate-600 font-mono">
                        {(row.contentChars / 1000).toFixed(1)}k kar
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">İçerik yok</span>
                    )}
                  </td>

                  {/* Locale coverage */}
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5 justify-center flex-wrap">
                      {['tr', 'en', 'ar', 'ru', 'fr', 'de'].map((l) => (
                        <span
                          key={l}
                          className={`text-sm ${row.coveredLocales.includes(l) ? 'opacity-100' : 'opacity-20 grayscale'}`}
                          title={row.coveredLocales.includes(l) ? `${l} ✓` : `${l} eksik`}
                        >
                          {LOCALE_FLAG[l]}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/icerikler/${row.slug}`}
                        className="text-[11px] px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => improveWithAI(row.id)}
                        disabled={isImproving}
                        className="text-[11px] px-2.5 py-1 rounded bg-gradient-to-r from-[#b8893c] to-[#9a7030] text-white hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1 whitespace-nowrap"
                      >
                        {isImproving ? (
                          <><span className="animate-spin">↻</span> İşleniyor</>
                        ) : (
                          <><span>✦</span> AI ile Geliştir</>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400 mt-4">
        ✦ "AI ile Geliştir" butonu: TR içeriği SEO odaklı genişletir, ardından EN · AR · RU · FR · DE dillerine otomatik çevirir ve kaydeder.
        Skor rozete tıklayınca detay kırılımı açılır.
      </p>
    </div>
  );
}
