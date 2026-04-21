'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { saveTranslations } from '@/app/admin/blocks/[id]/actions';

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
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          {activeTab.toUpperCase()} Dili İçin İçerik
        </label>
        
        {/* We mount the editor for the active tab */}
        <RichTextEditor 
          value={translations[activeTab] || ''} 
          onChange={(val) => setTranslations(prev => ({ ...prev, [activeTab]: val }))} 
        />
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
