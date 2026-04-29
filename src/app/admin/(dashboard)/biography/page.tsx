import TranslationEditor from '@/components/admin/TranslationEditor';
import { ensureBiographyBlockExists } from './actions';
import { BIOGRAPHY_DEFAULT_TR, BIOGRAPHY_LOCALES } from '@/lib/biography-defaults';

export default async function BiographyManagementPage() {
  // Automatically ensure the page and block exist
  const block = await ensureBiographyBlockExists();

  // Prepare standard locales
  const locales = BIOGRAPHY_LOCALES;

  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find((t: any) => t.locale === loc);
    let data = existing?.contentData || '';
    if (!data || data === '{}' || data === '[]') {
      data = loc === 'tr' ? JSON.stringify(BIOGRAPHY_DEFAULT_TR) : '{}';
    }
    translationMap[loc] = data;
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
