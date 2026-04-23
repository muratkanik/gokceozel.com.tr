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
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#111' }}>
        Biyografi Yönetimi
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Bu sayfadaki bilgiler, web sitenizin <strong>"Gökçe Özel Kimdir?"</strong> bölümünde gösterilir.
      </p>

      {/* Client Component to handle tabs and RichTextEditor state */}
      <TranslationEditor blockId={block.id} componentType={block.componentType} initialTranslations={translationMap} locales={locales} />
    </div>
  );
}
