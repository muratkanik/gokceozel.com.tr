import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Fetch maintenance mode
  const { data: maintenanceData } = await supabase
    .from('content_entries')
    .select('translations')
    .eq('slug', 'maintenance_mode')
    .single();

  const isMaintenanceActive = maintenanceData?.translations?.is_active === true;

  const toggleMaintenance = async (formData: FormData) => {
    'use server';
    const supabase = await createClient();
    
    const { data } = await supabase
      .from('content_entries')
      .select('translations')
      .eq('slug', 'maintenance_mode')
      .single();
      
    const currentStatus = data?.translations?.is_active === true;
    
    await supabase
      .from('content_entries')
      .update({
        translations: {
          is_active: !currentStatus
        }
      })
      .eq('slug', 'maintenance_mode');
      
    revalidatePath('/', 'layout');
    revalidatePath('/admin');
  };

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
