export const APPOINTMENT_STATUSES = [
  { value: 'pending_confirmation', label: 'E-posta onayı bekliyor', action: 'E-posta onayı bekliyor yap' },
  { value: 'pending', label: 'Yeni talep', action: 'Yeni talep yap' },
  { value: 'confirmed', label: 'Onaylandı', action: 'Onayla' },
  { value: 'completed', label: 'Tamamlandı', action: 'Tamamlandı yap' },
  { value: 'cancelled', label: 'İptal edildi', action: 'İptal et' },
  { value: 'no_show', label: 'Gelmedi', action: 'Gelmedi yap' },
] as const;

export const APPOINTMENT_STATUS_VALUES = APPOINTMENT_STATUSES.map((status) => status.value);
export const PENDING_APPOINTMENT_STATUSES = new Set(['pending_confirmation', 'pending']);

export function appointmentStatusLabel(status: string | null | undefined) {
  return APPOINTMENT_STATUSES.find((item) => item.value === status)?.label || 'Durum bilinmiyor';
}

export function appointmentStatusTone(status: string | null | undefined) {
  if (status === 'confirmed') return 'bg-emerald-50 text-emerald-700';
  if (status === 'completed') return 'bg-slate-100 text-slate-700';
  if (status === 'cancelled' || status === 'no_show') return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
}
