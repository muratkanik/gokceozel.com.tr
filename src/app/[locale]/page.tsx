import prisma from "@/lib/prisma";
import Image from "next/image";
import { canonicalServiceSlug, hasDisplayableServiceText, serviceDescriptionFor, serviceTitleFor } from "@/lib/service-display";
import { OLD_SITE_MEDIA, OLD_SITE_SERVICE_IMAGES } from "@/lib/old-site-media";

export const revalidate = 60;
const localePath = (locale: string, path = '') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
};

const HERO_DEFAULT = {
  tr: {
    badge: 'Ankara · KBB Uzmanı',
    h1a: 'Doğal güzelliğin',
    h1b: 'sanatsal dokunuşu',
    subtitle: 'Rinoplastiden Endolift\'e, blefaroplastiden yüz kontürlemesine — 15+ yıllık akademik deneyimle kişiye özel estetik çözümler.',
    cta1: 'Ücretsiz Ön Görüşme',
    cta2: 'Hizmetleri İncele',
    stat1: 'Yıl deneyim', stat2: 'Bilimsel yayın', stat3: 'Akademik indeks', stat4: 'Hasta puanı ★',
  },
  en: {
    badge: 'Ankara · ENT Specialist',
    h1a: 'Artistic touch of',
    h1b: 'natural beauty',
    subtitle: 'From rhinoplasty to Endolift, from blepharoplasty to facial contouring — personalized aesthetic solutions with 15+ years of academic expertise.',
    cta1: 'Free Consultation',
    cta2: 'Explore Services',
    stat1: 'Years experience', stat2: 'Academic papers', stat3: 'h-index', stat4: 'Patient rating ★',
  },
  ar: {
    badge: 'أنقرة · اختصاصية الأنف والأذن والحنجرة',
    h1a: 'جمال طبيعي',
    h1b: 'بلمسة فنية',
    subtitle: 'حلول تجميلية شخصية من تجميل الأنف إلى Endolift والعيون وتحديد ملامح الوجه بخبرة أكاديمية تتجاوز 15 عاماً.',
    cta1: 'استشارة أولية',
    cta2: 'استكشاف الخدمات',
    stat1: 'سنة خبرة', stat2: 'منشور علمي', stat3: 'مؤشر H', stat4: 'تقييم المرضى ★',
  },
  ru: {
    badge: 'Анкара · ЛОР-специалист',
    h1a: 'Естественная красота',
    h1b: 'с врачебной точностью',
    subtitle: 'Индивидуальные эстетические решения: ринопластика, Endolift, блефаропластика и контурирование лица.',
    cta1: 'Консультация',
    cta2: 'Услуги',
    stat1: 'лет опыта', stat2: 'публикаций', stat3: 'h-index', stat4: 'оценка пациентов ★',
  },
  fr: {
    badge: 'Ankara · Spécialiste ORL',
    h1a: 'La beauté naturelle',
    h1b: 'avec précision',
    subtitle: 'Rhinoplastie, Endolift, blépharoplastie et traitements esthétiques personnalisés avec plus de 15 ans d’expérience académique.',
    cta1: 'Consultation',
    cta2: 'Voir les services',
    stat1: 'ans d’expérience', stat2: 'publications', stat3: 'h-index', stat4: 'avis patients ★',
  },
  de: {
    badge: 'Ankara · HNO-Spezialistin',
    h1a: 'Natürliche Schönheit',
    h1b: 'präzise geplant',
    subtitle: 'Individuelle ästhetische Lösungen von Rhinoplastik bis Endolift, Blepharoplastik und Gesichtskonturierung.',
    cta1: 'Beratung',
    cta2: 'Leistungen ansehen',
    stat1: 'Jahre Erfahrung', stat2: 'Publikationen', stat3: 'h-index', stat4: 'Patientenbewertung ★',
  }
};

const HOME_STRINGS_DEFAULT = {
  tr: {
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
    
    cta_tag: 'Randevu',
    cta_h2a: 'Kişiye özel',
    cta_h2b: 'ön görüşmenizi',
    cta_h2c: 'planlayın',
    cta_sub: 'Ankara Ümitköy\'deki kliniğimizde yüz yüze veya online görüşme fırsatı.',
    cta_cta1: 'WhatsApp ile iletişim',
    cta_cta2: '+90 534 209 69 35'
  },
  en: {
    services_tag: 'Specialties',
    services_title: 'Our Services',
    services_sub: 'Personalized planning, evidence-based techniques, transparent follow-up — comprehensive aesthetic solutions across six key areas.',
    services_cta: 'Explore →',
    
    doctor_tag: 'Meet the Doctor',
    doctor_bio1: 'Graduate of Istanbul University Cerrahpaşa English Medicine. Specialized at Dışkapı Yıldırım Beyazıt Training Hospital ENT Clinic. Faculty member at Kırıkkale University Faculty of Medicine 2013–2021.',
    doctor_bio2: 'Associate Professor 2015, Full Professor 2021. Board Member of Turkish Society of Facial Plastic Surgery, member of European Academy of Facial Plastic Surgery. International advisory board of CMAC.',
    doctor_s1: 'National & international publications',
    doctor_s2: 'Academic citation index',
    doctor_s3: 'TYPCD Board Member',
    doctor_s4: 'International advisory board',
    
    cta_tag: 'Appointment',
    cta_h2a: 'Schedule your',
    cta_h2b: 'personalized',
    cta_h2c: 'consultation',
    cta_sub: 'In-person or online appointment at our clinic in Ümitköy, Ankara.',
    cta_cta1: 'Contact via WhatsApp',
    cta_cta2: '+90 534 209 69 35'
  },
  ar: {
    services_tag: 'مجالات الخبرة',
    services_title: 'خدماتنا',
    services_sub: 'تخطيط فردي، تقنيات مبنية على الدليل، ومتابعة واضحة في خدمات تجميل الوجه والأنف.',
    services_cta: 'اقرأ المزيد →',
    doctor_tag: 'تعرفوا على الطبيبة',
    doctor_bio1: 'تخرجت من كلية الطب الإنجليزية بجامعة إسطنبول جراح باشا، وأكملت تخصص الأنف والأذن والحنجرة في مستشفى دشكابي يلدريم بيازيد.',
    doctor_bio2: 'حصلت على لقب أستاذ مشارك عام 2015 وأستاذة عام 2021، وهي عضو في جمعية جراحة تجميل الوجه التركية والأوروبية.',
    doctor_s1: 'منشورات وطنية ودولية',
    doctor_s2: 'مؤشر الاقتباس الأكاديمي',
    doctor_s3: 'عضوية مجلس الإدارة',
    doctor_s4: 'مجلس استشاري دولي',
    cta_tag: 'موعد',
    cta_h2a: 'خططوا',
    cta_h2b: 'لاستشارتكم',
    cta_h2c: 'الشخصية',
    cta_sub: 'استشارة حضورية أو عبر الإنترنت في عيادتنا في أوميتكوي، أنقرة.',
    cta_cta1: 'تواصل عبر واتساب',
    cta_cta2: '+90 534 209 69 35'
  },
  ru: {
    services_tag: 'Направления',
    services_title: 'Услуги клиники',
    services_sub: 'Персональное планирование, доказательные методики и понятное сопровождение.',
    services_cta: 'Подробнее →',
    doctor_tag: 'О враче',
    doctor_bio1: 'Выпускница англоязычного медицинского факультета Стамбульского университета Cerrahpaşa, специализация ЛОР в Dışkapı Yıldırım Beyazıt.',
    doctor_bio2: 'Доцент с 2015 года, профессор с 2021 года. Член турецких и европейских обществ лицевой пластической хирургии.',
    doctor_s1: 'национальных и международных публикаций',
    doctor_s2: 'академический индекс цитирования',
    doctor_s3: 'член правления',
    doctor_s4: 'международный совет',
    cta_tag: 'Запись',
    cta_h2a: 'Запланируйте',
    cta_h2b: 'персональную',
    cta_h2c: 'консультацию',
    cta_sub: 'Очная или онлайн-консультация в клинике в Ümitköy, Анкара.',
    cta_cta1: 'Связаться в WhatsApp',
    cta_cta2: '+90 534 209 69 35'
  },
  fr: {
    services_tag: 'Expertises',
    services_title: 'Nos Services',
    services_sub: 'Planification personnalisée, techniques fondées sur les preuves et suivi transparent.',
    services_cta: 'Découvrir →',
    doctor_tag: 'Rencontrer le médecin',
    doctor_bio1: 'Diplômée de la Faculté de Médecine anglaise Cerrahpaşa de l’Université d’Istanbul, spécialisée en ORL à Dışkapı Yıldırım Beyazıt.',
    doctor_bio2: 'Maître de conférences en 2015, Professeure en 2021. Membre de sociétés turques et européennes de chirurgie plastique faciale.',
    doctor_s1: 'publications nationales et internationales',
    doctor_s2: 'indice de citation académique',
    doctor_s3: 'membre du conseil',
    doctor_s4: 'conseil international',
    cta_tag: 'Rendez-vous',
    cta_h2a: 'Planifiez',
    cta_h2b: 'votre consultation',
    cta_h2c: 'personnalisée',
    cta_sub: 'Consultation en clinique ou en ligne à Ümitköy, Ankara.',
    cta_cta1: 'Contacter via WhatsApp',
    cta_cta2: '+90 534 209 69 35'
  },
  de: {
    services_tag: 'Schwerpunkte',
    services_title: 'Unsere Leistungen',
    services_sub: 'Individuelle Planung, evidenzbasierte Methoden und transparente Nachbetreuung.',
    services_cta: 'Entdecken →',
    doctor_tag: 'Die Ärztin',
    doctor_bio1: 'Absolventin der englischsprachigen medizinischen Fakultät Cerrahpaşa der Universität Istanbul, HNO-Facharztausbildung am Dışkapı Yıldırım Beyazıt.',
    doctor_bio2: 'Dozentin seit 2015, Professorin seit 2021. Mitglied türkischer und europäischer Fachgesellschaften für Gesichtschirurgie.',
    doctor_s1: 'nationale und internationale Publikationen',
    doctor_s2: 'akademischer Zitationsindex',
    doctor_s3: 'Vorstandsmitglied',
    doctor_s4: 'internationaler Beirat',
    cta_tag: 'Termin',
    cta_h2a: 'Planen Sie',
    cta_h2b: 'Ihre persönliche',
    cta_h2c: 'Beratung',
    cta_sub: 'Persönlich oder online in unserer Klinik in Ümitköy, Ankara.',
    cta_cta1: 'WhatsApp Kontakt',
    cta_cta2: '+90 534 209 69 35'
  }
};

const SERVICE_FALLBACK = [
  { slug: 'rinoplasti', title: 'Rinoplasti', description: 'Burun estetiğinde doğal görünüm, nefes fonksiyonu ve yüz oranlarını birlikte değerlendiren kişiye özel planlama.', image: OLD_SITE_SERVICE_IMAGES.rinoplasti },
  { slug: 'endolift', title: 'Endolift Lazer', description: 'Yüz ve gıdı bölgesinde kesi gerektirmeyen lazer destekli sıkılaşma ve kontürleme yaklaşımı.', image: OLD_SITE_SERVICE_IMAGES.endolift },
  { slug: 'gz-kapa-estetii', title: 'Göz Kapağı Estetiği', description: 'Üst ve alt göz kapağı bölgesinde daha dinlenmiş, açık ve doğal bir ifade hedefleyen uygulamalar.', image: OLD_SITE_SERVICE_IMAGES['gz-kapa-estetii'] },
  { slug: 'botoks', title: 'Botoks', description: 'Mimik çizgilerini yumuşatmaya ve yüz ifadesini korumaya yönelik medikal estetik uygulamalar.', image: OLD_SITE_SERVICE_IMAGES.botoks },
  { slug: 'dolgu', title: 'Dolgu Uygulamaları', description: 'Yüz hacmi, dudak ve kontür ihtiyaçlarına göre planlanan hyalüronik asit dolgu uygulamaları.', image: OLD_SITE_SERVICE_IMAGES.dolgu },
  { slug: 'ip-aski', title: 'İp Askılama', description: 'Yüz ovalini desteklemek ve hafif sarkmaları toparlamak için ameliyatsız askılama seçenekleri.', image: OLD_SITE_SERVICE_IMAGES['ip-aski'] },
];

const GALLERY_COPY = {
  tr: {
    tag: 'Klinikten Kareler',
    title: 'Uygulamalar, teknoloji ve doğal sonuç odağı',
    text: 'Eski siteden gelen görsel arşiv ve yeni tasarım dili birlikte kullanıldı; ziyaretçi hem doktoru hem de uygulama alanlarını ilk bakışta hisseder.',
    stat1: '360°', stat1sub: 'Yüz oranı planlama',
    stat2: 'Doğal', stat2sub: 'Sonuç odaklı yaklaşım',
  },
  en: {
    tag: 'Visual Journey',
    title: 'Treatments, technology and a natural-result focus',
    text: 'The visual archive from the previous site is carried into the new experience so visitors immediately see the doctor, treatments and clinical approach.',
    stat1: '360°', stat1sub: 'Facial proportion planning',
    stat2: 'Natural', stat2sub: 'Result-focused approach',
  },
  ar: {
    tag: 'من العيادة',
    title: 'العلاجات والتقنيات والنتائج الطبيعية',
    text: 'تم توظيف أرشيف الصور القديم ضمن تجربة حديثة تعكس الطبيبة والخدمات ونهج العيادة من النظرة الأولى.',
    stat1: '360°', stat1sub: 'تخطيط نسب الوجه',
    stat2: 'طبيعي', stat2sub: 'نهج موجّه نحو النتائج',
  },
  ru: {
    tag: 'Визуальная история',
    title: 'Процедуры, технологии и естественный результат',
    text: 'Визуальный архив старого сайта перенесён в новый дизайн, чтобы посетитель сразу видел врача, услуги и подход клиники.',
    stat1: '360°', stat1sub: 'Планирование пропорций лица',
    stat2: 'Естественно', stat2sub: 'Ориентация на результат',
  },
  fr: {
    tag: 'Parcours Visuel',
    title: 'Soins, technologie et résultats naturels',
    text: "Les visuels de l'ancien site sont intégrés à la nouvelle expérience pour montrer le médecin, les traitements et l'approche clinique.",
    stat1: '360°', stat1sub: 'Planification des proportions',
    stat2: 'Naturel', stat2sub: 'Approche axée sur les résultats',
  },
  de: {
    tag: 'Visuelle Eindrücke',
    title: 'Behandlungen, Technologie und natürliche Ergebnisse',
    text: 'Das Bildarchiv der alten Website wird in die neue Gestaltung übernommen und zeigt Ärztin, Leistungen und Klinikansatz auf den ersten Blick.',
    stat1: '360°', stat1sub: 'Gesichtsproportionsplanung',
    stat2: 'Natürlich', stat2sub: 'Ergebnisorientierter Ansatz',
  },
};

const HOME_GALLERY_EXCLUDED_IMAGES = new Set([
  '/old-site/gallery/gokce-banner.jpg',
  '/old-site/gallery/yuz-estetigi-uygulama.png',
  '/old-site/blog/blog-img-1.jpg',
  '/old-site/blog/blog-img-2.jpg',
  '/old-site/blog/blog-img-3.jpg',
  '/old-site/blog/blog-img-4.jpg',
  '/old-site/blog/blog-featured-1.jpg',
  '/old-site/blog/blog-featured-2.jpg',
  '/old-site/blog/blog-featured-3.jpg',
  '/old-site/services/dolgu.jpg',
  '/images/gokceozel.png',
]);

const GALLERY_IMAGES = [
  ...OLD_SITE_MEDIA
    .filter((item) => !HOME_GALLERY_EXCLUDED_IMAGES.has(item.url))
    .map((item) => ({ src: item.url, alt: item.name })),
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      include: {
        page: {
          include: {
            blocks: {
              where: { componentType: 'text_block' },
              include: { translations: { where: { locale } } },
            },
            seoMeta: true,
          },
        },
      },
      take: 6,
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Home services fetch failed', e);
  }

  let blocks: any[] = [];
  try {
    blocks = await prisma.contentBlock.findMany({
      where: {
        componentType: { in: ['hero', 'home_page_strings'] }
      },
      include: {
        translations: { where: { locale } }
      }
    });
  } catch (e) {
    console.error('Home strings fetch failed', e);
  }

  let heroData = null;
  let homeStringsData = null;

  blocks.forEach(block => {
    if (block.componentType === 'hero' && block.translations.length > 0) {
      try {
        const slides = JSON.parse(block.translations[0].contentData);
        if (Array.isArray(slides) && slides.length > 0) {
          // If the AI outputted the old hero format as a single object inside the array
          heroData = slides[0]; 
        } else if (typeof slides === 'object' && slides !== null && !Array.isArray(slides)) {
          heroData = slides;
        }
      } catch (e) {
        console.error('Hero JSON parse error', e);
      }
    } else if (block.componentType === 'home_page_strings' && block.translations.length > 0) {
      try {
        homeStringsData = JSON.parse(block.translations[0].contentData);
      } catch (e) {
        console.error('Home Strings JSON parse error', e);
      }
    }
  });

  // Fallback to static objects if DB is empty for this locale
  const h = (heroData || HERO_DEFAULT[locale as keyof typeof HERO_DEFAULT] || HERO_DEFAULT.tr) as Record<string, string>;
  const s = (homeStringsData || HOME_STRINGS_DEFAULT[locale as keyof typeof HOME_STRINGS_DEFAULT] || HOME_STRINGS_DEFAULT.tr) as Record<string, string>;
  const gallery = GALLERY_COPY[locale as keyof typeof GALLERY_COPY] || GALLERY_COPY.tr;
  const displayServices = (services.length ? services : SERVICE_FALLBACK)
    .filter((service) => {
      const rawSlug = service.page?.slug || service.slug || '';
      const seoTrans = service.page?.seoMeta?.find((sm: { locale: string }) => sm.locale === locale)
                    || service.page?.seoMeta?.find((sm: { locale: string }) => sm.locale === 'tr');

      return hasDisplayableServiceText(rawSlug, [
        seoTrans?.metaTitle,
        seoTrans?.metaDescription,
        service.title,
        service.page?.titleInternal,
        service.description,
      ]);
    })
    .slice(0, 6);
  
  const contactHref = localePath(locale, '/iletisim');
  const servicesHref = localePath(locale, '/hizmetler');

  return (
    <>
      <section className="luxury-hero relative overflow-hidden min-h-[calc(82svh-80px)] flex items-center">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbf8f2] to-transparent" />
        <div className="max-w-7xl mx-auto px-5 lg:px-6 relative py-16 lg:py-24 w-full">
          <div className="text-white max-w-[880px]">
            <span className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#e1c996]/35 rounded-full bg-white/10 text-xs text-[#f5dfab] font-bold tracking-[0.12em] uppercase shadow-sm backdrop-blur-md">
              {h.badge || 'Ankara · KBB Uzmanı'}
            </span>
            <h1 className="font-serif text-[clamp(48px,7vw,96px)] leading-[0.96] my-7 max-w-[820px]">
              {h.h1a || h.title || 'Doğal güzelliğin'}{' '}
              <span className="gold-gradient-text">{h.h1b || ''}</span>
            </h1>
            <p className="text-[18px] lg:text-[21px] text-[#efe8dc] max-w-[650px] mb-9 leading-relaxed">{h.subtitle || h.description || ''}</p>
            <div className="flex flex-wrap gap-3">
              <a href={h.buttonLink || contactHref} className="bg-[#e1c996] text-[#151714] px-7 py-4 rounded-full font-bold text-sm tracking-wide shadow-[0_18px_42px_rgba(0,0,0,0.28)] hover:bg-white transition-colors">
                {h.cta1 || h.buttonText || 'Ücretsiz Ön Görüşme'}
              </a>
              <a href={servicesHref} className="border border-white/25 bg-white/10 text-white px-7 py-[15px] rounded-full font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-md">
                {h.cta2 || 'Hizmetleri İncele'}
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-11 max-w-[720px]">
              <div className="hero-stat-card rounded-2xl p-4 text-xs text-[#48544f] min-h-[76px]"><strong className="block font-serif text-[#6f263d] text-[32px] leading-none font-semibold tracking-tight">15+</strong><span className="block mt-2 leading-tight">{h.stat1 || 'Yıl deneyim'}</span></div>
              <div className="hero-stat-card rounded-2xl p-4 text-xs text-[#48544f] min-h-[76px]"><strong className="block font-serif text-[#6f263d] text-[32px] leading-none font-semibold tracking-tight">100+</strong><span className="block mt-2 leading-tight">{h.stat2 || 'Bilimsel yayın'}</span></div>
              <div className="hero-stat-card rounded-2xl p-4 text-xs text-[#48544f] min-h-[76px]"><strong className="block font-serif text-[#6f263d] text-[32px] leading-none font-semibold tracking-tight">H-12</strong><span className="block mt-2 leading-tight">{h.stat3 || 'Akademik indeks'}</span></div>
              <div className="hero-stat-card rounded-2xl p-4 text-xs text-[#48544f] min-h-[76px]"><strong className="block font-serif text-[#6f263d] text-[32px] leading-none font-semibold tracking-tight">4.9</strong><span className="block mt-2 leading-tight">{h.stat4 || 'Hasta puanı ★'}</span></div>
            </div>

            {/* Certification & Accreditation Strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-8 max-w-[720px]">
              {/* Health Turkey */}
              <a
                href="https://healthturkey.gov.tr"
                target="_blank"
                rel="noopener noreferrer"
                title="T.C. Sağlık Bakanlığı – Health Turkey"
                className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity"
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="22" r="22" fill="#E30A17"/>
                  <path d="M14 16.5C14 13.46 16.46 11 19.5 11C21.55 11 23.35 12.12 24.3 13.77C24.87 13.56 25.5 13.44 26.15 13.44C28.82 13.44 31 15.62 31 18.29C31 20.96 28.82 23.14 26.15 23.14H13.85C11.18 23.14 9 20.96 9 18.29C9 15.83 10.82 13.8 13.18 13.51C13.07 14.09 13 14.69 13 15.31C13 15.71 13.03 16.11 13.08 16.5H14Z" fill="white"/>
                  <rect x="11" y="25" width="22" height="2.8" rx="1.4" fill="white" fillOpacity="0.8"/>
                  <rect x="14" y="30" width="16" height="2.8" rx="1.4" fill="white" fillOpacity="0.55"/>
                </svg>
                <div className="leading-none">
                  <div className="text-[#E30A17] text-[15px] font-extrabold tracking-widest leading-none">HEALTH</div>
                  <div className="text-[#1a1a1a] text-[13px] tracking-[0.22em] font-semibold leading-none mt-1">TURKEY</div>
                  <div className="text-[#48544f] text-[11px] leading-none mt-1 font-medium">T.C. Sağlık Bakanlığı</div>
                </div>
              </a>

              <div className="w-px h-10 bg-[#48544f]/25 hidden sm:block"/>

              {/* Sağlık Turizmi Belgesi */}
              <a
                href="/images/saglik-turizmi-belgesi.jpg"
                target="_blank"
                rel="noopener noreferrer"
                title="Uluslararası Sağlık Turizmi Yetki Belgesi"
                className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity group"
              >
                <div className="relative w-16 h-11 rounded-md border border-[#48544f]/30 overflow-hidden flex-shrink-0 group-hover:border-[#6f263d]/50 transition-colors shadow-sm">
                  <Image src="/images/saglik-turizmi-belgesi.jpg" alt="Sağlık Turizmi Yetki Belgesi" fill className="object-cover" sizes="64px"/>
                </div>
                <div className="leading-tight">
                  <div className="text-[#1a1a1a] text-[13px] font-bold leading-snug">Sağlık Turizmi</div>
                  <div className="text-[#48544f] text-[12px] font-medium leading-snug">Yetki Belgesi</div>
                  <div className="text-[#6f263d] text-[11px] leading-snug">Uluslararası</div>
                </div>
              </a>

              <div className="w-px h-10 bg-[#48544f]/25 hidden sm:block"/>

              {/* TYPCD & CMAC */}
              <div className="flex gap-2.5">
                <span className="border border-[#48544f]/35 text-[#48544f] text-[12px] font-semibold px-3 py-1.5 rounded-full tracking-wide">TYPCD Üyesi</span>
                <span className="border border-[#48544f]/35 text-[#48544f] text-[12px] font-semibold px-3 py-1.5 rounded-full tracking-wide">CMAC Üyesi</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="visual-band py-20 lg:py-28 border-y border-[#315a52]/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="section-kicker mb-3.5">{s.services_tag}</span>
              <h2 className="font-serif text-[clamp(36px,4.4vw,62px)] leading-[1.02] text-[#151714]">{s.services_title}</h2>
            </div>
            <p className="text-[#5d6964] max-w-[660px] text-[16px] lg:text-[17px] leading-relaxed">{s.services_sub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {displayServices.map((service) => {
              const seoTrans = service.page?.seoMeta?.find((sm: { locale: string }) => sm.locale === locale)
                            || service.page?.seoMeta?.find((sm: { locale: string }) => sm.locale === 'tr');
              const rawSlug = service.page?.slug || service.slug || '';
              const slug = canonicalServiceSlug(rawSlug, [
                seoTrans?.metaTitle,
                service.title,
                service.page?.titleInternal,
              ]);
              const title = serviceTitleFor(slug, locale, [
                seoTrans?.metaTitle,
                service.title,
                service.page?.titleInternal,
              ]);
              const desc = serviceDescriptionFor(slug, locale, [
                seoTrans?.metaDescription,
                service.description,
              ]);
              const href = localePath(locale, `/hizmetler/${slug}`);
              const bgImage = OLD_SITE_SERVICE_IMAGES[slug] || seoTrans?.ogImage || service.image || '/images/logo.png';

              return (
                <div key={service.id || slug} className="service-signature-card group relative rounded-[1.55rem] overflow-hidden min-h-[390px] flex flex-col justify-end border border-white/80 bg-white transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 z-0 bg-[#dbe7e7]">
                    <Image src={bgImage} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover image-polish group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  
                  <div className="relative z-10 p-7 text-white">
                    <div className="w-12 h-12 rounded-full bg-[#fbf8f2]/90 grid place-items-center text-[#6f263d] text-[20px] mb-5 backdrop-blur-sm shadow-lg">✦</div>
                    <h3 className="font-serif text-[25px] mb-2.5 leading-snug">{title}</h3>
                    {desc && <p className="text-[#dbe5e1] text-sm mb-4 line-clamp-3 leading-relaxed">{desc}</p>}
                    <a href={href} className="text-[#d7bb7b] text-[13px] font-bold tracking-wider transition-colors mt-2 inline-block">
                      {s.services_cta}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#111714] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-6 grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-14 items-center">
          <div className="relative z-10">
            <span className="section-kicker mb-4 !text-[#e1c996]">{gallery.tag}</span>
            <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] leading-[1.02] mb-5">{gallery.title}</h2>
            <p className="text-[#cbd8d3] text-[16px] lg:text-[17px] leading-relaxed">{gallery.text}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-[420px]">
              <div className="border border-white/10 bg-white/10 rounded-2xl p-4">
                <strong className="font-serif text-[#e1c996] text-3xl block">{gallery.stat1}</strong>
                <span className="text-xs text-[#cbd8d3]">{gallery.stat1sub}</span>
              </div>
              <div className="border border-white/10 bg-white/10 rounded-2xl p-4">
                <strong className="font-serif text-[#e1c996] text-3xl block">{gallery.stat2}</strong>
                <span className="text-xs text-[#cbd8d3]">{gallery.stat2sub}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            {GALLERY_IMAGES.map((image, index) => (
              <div
                key={image.src}
                className={`relative overflow-hidden rounded-[1.35rem] bg-white/10 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${index === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto' : index === 4 ? 'md:col-span-2 aspect-[16/10]' : 'aspect-square'}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 22vw"
                  className="object-cover image-polish transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="doctor-prestige py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-6 grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr] gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.2rem] border border-[#e1c996]/20" />
            <div className="aspect-[4/5] rounded-[1.8rem] bg-[#dbe7e7] border border-white/15 overflow-hidden relative shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
              <Image src="/images/gokceozel.png" alt="Prof. Dr. Gökçe Özel" fill className="absolute inset-0 object-cover object-[center_top] image-polish" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111714]/80 to-transparent" />
            </div>
          </div>
          <div>
            <span className="section-kicker mb-5 !text-[#e1c996]">{s.doctor_tag}</span>
            <h2 className="font-serif text-[clamp(36px,4.5vw,66px)] leading-[1.03] mb-5 text-white">Prof. Dr. Gökçe Özel</h2>
            <p className="text-[#d6ded9] text-[16px] lg:text-[17px] leading-relaxed mb-4">{s.doctor_bio1}</p>
            <p className="text-[#d6ded9] text-[16px] lg:text-[17px] leading-relaxed mb-4">{s.doctor_bio2}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
              <div className="border border-white/10 bg-white/10 p-[18px] rounded-2xl backdrop-blur-sm">
                <strong className="block font-serif text-[#e1c996] text-[28px]">100+</strong>
                <span className="text-[#cbd8d3] text-[12px]">{s.doctor_s1}</span>
              </div>
              <div className="border border-white/10 bg-white/10 p-[18px] rounded-2xl backdrop-blur-sm">
                <strong className="block font-serif text-[#e1c996] text-[28px]">H-12</strong>
                <span className="text-[#cbd8d3] text-[12px]">{s.doctor_s2}</span>
              </div>
              <div className="border border-white/10 bg-white/10 p-[18px] rounded-2xl backdrop-blur-sm">
                <strong className="block font-serif text-[#e1c996] text-[28px]">TYPCD</strong>
                <span className="text-[#cbd8d3] text-[12px]">{s.doctor_s3}</span>
              </div>
              <div className="border border-white/10 bg-white/10 p-[18px] rounded-2xl backdrop-blur-sm">
                <strong className="block font-serif text-[#e1c996] text-[28px]">CMAC</strong>
                <span className="text-[#cbd8d3] text-[12px]">{s.doctor_s4}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0">
          <Image src="/uploads/endolift_lazer.png" alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f2] via-[#fbf8f2]/95 to-[#edf3f1]/90" />
        </div>
        <div className="relative max-w-[860px] mx-auto px-6 text-center">
          <span className="section-kicker mb-4">{s.cta_tag}</span>
          <h2 className="font-serif text-[clamp(38px,5vw,66px)] leading-[1.03] mb-5 text-[#151714]">
            {s.cta_h2a}{' '}
            <span className="gold-gradient-text">{s.cta_h2b}</span>
            {' '}{s.cta_h2c}
          </h2>
          <p className="text-[#5d6964] mb-8 text-[17px] leading-relaxed max-w-[680px] mx-auto">{s.cta_sub}</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <a href="https://wa.me/905342096935" className="bg-[#151714] text-white px-8 py-4 rounded-full font-bold shadow-[0_18px_42px_rgba(21,23,20,0.18)] hover:bg-[#315a52] transition-colors">
              {s.cta_cta1}
            </a>
            <a href="tel:+905342096935" className="border border-[#315a52]/25 bg-white/55 text-[#151714] px-8 py-[15px] rounded-full hover:bg-white transition-colors">
              {s.cta_cta2}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
