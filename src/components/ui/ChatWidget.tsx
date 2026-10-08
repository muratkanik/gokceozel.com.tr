'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const GREETING: Record<string, string> = {
  tr: 'Merhaba! 👋 Prof. Dr. Gökçe Özel Kliniği\'ne hoş geldiniz. Estetik veya KBB prosedürleri hakkında sorularınızı yanıtlamaktan memnuniyet duyarım. Size nasıl yardımcı olabilirim?',
  en: 'Hello! 👋 Welcome to Prof. Dr. Gökçe Özel Clinic. I\'m happy to answer your questions about aesthetic or ENT procedures. How can I help you?',
  ar: 'مرحباً! 👋 أهلاً بكم في عيادة أ.د. غوكتشه أوزيل. يسعدني الإجابة على أسئلتكم حول إجراءات التجميل وطب الأنف والأذن والحنجرة.',
  ru: 'Здравствуйте! 👋 Добро пожаловать в клинику проф. д-ра Гёкче Озель. Готова ответить на ваши вопросы об эстетических процедурах.',
  fr: 'Bonjour! 👋 Bienvenue à la Clinique du Prof. Dr. Gökçe Özel. Je suis là pour répondre à vos questions.',
  de: 'Hallo! 👋 Willkommen in der Klinik von Prof. Dr. Gökçe Özel. Ich helfe Ihnen gerne bei Ihren Fragen.',
};

const PLACEHOLDER: Record<string, string> = {
  tr: 'Sorunuzu yazın…',
  en: 'Type your question…',
  ar: 'اكتب سؤالك…',
  ru: 'Напишите вопрос…',
  fr: 'Posez votre question…',
  de: 'Stellen Sie Ihre Frage…',
};

const SEND_LABEL: Record<string, string> = {
  tr: 'Gönder', en: 'Send', ar: 'إرسال', ru: 'Отправить', fr: 'Envoyer', de: 'Senden',
};

const TITLE: Record<string, string> = {
  tr: 'Klinik Asistanı', en: 'Clinic Assistant', ar: 'مساعد العيادة',
  ru: 'Ассистент клиники', fr: 'Assistant clinique', de: 'Klinik-Assistent',
};

const SUBTITLE: Record<string, string> = {
  tr: 'Prof. Dr. Gökçe Özel', en: 'Prof. Dr. Gökçe Özel',
  ar: 'أ.د. غوكتشه أوزيل', ru: 'Проф. д-р Гёкче Озель',
  fr: 'Prof. Dr. Gökçe Özel', de: 'Prof. Dr. Gökçe Özel',
};

export default function ChatWidget({ locale = 'tr' }: { locale?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING[locale] || GREETING.tr },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const placeholder: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, placeholder]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          locale,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Stream failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: locale === 'tr'
              ? 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin veya +90 534 209 69 35 numaralı hattı arayın.'
              : 'Sorry, an error occurred. Please try again or call us at +90 534 209 69 35.',
          };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, locale]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Sohbeti kapat' : 'Sohbeti aç'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#17201e] text-white shadow-2xl flex items-center justify-center hover:bg-[#49685f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#b8893c]"
        style={{ boxShadow: '0 8px 32px rgba(23,32,30,0.35)' }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M4 4L16 16M16 4L4 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {/* Notification dot when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#b8893c] rounded-full border-2 border-white" aria-hidden />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-[1.25rem] overflow-hidden shadow-2xl border border-[#49685f]/20"
          style={{ height: 'min(520px, calc(100dvh - 120px))', background: '#fcfbf9' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#17201e]">
            <div className="w-9 h-9 rounded-full bg-[#b8893c] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              GÖ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{TITLE[locale] || TITLE.tr}</p>
              <p className="text-[#b8893c] text-xs leading-tight">{SUBTITLE[locale] || SUBTITLE.tr}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="text-white/50 hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-[1rem] text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#17201e] text-white rounded-br-sm'
                      : 'bg-white border border-[#49685f]/10 text-[#17201e] rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b8893c] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b8893c] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b8893c] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions — only shown when first message */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {(locale === 'tr'
                ? ['Rinoplasti hakkında bilgi', 'Botoks fiyatları', 'Randevu almak istiyorum']
                : ['About rhinoplasty', 'Botox prices', 'I want an appointment']
              ).map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-xs bg-[#17201e]/5 border border-[#49685f]/15 text-[#17201e] px-2.5 py-1 rounded-full hover:bg-[#17201e]/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-[#49685f]/10 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={PLACEHOLDER[locale] || PLACEHOLDER.tr}
              rows={1}
              className="flex-1 resize-none bg-white border border-[#49685f]/20 rounded-xl px-3 py-2 text-sm text-[#17201e] placeholder:text-[#61706b]/60 focus:outline-none focus:border-[#b8893c]/50 transition-colors leading-relaxed"
              style={{ maxHeight: '80px', overflowY: 'auto' }}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label={SEND_LABEL[locale] || SEND_LABEL.tr}
              className="w-9 h-9 rounded-full bg-[#17201e] text-white flex items-center justify-center hover:bg-[#49685f] transition-colors disabled:opacity-40 flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M14 2L7 9M14 2L9.5 14L7 9L2 6.5L14 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
