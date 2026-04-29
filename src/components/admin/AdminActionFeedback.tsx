'use client';

import { useEffect, useRef, useState } from 'react';

type FeedbackKind = 'loading' | 'success' | 'error' | 'info';

interface FeedbackState {
  kind: FeedbackKind;
  message: string;
}

const STORAGE_KEY = 'gokce-admin-action-feedback';

function isFormElement(target: EventTarget | null): target is HTMLFormElement {
  return target instanceof HTMLFormElement;
}

function kindClasses(kind: FeedbackKind) {
  if (kind === 'loading') return 'border-slate-200 bg-slate-950 text-white shadow-slate-950/20';
  if (kind === 'error') return 'border-red-200 bg-red-50 text-red-700 shadow-red-950/10';
  if (kind === 'info') return 'border-blue-200 bg-blue-50 text-blue-700 shadow-blue-950/10';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-950/10';
}

export default function AdminActionFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const show = (next: FeedbackState, autoHide = next.kind !== 'loading') => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setFeedback(next);
      if (autoHide) {
        timeoutRef.current = setTimeout(() => setFeedback(null), 3200);
      }
    };

    const previousAction = window.sessionStorage.getItem(STORAGE_KEY);
    if (previousAction) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      show({ kind: 'success', message: previousAction });
    }

    const originalAlert = window.alert;
    window.alert = (message?: unknown) => {
      const text = String(message || '').trim();
      const isError = /hata|başarısız|error|failed/i.test(text);
      show({
        kind: isError ? 'error' : 'success',
        message: text || (isError ? 'İşlem tamamlanamadı.' : 'İşlem tamamlandı.'),
      });
    };

    const handleFeedbackEvent = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      const kind = detail?.kind || 'info';
      const message = String(detail?.message || '').trim();
      if (!message) return;
      show({ kind, message });
    };

    const handleSubmit = (event: SubmitEvent) => {
      window.setTimeout(() => {
        if (event.defaultPrevented || !isFormElement(event.target)) return;

        const form = event.target;
        if (form.dataset.noAdminFeedback === 'true') return;
        if ((form.method || '').toLowerCase() === 'get') return;

        const message = form.dataset.successMessage || 'Başarıyla kaydedildi.';
        const pendingMessage = form.dataset.pendingMessage || 'Kaydediliyor...';

        window.sessionStorage.setItem(STORAGE_KEY, message);
        show({ kind: 'loading', message: pendingMessage }, false);
      }, 0);
    };

    window.addEventListener('admin-feedback', handleFeedbackEvent);
    document.addEventListener('submit', handleSubmit);

    return () => {
      window.removeEventListener('admin-feedback', handleFeedbackEvent);
      document.removeEventListener('submit', handleSubmit);
      window.alert = originalAlert;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!feedback) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[9999] max-w-sm">
      <div className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${kindClasses(feedback.kind)}`}>
        <div className="flex items-center gap-3">
          {feedback.kind === 'loading' ? (
            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-current/10 text-[11px]">✓</span>
          )}
          <span>{feedback.message}</span>
        </div>
      </div>
    </div>
  );
}
