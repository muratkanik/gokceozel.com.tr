'use client';
import { useEffect, useState } from 'react';

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
  createdAt: string;
};

function LeadBar({ score }: { score: number }) {
  const color = score >= 60 ? '#22c55e' : score >= 30 ? '#f59e0b' : '#9ca3af';
  const label = score >= 60 ? 'Sıcak' : score >= 30 ? 'Ilık' : 'Soğuk';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label} {score}%</span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminSohbetPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'anxiety' | 'hot' | 'contact'>('all');
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
    await fetch('/api/admin/sohbet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setSessions(prev => prev.filter(s => s.id !== id));
    setTotal(prev => prev - 1);
  };

  const contactCount = sessions.filter(s => s.contactPhone).length;
  const anxietyCount = sessions.filter(s => s.anxiety).length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#17201e]">AI Sohbet Geçmişi</h1>
          <p className="text-[#61706b] text-sm mt-1">
            {total} konuşma · {contactCount} iletişim bilgisi · {anxietyCount} kaygılı hasta
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {([
            ['all', 'Tümü'],
            ['contact', '📞 İletişim Bıraktı'],
            ['hot', '🔥 Sıcak Lead'],
            ['anxiety', '⚠️ Kaygılı'],
          ] as const).map(([f, label]) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#17201e] text-white'
                  : 'bg-[#f4f0e8] text-[#61706b] hover:bg-[#e8e1d4]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[#61706b] text-center py-12">Yükleniyor…</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-[#61706b]">
          <p className="text-3xl mb-3">💬</p>
          <p className="font-semibold text-lg text-[#17201e] mb-1">Henüz sohbet yok</p>
          <p className="text-sm">Siteyi ziyaret edenler chatbot ile konuştuğunda buraya düşecek.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map(s => {
            const userMsgCount = s.messages.filter(m => m.role === 'user').length;
            const firstUserMsg = s.messages.find(m => m.role === 'user')?.content || '—';
            const isExpanded = expanded === s.id;

            return (
              <div key={s.id} className="bg-white border border-[#e8e1d4] rounded-xl overflow-hidden shadow-sm">
                {/* Row header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : s.id)}
                  className="w-full text-left px-5 py-4 hover:bg-[#f9f7f3] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Contact avatar / indicator */}
                    <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      s.contactPhone ? 'bg-emerald-100 text-emerald-700' : 'bg-[#f4f0e8] text-[#9ca3af]'
                    }`}>
                      {s.contactName ? s.contactName.charAt(0).toUpperCase() : '?'}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + phone row */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {s.contactName ? (
                          <span className="font-semibold text-[#17201e] text-sm">{s.contactName}</span>
                        ) : (
                          <span className="text-[#9ca3af] text-sm italic">İsim bırakmadı</span>
                        )}
                        {s.contactPhone && (
                          <a
                            href={`tel:${s.contactPhone}`}
                            onClick={e => e.stopPropagation()}
                            className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            📞 {s.contactPhone}
                          </a>
                        )}
                        {s.anxiety && (
                          <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                            ⚠️ Kaygılı
                          </span>
                        )}
                        <span className="text-xs bg-[#e8e1d4] text-[#61706b] px-2 py-0.5 rounded-full font-mono uppercase">
                          {s.locale}
                        </span>
                      </div>

                      {/* Summary or first message */}
                      <p className="text-sm text-[#61706b] line-clamp-2 leading-relaxed">
                        {s.summary || firstUserMsg}
                      </p>

                      {/* Bottom meta row */}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <LeadBar score={s.leadScore} />
                        <span className="text-xs text-[#9ca3af]">{userMsgCount} mesaj</span>
                        <span className="text-xs text-[#9ca3af]">{formatDate(s.createdAt)}</span>
                      </div>
                    </div>

                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className={`flex-shrink-0 text-[#61706b] transition-transform mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {/* Expanded: full conversation */}
                {isExpanded && (
                  <div className="border-t border-[#e8e1d4]">
                    {/* Contact info banner */}
                    {(s.contactName || s.contactPhone) && (
                      <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
                        <span className="text-emerald-700 font-semibold text-sm">İletişim Bilgisi:</span>
                        {s.contactName && <span className="text-emerald-900 text-sm">{s.contactName}</span>}
                        {s.contactPhone && (
                          <a href={`tel:${s.contactPhone}`} className="text-emerald-700 font-bold text-sm hover:underline">
                            {s.contactPhone}
                          </a>
                        )}
                      </div>
                    )}

                    {/* AI Summary */}
                    {s.summary && (
                      <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">AI Özeti</p>
                        <p className="text-sm text-blue-900 leading-relaxed">{s.summary}</p>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="px-5 py-4 flex flex-col gap-3 max-h-96 overflow-y-auto bg-[#f9f7f3]">
                      {s.messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[#17201e] text-white rounded-br-sm'
                              : 'bg-white border border-[#e8e1d4] text-[#17201e] rounded-bl-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="px-5 py-3 border-t border-[#e8e1d4] flex items-center justify-between">
                      {s.contactPhone ? (
                        <a
                          href={`https://wa.me/${s.contactPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1da851] transition-colors"
                        >
                          WhatsApp ile Ara
                        </a>
                      ) : (
                        <span className="text-xs text-[#9ca3af]">İletişim bilgisi yok</span>
                      )}
                      <button
                        onClick={() => deleteSession(s.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
