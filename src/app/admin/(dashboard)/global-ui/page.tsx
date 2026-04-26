import TranslationEditor from '@/components/admin/TranslationEditor';
import { ensureGlobalUIBlockExists } from './actions';

export default async function GlobalUIManagementPage() {
  const block = await ensureGlobalUIBlockExists();
  const locales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
  
  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find((t: any) => t.locale === loc);
    translationMap[loc] = existing?.contentData || '{}'; 
  });

  // Default values for TR if it's completely empty
  if (translationMap['tr'] === '{}') {
    const defaultTr = {
      'Navigation.services': 'Hizmetlerimiz',
      'Navigation.about': 'Hakkımızda',
      'Navigation.reviews': 'Hasta Yorumları',
      'Navigation.blog': 'Blog',
      'Navigation.faq': 'Sık Sorulan Sorular',
      'Navigation.contact': 'İletişim',
      'Navigation.beforeAfter': 'Öncesi & Sonrası',
      
      'Contact.appointment': 'Randevu Al',
      'Contact.title': 'İletişim',
      'Contact.address': 'Prof. Dr. Ahmet Taner Kışlalı Mah. 2830. Cad. No:19 Çayyolu / Ankara',
      'Contact.phone': '+90 534 209 69 35',
      'Contact.email': 'info@gokceozel.com.tr',
      'Contact.hours': 'Pzt–Cmt · 10:00–18:00',
      
      'Footer.description': 'Prof. Dr. Gökçe Özel Kulak Burun Boğaz ve Yüz Plastik Cerrahi Kliniği. Doğal güzelliğiniz için bilimsel ve estetik çözümler.',
      'Footer.clinic': 'Klinik',
      'Footer.privacy': 'Gizlilik Politikası',
      
      'Services.rhinoplasty': 'Rinoplasti',
      'Services.blepharoplasty': 'Göz Kapağı Estetiği',
      'Services.endolift': 'Endolift Lazer',
      'Services.botox': 'Botoks ve Dolgu',
      'Services.viewAll': 'Tümünü Gör'
    };
    translationMap['tr'] = JSON.stringify(defaultTr, null, 2);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Genel Metinler Yönetimi</h1>
        <p className="text-slate-500 mt-1">
          Menüler, Footer ve global buton metinlerini buradan yönetebilirsiniz.
        </p>
      </div>

      <TranslationEditor blockId={block.id} componentType={block.componentType} initialTranslations={translationMap} locales={locales} />
    </div>
  );
}
