'use client';

import { useState } from 'react';
import { Sparkles, Save, Layout, Settings, FileText, Image as ImageIcon, MessageCircle, Info, ChevronRight, Globe, BarChart2 } from 'lucide-react';

import { savePageContent } from '@/app/admin/(dashboard)/shared-actions';
import { useRouter } from 'next/navigation';

export default function PageEditor({ initialData, pageType = 'page' }: { initialData: any, pageType?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tr');
  const [activeInspector, setActiveInspector] = useState('seo');
  const [contentType, setContentType] = useState(initialData?.type || 'SERVICE');
  const [blocks, setBlocks] = useState<any[]>(initialData?.blocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePageContent(initialData?.id || 'new', {
        type: contentType,
        blocks: blocks.map((b, index) => ({ ...b, sortOrder: index + 1 }))
      });
      alert('İçerik başarıyla kaydedildi!');
      router.refresh();
    } catch (e) {
      alert('Kaydedilirken bir hata oluştu.');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = (componentType: string) => {
    const newBlock = {
      id: `temp_${Date.now()}`,
      componentType,
      sortOrder: blocks.length + 1,
      isActive: true,
      translations: [
        { locale: 'tr', contentData: '{}' },
        { locale: 'en', contentData: '{}' },
        { locale: 'de', contentData: '{}' },
        { locale: 'fr', contentData: '{}' },
        { locale: 'ar', contentData: '{}' },
        { locale: 'ru', contentData: '{}' }
      ]
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setActiveInspector('block');
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const updateBlockContent = (id: string, locale: string, contentData: any) => {
    setBlocks(blocks.map(b => {
      if (b.id !== id) return b;
      
      const newTranslations = [...b.translations];
      const tIndex = newTranslations.findIndex(t => t.locale === locale);
      
      if (tIndex >= 0) {
        newTranslations[tIndex] = { ...newTranslations[tIndex], contentData: JSON.stringify(contentData) };
      } else {
        newTranslations.push({ locale, contentData: JSON.stringify(contentData) });
      }
      
      return { ...b, translations: newTranslations };
    }));
  };

  const getBlockContent = (block: any, locale: string) => {
    const t = block.translations?.find((t: any) => t.locale === locale);
    if (!t || !t.contentData) return {};
    try {
      return JSON.parse(t.contentData);
    } catch (e) {
      return {};
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -mx-8 -mb-8">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="text-[13px] text-slate-500 flex items-center gap-2">
          Sayfalar <ChevronRight className="w-3 h-3" /> 
          <span className="capitalize">{pageType}</span> <ChevronRight className="w-3 h-3" /> 
          <strong className="text-slate-900 font-semibold">{initialData?.slug || 'Yeni Sayfa'}</strong>
          <span className="text-slate-300 mx-2">|</span>
          <select 
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 outline-none hover:border-[#b8893c] transition-colors cursor-pointer"
          >
            <option value="SERVICE">Hizmet</option>
            <option value="BLOG">Blog</option>
            <option value="PAGE">Sayfa</option>
            <option value="BIOGRAPHY">Biyografi</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-400 mr-2">Otomatik kaydedildi · 3 sn önce</span>
          <button className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-transparent hover:bg-slate-50 rounded-lg transition-colors">
            Önizle
          </button>
          <button className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm">
            Taslak
          </button>
          <button disabled={isSaving} onClick={handleSave} className="px-5 py-2 text-[13px] font-medium text-white bg-[#1a1410] hover:bg-[#2d241d] rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSaving ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Block library */}
        <div className="w-[260px] bg-white border-r border-slate-200 flex flex-col z-10">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[11px] tracking-[0.15em] uppercase text-slate-400 mb-3 font-semibold">Blok Kütüphanesi</h3>
            <input 
              type="search" 
              placeholder="Blok ara..." 
              className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Layout />, label: "Hero Slider" },
                { icon: <Layout />, label: "Intro Split" },
                { icon: <Layout />, label: "Hizmet Izgara" },
                { icon: <MessageCircle />, label: "Yorumlar" },
                { icon: <Info />, label: "SSS" },
                { icon: <ImageIcon />, label: "Galeri" },
                { icon: <ImageIcon />, label: "Önce/Sonra" },
                { icon: <FileText />, label: "Zengin Metin" },
              ].map((block, i) => (
                <div key={i} onClick={() => handleAddBlock(block.label.toLowerCase().replace(/ /g, '_'))} className="p-3 border border-slate-200 rounded-[10px] text-center cursor-pointer hover:border-[#b8893c] hover:shadow-[0_3px_10px_rgba(184,137,60,0.1)] transition-all bg-white group">
                  <div className="text-[#b8893c] flex justify-center mb-1.5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                    {block.icon}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">{block.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div className="flex-1 bg-[#fafaf7] flex flex-col relative">
          <div className="flex items-center justify-between p-4 pb-0">
            <div className="flex flex-wrap bg-white border border-slate-200 rounded-lg p-1 gap-1 shadow-sm">
              <button onClick={() => setActiveTab('tr')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'tr' ? 'bg-[#1a1410] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> TR · Türkçe
              </button>
              <button onClick={() => setActiveTab('en')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'en' ? 'bg-[#1a1410] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> EN
              </button>
              <button onClick={() => setActiveTab('de')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'de' ? 'bg-[#1a1410] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> DE
              </button>
              <button onClick={() => setActiveTab('fr')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'fr' ? 'bg-[#1a1410] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> FR
              </button>
              <button onClick={() => setActiveTab('ar')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'ar' ? 'bg-[#1a1410] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> AR
              </button>
              <button onClick={() => setActiveTab('ru')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'ru' ? 'bg-[#1a1410] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> RU
              </button>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-slate-100 text-slate-900">Desktop</button>
              <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-slate-500 hover:bg-slate-50">Mobil</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[800px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden min-h-[700px]">
              
              {/* Canvas Frame placeholder for the new Gold/Dark blocks */}
              <div className="m-4 bg-gradient-to-b from-[#0f0d0b] to-[#1a1410] rounded-xl text-[#f7f4ee] p-6 min-h-[600px]">
                
                {blocks.map((block) => {
                  const content = getBlockContent(block, activeTab);
                  const isSelected = selectedBlockId === block.id;

                  return (
                    <div 
                      key={block.id} 
                      onClick={() => { setSelectedBlockId(block.id); setActiveInspector('block'); }}
                      className={`relative p-5 border-2 border-dashed ${isSelected ? 'border-[#b8893c] bg-[#b8893c]/5' : 'border-transparent hover:border-[#b8893c]/40'} rounded-xl mb-4 group transition-colors cursor-pointer`}
                    >
                      <div className={`absolute -top-3 left-4 ${isSelected ? 'bg-[#b8893c]' : 'bg-[#1a1410]'} text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase`}>
                        {block.componentType}
                      </div>
                      
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveBlock(block.id); }} className="text-red-400 hover:text-red-500 text-xs font-semibold px-2">Sil</button>
                        <div className="text-slate-400 cursor-grab">⋮⋮</div>
                      </div>

                      {block.componentType === 'hero_slider' && (
                        <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 items-center p-4">
                          <div>
                            <h1 className="font-serif text-3xl mb-3 text-white">{content.title || 'Başlık Girin'}</h1>
                            <p className="text-[#c9c0ae] text-sm">{content.subtitle || 'Alt başlık açıklaması girin.'}</p>
                          </div>
                          <div className="aspect-[4/5] bg-gradient-to-br from-[#3d2f22] to-[#17130f] rounded-xl grid place-items-center text-[#d4b97a]/30 font-serif text-xs">Görsel</div>
                        </div>
                      )}

                      {block.componentType === 'zengin_metin' && (
                        <div className="py-2">
                          <h2 className="font-serif text-2xl mb-2 text-white">{content.title || 'Metin Başlığı'}</h2>
                          <p className="text-[#c9c0ae] text-[13px] leading-relaxed whitespace-pre-wrap">{content.text || 'Zengin metin içeriğinizi buraya girin...'}</p>
                        </div>
                      )}

                      {block.componentType !== 'hero_slider' && block.componentType !== 'zengin_metin' && (
                        <div className="py-8 text-center text-[#c9c0ae]/60 text-sm">
                          {block.componentType} bloğu (Önizleme yakında)
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Block Placeholder */}
                <div className="text-center p-6 border-2 border-dashed border-[#b8893c]/30 rounded-xl text-[#d4b97a]/50 text-[13px] cursor-pointer hover:bg-[#b8893c]/5 hover:border-[#b8893c]/50 transition-colors">
                  + Yeni blok ekle (sürükle-bırak veya seç)
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Inspector */}
        <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col z-10 overflow-y-auto">
          <div className="flex border-b border-slate-200 px-4 pt-4">
            <button onClick={() => setActiveInspector('seo')} className={`pb-3 px-3 text-[12px] font-bold tracking-wide border-b-2 transition-colors ${activeInspector === 'seo' ? 'border-[#b8893c] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>SEO</button>
            <button onClick={() => setActiveInspector('block')} className={`pb-3 px-3 text-[12px] font-bold tracking-wide border-b-2 transition-colors ${activeInspector === 'block' ? 'border-[#b8893c] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>BLOK</button>
            <button onClick={() => setActiveInspector('version')} className={`pb-3 px-3 text-[12px] font-bold tracking-wide border-b-2 transition-colors ${activeInspector === 'version' ? 'border-[#b8893c] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>VERSİYON</button>
          </div>

          <div className="p-5">
            {activeInspector === 'seo' && (
              <>
                {/* SEO Score */}
                <div className="bg-gradient-to-br from-[#f7f4ee] to-white border border-slate-200 rounded-xl p-4 mb-5 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-serif text-3xl text-[#b8893c] leading-none flex items-baseline gap-1">
                      78 <span className="text-sm text-slate-400 font-sans">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right leading-tight uppercase font-medium tracking-wide">
                      SEO Skoru<br/>(TR için)
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full my-3 overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-[#b8893c] to-[#e89721]"></div>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-600"><span className="text-[14px]">✓</span> Meta başlık uzunluğu ideal (58)</div>
                    <div className="flex items-center gap-1.5 text-emerald-600"><span className="text-[14px]">✓</span> H1 bir kez kullanılmış</div>
                    <div className="flex items-center gap-1.5 text-amber-500"><span className="text-[14px]">⚠</span> Açıklama 140 karakterden kısa</div>
                    <div className="flex items-center gap-1.5 text-red-500"><span className="text-[14px]">✗</span> İç bağlantı yok</div>
                  </div>
                </div>

                {/* AI Panel */}
                <div className="bg-gradient-to-br from-[#b8893c]/10 to-[#b8893c]/5 border border-[#b8893c]/25 rounded-xl p-4 mb-6">
                  <h4 className="text-[11px] tracking-[0.12em] uppercase text-[#b8893c] mb-3 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Asistan
                  </h4>
                  <div className="space-y-1.5">
                    <button className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:border-[#b8893c] transition-colors shadow-sm">✦ Meta başlık & açıklama üret</button>
                    <button className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:border-[#b8893c] transition-colors shadow-sm">✦ FAQ sorularını öner (AEO)</button>
                    <button className="w-full text-left px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:border-[#b8893c] transition-colors shadow-sm">✦ Kısa özet üret (LLM için)</button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">URL</label>
                    <input type="text" defaultValue="/tr/hizmetler/rinoplasti" className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none bg-slate-50 text-slate-500" readOnly />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Meta Başlık</label>
                    <input type="text" defaultValue="Rinoplasti Ankara | Prof. Dr. Gökçe Özel - Burun Estetiği" className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none" />
                    <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                      <span>60 karakter ideal</span><span className="text-emerald-500">58</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Meta Açıklama</label>
                    <textarea rows={4} defaultValue="Ankara'da rinoplasti: Prof. Dr. Gökçe Özel ile kişiye özel burun estetiği. 3D simülasyon, açık/kapalı teknik, doğal sonuçlar." className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none resize-none"></textarea>
                    <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                      <span>155 karakter önerilir</span><span className="text-amber-500">127</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeInspector === 'block' && (
              <div className="space-y-4">
                {selectedBlockId ? (() => {
                  const activeBlock = blocks.find(b => b.id === selectedBlockId);
                  if (!activeBlock) return null;
                  const content = getBlockContent(activeBlock, activeTab);

                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Seçili Blok</div>
                        <div className="text-[13px] font-semibold text-slate-700">{activeBlock.componentType}</div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Başlık ({activeTab.toUpperCase()})</label>
                        <input 
                          type="text" 
                          value={content.title || ''} 
                          onChange={(e) => updateBlockContent(activeBlock.id, activeTab, { ...content, title: e.target.value })}
                          className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none" 
                          placeholder="Blok başlığı"
                        />
                      </div>

                      {activeBlock.componentType === 'zengin_metin' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Metin İçeriği ({activeTab.toUpperCase()})</label>
                          <textarea 
                            rows={8} 
                            value={content.text || ''} 
                            onChange={(e) => updateBlockContent(activeBlock.id, activeTab, { ...content, text: e.target.value })}
                            className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none resize-none"
                            placeholder="Metin içeriği girin..."
                          ></textarea>
                        </div>
                      )}

                      {activeBlock.componentType === 'hero_slider' && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Alt Başlık ({activeTab.toUpperCase()})</label>
                          <textarea 
                            rows={3} 
                            value={content.subtitle || ''} 
                            onChange={(e) => updateBlockContent(activeBlock.id, activeTab, { ...content, subtitle: e.target.value })}
                            className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none resize-none"
                            placeholder="Alt başlık girin..."
                          ></textarea>
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <div className="text-sm text-slate-500 p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                    Ayarlarını görmek için ortadaki alandan bir blok seçin.
                  </div>
                )}
              </div>
            )}
            {activeInspector === 'version' && (
              <div className="text-sm text-slate-500">Geçmiş versiyonlar yakında eklenecektir.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
