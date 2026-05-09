'use client';

import { useState, useMemo } from 'react';
import { Sparkles, Save, ChevronRight, Layout, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import { savePageContent } from '@/app/admin/(dashboard)/shared-actions';
import { useRouter } from 'next/navigation';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function PageEditor({ initialData, pageType = 'page' }: { initialData: any, pageType?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tr');
  const [activeInspector, setActiveInspector] = useState('seo');
  const [contentType, setContentType] = useState(initialData?.type || 'SERVICE');
  
  // Ensure we have at least one rich text block
  const ensureMainBlock = (currentBlocks: any[]) => {
    let main = currentBlocks.find(b => b.componentType === 'zengin_metin');
    if (!main) {
      main = {
        id: `temp_${Math.random().toString(36).substring(2, 9)}`,
        componentType: 'zengin_metin',
        sortOrder: 1,
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
      return [...currentBlocks, main];
    }
    return currentBlocks;
  };

  const [blocks, setBlocks] = useState<any[]>(ensureMainBlock(initialData?.blocks || []));
  const [isSaving, setIsSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);

  const mainBlock = useMemo(() => blocks.find(b => b.componentType === 'zengin_metin'), [blocks]);

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
    if (!block) return {};
    const t = block.translations?.find((t: any) => t.locale === locale);
    if (!t || !t.contentData) return {};
    try {
      return JSON.parse(t.contentData);
    } catch (e) {
      return {};
    }
  };

  const mainContent = getBlockContent(mainBlock, activeTab);

  const improveWithAI = async () => {
    if (!mainBlock) return;
    setAiBusy('improve');
    const pageSlug = initialData?.slug || '';
    const pageTitle = initialData?.titleInternal || pageSlug;
    const cleanTitle = pageTitle.replace(/\s*[|–-].*$/, '').replace(/Ankara.*|Antalya.*/i, '').trim();
    const hasExistingContent = !!(mainContent.text || mainContent.title);

    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: activeTab,
          currentHtml: mainContent.text || mainContent.title || '',
          prompt: hasExistingContent
            ? `Aşağıdaki mevcut içeriği, "${cleanTitle}" hizmet sayfasına özel olarak geliştir. Konu: ${cleanTitle}. Hasta odaklı, güven veren, SEO uyumlu, tıbbi reklam diline dikkat eden bir yapıya kavuştur. Başlık hiyerarşisi (h2/h3) ve kısa paragraflar kullan. Konuyu abartılı vaatlerle anlatma.`
            : `"${cleanTitle}" hizmeti için Prof. Dr. Gökçe Özel kliniği web sitesine özgü, SEO uyumlu zengin metin oluştur. Şu yapıyı kullan:\n<h2>${cleanTitle} Nedir?</h2>\n<p>Tanım ve amaç</p>\n<h2>Kimler Yaptırabilir?</h2>\n<p>Uygun adaylar</p>\n<h2>Prosedür</h2>\n<p>Nasıl uygulanır</p>\n<h2>Sonuçlar</h2>\n<p>Ne beklenebilir</p>\nAnkara ve Antalya'da yapılabildiğini vurgula.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI içerik üretimi başarısız oldu.');
      
      updateBlockContent(mainBlock.id, activeTab, {
        ...mainContent,
        text: data.content,
      });
    } catch (error: any) {
      alert(error.message || 'AI içerik üretimi sırasında hata oluştu.');
    } finally {
      setAiBusy(null);
    }
  };

  const translateFromTurkish = async () => {
    if (!mainBlock) return;
    if (activeTab === 'tr') {
      alert('Türkçe kaynak dil olduğu için önce farklı bir dil sekmesi seçin.');
      return;
    }
    const sourceContent = getBlockContent(mainBlock, 'tr');
    if (!Object.keys(sourceContent).length || !sourceContent.text) {
      alert('Bu sayfa için önce Türkçe içerik girin.');
      return;
    }
    
    setAiBusy('translate');
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: JSON.stringify(sourceContent),
          targetLocale: activeTab,
          isJson: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI çeviri başarısız oldu.');
      
      updateBlockContent(mainBlock.id, activeTab, JSON.parse(data.content));
    } catch (error: any) {
      alert(error.message || 'AI çeviri sırasında hata oluştu.');
    } finally {
      setAiBusy(null);
    }
  };

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -mx-8 -mb-8">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10 flex-shrink-0">
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
        {/* CENTER: Editor */}
        <div className="flex-1 bg-[#fafaf7] flex flex-col relative overflow-hidden">
          {/* Language Tabs */}
          <div className="flex items-center justify-between p-4 pb-0 flex-shrink-0">
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
            
            <div className="flex gap-2">
               <button
                  onClick={improveWithAI}
                  disabled={!!aiBusy}
                  className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#b8893c]/10 text-[#b8893c] hover:bg-[#b8893c]/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiBusy === 'improve' ? 'Üretiliyor...' : 'İçeriği AI ile Geliştir'}
                </button>
                {activeTab !== 'tr' && (
                  <button
                    onClick={translateFromTurkish}
                    disabled={!!aiBusy}
                    className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    {aiBusy === 'translate' ? 'Çevriliyor...' : 'TR\'den Çevir'}
                  </button>
                )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[800px] mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
              
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <input 
                  type="text"
                  placeholder="Sayfa Başlığı"
                  value={mainContent.title || ''}
                  onChange={(e) => mainBlock && updateBlockContent(mainBlock.id, activeTab, { ...mainContent, title: e.target.value })}
                  className="w-full text-3xl font-serif text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                />
              </div>

              <div className="flex-1 flex flex-col [&_.quill]:flex-1 [&_.quill]:flex [&_.quill]:flex-col [&_.ql-container]:flex-1 [&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-[15px] [&_.ql-editor]:leading-relaxed [&_.ql-editor]:text-slate-700">
                <ReactQuill 
                  theme="snow"
                  value={mainContent.text || ''}
                  onChange={(val) => mainBlock && updateBlockContent(mainBlock.id, activeTab, { ...mainContent, text: val })}
                  modules={quillModules}
                  placeholder="Sayfa içeriğini buraya yazın..."
                />
              </div>
              
            </div>
            
            {/* Display other preserved blocks as info */}
            {blocks.filter(b => b.componentType !== 'zengin_metin').length > 0 && (
              <div className="max-w-[800px] mx-auto mt-6 bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex items-start gap-3 text-amber-700 text-[13px]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-1">Mevcut Tasarım Bileşenleri Korunuyor</strong>
                  Bu sayfada metin dışında <b>{blocks.filter(b => b.componentType !== 'zengin_metin').length} adet</b> ek bileşen (Hero Slider, Galeri vb.) bulunuyor. Bu bileşenler sayfada görünmeye devam edecek ancak şu anki basit düzenleyicide sadece ana metni düzenliyorsunuz.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Inspector */}
        <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col z-10 overflow-y-auto flex-shrink-0">
          <div className="flex border-b border-slate-200 px-4 pt-4">
            <button onClick={() => setActiveInspector('seo')} className={`pb-3 px-3 text-[12px] font-bold tracking-wide border-b-2 transition-colors ${activeInspector === 'seo' ? 'border-[#b8893c] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>SEO AYARLARI</button>
          </div>

          <div className="p-5">
            {activeInspector === 'seo' && (
              <>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Meta Başlık</label>
                    <input type="text" placeholder="SEO başlığı" className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Meta Açıklama</label>
                    <textarea rows={4} placeholder="Arama motorları için kısa özet..." className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#b8893c] focus:border-[#b8893c] outline-none resize-none"></textarea>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
