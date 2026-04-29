import prisma from '@/lib/prisma';
import { PENDING_APPOINTMENT_STATUSES, appointmentStatusLabel, appointmentStatusTone } from '@/lib/appointment-status';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const appointments = await prisma.appointments.findMany({
    orderBy: { created_at: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">İletişim Talepleri</h1>
        <p className="text-slate-500 mt-1">
          Web sitesindeki randevu formundan gelen talepler Supabase veritabanından listelenir.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Toplam Talep" value={appointments.length.toString()} />
        <StatCard
          label="Bekleyen"
          value={appointments.filter((item) => PENDING_APPOINTMENT_STATUSES.has(item.status || 'pending')).length.toString()}
        />
        <StatCard
          label="Son Talep"
          value={appointments[0]?.created_at ? formatDate(appointments[0].created_at) : '-'}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
              <th className="py-4 px-5 font-semibold">Hasta</th>
              <th className="py-4 px-5 font-semibold">İletişim</th>
              <th className="py-4 px-5 font-semibold">Hizmet</th>
              <th className="py-4 px-5 font-semibold">Mesaj</th>
              <th className="py-4 px-5 font-semibold">Durum</th>
              <th className="py-4 px-5 font-semibold">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top hover:bg-slate-50 transition-colors">
                <td className="py-4 px-5">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                </td>
                <td className="py-4 px-5 text-sm text-slate-600">
                  <a className="block hover:text-[#b8893c]" href={`tel:${item.phone}`}>{item.phone}</a>
                  {item.email && (
                    <a className="block hover:text-[#b8893c]" href={`mailto:${item.email}`}>{item.email}</a>
                  )}
                </td>
                <td className="py-4 px-5 text-sm text-slate-600">
                  {item.service_requested || '-'}
                </td>
                <td className="py-4 px-5 text-sm text-slate-600 max-w-md">
                  <div className="line-clamp-4 whitespace-pre-wrap">{item.message || '-'}</div>
                </td>
                <td className="py-4 px-5">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${appointmentStatusTone(item.status || 'pending')}`}>
                    {appointmentStatusLabel(item.status || 'pending')}
                  </span>
                </td>
                <td className="py-4 px-5 text-sm text-slate-500 whitespace-nowrap">
                  {item.created_at ? formatDate(item.created_at) : '-'}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  Henüz iletişim talebi yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Istanbul',
  }).format(date);
}
