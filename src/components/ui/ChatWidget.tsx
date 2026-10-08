'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const DISCLAIMER_KEY = 'chatbot_disclaimer_v1';

const T = {
  tr: {
    title: 'Klinik Asistanı',
    subtitle: 'Prof. Dr. Gökçe Özel',
    placeholder: 'Sorunuzu yazın…',
    send: 'Gönder',
    close: 'Kapat',
    greeting: 'Merhaba! 👋 Prof. Dr. Gökçe Özel Kliniği\'ne hoş geldiniz.\n\nSize daha iyi yardımcı olabilmem için önce adınızı öğrenebilir miyim? 😊',
    suggestions: ['Rinoplasti hakkında bilgi', 'Botoks fiyatları', 'Randevu almak istiyorum'],
    error: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin veya +90 534 209 69 35 numaralı hattı arayın.',
    disclaimerTitle: 'Bilgilendirme Uyarısı',
    disclaimerBody: `Bu asistan yalnızca bilgilendirme amaçlıdır ve tıbbi teşhis, tedavi tavsiyesi veya doktor muayenesi yerine geçmez.

Verilen bilgiler Prof. Dr. Gökçe Özel Kliniği hizmetleri hakkında genel nitelikte olup kişisel tıbbi karar için mutlaka bir uzman hekime danışmanız gerekmektedir.

Kişisel sağlık verileriniz KVKK kapsamında işlenmekte ve yalnızca klinik tarafından kullanılmaktadır.`,
    disclaimerAccept: 'Anladım, Devam Et',
    disclaimerNote: 'Bu uyarıyı kabul ederek bilgilendirme amaçlı kullandığınızı onaylıyorsunuz.',
    aiNotice: '🤖 Yapay Zeka tarafından yanıtlanmaktadır',
  },
  en: {
    title: 'Clinic Assistant',
    subtitle: 'Prof. Dr. Gökçe Özel',
    placeholder: 'Type your question…',
    send: 'Send',
    close: 'Close',
    greeting: 'Hello! 👋 Welcome to Prof. Dr. Gökçe Özel Clinic.\n\nMay I ask your name so I can assist you better? 😊',
    suggestions: ['About rhinoplasty', 'Botox prices', 'I want an appointment'],
    error: 'Sorry, an error occurred. Please try again or call us at +90 534 209 69 35.',
    disclaimerTitle: 'Important Notice',
    disclaimerBody: `This assistant is for informational purposes only and does not replace medical diagnosis, treatment advice, or a physician consultation.

Information provided is general in nature about Prof. Dr. Gökçe Özel Clinic services. Always consult a qualified physician for personal medical decisions.

Your personal data is processed in accordance with applicable data protection regulations.`,
    disclaimerAccept: 'I Understand, Continue',
    disclaimerNote: 'By accepting, you confirm you are using this for informational purposes only.',
    aiNotice: '🤖 Answered by Artificial Intelligence',
  },
  ar: {
    title: 'مساعد العيادة',
    subtitle: 'أ.د. غوكتشه أوزيل',
    placeholder: 'اكتب سؤالك…',
    send: 'إرسال',
    close: 'إغلاق',
    greeting: 'مرحباً! 👋 أهلاً بكم في عيادة أ.د. غوكتشه أوزيل.\n\nهل يمكنني معرفة اسمك لأتمكن من مساعدتك بشكل أفضل؟ 😊',
    suggestions: ['معلومات عن رينوبلاستي', 'أسعار البوتوكس', 'أريد حجز موعد'],
    error: 'عذراً، حدث خطأ. يرجى المحاولة مجدداً أو الاتصال بنا.',
    disclaimerTitle: 'تنبيه مهم',
    disclaimerBody: `هذا المساعد للأغراض الإعلامية فقط ولا يُعدّ بديلاً عن التشخيص الطبي أو استشارة الطبيب.

المعلومات المقدمة عامة بطبيعتها حول خدمات العيادة. استشر دائماً طبيباً مختصاً للقرارات الطبية الشخصية.`,
    disclaimerAccept: 'فهمت، المتابعة',
    disclaimerNote: 'بالقبول، تؤكد استخدامك للأغراض الإعلامية فقط.',
    aiNotice: '🤖 مُجاب بواسطة الذكاء الاصطناعي',
  },
  ru: {
    title: 'Ассистент клиники',
    subtitle: 'Проф. д-р Гёкче Озель',
    placeholder: 'Напишите вопрос…',
    send: 'Отправить',
    close: 'Закрыть',
    greeting: 'Здравствуйте! 👋 Добро пожаловать в клинику проф. д-ра Гёкче Озель.\n\nМогу ли я узнать ваше имя? 😊',
    suggestions: ['О ринопластике', 'Цены на ботокс', 'Записаться на приём'],
    error: 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.',
    disclaimerTitle: 'Важное уведомление',
    disclaimerBody: `Этот помощник предназначен только для информационных целей и не заменяет медицинскую диагностику или консультацию врача.

Предоставляемая информация носит общий характер. Всегда консультируйтесь с квалифицированным врачом.`,
    disclaimerAccept: 'Понятно, продолжить',
    disclaimerNote: 'Принимая, вы подтверждаете информационный характер использования.',
    aiNotice: '🤖 Ответ сгенерирован ИИ',
  },
  fr: {
    title: 'Assistant clinique',
    subtitle: 'Prof. Dr. Gökçe Özel',
    placeholder: 'Posez votre question…',
    send: 'Envoyer',
    close: 'Fermer',
    greeting: 'Bonjour! 👋 Bienvenue à la Clinique du Prof. Dr. Gökçe Özel.\n\nPuis-je vous demander votre prénom pour mieux vous aider ? 😊',
    suggestions: ['À propos de la rhinoplastie', 'Prix du botox', 'Prendre rendez-vous'],
    error: 'Une erreur s\'est produite. Veuillez réessayer.',
    disclaimerTitle: 'Avis important',
    disclaimerBody: `Cet assistant est fourni à titre informatif uniquement et ne remplace pas un diagnostic médical ou une consultation médicale.

Les informations fournies sont d'ordre général. Consultez toujours un médecin qualifié.`,
    disclaimerAccept: 'Je comprends, continuer',
    disclaimerNote: 'En acceptant, vous confirmez l\'usage informatif.',
    aiNotice: '🤖 Répondu par l\'Intelligence Artificielle',
  },
  de: {
    title: 'Klinik-Assistent',
    subtitle: 'Prof. Dr. Gökçe Özel',
    placeholder: 'Stellen Sie Ihre Frage…',
    send: 'Senden',
    close: 'Schließen',
    greeting: 'Hallo! 👋 Willkommen in der Klinik von Prof. Dr. Gökçe Özel.\n\nDarf ich Ihren Namen erfahren, um Ihnen besser helfen zu können? 😊',
    suggestions: ['Über Rhinoplastik', 'Botox-Preise', 'Termin vereinbaren'],
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    disclaimerTitle: 'Wichtiger Hinweis',
    disclaimerBody: `Dieser Assistent dient nur zu Informationszwecken und ersetzt keine medizinische Diagnose oder Arztberatung.

Die bereitgestellten Informationen sind allgemeiner Natur. Konsultieren Sie immer einen qualifizierten Arzt.`,
    disclaimerAccept: 'Verstanden, weiter',
    disclaimerNote: 'Mit der Zustimmung bestätigen Sie die informatorische Nutzung.',
    aiNotice: '🤖 Von Künstlicher Intelligenz beantwortet',
  },
};

export default function ChatWidget({ locale = 'tr' }: { locale?: string }) {
  const lang = (T[locale as keyof typeof T] || T.tr);
  const [open, setOpen] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: lang.greeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Check localStorage for prior acceptance
  useEffect(() => {
    try {
      setDisclaimerAccepted(!!localStorage.getItem(DISCLAIMER_KEY));
    } catch {}
  }, []);

  useEffect(() => {
    if (open && disclaimerAccepted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, disclaimerAccepted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const acceptDisclaimer = () => {
    try { localStorage.setItem(DISCLAIMER_KEY, '1'); } catch {}
    setDisclaimerAccepted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

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
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Buffer across chunks so split SSE lines are never parsed mid-token
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
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
      // Save conversation async (fire-and-forget)
      const finalMessages = [...newMessages, { role: 'assistant' as const, content: assistantText }];
      fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current, messages: finalMessages, locale }),
      }).then(r => r.json()).then((data: any) => {
        if (data.sessionId) sessionIdRef.current = data.sessionId;
      }).catch(() => {});
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: lang.error };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, locale, lang.error]);

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
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#b8893c] rounded-full border-2 border-white" aria-hidden />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-[1.25rem] overflow-hidden shadow-2xl border border-[#49685f]/20"
          style={{ height: 'min(560px, calc(100dvh - 120px))', background: '#fcfbf9' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#17201e] flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#b8893c] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              GÖ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{lang.title}</p>
              <p className="text-[#b8893c] text-xs leading-tight">{lang.subtitle}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={lang.close}
              className="text-white/50 hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Disclaimer modal — shown on first open until accepted */}
          {!disclaimerAccepted ? (
            <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-4 overflow-y-auto">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-[#17201e] font-bold text-base text-center">{lang.disclaimerTitle}</h3>
              <p className="text-[#61706b] text-xs leading-relaxed text-center whitespace-pre-line">{lang.disclaimerBody}</p>
              <p className="text-[#9ca3af] text-[11px] text-center italic">{lang.disclaimerNote}</p>
              <button
                onClick={acceptDisclaimer}
                className="w-full bg-[#17201e] text-white font-semibold py-3 rounded-xl hover:bg-[#49685f] transition-colors text-sm"
              >
                {lang.disclaimerAccept}
              </button>
            </div>
          ) : (
            <>
              {/* AI notice bar */}
              <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-100 text-center flex-shrink-0">
                <p className="text-[10px] text-amber-700 font-medium">{lang.aiNotice}</p>
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
                <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                  {lang.suggestions.map(q => (
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

              {/* Disclaimer footer */}
              <div className="px-4 pt-1 pb-1 flex-shrink-0">
                <p className="text-[10px] text-[#9ca3af] text-center leading-tight">
                  {locale === 'tr'
                    ? 'Bu sohbet tıbbi tavsiye değildir. Sağlık kararları için lütfen doktorunuza danışın.'
                    : 'This chat is not medical advice. Please consult a physician for health decisions.'}
                </p>
              </div>

              {/* Input */}
              <div className="px-3 pb-3 pt-1 border-t border-[#49685f]/10 flex gap-2 items-end flex-shrink-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={lang.placeholder}
                  rows={1}
                  className="flex-1 resize-none bg-white border border-[#49685f]/20 rounded-xl px-3 py-2 text-sm text-[#17201e] placeholder:text-[#61706b]/60 focus:outline-none focus:border-[#b8893c]/50 transition-colors leading-relaxed"
                  style={{ maxHeight: '80px', overflowY: 'auto' }}
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label={lang.send}
                  className="w-9 h-9 rounded-full bg-[#17201e] text-white flex items-center justify-center hover:bg-[#49685f] transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M14 2L7 9M14 2L9.5 14L7 9L2 6.5L14 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
