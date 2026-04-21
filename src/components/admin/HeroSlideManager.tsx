'use client';

import { useState } from 'react';
import MediaBrowser from './MediaBrowser';

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSlideManagerProps {
  value: string;
  onChange: (value: string) => void;
  locale: string;
}

export default function HeroSlideManager({ value, onChange, locale }: HeroSlideManagerProps) {
  // Parse the existing JSON string or default to an empty array
  let initialSlides: HeroSlide[] = [];
  try {
    initialSlides = value ? JSON.parse(value) : [];
    if (!Array.isArray(initialSlides)) initialSlides = [];
  } catch (e) {
    initialSlides = [];
  }

  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [showMediaBrowser, setShowMediaBrowser] = useState<number | null>(null);

  const updateSlides = (newSlides: HeroSlide[]) => {
    setSlides(newSlides);
    onChange(JSON.stringify(newSlides));
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Math.random().toString(36).substring(2, 9),
      image: '',
      title: 'Yeni Slayt Başlığı',
      subtitle: 'Alt başlık metni...',
      buttonText: 'Hizmetlerimiz',
      buttonLink: `/${locale}/hizmetler`
    };
    updateSlides([...slides, newSlide]);
  };

  const removeSlide = (index: number) => {
    if (!confirm('Bu slaytı silmek istediğinize emin misiniz?')) return;
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    updateSlides(newSlides);
  };

  const updateSlideField = (index: number, field: keyof HeroSlide, val: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: val };
    updateSlides(newSlides);
  };

  const handleMediaSelect = (url: string) => {
    if (showMediaBrowser !== null) {
      updateSlideField(showMediaBrowser, 'image', url);
    }
    setShowMediaBrowser(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {slides.map((slide, index) => (
        <div key={slide.id} style={{ background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>Slayt {index + 1}</h3>
            <button 
              onClick={() => removeSlide(index)}
              style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Sil
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Image Preview & Selector */}
            <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ 
                width: '100%', height: '120px', background: '#eee', borderRadius: '6px', 
                border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative'
              }}>
                {slide.image ? (
                  <img src={slide.image} alt="Slide Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#999', fontSize: '12px' }}>Resim Yok</span>
                )}
              </div>
              <button 
                onClick={() => setShowMediaBrowser(index)}
                style={{ background: '#333', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Görsel Seç / Değiştir
              </button>
            </div>

            {/* Content Fields */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '250px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Başlık (Title)</label>
                <input 
                  type="text" 
                  value={slide.title} 
                  onChange={(e) => updateSlideField(index, 'title', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Alt Başlık (Subtitle)</label>
                <input 
                  type="text" 
                  value={slide.subtitle} 
                  onChange={(e) => updateSlideField(index, 'subtitle', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Buton Metni</label>
                  <input 
                    type="text" 
                    value={slide.buttonText} 
                    onChange={(e) => updateSlideField(index, 'buttonText', e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Buton Linki</label>
                  <input 
                    type="text" 
                    value={slide.buttonLink} 
                    onChange={(e) => updateSlideField(index, 'buttonLink', e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length === 0 && (
        <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', border: '1px dashed #ccc', borderRadius: '8px', color: '#666' }}>
          Henüz bu dil için slayt eklenmedi.
        </div>
      )}

      <button 
        onClick={addSlide}
        style={{ background: 'var(--color-gold)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start' }}
      >
        + Yeni Slayt Ekle
      </button>

      {/* Media Browser Modal */}
      {showMediaBrowser !== null && (
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
              onClick={() => setShowMediaBrowser(null)}
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
