'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

interface ReservationSettingsValue {
  isEnabled: boolean;
  workingDays: number[];
  dayStart: string;
  dayEnd: string;
  slotMinutes: number;
  bufferMinutes: number;
  maxPerSlot: number;
  minNoticeHours: number;
  bookingHorizonDays: number;
}

interface ReservationSettingsFormProps {
  settings: ReservationSettingsValue;
}

const dayLabels = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function emitFeedback(kind: 'loading' | 'success' | 'error', message: string) {
  window.dispatchEvent(new CustomEvent('admin-feedback', { detail: { kind, message } }));
}

export default function ReservationSettingsForm({ settings }: ReservationSettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<ReservationSettingsValue>(settings);

  const update = <Key extends keyof ReservationSettingsValue>(key: Key, value: ReservationSettingsValue[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleWorkingDay = (day: number) => {
    setForm((current) => ({
      ...current,
      workingDays: current.workingDays.includes(day)
        ? current.workingDays.filter((item) => item !== day)
        : [...current.workingDays, day].sort((a, b) => a - b),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    emitFeedback('loading', 'Randevu ayarları kaydediliyor...');

    try {
      const response = await fetch('/api/admin/reservations/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Randevu ayarları kaydedilemedi.');
      }

      emitFeedback('success', 'Randevu ayarları başarıyla kaydedildi.');
      router.refresh();
    } catch (error) {
      emitFeedback('error', error instanceof Error ? error.message : 'Randevu ayarları kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-no-admin-feedback="true" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-950">Çalışma düzeni</h2>
      <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={form.isEnabled} onChange={(event) => update('isEnabled', event.target.checked)} />
        Online randevu açık
      </label>
      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        {dayLabels.map((label, index) => (
          <label key={label} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <input type="checkbox" checked={form.workingDays.includes(index)} onChange={() => toggleWorkingDay(index)} />
            {label}
          </label>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Başlangıç" type="time" value={form.dayStart} onChange={(value) => update('dayStart', value)} />
        <Field label="Bitiş" type="time" value={form.dayEnd} onChange={(value) => update('dayEnd', value)} />
        <Field label="Slot dakika" type="number" value={form.slotMinutes} onChange={(value) => update('slotMinutes', Number(value))} />
        <Field label="Ara dakika" type="number" value={form.bufferMinutes} onChange={(value) => update('bufferMinutes', Number(value))} />
        <Field label="Slot kapasite" type="number" value={form.maxPerSlot} onChange={(value) => update('maxPerSlot', Number(value))} />
        <Field label="Min. bildirim saat" type="number" value={form.minNoticeHours} onChange={(value) => update('minNoticeHours', Number(value))} />
        <Field label="Kaç gün ileri" type="number" value={form.bookingHorizonDays} onChange={(value) => update('bookingHorizonDays', Number(value))} />
      </div>
      <button
        type="submit"
        disabled={isSaving}
        aria-busy={isSaving}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Ayarlar kaydediliyor...' : 'Ayarları kaydet'}
      </button>
    </form>
  );
}

function Field({ label, type, value, onChange }: { label: string; type: string; value: string | number; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <input value={value} type={type} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </label>
  );
}
