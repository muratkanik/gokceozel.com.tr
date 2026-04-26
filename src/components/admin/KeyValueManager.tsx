'use client';

import { useState, useEffect } from 'react';

interface KeyValueManagerProps {
  value: string;
  onChange: (value: string) => void;
  locale: string;
}

export default function KeyValueManager({ value, onChange, locale }: KeyValueManagerProps) {
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const parsed = JSON.parse(value || '{}');
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        setData(parsed);
      } else {
        setData({});
      }
    } catch (e) {
      setData({});
    }
  }, [value]);

  const updateField = (key: string, newValue: string) => {
    const updated = { ...data, [key]: newValue };
    setData(updated);
    onChange(JSON.stringify(updated, null, 2));
  };

  const addField = () => {
    const key = window.prompt('Yeni alan için bir anahtar (key) girin (Örn: nav_home, footer_desc):');
    if (key && key.trim() !== '') {
      if (data[key]) {
        alert('Bu anahtar zaten var!');
        return;
      }
      updateField(key.trim(), '');
    }
  };

  const removeField = (key: string) => {
    if (confirm(`"${key}" alanını silmek istediğinize emin misiniz?`)) {
      const updated = { ...data };
      delete updated[key];
      setData(updated);
      onChange(JSON.stringify(updated, null, 2));
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).length === 0 ? (
        <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
          <p className="text-slate-500 mb-4">Henüz hiç çeviri alanı eklenmemiş.</p>
          <button 
            onClick={addField}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            + Yeni Alan Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <button 
              onClick={addField}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-100"
            >
              + Alan Ekle
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(data).map(([key, val]) => (
              <div key={key} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex gap-4">
                <div className="w-1/4 pt-2">
                  <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    {key}
                  </span>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={val}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={2}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-transparent outline-none resize-y min-h-[60px]"
                    placeholder={`${key} için çeviri metni...`}
                  />
                </div>
                <div>
                  <button 
                    onClick={() => removeField(key)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Alanı Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
