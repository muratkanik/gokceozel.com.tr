import TranslationEditor from '@/components/admin/TranslationEditor';
import { ensureHomePageBlockExists } from './actions';

export default async function HomeStringsManagementPage() {
  const block = await ensureHomePageBlockExists();
  const locales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
  
  const translationMap: Record<string, string> = {};
  locales.forEach(loc => {
    const existing = block.translations.find((t: any) => t.locale === loc);
    translationMap[loc] = existing?.contentData || '{}'; 
  });

  // Default values for TR if it's completely empty
  if (translationMap['tr'] === '{}') {
    const defaultTr = {
      services_tag: 'Uzmanlık Alanları',
      services_title: 'Hizmetlerimiz',
      services_sub: 'Kişiye özel planlama, kanıta dayalı teknikler, şeffaf takip — altı ana alanda kapsamlı estetik çözümler.',
      services_cta: 'Keşfet →',
      
      doctor_tag: 'Tanışalım',
      doctor_bio1: 'İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesi mezunu. Dışkapı Yıldırım Beyazıt EAH KBB Kliniği\'nde uzmanlık eğitimi. 2013-2021 Kırıkkale Üniversitesi Tıp Fakültesi KBB Anabilim Dalı öğretim üyesi.',
      doctor_bio2: '2015\'te Doçent, 2021\'de Profesör unvanı aldı. Türkiye Yüz Plastik Cerrahi Derneği Yönetim Kurulu ve Avrupa Fasiyal Plastik Cerrahi Derneği üyesi. CMAC uluslararası danışma kurulunda görev alıyor.',
      doctor_s1: 'Ulusal ve uluslararası yayın',
      doctor_s2: 'Akademik atıf indeksi',
      doctor_s3: 'Yönetim Kurulu üyesi',
      doctor_s4: 'Uluslararası danışma kurulu',
      
      cta_h2a: 'Kişiye özel',
      cta_h2b: 'ön görüşmenizi',
      cta_h2c: 'planlayın',
      cta_sub: 'Ankara Ümitköy\'deki kliniğimizde yüz yüze veya online görüşme fırsatı.',
      cta_cta1: 'WhatsApp ile iletişim',
      cta_cta2: '+90 534 209 69 35'
    };
    translationMap['tr'] = JSON.stringify(defaultTr, null, 2);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ana Sayfa Metinleri</h1>
        <p className="text-slate-500 mt-1">
          Hizmetler başlığı, Doktor biyografisi ve en alttaki çağrı (CTA) metinlerini buradan yönetebilirsiniz.
        </p>
      </div>

      <TranslationEditor blockId={block.id} componentType={block.componentType} initialTranslations={translationMap} locales={locales} />
    </div>
  );
}
