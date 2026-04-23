import TranslationEditor from '@/components/admin/TranslationEditor';
import { ensureHeroBlockExists } from './actions';

export default async function HeroManagementPage() {
  const block = await ensureHeroBlockExists();
  const locales = ['tr', 'en', 'ar', 'ru'];
  
  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find((t: any) => t.locale === loc);
    translationMap[loc] = existing?.contentData || '[]'; // Hero defaults to empty array
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hero Slayt Yönetimi</h1>
        <p className="text-slate-500 mt-1">
          Ana sayfada ziyaretçileri karşılayan büyük dönen görselleri, başlıkları ve butonları buradan yönetebilirsiniz.
        </p>
      </div>

      <TranslationEditor blockId={block.id} componentType={block.componentType} initialTranslations={translationMap} locales={locales} />
    </div>
  );
}
