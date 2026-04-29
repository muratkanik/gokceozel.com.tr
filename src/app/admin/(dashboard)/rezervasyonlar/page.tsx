import prisma from '@/lib/prisma';
import { getReservationSettings } from '@/lib/reservations';
import {
  PENDING_APPOINTMENT_STATUSES,
} from '@/lib/appointment-status';
import AdminSubmitButton from '@/components/admin/AdminSubmitButton';
import AdminAppointmentStatusSelect from '@/components/admin/AdminAppointmentStatusSelect';
import ReservationSettingsForm from '@/components/admin/ReservationSettingsForm';
import { createBlackout, deleteBlackout } from './actions';
import SettingsSection from './SettingsSection';

export const dynamic = 'force-dynamic';

function toSettingsValue(settings: Awaited<ReturnType<typeof getReservationSettings>>) {
  return {
    isEnabled: settings.isEnabled,
    workingDays: settings.workingDays,
    dayStart: settings.dayStart,
    dayEnd: settings.dayEnd,
    slotMinutes: settings.slotMinutes,
    bufferMinutes: settings.bufferMinutes,
    maxPerSlot: settings.maxPerSlot,
    minNoticeHours: settings.minNoticeHours,
    bookingHorizonDays: settings.bookingHorizonDays,
  };
}

export default async function ReservationAdminPage() {
  const [settings, reservations, blackouts] = await Promise.all([
    getReservationSettings(),
    prisma.appointments.findMany({
      orderBy: [{ scheduled_date: 'desc' }, { start_time: 'asc' }, { created_at: 'desc' }],
      take: 160,
    }),
    prisma.reservationBlackout.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      take: 80,
    }),
  ]);

  const upcoming = reservations.filter((item) => item.scheduled_date && (PENDING_APPOINTMENT_STATUSES.has(item.status || 'pending') || item.status === 'confirmed')).length;

  return (
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Randevu Yönetimi</h1>
        <p className="text-slate-500 mt-1">Çalışma günleri, saat aralıkları, kapalı özel tarihler ve hasta randevuları.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Toplam Randevu" value={String(reservations.length)} />
        <StatCard label="Aktif Bekleyen" value={String(upcoming)} />
        <StatCard label="Kapalı Tarih" value={String(blackouts.length)} />
      </div>

      <SettingsSection>
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <ReservationSettingsForm settings={toSettingsValue(settings)} />

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Kapalı özel tarihler</h2>
            <form
              action={createBlackout}
              data-pending-message="Kapalı tarih ekleniyor..."
              data-success-message="Kapalı tarih başarıyla eklendi."
              className="mb-4 grid gap-3"
            >
              <Field label="Tarih" name="date" type="date" />
              <input name="reason" placeholder="Açıklama: Resmi tatil, kongre, izin..." className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input type="checkbox" name="isFullDay" defaultChecked />
                Tüm gün kapalı
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Kısmi başlangıç" name="startTime" type="time" />
                <Field label="Kısmi bitiş" name="endTime" type="time" />
              </div>
              <AdminSubmitButton className="rounded-lg bg-[#b8893c] px-4 py-2.5 text-sm font-bold text-white" pendingText="Ekleniyor...">
                Kapalı tarih ekle
              </AdminSubmitButton>
            </form>
            <div className="divide-y divide-slate-100">
              {blackouts.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{formatDate(item.date)}</div>
                    <div className="text-slate-500">{item.isFullDay ? 'Tüm gün' : `${item.startTime || '-'} - ${item.endTime || '-'}`} · {item.reason || 'Kapalı'}</div>
                  </div>
                  <form action={deleteBlackout} data-pending-message="Kapalı tarih siliniyor..." data-success-message="Kapalı tarih silindi.">
                    <input type="hidden" name="id" value={item.id} />
                    <AdminSubmitButton className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50" pendingText="Siliniyor...">
                      Sil
                    </AdminSubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </section>
        </section>
      </SettingsSection>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">Hasta randevuları</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Tarih/Saat</th>
                <th className="px-5 py-3">Hasta</th>
                <th className="px-5 py-3">İletişim</th>
                <th className="px-5 py-3">Hizmet</th>
                <th className="px-5 py-3">Not</th>
                <th className="px-5 py-3">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((item) => (
                <tr key={item.id} className={`align-top hover:bg-slate-50 ${PENDING_APPOINTMENT_STATUSES.has(item.status || 'pending') ? 'bg-amber-50/50' : ''}`}>
                  <td className="px-5 py-4 font-semibold text-slate-900">{item.scheduled_date ? formatDate(item.scheduled_date) : '-'}<br /><span className="text-xs text-slate-500">{item.start_time || '-'} - {item.end_time || '-'}</span></td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-5 py-4 text-slate-600"><a href={`tel:${item.phone}`}>{item.phone}</a>{item.email && <><br /><a href={`mailto:${item.email}`}>{item.email}</a></>}</td>
                  <td className="px-5 py-4 text-slate-600">{item.service_requested || '-'}</td>
                  <td className="max-w-sm px-5 py-4 text-slate-600"><div className="line-clamp-4 whitespace-pre-wrap">{item.message || item.patient_note || '-'}</div></td>
                  <td className="px-5 py-4">
                    <AdminAppointmentStatusSelect id={item.id} initialStatus={item.status || 'pending'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type, defaultValue }: { label: string; name: string; type: string; defaultValue?: string | number }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeZone: 'Europe/Istanbul' }).format(date);
}
