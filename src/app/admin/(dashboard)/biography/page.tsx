import TranslationEditor from '@/components/admin/TranslationEditor';
import { ensureBiographyBlockExists } from './actions';

export default async function BiographyManagementPage() {
  // Automatically ensure the page and block exist
  const block = await ensureBiographyBlockExists();

  // Prepare standard locales
  const locales = ['tr', 'en', 'ar', 'ru'];
  
  // Fallback data matching the frontend
  const fallbackData = {
    image: '/images/gokceozel.png',
    title: 'Prof. Dr. Gökçe Özel',
    subtitle: 'KBB ve Yüz Plastik Cerrahi Uzmanı',
    about: '<p>Prof. Dr. Gökçe Özel, Kulak Burun Boğaz ve Baş Boyun Cerrahisi alanında uzmanlaşmış, özellikle Rinoplasti (Burun Estetiği) ve yüz plastik cerrahisi konularında derin bir tecrübeye sahip hekimdir.</p><p>Hastalarına en güncel ve güvenilir tedavi yöntemlerini sunmayı amaçlayan kliniğimizde, estetik ve fonksiyonu bir arada değerlendiren bütüncül bir yaklaşım benimsenmektedir.</p>',
    timeline: [
      { id: '1', year: '2010', title: 'Tıp Eğitimi', description: 'Hacettepe Üniversitesi Tıp Fakültesi' },
      { id: '2', year: '2016', title: 'Uzmanlık', description: 'KBB Baş ve Boyun Cerrahisi İhtisası' },
      { id: '3', year: '2023', title: 'Profesörlük', description: 'KBB alanında Profesör unvanı' }
    ],
    certificates: []
  };

  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find((t: any) => t.locale === loc);
    let data = existing?.contentData || '';
    if (!data || data === '{}' || data === '[]') {
      data = loc === 'tr' ? JSON.stringify(fallbackData) : '{}';
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
