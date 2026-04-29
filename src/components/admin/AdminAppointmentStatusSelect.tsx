'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { APPOINTMENT_STATUSES, appointmentStatusLabel, appointmentStatusTone } from '@/lib/appointment-status';

interface AdminAppointmentStatusSelectProps {
  id: string;
  initialStatus?: string | null;
}

export default function AdminAppointmentStatusSelect({ id, initialStatus }: AdminAppointmentStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus || 'pending');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const updateStatus = async (nextStatus: string) => {
    if (nextStatus === status || saving) return;

    const previous = status;
    setStatus(nextStatus);
    setSaving(true);
    setMessage('Kaydediliyor...');

    try {
      const response = await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) throw new Error('Randevu durumu kaydedilemedi.');
      setMessage('Kaydedildi');
      router.refresh();
      window.setTimeout(() => setMessage(''), 2200);
    } catch (error) {
      setStatus(previous);
      setMessage(error instanceof Error ? error.message : 'Randevu durumu kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-w-[220px] space-y-2">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${appointmentStatusTone(status)}`}>
        {appointmentStatusLabel(status)}
      </span>
      <select
        value={status}
        disabled={saving}
        onChange={(event) => updateStatus(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-slate-900 disabled:cursor-wait disabled:opacity-70"
      >
        {APPOINTMENT_STATUSES.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
      {message && (
        <p className={`text-xs font-semibold ${message === 'Kaydedildi' ? 'text-emerald-700' : message === 'Kaydediliyor...' ? 'text-slate-500' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
