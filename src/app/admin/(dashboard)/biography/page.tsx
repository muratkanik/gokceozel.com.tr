import TranslationEditor from '@/components/admin/TranslationEditor';
import { ensureBiographyBlockExists } from './actions';

export default async function BiographyManagementPage() {
  // Automatically ensure the page and block exist
  const block = await ensureBiographyBlockExists();

  // Prepare standard locales
  const locales = ['tr', 'en', 'ar', 'ru'];
  
  // Transform existing translations into an easy to use map
  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find((t: any) => t.locale === loc);
    translationMap[loc] = existing?.contentData || '';
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Biyografi Yönetimi</h1>
        <p className="text-slate-500 mt-1">
          Bu sayfadaki bilgiler, web sitenizin <strong className="text-slate-700">"Gökçe Özel Kimdir?"</strong> bölümünde gösterilir.
        </p>
      </div>

      {/* Client Component to handle tabs and RichTextEditor state */}
      <TranslationEditor blockId={block.id} componentType={block.componentType} initialTranslations={translationMap} locales={locales} />
    </div>
  );
}
