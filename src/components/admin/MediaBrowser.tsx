'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { OLD_SITE_MEDIA } from '@/lib/old-site-media';

export default function MediaBrowser({ onSelect }: { onSelect?: (url: string) => void }) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from('media').list();
    if (error) {
      setError(error.message);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage.from('media').upload(filePath, file);
    
    if (error) {
      setError(error.message);
    } else {
      await fetchFiles();
    }
    setUploading(false);
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>, oldFileName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    const file = e.target.files[0];

    const { error } = await supabase.storage.from('media').upload(oldFileName, file, { upsert: true });
    
    if (error) {
      setError(error.message);
    } else {
      await fetchFiles();
    }
    setUploading(false);
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Bu dosyayı silmek istediğinize emin misiniz?')) return;
    
    const { error } = await supabase.storage.from('media').remove([fileName]);
    if (error) {
      alert(error.message);
    } else {
      await fetchFiles();
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL Kopyalandı!');
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Medya Galerisi</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
            Supabase dosyaları ve eski siteden taşınan görseller.
          </p>
        </div>
        <div>
          <label style={{
            background: '#000', color: '#fff', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'inline-block'
          }}>
            {uploading ? 'Yükleniyor...' : '+ Yeni Dosya Yükle'}
            <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 12px', letterSpacing: '.08em', textTransform: 'uppercase' }}>Supabase Medya</h3>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {files.filter(f => f.name !== '.emptyFolderPlaceholder').map((file) => {
              const url = getPublicUrl(file.name);
              const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
              return (
                <div key={file.name} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '150px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {isImage ? (
                      <Image src={url} alt={file.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <span style={{ color: '#999' }}>{file.name.split('.').pop()?.toUpperCase()} Dosyası</span>
                    )}
                  </div>
                  <div style={{ padding: '10px', fontSize: '12px', background: '#fff', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold' }}>{file.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: 'auto', paddingTop: '10px' }}>
                      <button onClick={() => copyToClipboard(url)} style={{ flex: 1, background: '#f1f2f6', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>URL Kopyala</button>
                      {onSelect && (
                        <button onClick={() => onSelect(url)} style={{ flex: 1, background: '#2ed573', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>Seç</button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <label style={{ flex: 1, background: '#eccc68', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center', display: 'block' }}>
                        Değiştir
                        <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => handleReplace(e, file.name)} disabled={uploading} />
                      </label>
                      <button onClick={() => handleDelete(file.name)} style={{ flex: 1, background: '#ff4757', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {files.length === 0 && <p style={{ gridColumn: '1 / -1', color: '#999' }}>Supabase içinde dosya bulunamadı.</p>}
          </div>
        )}
      </section>

      <section>
        <h3 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 12px', letterSpacing: '.08em', textTransform: 'uppercase' }}>Eski Site Görselleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {OLD_SITE_MEDIA.map((item) => (
            <div key={item.url} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <div style={{ height: '150px', background: '#f8fafc', position: 'relative' }}>
                <Image src={item.url} alt={item.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px', fontSize: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{item.name}</div>
                <div style={{ color: '#b8893c', fontWeight: 700 }}>{item.category}</div>
                <div title={item.source} style={{ color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.source}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: 'auto', paddingTop: '10px' }}>
                  <button onClick={() => copyToClipboard(item.url)} style={{ flex: 1, background: '#f1f2f6', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>URL Kopyala</button>
                  {onSelect && (
                    <button onClick={() => onSelect(item.url)} style={{ flex: 1, background: '#2ed573', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>Seç</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
