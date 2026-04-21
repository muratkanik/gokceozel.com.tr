'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import SeoScoreBadge from './SeoScoreBadge';
import { saveTranslations } from '@/app/admin/(dashboard)/blocks/[id]/actions';

interface TranslationEditorProps {
  blockId: string;
  initialTranslations: Record<string, string>;
  locales: string[];
}

export default function TranslationEditor({ blockId, initialTranslations, locales }: TranslationEditorProps) {
  const [activeTab, setActiveTab] = useState<string>(locales[0]);
  const [translations, setTranslations] = useState<Record<string, string>>(initialTranslations);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTranslations(blockId, translations);
      alert('Değişiklikler başarıyla kaydedildi!');
    } catch (e) {
      alert('Kaydedilirken bir hata oluştu.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
        {locales.map(loc => (
          <button
            key={loc}
            onClick={() => setActiveTab(loc)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              fontSize: '1rem',
              fontWeight: activeTab === loc ? 'bold' : 'normal',
              color: activeTab === loc ? 'var(--color-gold)' : '#666',
              borderBottom: activeTab === loc ? '3px solid var(--color-gold)' : '3px solid transparent',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>
            {activeTab.toUpperCase()} Dili İçin İçerik
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={async () => {
                const currentHtml = translations[activeTab] || '';
                if (!currentHtml || currentHtml.trim() === '') {
                  alert('Önce çevrilecek bir içerik olmalı! (Başka bir dildeki içeriği buraya yapıştırabilir veya sıfırdan oluşturabilirsiniz)');
                  return;
                }
                
                const oldVal = currentHtml;
                setTranslations(prev => ({ ...prev, [activeTab]: '<p><em>✨ Yapay zeka içeriği çeviriyor, lütfen bekleyin...</em></p>' }));
                
                try {
                  const res = await fetch('/api/ai/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      prompt: `Lütfen verilen HTML içeriğini ${activeTab.toUpperCase()} diline profesyonel bir şekilde çevir. Sadece çevrilmiş HTML'i döndür.`, 
                      currentHtml: oldVal, 
                      locale: activeTab 
                    })
                  });
                  
                  const data = await res.json();
                  if (data.error) throw new Error(data.error);
                  
                  setTranslations(prev => ({ ...prev, [activeTab]: data.content }));
                } catch (e: any) {
                  alert('AI Çevirisi başarısız oldu: ' + e.message);
                  setTranslations(prev => ({ ...prev, [activeTab]: oldVal }));
                }
              }}
              style={{
                background: '#ff9ff3',
                color: '#fff',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🌍 AI Çeviri
            </button>

            <button 
              type="button"
              onClick={async () => {
                const prompt = window.prompt('Ne hakkında bir içerik üretmek istiyorsunuz? (Örn: Endolift tedavisinin faydaları hakkında 300 kelimelik SEO uyumlu makale)');
                if (!prompt) return;
                
                const currentHtml = translations[activeTab] || '';
                const oldVal = currentHtml;
                setTranslations(prev => ({ ...prev, [activeTab]: '<p><em>✨ Yapay zeka içerik üretiyor, lütfen bekleyin...</em></p>' }));
                
                try {
                  const res = await fetch('/api/ai/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, currentHtml, locale: activeTab })
                  });
                  
                  const data = await res.json();
                  if (data.error) throw new Error(data.error);
                  
                  setTranslations(prev => ({ ...prev, [activeTab]: data.content }));
                } catch (e: any) {
                  alert('AI Üretimi başarısız oldu: ' + e.message);
                  setTranslations(prev => ({ ...prev, [activeTab]: oldVal }));
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                color: '#fff',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ✨ AI ile Oluştur
            </button>
          </div>
        </div>
        
        {/* We mount the editor for the active tab */}
        <RichTextEditor 
          value={translations[activeTab] || ''} 
          onChange={(val) => setTranslations(prev => ({ ...prev, [activeTab]: val }))} 
        />
        
        {/* SEO Score Helper */}
        <SeoScoreBadge content={translations[activeTab] || ''} />
      </div>

      {/* Save Button */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'right' }}>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ 
            background: '#000', 
            color: '#fff', 
            border: 'none', 
            padding: '12px 25px', 
            borderRadius: '6px', 
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

    </div>
  );
}
