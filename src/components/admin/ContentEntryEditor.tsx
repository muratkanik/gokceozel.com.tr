'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface ContentEntryData {
  title: string;
  content: string;
  image?: string;
  [key: string]: any;
}

interface ContentEntryEditorProps {
  initialData: Record<string, ContentEntryData>;
  locales: string[];
  onSave: (data: Record<string, ContentEntryData>) => Promise<void>;
}

export default function ContentEntryEditor({ initialData, locales, onSave }: ContentEntryEditorProps) {
  const [activeTab, setActiveTab] = useState<string>(locales[0]);
  const [data, setData] = useState<Record<string, ContentEntryData>>(initialData);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (locale: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [locale]: {
        ...(prev[locale] || { title: '', content: '' }),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
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
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
          <input 
            type="text" 
            value={data[activeTab]?.title || ''}
            onChange={(e) => handleFieldChange(activeTab, 'title', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none transition-all"
            placeholder={`${activeTab.toUpperCase()} dili için başlık girin...`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (Metin)</label>
          <RichTextEditor 
            value={data[activeTab]?.content || ''}
            onChange={(val) => handleFieldChange(activeTab, 'content', val)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? '#ccc' : 'var(--color-gold)',
            color: '#000',
            border: 'none',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

    </div>
  );
}
