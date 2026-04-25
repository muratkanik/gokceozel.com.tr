'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertEvent } from '../actions';
import MediaInput from '@/components/admin/MediaInput';

const LOCALES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

export default function EventForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('tr');
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  const defaultDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    event_name: initialData?.event_name || '',
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : defaultDate,
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : defaultDate,
    theme_class: initialData?.theme_class || 'national_day',
    is_active: initialData?.is_active ?? true,
    popup_translations: typeof initialData?.popup_translations === 'string' 
      ? JSON.parse(initialData.popup_translations) 
      : (initialData?.popup_translations || {})
  });

  const handleTranslationChange = (locale: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      popup_translations: {
        ...prev.popup_translations,
        [locale]: {
          ...(prev.popup_translations[locale] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await upsertEvent(formData);
      router.push('/admin/ozel-gunler');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#e9e4d8] shadow-sm">
        <h2 className="text-lg font-serif font-semibold text-[#1a1410] mb-5">Etkinlik Bilgileri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">Etkinlik Adı (Sadece Admin İçin)</label>
            <input 
              type="text" 
              required
              value={formData.event_name}
              onChange={e => setFormData({...formData, event_name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e9e4d8] focus:border-[#b8893c] focus:ring-1 focus:ring-[#b8893c] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">Başlangıç Tarihi</label>
            <input 
              type="date" 
              required
              value={formData.start_date}
              onChange={e => setFormData({...formData, start_date: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e9e4d8] focus:border-[#b8893c] focus:ring-1 focus:ring-[#b8893c] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">Bitiş Tarihi</label>
            <input 
              type="date" 
              required
              value={formData.end_date}
              onChange={e => setFormData({...formData, end_date: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e9e4d8] focus:border-[#b8893c] focus:ring-1 focus:ring-[#b8893c] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">Tema Stili</label>
            <select 
              value={formData.theme_class}
              onChange={e => setFormData({...formData, theme_class: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e9e4d8] focus:border-[#b8893c] focus:ring-1 focus:ring-[#b8893c] outline-none transition-all bg-white"
            >
              <option value="national_day">Milli Bayram (Kırmızı Konsept)</option>
              <option value="default">Standart Konsept</option>
            </select>
          </div>

          <div className="flex items-center mt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.is_active}
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
                className="w-5 h-5 rounded border-[#e9e4d8] text-[#b8893c] focus:ring-[#b8893c]"
              />
              <span className="text-[14px] font-semibold text-[#1a1410]">Etkinliği Aktifleştir</span>
            </label>
          </div>
        </div>
      </div>

      {/* Translations & Media */}
      <div className="bg-white p-6 rounded-2xl border border-[#e9e4d8] shadow-sm">
        <h2 className="text-lg font-serif font-semibold text-[#1a1410] mb-5">Pop-up İçeriği (Dillere Göre)</h2>
        
        {/* Language Tabs & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e9e4d8] pb-4 mb-4">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
            {LOCALES.map(loc => (
              <button
                key={loc.code}
                type="button"
                onClick={() => setActiveTab(loc.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === loc.code 
                    ? 'bg-[#b8893c] text-white' 
                    : 'bg-[#fafaf7] text-[#6a5f54] hover:bg-[#e9e4d8]'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
          
          <button 
            type="button"
            disabled={isTranslatingAll}
            onClick={async () => {
              const trData = formData.popup_translations['tr'];
              if (!trData || !trData.title || !trData.body) {
                alert('Öncelikle "Türkçe" sekmesinde başlık ve metin alanlarını doldurmalısınız!');
                return;
              }
              
              if (!confirm('Türkçe içerik diğer tüm dillere otomatik çevrilecek. Onaylıyor musunuz?')) return;
              
              setIsTranslatingAll(true);
              const otherLocales = LOCALES.filter(l => l.code !== 'tr');
              let successCount = 0;
              
              const newTranslations = { ...formData.popup_translations };
              const payload = JSON.stringify({ title: trData.title, body: trData.body });
              
              for (const loc of otherLocales) {
                try {
                  const res = await fetch('/api/ai/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: payload, targetLocale: loc.code, isJson: true })
                  });
                  const data = await res.json();
                  if (data.content) {
                    const parsed = JSON.parse(data.content);
                    newTranslations[loc.code] = {
                      ...newTranslations[loc.code],
                      title: parsed.title,
                      body: parsed.body,
                      // Preserve existing imageUrl if any, else copy TR imageUrl
                      imageUrl: newTranslations[loc.code]?.imageUrl || trData.imageUrl
                    };
                    successCount++;
                  }
                } catch (e) {
                  console.error(`${loc.code} çevirisi başarısız:`, e);
                }
              }
              
              setFormData(prev => ({ ...prev, popup_translations: newTranslations }));
              setIsTranslatingAll(false);
              alert(`Toplu çeviri tamamlandı! ${successCount}/${otherLocales.length} dil çevrildi.`);
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold text-white transition-all flex items-center gap-2 ${
              isTranslatingAll ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30'
            }`}
          >
            {isTranslatingAll ? '⏳ Çevriliyor...' : '🌐 Tümüne Çevir'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          <div>
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">
              Pop-up Başlığı ({activeTab.toUpperCase()})
            </label>
            <input 
              type="text" 
              value={formData.popup_translations[activeTab]?.title || ''}
              onChange={e => handleTranslationChange(activeTab, 'title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e9e4d8] focus:border-[#b8893c] focus:ring-1 focus:ring-[#b8893c] outline-none transition-all"
              placeholder="Örn: 23 Nisan Kutlu Olsun!"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">
              Pop-up Metni ({activeTab.toUpperCase()})
            </label>
            <textarea 
              rows={4}
              value={formData.popup_translations[activeTab]?.body || ''}
              onChange={e => handleTranslationChange(activeTab, 'body', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e9e4d8] focus:border-[#b8893c] focus:ring-1 focus:ring-[#b8893c] outline-none transition-all resize-y"
              placeholder="Açıklama metni..."
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#6a5f54] mb-2">
              Görsel ({activeTab.toUpperCase()})
            </label>
            <MediaInput 
              value={formData.popup_translations[activeTab]?.imageUrl || ''}
              onChange={(url) => handleTranslationChange(activeTab, 'imageUrl', url)}
            />
            <p className="text-xs text-[#9a8f7c] mt-2">Dile özel görsel seçebilirsiniz. Boş bırakırsanız sistem varsayılan bir görsel kullanır.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/admin/ozel-gunler')}
          className="px-6 py-3 rounded-xl text-[14px] font-semibold text-[#6a5f54] hover:bg-[#fafaf7] transition-colors"
        >
          İptal
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#b8893c] to-[#9a7332] text-white px-8 py-3 rounded-xl text-[14px] font-semibold hover:shadow-lg hover:shadow-[#b8893c]/20 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
