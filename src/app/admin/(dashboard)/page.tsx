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
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#111' }}>Dashboard Özeti</h1>
      
      <div style={{
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        maxWidth: '600px'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Site Durumu</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: '#111' }}>Bakım Modu (Yapım Aşamasında)</strong>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {isMaintenanceActive 
                ? 'Şu an aktif. Ziyaretçiler sadece bakım sayfasını görüyor.' 
                : 'Şu an kapalı. Ziyaretçiler ana siteyi görüyor.'}
            </span>
          </div>
          
          <form action={toggleMaintenance}>
            <button type="submit" style={{
              background: isMaintenanceActive ? '#ff4757' : '#2ed573',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '120px'
            }}>
              {isMaintenanceActive ? 'KAPAT' : 'AÇ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
