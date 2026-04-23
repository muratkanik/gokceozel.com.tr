'use client';

import { useState } from 'react';
import MediaBrowser from './MediaBrowser';
import RichTextEditor from './RichTextEditor';

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface BiographyData {
  image: string;
  title: string;
  subtitle: string;
  about: string;
  timeline: TimelineItem[];
}

interface BiographyManagerProps {
  value: string;
  onChange: (value: string) => void;
  locale: string;
}

const defaultData: BiographyData = {
  image: '',
  title: 'Prof. Dr. Gökçe Özel',
  subtitle: 'KBB ve Yüz Plastik Cerrahi Uzmanı',
  about: '',
  timeline: []
};

export default function BiographyManager({ value, onChange, locale }: BiographyManagerProps) {
  let initialData: BiographyData = defaultData;
  try {
    if (value && value.trim() !== '') {
      initialData = { ...defaultData, ...JSON.parse(value) };
    }
  } catch (e) {
    initialData = defaultData;
  }

  const [data, setData] = useState<BiographyData>(initialData);
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);

  const updateData = (newData: BiographyData) => {
    setData(newData);
    onChange(JSON.stringify(newData));
  };

  const updateField = (field: keyof BiographyData, val: any) => {
    updateData({ ...data, [field]: val });
  };

  const handleMediaSelect = (url: string) => {
    updateField('image', url);
    setShowMediaBrowser(false);
  };

  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: Math.random().toString(36).substring(2, 9),
      year: '2023',
      title: 'Yeni Deneyim / Eğitim',
      description: 'Detaylı açıklama...'
    };
    updateField('timeline', [...data.timeline, newItem]);
  };

  const removeTimelineItem = (index: number) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    const newTimeline = [...data.timeline];
    newTimeline.splice(index, 1);
    updateField('timeline', newTimeline);
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, val: string) => {
    const newTimeline = [...data.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: val };
    updateField('timeline', newTimeline);
  };

  // Move item up or down in the array
  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.timeline.length - 1) return;
    
    const newTimeline = [...data.timeline];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newTimeline[index];
    newTimeline[index] = newTimeline[targetIndex];
    newTimeline[targetIndex] = temp;
    
    updateField('timeline', newTimeline);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Basic Info Section */}
      <div style={{ background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#333' }}>Temel Bilgiler</h3>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Profile Image */}
          <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Profil Görseli</label>
            <div style={{ 
              width: '100%', height: '250px', background: '#eee', borderRadius: '6px', 
              border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative'
            }}>
              {data.image ? (
                <img src={data.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#999', fontSize: '12px' }}>Görsel Yok</span>
              )}
            </div>
            <button 
              onClick={() => setShowMediaBrowser(true)}
              style={{ background: '#333', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Görsel Seç / Değiştir
            </button>
          </div>

          {/* Titles */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '250px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>İsim Soyisim</label>
              <input 
                type="text" 
                value={data.title} 
                onChange={(e) => updateField('title', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Ünvan / Alt Başlık</label>
              <input 
                type="text" 
                value={data.subtitle} 
                onChange={(e) => updateField('subtitle', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* About (Rich Text) */}
      <div style={{ background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#333' }}>Hakkında (Zengin Metin)</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Özgeçmişin ana metnini bu alana yazabilirsiniz.</p>
        <div style={{ background: '#fff' }}>
          <RichTextEditor 
            value={data.about}
            onChange={(val) => updateField('about', val)}
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Zaman Çizelgesi (Eğitim & Deneyim)</h3>
          <button 
            onClick={addTimelineItem}
            style={{ background: 'var(--color-gold)', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Yeni Kayıt Ekle
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {data.timeline.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', gap: '15px', background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '6px' }}>
              
              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' }}>
                <button 
                  onClick={() => moveTimelineItem(index, 'up')} disabled={index === 0}
                  style={{ background: '#f1f2f6', border: 'none', padding: '5px', cursor: index === 0 ? 'not-allowed' : 'pointer', borderRadius: '4px', opacity: index === 0 ? 0.5 : 1 }}
                >
                  ↑
                </button>
                <button 
                  onClick={() => moveTimelineItem(index, 'down')} disabled={index === data.timeline.length - 1}
                  style={{ background: '#f1f2f6', border: 'none', padding: '5px', cursor: index === data.timeline.length - 1 ? 'not-allowed' : 'pointer', borderRadius: '4px', opacity: index === data.timeline.length - 1 ? 0.5 : 1 }}
                >
                  ↓
                </button>
                <button 
                  onClick={() => removeTimelineItem(index)}
                  style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px', marginTop: '10px' }}
                >
                  Sil
                </button>
              </div>

              {/* Fields */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '120px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Yıl / Tarih</label>
                    <input 
                      type="text" 
                      value={item.year} 
                      onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                      placeholder="Örn: 2020 - 2023"
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Başlık</label>
                    <input 
                      type="text" 
                      value={item.title} 
                      onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                      placeholder="Örn: KBB Uzmanlığı"
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Açıklama</label>
                  <textarea 
                    value={item.description} 
                    onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                    placeholder="Detaylı açıklama..."
                    rows={2}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', resize: 'vertical' }}
                  />
                </div>
              </div>

            </div>
          ))}

          {data.timeline.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '13px' }}>
              Henüz zaman çizelgesine kayıt eklenmemiş.
            </div>
          )}
        </div>
      </div>

      {/* Media Browser Modal */}
      {showMediaBrowser && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
        }}>
          <div style={{ 
            background: '#fff', width: '100%', maxWidth: '1000px', maxHeight: '90vh', 
            borderRadius: '12px', overflowY: 'auto', position: 'relative', padding: '20px'
          }}>
            <button 
              onClick={() => setShowMediaBrowser(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#ff4757', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}
            >
              Kapat
            </button>
            <MediaBrowser onSelect={handleMediaSelect} />
          </div>
        </div>
      )}
    </div>
  );
}
