'use client';
import { useEffect, useState, useCallback } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };
type Session = {
  id: string;
  locale: string;
  messages: Message[];
  anxiety: boolean;
  leadScore: number;
  contactName: string | null;
  contactPhone: string | null;
  summary: string | null;
  emailSent: boolean;
  whatsappNotified: boolean;
  calledBack: boolean;
  calledBackAt: string | null;
  city: string | null;
  country: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
};

const LOCALE_FLAG: Record<string, string> = { tr: '🇹🇷', en: '🇬🇧', ar: '🇸🇦', ru: '🇷🇺', fr: '🇫🇷', de: '🇩🇪' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Az önce';
  if (mins < 60) return `${mins}dk önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}sa önce`;
  return `${Math.floor(hrs / 24)}g önce`;
}

function LeadDot({ score }: { score: number }) {
  const cls = score >= 60 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-400' : 'bg-slate-300';
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${cls}`} />;
}

function LeadBadge({ score }: { score: number }) {
  if (score >= 60) return <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">🔥 Sıcak</span>;
  if (score >= 30) return <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">🌡️ Ilık</span>;
  return <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">❄️ Soğuk</span>;
}

function CallbackBadge({ calledBack, calledBackAt }: { calledBack: boolean; calledBackAt: string | null }) {
  if (calledBack) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
        ✓ Arandı{calledBackAt ? ` · ${timeAgo(calledBackAt)}` : ''}
      </span>
    );
  }
  return (
    <span className="relative inline-flex items-center gap-1 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-400 animate-ping" />
      <span className="relative">📞 ARANMAK İSTİYOR</span>
    </span>
  );
}

function DeviceBadge({ ua }: { ua: string | null }) {
  if (!ua) return null;
  const isMobile = /mobile|android|iphone|ipad/i.test(ua);
  return <span className="text-[10px] text-slate-400">{isMobile ? '📱 Mobil' : '🖥️ Masaüstü'}</span>;
}

function SessionModal({
  session: initialSession,
  onClose,
  onDelete,
  onCalledBackChange,
}: {
  session: Session;
  onClose: () => void;
  onDelete: (id: string) => void;
  onCalledBackChange: (id: string, calledBack: boolean, calledBackAt: string | null) => void;
}) {
  const [session, setSession] = useState(initialSession);
  const [markingCall, setMarkingCall] = useState(false);
  const userMsgCount = session.messages.filter(m => m.role === 'user').length;

  const toggleCalledBack = async () => {
    setMarkingCall(true);
    const newVal = !session.calledBack;
    const res = await fetch('/api/admin/sohbet', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.id, calledBack: newVal }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = { ...session, calledBack: newVal, calledBackAt: data.session?.calledBackAt ?? null };
      setSession(updated);
      onCalledBackChange(session.id, newVal, data.session?.calledBackAt ?? null);
    }
    setMarkingCall(false);
  };

  const handleDelete = async () => {
    if (!confirm('Bu sohbeti kalıcı olarak silmek istiyor musunuz?')) return;
    await fetch('/api/admin/sohbet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.id }),
    });
    onDelete(session.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              session.contactPhone ? (session.calledBack ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600') : 'bg-slate-100 text-slate-500'
            }`}>
              {session.contactName ? session.contactName.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800 text-sm">{session.contactName || 'Anonim Ziyaretçi'}</span>
                {session.contactPhone && <CallbackBadge calledBack={session.calledBack} calledBackAt={session.calledBackAt} />}
                {session.anxiety && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">⚠️ Kaygılı</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                {session.contactPhone && (
                  <a href={`tel:${session.contactPhone}`} className="font-semibold text-emerald-600 hover:underline">{session.contactPhone}</a>
                )}
                <span>·</span><span>{userMsgCount} mesaj</span>
                <span>·</span><span>{formatDate(session.createdAt)}</span>
                {session.city && <><span>·</span><span>📍 {session.city}{session.country ? `, ${session.country}` : ''}</span></>}
                {LOCALE_FLAG[session.locale] && <span>{LOCALE_FLAG[session.locale]}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0 transition-colors">✕</button>
        </div>

        {/* AI Summary */}
        {session.summary && (
          <div className="mx-6 mt-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl flex-shrink-0">
            <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1">AI Özeti</p>
            <p className="text-sm text-blue-900 leading-relaxed">{session.summary}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2.5 bg-slate-50/50">
          {session.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-[#17201e] text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {session.contactPhone && (
              <>
                <a href={`tel:${session.contactPhone}`} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">📞 Ara</a>
                <a href={`https://wa.me/${session.contactPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1da851] transition-colors">WhatsApp</a>
                <button onClick={toggleCalledBack} disabled={markingCall}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-60 ${
                    session.calledBack ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-100'
                  }`}>
                  {markingCall ? '…' : session.calledBack ? '↩ Aranmadı olarak işaretle' : '✓ Aradım'}
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <LeadBadge score={session.leadScore} />
            <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Sil</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSohbetPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCallbackCount, setPendingCallbackCount] = useState(0);
  const [calledCount, setCalledCount] = useState(0);
  const [anxietyCount, setAnxietyCount] = useState(0);
  const [hotCount, setHotCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'callback' | 'called' | 'hot' | 'anxiety'>('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Session | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchSessions = useCallback(() => {
    setLoading(true);
    setCheckedIds(new Set());
    fetch(`/api/admin/sohbet?filter=${filter}&page=${page}`)
      .then(r => r.json())
      .then(d => {
        setSessions(d.sessions || []);
        setTotal(d.total || 0);
        setPendingCallbackCount(d.pendingCallbackCount ?? 0);
        setCalledCount(d.calledCount ?? 0);
        setAnxietyCount(d.anxietyCount ?? 0);
        setHotCount(d.hotCount ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, page]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setTotal(prev => prev - 1);
    setCheckedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    setSelected(null);
  };

  const handleCalledBackChange = (id: string, calledBack: boolean, calledBackAt: string | null) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, calledBack, calledBackAt } : s));
    if (calledBack) { setPendingCallbackCount(c => Math.max(0, c - 1)); setCalledCount(c => c + 1); }
    else { setPendingCallbackCount(c => c + 1); setCalledCount(c => Math.max(0, c - 1)); }
    if (filter === 'callback' && calledBack) setSessions(prev => prev.filter(s => s.id !== id));
    if (filter === 'called' && !calledBack) setSessions(prev => prev.filter(s => s.id !== id));
  };

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    if (checkedIds.size === sessions.length) setCheckedIds(new Set());
    else setCheckedIds(new Set(sessions.map(s => s.id)));
  };

  const bulkDelete = async () => {
    if (checkedIds.size === 0) return;
    if (!confirm(`${checkedIds.size} sohbeti kalıcı olarak silmek istiyor musunuz?`)) return;
    setBulkDeleting(true);
    await fetch('/api/admin/sohbet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...checkedIds] }),
    });
    setSessions(prev => prev.filter(s => !checkedIds.has(s.id)));
    setTotal(prev => prev - checkedIds.size);
    setCheckedIds(new Set());
    setBulkDeleting(false);
  };

  const totalPages = Math.ceil(total / 25);
  const allChecked = sessions.length > 0 && checkedIds.size === sessions.length;

  const FILTERS = [
    { key: 'all' as const,      label: 'Tümü',           count: total,                urgent: false },
    { key: 'callback' as const, label: '📞 Aranacaklar', count: pendingCallbackCount, urgent: pendingCallbackCount > 0 },
    { key: 'called' as const,   label: '✓ Arananlar',    count: calledCount,          urgent: false },
    { key: 'hot' as const,      label: '🔥 Sıcak',       count: hotCount,             urgent: false },
    { key: 'anxiety' as const,  label: '⚠️ Kaygılı',     count: anxietyCount,         urgent: false },
  ];

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-serif font-semibold text-slate-800">AI Sohbet Geçmişi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total} konuşma
            {pendingCallbackCount > 0 && (
              <span className="text-red-600 font-semibold animate-pulse"> · {pendingCallbackCount} kişi bekliyor</span>
            )}
          </p>
        </div>
        <button onClick={fetchSessions} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
          ↻ Yenile
        </button>
      </div>

      {/* Urgent banner */}
      {pendingCallbackCount > 0 && filter !== 'callback' && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => { setFilter('callback'); setPage(1); }}>
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <p className="text-sm font-semibold text-red-700">{pendingCallbackCount} ziyaretçi aranmayı bekliyor — görüntülemek için tıklayın</p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map(({ key, label, count, urgent }) => (
          <button key={key} onClick={() => { setFilter(key); setPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === key
                ? urgent ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
                : urgent ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
            {label}
            {count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === key ? 'bg-white/20 text-white' : urgent ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'
              }`}>{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {checkedIds.size > 0 && (
        <div className="mb-3 flex items-center gap-3 px-4 py-2.5 bg-slate-800 text-white rounded-xl">
          <span className="text-sm font-semibold">{checkedIds.size} seçili</span>
          <button onClick={bulkDelete} disabled={bulkDeleting}
            className="ml-auto text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-60">
            {bulkDeleting ? 'Siliniyor…' : `🗑 ${checkedIds.size} sohbeti sil`}
          </button>
          <button onClick={() => setCheckedIds(new Set())} className="text-xs text-slate-400 hover:text-white transition-colors">İptal</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">{filter === 'called' ? '✅' : filter === 'callback' ? '🎉' : '💬'}</p>
          <p className="font-semibold text-slate-600">
            {filter === 'called' ? 'Henüz aranan yok' : filter === 'callback' ? 'Bekleyen kimse yok — harika!' : 'Henüz sohbet yok'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 w-10">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded border-slate-300 accent-slate-700 cursor-pointer" />
                  </th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Ziyaretçi</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Özet</th>
                  <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Skor</th>
                  <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Konum</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const firstUserMsg = s.messages.find(m => m.role === 'user')?.content || '—';
                  const preview = (s.summary || firstUserMsg).slice(0, 90) + ((s.summary || firstUserMsg).length > 90 ? '…' : '');
                  const msgCount = s.messages.filter(m => m.role === 'user').length;
                  const needsCall = s.contactPhone && !s.calledBack;
                  const isChecked = checkedIds.has(s.id);

                  return (
                    <tr key={s.id} onClick={() => setSelected(s)}
                      className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                        isChecked ? 'bg-slate-100' : needsCall ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50'
                      }`}>
                      {/* Checkbox */}
                      <td className="px-3 py-3" onClick={e => toggleCheck(s.id, e)}>
                        <input type="checkbox" checked={isChecked} onChange={() => {}}
                          className="w-3.5 h-3.5 rounded border-slate-300 accent-slate-700 cursor-pointer" />
                      </td>

                      {/* Visitor */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <LeadDot score={s.leadScore} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-slate-800 text-[13px]">
                                {s.contactName || <span className="text-slate-400 italic text-[12px]">Anonim</span>}
                              </span>
                              {s.anxiety && <span className="text-[10px] font-bold text-red-500">⚠️</span>}
                            </div>
                            {s.contactPhone && (
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="text-[11px] text-slate-500 font-mono">{s.contactPhone}</span>
                                <CallbackBadge calledBack={s.calledBack} calledBackAt={s.calledBackAt} />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Preview */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">{preview}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{msgCount} mesaj · {LOCALE_FLAG[s.locale] || s.locale}</p>
                      </td>

                      {/* Score */}
                      <td className="px-3 py-3 text-center">
                        <LeadBadge score={s.leadScore} />
                        <div className="text-[10px] text-slate-400 mt-0.5">{s.leadScore}%</div>
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3 text-center hidden sm:table-cell">
                        {s.city && <div className="text-[11px] text-slate-500">📍 {s.city}</div>}
                        <DeviceBadge ua={s.userAgent} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-[11px] font-medium text-slate-600">{timeAgo(s.createdAt)}</div>
                        <div className="text-[10px] text-slate-400">{formatDate(s.createdAt)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium disabled:opacity-40 hover:bg-slate-200 transition-colors">← Önceki</button>
              <span className="text-sm text-slate-500">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium disabled:opacity-40 hover:bg-slate-200 transition-colors">Sonraki →</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selected && (
        <SessionModal
          session={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onCalledBackChange={handleCalledBackChange}
        />
      )}
    </div>
  );
}
