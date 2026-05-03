import prisma from '@/lib/prisma';
import { toggleMaintenance } from './actions';

export default async function AdminDashboard() {

  // Fetch maintenance mode
  const maintenanceSetting = await prisma.setting.findUnique({
    where: { key: 'maintenance_mode' }
  });

  let isMaintenanceActive = false;
  try {
    if (maintenanceSetting?.value) {
      const parsed = JSON.parse(maintenanceSetting.value);
      isMaintenanceActive = parsed.isActive === true;
    }
  } catch (e) { /* ignore */ }

  // Stats — parallel fetch
  const [
    pageCount,
    blogCount,
    serviceCount,
    faqCount,
    testimonialCount,
    pendingTestimonials,
    beforeAfterCount,
    publicBeforeAfter,
    redirectCount,
    pendingAppointments,
    recentAppointments,
  ] = await Promise.allSettled([
    prisma.page.count(),
    prisma.page.count({ where: { type: 'BLOG' } }),
    prisma.service.count(),
    prisma.faq.count({ where: { pageId: null } }),
    prisma.testimonial.count({ where: { approved: true } }),
    prisma.testimonial.count({ where: { approved: false } }),
    prisma.beforeAfter.count(),
    prisma.beforeAfter.count({ where: { isPublic: true, consent: true } }),
    prisma.redirect.count(),
    prisma.appointments.count({ where: { status: { in: ['pending', 'pending_confirmation'] } } }),
    prisma.appointments.findMany({
      where: { status: { in: ['pending', 'pending_confirmation', 'confirmed'] } },
      orderBy: { created_at: 'desc' },
      take: 8,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        service_requested: true,
        status: true,
        scheduled_date: true,
        start_time: true,
        created_at: true,
        locale: true,
      },
    }),
  ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : (Array.isArray((r as any).value) ? [] : 0)));

  const appointments = recentAppointments as Array<{
    id: string; name: string; phone: string; email: string | null;
    service_requested: string | null; status: string | null;
    scheduled_date: Date | null; start_time: string | null;
    created_at: Date | null; locale: string | null;
  }>;

  const stats = [
    { label: 'Toplam Sayfa', value: pageCount, icon: '▥', href: '/admin/icerikler', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    { label: 'Blog Yazısı', value: blogCount, icon: '✍', href: '/admin/icerikler', color: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
    { label: 'Hizmet', value: serviceCount, icon: '⊕', href: '/admin/icerikler', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
    { label: 'SSS', value: faqCount, icon: '❓', href: '/admin/sss', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    { label: 'Yorum (Onaylı)', value: testimonialCount, icon: '★', href: '/admin/yorumlar', color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    { label: 'Yorum Bekliyor', value: pendingTestimonials, icon: '⏳', href: '/admin/yorumlar', color: (pendingTestimonials as number) > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200', text: (pendingTestimonials as number) > 0 ? 'text-red-700' : 'text-gray-500' },
    { label: 'Önce/Sonra (Yayında)', value: `${publicBeforeAfter}/${beforeAfterCount}`, icon: '⊞', href: '/admin/once-sonra', color: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
    { label: 'Yönlendirme', value: redirectCount, icon: '↪', href: '/admin/redirectler', color: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
  ];

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: 'Bekliyor', color: 'bg-amber-100 text-amber-800' },
    pending_confirmation: { label: 'Onay bekleniyor', color: 'bg-orange-100 text-orange-800' },
    confirmed: { label: 'Onaylandı', color: 'bg-emerald-100 text-emerald-800' },
    cancelled: { label: 'İptal', color: 'bg-red-100 text-red-700' },
    completed: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1410] tracking-tight">Dashboard Özeti</h1>
        <p className="text-[#7a6a52] text-sm mt-1">Gökçe Özel yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Pending appointments — prominent top section */}
      <div className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="font-bold text-[#1a1410] text-[16px]">Randevu &amp; İletişim Talepleri</h2>
              <p className="text-[12px] text-[#7a6a52]">Son aktif randevular — onay bekleyenler dahil</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(pendingAppointments as number) > 0 && (
              <span className="bg-red-500 text-white text-[12px] font-bold px-3 py-1 rounded-full">
                {pendingAppointments as number} bekliyor
              </span>
            )}
            <a href="/admin/rezervasyonlar" className="bg-[#1a1410] text-white text-[12px] font-semibold px-4 py-2 rounded-lg hover:bg-[#315a52] transition-colors">
              Tümünü gör →
            </a>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="px-6 py-10 text-center text-[#9a8f7c] text-[14px]">Henüz randevu talebi yok.</div>
        ) : (
          <div className="divide-y divide-[#f0ebe2]">
            {appointments.map((apt) => {
              const s = statusLabel[apt.status || 'pending'] || { label: apt.status || '-', color: 'bg-gray-100 text-gray-700' };
              return (
                <div key={apt.id} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-[#fdf9f3] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1a1410] text-[14px]">{apt.name}</span>
                      {apt.locale && apt.locale !== 'tr' && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-medium uppercase">{apt.locale}</span>
                      )}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[12px] text-[#7a6a52]">
                      <a href={`tel:${apt.phone}`} className="hover:text-[#1a1410]">{apt.phone}</a>
                      {apt.email && <a href={`mailto:${apt.email}`} className="hover:text-[#1a1410] truncate max-w-[200px]">{apt.email}</a>}
                      {apt.service_requested && <span className="text-[#b8893c]">{apt.service_requested}</span>}
                    </div>
                  </div>
                  <div className="text-right text-[12px] text-[#9a8f7c] whitespace-nowrap flex-shrink-0">
                    {apt.scheduled_date && (
                      <div className="font-medium text-[#1a1410]">
                        {new Date(apt.scheduled_date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {apt.start_time && ` ${apt.start_time}`}
                      </div>
                    )}
                    {apt.created_at && (
                      <div>{new Date(apt.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} talep edildi</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <a
            key={stat.label}
            href={stat.href}
            className={`border rounded-xl p-4 flex flex-col gap-1 hover:shadow-md transition-shadow ${stat.color}`}
          >
            <div className="text-2xl">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
            <div className="text-[12px] text-[#7a6a52] font-medium">{stat.label}</div>
          </a>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/rezervasyonlar" className="bg-white border border-[#e8e2d6] rounded-xl p-5 hover:border-[#b8893c]/40 hover:shadow-sm transition-all group">
          <div className="text-xl mb-2">📅</div>
          <h3 className="font-bold text-[#1a1410] text-[14px] group-hover:text-[#b8893c] transition-colors">Randevular</h3>
          <p className="text-[12px] text-[#9a8f7c] mt-1">Tüm randevu ve iletişim taleplerini yönet</p>
        </a>
        <a href="/admin/icerikler" className="bg-white border border-[#e8e2d6] rounded-xl p-5 hover:border-[#b8893c]/40 hover:shadow-sm transition-all group">
          <div className="text-xl mb-2">▥</div>
          <h3 className="font-bold text-[#1a1410] text-[14px] group-hover:text-[#b8893c] transition-colors">İçerik Düzenle</h3>
          <p className="text-[12px] text-[#9a8f7c] mt-1">Sayfalar, blog yazıları ve hizmetleri yönet</p>
        </a>
        <a href="/admin/once-sonra" className="bg-white border border-[#e8e2d6] rounded-xl p-5 hover:border-[#b8893c]/40 hover:shadow-sm transition-all group">
          <div className="text-xl mb-2">⊞</div>
          <h3 className="font-bold text-[#1a1410] text-[14px] group-hover:text-[#b8893c] transition-colors">Öncesi &amp; Sonrası</h3>
          <p className="text-[12px] text-[#9a8f7c] mt-1">Hasta görselleri — onay ve yayın yönetimi</p>
        </a>
      </div>

      {/* Bakım modu kartı */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8e2d6] p-6 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[#1a1410] flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Bakım Modu
          </h2>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isMaintenanceActive ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {isMaintenanceActive ? 'Aktif' : 'Kapalı'}
          </div>
        </div>
        <p className="text-[13px] text-[#7a6a52] mb-4">
          {isMaintenanceActive
            ? 'Şu an aktif. Ziyaretçiler sadece yapım aşamasında sayfasını görüyor.'
            : 'Şu an kapalı. Ziyaretçiler siteye sorunsuz erişiyor.'}
        </p>
        <form action={toggleMaintenance}>
          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-[13px] transition-all ${
              isMaintenanceActive
                ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isMaintenanceActive ? 'Bakım Modunu Kapat' : 'Bakım Moduna Al'}
          </button>
        </form>
      </div>
    </div>
  );
}
