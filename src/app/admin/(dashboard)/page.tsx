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
  } catch (e) {
    // ignore parse error
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Özeti</h1>
        <p className="text-slate-500 mt-1">Gökçe Özel yönetim paneline hoş geldiniz. Sitenizin genel durumunu buradan takip edebilirsiniz.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bakım Modu Kartı */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Bakım Modu
              </h2>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isMaintenanceActive ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isMaintenanceActive ? 'Aktif' : 'Kapalı'}
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              {isMaintenanceActive 
                ? 'Şu an aktif. Ziyaretçiler sadece yapım aşamasında sayfasını görüyor, siteye erişemiyor.' 
                : 'Şu an kapalı. Ziyaretçiler ana siteyi sorunsuz bir şekilde görüntüleyebiliyor.'}
            </p>
          </div>
          
          <form action={toggleMaintenance}>
            <button type="submit" className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all shadow-sm ${
              isMaintenanceActive 
                ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50' 
                : 'bg-emerald-600 border border-transparent text-white hover:bg-emerald-700'
            }`}>
              {isMaintenanceActive ? 'Bakım Modunu Kapat' : 'Bakım Moduna Al'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
