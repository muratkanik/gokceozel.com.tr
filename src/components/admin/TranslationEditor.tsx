'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import SeoScoreBadge from './SeoScoreBadge';
import HeroSlideManager, { HeroSlide } from './HeroSlideManager';
import KeyValueManager from './KeyValueManager';
import { saveTranslations } from '@/components/admin/actions';

interface TranslationEditorProps {
  blockId: string;
  componentType?: string;
  initialTranslations: Record<string, string>;
  locales: string[];
}

export default function TranslationEditor({ blockId, componentType = 'text_block', initialTranslations, locales }: TranslationEditorProps) {
  const [activeTab, setActiveTab] = useState<string>(locales[0]);
  const [translations, setTranslations] = useState<Record<string, string>>(initialTranslations);
  const [saving, setSaving] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalStatus, setTerminalStatus] = useState<'running' | 'success' | 'error'>('running');

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, msg]);
  };

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

  const isHero = componentType === 'hero';
  const isJsonBlock = componentType === 'hero' || componentType === 'global_ui_strings' || componentType === 'home_page_strings';

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
            {activeTab.toUpperCase()} Dili İçin {isJsonBlock ? 'Metin İçerikleri' : 'İçerik'}
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={async () => {
                const currentData = translations[activeTab] || '';
                if (!currentData || currentData.trim() === '' || currentData === '[]') {
                  alert('Önce çevrilecek bir içerik olmalı! (Başka bir dildeki içeriği buraya yapıştırabilir veya sıfırdan oluşturabilirsiniz)');
                  return;
                }
                
                const oldVal = currentData;
                
                setTerminalLogs([]);
                setTerminalStatus('running');
                setTerminalOpen(true);
                addLog('> AI Agent başlatılıyor...');
                addLog(`> Hedef dil: ${activeTab.toUpperCase()}`);
                
                if (!isJsonBlock) {
                  setTranslations(prev => ({ ...prev, [activeTab]: '<p><em>✨ Yapay zeka içeriği çeviriyor, lütfen bekleyin...</em></p>' }));
                }
                
                try {
                  addLog('> Sunucularla bağlantı kuruluyor (OpenAI / xAI / Gemini)...');
                  const res = await fetch('/api/ai/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      content: oldVal, 
                      targetLocale: activeTab,
                      isJson: isJsonBlock
                    })
                  });
                  
                  const data = await res.json();
                  if (data.error) throw new Error(data.error);
                  
                  setTranslations(prev => ({ ...prev, [activeTab]: data.content }));
                  addLog(`> Başarılı! Çeviri [${data.provider}] üzerinden tamamlandı.`);
                  setTerminalStatus('success');
                } catch (e: any) {
                  addLog(`> HATA: ${e.message}`);
                  setTerminalStatus('error');
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
              disabled={isTranslatingAll}
              onClick={async () => {
                const trContent = translations['tr'];
                if (!trContent || trContent.trim() === '' || trContent === '[]') {
                  alert('Öncelikle "TR" dilinde içerik oluşturmalısınız!');
                  return;
                }
                
                if (!confirm('TR içeriği diğer tüm dillere çevrilecek. Onaylıyor musunuz?')) return;
                
                setIsTranslatingAll(true);
                setTerminalLogs([]);
                setTerminalStatus('running');
                setTerminalOpen(true);
                
                const otherLocales = locales.filter(l => l !== 'tr');
                addLog(`> Toplu çeviri başlatıldı. Toplam hedef dil: ${otherLocales.length}`);
                
                const newTranslations = { ...translations };
                let successCount = 0;
                
                for (const loc of otherLocales) {
                  addLog(`> [${loc.toUpperCase()}] diline çevriliyor...`);
                  try {
                    const res = await fetch('/api/ai/translate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: trContent, targetLocale: loc, isJson: isJsonBlock })
                    });
                    const data = await res.json();
                    if (data.content) {
                      newTranslations[loc] = data.content;
                      addLog(`> [${loc.toUpperCase()}] Başarılı! (${data.provider})`);
                      successCount++;
                    } else if (data.error) {
                      addLog(`> [${loc.toUpperCase()}] HATA: ${data.error}`);
                    }
                  } catch (e: any) {
                    addLog(`> [${loc.toUpperCase()}] Kritik Hata: ${e.message}`);
                  }
                }
                
                setTranslations(newTranslations);
                setIsTranslatingAll(false);
                addLog(`> İşlem tamamlandı: ${successCount}/${otherLocales.length} dil çevrildi.`);
                setTerminalStatus(successCount === otherLocales.length ? 'success' : 'error');
              }}
              style={{
                background: isTranslatingAll ? '#ccc' : '#10b981',
                color: '#fff',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '20px',
                cursor: isTranslatingAll ? 'wait' : 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isTranslatingAll ? '⏳ Çevriliyor...' : '🌐 Tümüne Çevir'}
            </button>

            {!isJsonBlock && (
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
            )}
          </div>
        </div>
        
        {/* We mount the specific editor based on componentType */}
        {isHero ? (
          <HeroSlideManager 
            value={translations[activeTab] || ''} 
            onChange={(val) => setTranslations(prev => ({ ...prev, [activeTab]: val }))} 
            locale={activeTab}
          />
        ) : isJsonBlock ? (
          <KeyValueManager 
            value={translations[activeTab] || ''} 
            onChange={(val) => setTranslations(prev => ({ ...prev, [activeTab]: val }))} 
            locale={activeTab}
          />
        ) : (
          <RichTextEditor 
            value={translations[activeTab] || ''} 
            onChange={(val) => setTranslations(prev => ({ ...prev, [activeTab]: val }))} 
          />
        )}
        
        {/* SEO Score Helper only for text blocks */}
        {!isJsonBlock && <SeoScoreBadge content={translations[activeTab] || ''} />}
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

      {/* Terminal Overlay */}
      {terminalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0a0a0a] rounded-xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden font-mono flex flex-col h-[400px]">
            <div className="bg-[#111] px-4 py-3 border-b border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="text-green-500/50 text-xs ml-3 tracking-widest uppercase">root@ai-core ~</span>
              </div>
              {terminalStatus !== 'running' && (
                <button 
                  onClick={() => setTerminalOpen(false)}
                  className="text-xs text-green-500 hover:text-white px-3 py-1 border border-green-500/30 rounded hover:bg-green-500/20 transition-colors"
                >
                  [KAPAT]
                </button>
              )}
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-2 text-[13px] text-green-400">
              {terminalLogs.map((log, i) => (
                <div key={i} className={`${log.includes('HATA') ? 'text-red-400' : 'text-green-400'}`}>{log}</div>
              ))}
              {terminalStatus === 'running' && (
                <div className="animate-pulse inline-block">_</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
