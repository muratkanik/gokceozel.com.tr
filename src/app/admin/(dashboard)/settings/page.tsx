import prisma from '@/lib/prisma';
import { saveSetting, deleteSetting } from './actions';

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany({
    orderBy: { key: 'asc' }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#111' }}>Ayarlar Yönetimi</h1>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Yeni Ayar Ekle</h2>
        <form action={saveSetting} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Anahtar (Key)</label>
            <input type="text" name="key" required placeholder="örn: contact_email" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Değer (Value - JSON veya Metin)</label>
            <textarea name="value" required placeholder="Değer..." rows={1} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}></textarea>
          </div>
          <div style={{ paddingTop: '25px' }}>
            <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
              Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Global SEO Settings */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Global SEO Ayarları</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <tbody>
            {['seo_meta_title', 'seo_meta_description', 'seo_meta_keywords'].map(key => {
              const setting = settings.find(s => s.key === key);
              return (
                <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 10px', fontWeight: 'bold', width: '200px' }}>{key}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <form action={saveSetting} style={{ display: 'flex', gap: '10px' }}>
                      <input type="hidden" name="key" value={key} />
                      <input type="text" name="value" defaultValue={setting?.value || ''} placeholder={key.replace(/_/g, ' ')} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <button type="submit" style={{ background: '#2ed573', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Kaydet</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Multi-Language Settings */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Aktif Diller (Multi-Language)</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {['tr', 'en', 'de', 'ar', 'fr', 'ru'].map(lang => {
            const key = `lang_${lang}_active`;
            const setting = settings.find(s => s.key === key);
            const isActive = setting?.value === 'true';
            
            return (
              <form key={lang} action={saveSetting} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '100px' }}>
                <strong style={{ textTransform: 'uppercase' }}>{lang}</strong>
                <span style={{ fontSize: '12px', color: isActive ? '#2ed573' : '#ff4757' }}>
                  {isActive ? 'Aktif' : 'Pasif'}
                </span>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="value" value={isActive ? 'false' : 'true'} />
                <button type="submit" style={{ background: isActive ? '#ff4757' : '#000', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  {isActive ? 'Kapat' : 'Aç'}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#333' }}>Diğer Tüm Ayarlar</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px 10px', color: '#666' }}>Anahtar</th>
              <th style={{ padding: '15px 10px', color: '#666' }}>Değer</th>
              <th style={{ padding: '15px 10px', color: '#666', width: '150px' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.key} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{setting.key}</td>
                <td style={{ padding: '15px 10px' }}>
                  <form action={saveSetting} style={{ display: 'flex', gap: '10px' }}>
                    <input type="hidden" name="key" value={setting.key} />
                    <input type="text" name="value" defaultValue={setting.value} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    <button type="submit" style={{ background: '#2ed573', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Güncelle</button>
                  </form>
                </td>
                <td style={{ padding: '15px 10px' }}>
                  {setting.key !== 'maintenance_mode' && (
                    <form action={deleteSetting}>
                      <input type="hidden" name="key" value={setting.key} />
                      <button type="submit" style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {settings.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Henüz ayar bulunmuyor.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
