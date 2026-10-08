'use client';
import { useEffect, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };
type Session = {
  id: string;
  locale: string;
  messages: Message[];
  anxiety: boolean;
  leadScore: number;
  createdAt: string;
};

function LeadBadge({ score }: { score: number }) {
  const color = score >= 60 ? '#22c55e' : score >= 30 ? '#f59e0b' : '#9ca3af';
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {score}%
    </span>
  );
}

export default function AdminSohbetPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'anxiety' | 'hot'>('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/sohbet?filter=${filter}&page=${page}`)
      .then(r => r.json())
      .then(d => {
        setSessions(d.sessions || []);
        setTotal(d.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, page]);

  const deleteSession = async (id: string) => {
    if (!confirm('Bu sohbeti silmek istiyor musunuz?')) return;
    await fetch('/api/admin/sohbet', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setSessions(prev => prev.filter(s => s.id !== id));
    setTotal(prev => prev - 1);
  };

  const userMsgCount = (s: Session) => s.messages.filter(m => m.role === 'user').length;
  const firstUserMsg = (s: Session) => s.messages.find(m => m.role === 'user')?.content || '—';

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#17201e]">Sohbet Geçmişi</h1>
          <p className="text-[#61706b] text-sm mt-1">{total} konuşma kayıtlı</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'hot', 'anxiety'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#17201e] text-white'
                  : 'bg-[#f4f0e8] text-[#61706b] hover:bg-[#e8e1d4]'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'hot' ? '🔥 Sıcak Lead' : '⚠️ Kaygılı'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[#61706b] text-center py-12">Yükleniyor…</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-[#61706b]">
          <p className="text-lg mb-2">Henüz sohbet yok</p>
          <p className="text-sm">Siteyi ziyaret edenler chatbot ile konuştuğunda buraya düşecek.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map(s => (
            <div key={s.id} className="bg-white border border-[#e8e1d4] rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-[#f9f7f3] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs bg-[#e8e1d4] text-[#61706b] px-2 py-0.5 rounded-full font-mono uppercase">
                      {s.locale}
                    </span>
                    <LeadBadge score={s.leadScore} />
                    {s.anxiety && (
                      <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                        ⚠️ Kaygılı
                      </span>
                    )}
                    <span className="text-xs text-[#9ca3af]">{userMsgCount(s)} mesaj</span>
                    <span className="text-xs text-[#9ca3af]">
                      {new Date(s.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-[#17201e] truncate">{firstUserMsg(s)}</p>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`flex-shrink-0 text-[#61706b] transition-transform ${expanded === s.id ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {expanded === s.id && (
                <div className="border-t border-[#e8e1d4]">
                  <div className="px-5 py-4 flex flex-col gap-3 max-h-96 overflow-y-auto bg-[#f9f7f3]">
                    {s.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#17201e] text-white rounded-br-sm'
                            : 'bg-white border border-[#e8e1d4] text-[#17201e] rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-[#e8e1d4] flex justify-end">
                    <button
                      onClick={() => deleteSession(s.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg bg-[#f4f0e8] text-sm font-medium disabled:opacity-40 hover:bg-[#e8e1d4] transition-colors"
          >
            ← Önceki
          </button>
          <span className="text-sm text-[#61706b]">{page} / {Math.ceil(total / 20)}</span>
          <button
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg bg-[#f4f0e8] text-sm font-medium disabled:opacity-40 hover:bg-[#e8e1d4] transition-colors"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
