import type { BiographyData } from '@/components/admin/BiographyManager';

export const BIOGRAPHY_LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

export const BIOGRAPHY_DEFAULT_TR: BiographyData = {
  image: '/images/gokceozel.png',
  title: 'Prof. Dr. Gökçe Özel',
  subtitle: 'Kulak Burun Boğaz Uzmanı, Yüz Plastik Cerrahisi ve Medikal Estetik Uygulamaları',
  about: [
    '<p>İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesi mezunuyum. Dışkapı Yıldırım Beyazıt Eğitim ve Araştırma Hastanesi Kulak Burun Boğaz Kliniğinde uzmanlık eğitimimi tamamladım.</p>',
    '<p>2013-2021 yılları arasında Kırıkkale Üniversitesi Tıp Fakültesi Kulak Burun Boğaz Anabilim Dalında öğretim üyesi olarak çalıştım. 2015 yılında Doçent, 2021 yılında Profesör unvanı aldım.</p>',
    '<p>Türkiye Yüz Plastik Cerrahi Derneği Yönetim Kurulu ve Avrupa Fasiyal Plastik Cerrahi Derneği üyesiyim. Complications in Medical Aesthetic Collaborative (CMAC) derneği uluslararası danışma kurulundayım.</p>',
    '<p>Ulusal ve uluslararası dergilerde yayınlanmış 100’ün üzerinde makalem mevcut olup H-index değerim 12’dir. Mesleki pratiğimde kulak burun boğaz branşının her alanında hastalarıma hizmet vermekteyim.</p>',
  ].join(''),
  timeline: [
    { id: 'cerrahpasa', year: 'Tıp Eğitimi', title: 'İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesi', description: 'Tıp fakültesi eğitimini İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesinde tamamladı.' },
    { id: 'diskapi', year: 'Uzmanlık', title: 'Dışkapı Yıldırım Beyazıt Eğitim ve Araştırma Hastanesi', description: 'Kulak Burun Boğaz Kliniğinde uzmanlık eğitimini tamamladı.' },
    { id: 'kirikkale', year: '2013-2021', title: 'Kırıkkale Üniversitesi Tıp Fakültesi', description: 'Kulak Burun Boğaz Anabilim Dalında öğretim üyesi olarak görev yaptı.' },
    { id: 'docent', year: '2015', title: 'Doçentlik', description: 'Kulak Burun Boğaz alanında Doçent unvanı aldı.' },
    { id: 'profesor', year: '2021', title: 'Profesörlük', description: 'Kulak Burun Boğaz alanında Profesör unvanı aldı.' },
    { id: 'dernekler', year: 'Üyelikler', title: 'TYPCD, Avrupa Fasiyal Plastik Cerrahi Derneği ve CMAC', description: 'Türkiye Yüz Plastik Cerrahi Derneği Yönetim Kurulu üyesi, Avrupa Fasiyal Plastik Cerrahi Derneği üyesi ve CMAC uluslararası danışma kurulu üyesidir.' },
    { id: 'yayinlar', year: 'Akademik', title: '100+ yayın ve H-index 12', description: 'Ulusal ve uluslararası dergilerde yayınlanmış 100’ün üzerinde makalesi ve H-index 12 akademik göstergesi bulunmaktadır.' },
  ],
  certificates: [],
};

export function completeBiographyData(data: BiographyData | null, locale: string): BiographyData {
  const merged = {
    ...BIOGRAPHY_DEFAULT_TR,
    ...(data || {}),
  };

  if (locale === 'tr') {
    const text = `${merged.about || ''} ${JSON.stringify(merged.timeline || [])}`;
    const hasOldBioFacts = [
      'Cerrahpaşa',
      'Dışkapı Yıldırım Beyazıt',
      'Kırıkkale Üniversitesi',
      'Doçent',
      'Profesör',
      'CMAC',
      '100',
      'H-index',
    ].every((needle) => text.includes(needle));

    if (!hasOldBioFacts) {
      return BIOGRAPHY_DEFAULT_TR;
    }
  }

  return merged;
}
