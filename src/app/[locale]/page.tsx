import prisma from "@/lib/prisma";
import Image from "next/image";

export const revalidate = 60;

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
    
    cta_h2a: 'Schedule your',
    cta_h2b: 'personalized',
    cta_h2c: 'consultation',
    cta_sub: 'In-person or online appointment at our clinic in Ümitköy, Ankara.',
    cta_cta1: 'Contact via WhatsApp',
    cta_cta2: '+90 534 209 69 35'
  }
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch Services
  const services = await prisma.service.findMany({
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

  // Fetch Hero and Home Strings from DB
  const blocks = await prisma.contentBlock.findMany({
    where: {
      componentType: { in: ['hero', 'home_page_strings'] }
    },
    include: {
      translations: { where: { locale } }
    }
  });

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
  const h = heroData || HERO_DEFAULT[locale as keyof typeof HERO_DEFAULT] || HERO_DEFAULT.tr;
  const s = homeStringsData || HOME_STRINGS_DEFAULT[locale as keyof typeof HOME_STRINGS_DEFAULT] || HOME_STRINGS_DEFAULT.tr;
  
  const contactHref = locale === 'tr' ? '/iletisim' : `/${locale}/iletisim`;
  const servicesHref = locale === 'tr' ? '/hizmetler' : `/${locale}/hizmetler`;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] grid place-items-center overflow-hidden pt-[120px] pb-[60px]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_10%,rgba(184,137,60,0.22),transparent_55%),linear-gradient(180deg,#0f0d0b_0%,#1a1410_60%,#0f0d0b_100%)] pointer-events-none" />
        <div className="absolute w-[560px] h-[560px] rounded-full blur-[80px] opacity-[0.18] -right-[120px] -top-[80px] bg-[radial-gradient(circle,#b8893c,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 border border-gold/35 rounded-full text-xs text-gold-soft tracking-[0.12em] uppercase">
              ● {h.badge || 'Ankara · KBB Uzmanı'}
            </span>
            <h1 className="font-serif text-[clamp(44px,6vw,78px)] leading-[1.05] my-5">
              {h.h1a || h.title || 'Doğal güzelliğin'}{' '}
              <span className="bg-gradient-to-br from-[#f0d48e] via-gold to-[#8f6b2e] bg-clip-text text-transparent">{h.h1b || ''}</span>
            </h1>
            <p className="text-[19px] text-[#d9d1bf] max-w-[560px] mb-8">{h.subtitle || h.description || ''}</p>
            <div className="flex flex-wrap gap-3.5">
              <a href={h.buttonLink || contactHref} className="bg-gradient-to-br from-gold-soft to-[#8f6b2e] text-[#1a1410] px-7 py-4 rounded-full font-bold text-sm tracking-wide shadow-[0_10px_40px_-10px_rgba(184,137,60,0.6)] hover:scale-105 transition-transform">
                {h.cta1 || h.buttonText || 'Ücretsiz Ön Görüşme'}
              </a>
              <a href={servicesHref} className="border border-gold/50 text-paper px-7 py-[15px] rounded-full font-semibold text-sm hover:bg-gold/10 transition-colors">
                {h.cta2 || 'Hizmetleri İncele'}
              </a>
            </div>
            <div className="flex gap-8 mt-11 pt-7 border-t border-gold/20">
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">15+</strong>{h.stat1 || 'Yıl deneyim'}</div>
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">100+</strong>{h.stat2 || 'Bilimsel yayın'}</div>
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">H-12</strong>{h.stat3 || 'Akademik indeks'}</div>
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">4.9</strong>{h.stat4 || 'Hasta puanı ★'}</div>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-gold/20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2a2420] to-[#17130f]">
              <Image src={h.image || "/images/drgo_21.jpg"} alt="Prof. Dr. Gökçe Özel" fill className="absolute inset-0 object-cover object-[center_top] opacity-90" priority />
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex gap-2.5 flex-wrap">
              <span className="bg-dark/80 backdrop-blur-md border border-gold/30 px-3.5 py-2 rounded-full text-[11px] text-gold-soft">TYPCD Yönetim Kurulu</span>
              <span className="bg-dark/80 backdrop-blur-md border border-gold/30 px-3.5 py-2 rounded-full text-[11px] text-gold-soft">CMAC Uluslararası</span>
              <span className="bg-dark/80 backdrop-blur-md border border-gold/30 px-3.5 py-2 rounded-full text-[11px] text-gold-soft">Prof. · 2021</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#14110e] py-[100px] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.2em] uppercase text-gold block mb-3.5">{s.services_tag}</span>
            <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1]">{s.services_title}</h2>
            <p className="text-muted max-w-[640px] mx-auto mt-4">{s.services_sub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => {
              const seoTrans = service.page?.seoMeta?.find((sm: { locale: string }) => sm.locale === locale)
                            || service.page?.seoMeta?.find((sm: { locale: string }) => sm.locale === 'tr');
              const title = seoTrans?.metaTitle || service.page?.slug || '';
              const desc = seoTrans?.metaDescription || '';
              const slug = service.page?.slug || '';
              const href = locale === 'tr' ? `/hizmetler/${slug}` : `/${locale}/hizmetler/${slug}`;
              const bgImage = seoTrans?.ogImage || '/images/logo.png';

              return (
                <div key={service.id} className="group relative border border-gold/15 rounded-[18px] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 overflow-hidden min-h-[280px] flex flex-col justify-end z-10">
                  <div className="absolute inset-0 z-0 bg-[#1a1410]">
                    <Image src={bgImage} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#14110e]/90 to-[#14110e]/40"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-[#8f6b2e]/10 grid place-items-center text-gold-soft text-[22px] mb-5 backdrop-blur-sm border border-gold/20 shadow-lg">◈</div>
                    <h3 className="font-serif text-[20px] mb-2.5 leading-snug">{title}</h3>
                    {desc && <p className="text-[#a89d89] text-sm mb-4 line-clamp-3">{desc}</p>}
                    <a href={href} className="text-gold-soft text-[13px] font-semibold tracking-wider group-hover:text-gold transition-colors mt-2 inline-block">
                      {s.services_cta}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctor */}
      <section className="bg-gradient-to-b from-[#0f0d0b] to-[#1a1410] py-[100px]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-20 items-center">
          <div className="aspect-[4/5] rounded-[20px] bg-gradient-to-br from-[#3d2f22] to-[#17130f] border border-gold/15 overflow-hidden relative">
            <Image src="/images/gokcebanner.jpg" alt="Prof. Dr. Gökçe Özel" fill className="absolute inset-0 object-cover object-[center_top] opacity-80" />
          </div>
          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-gold block mb-5">{s.doctor_tag}</span>
            <h2 className="font-serif text-[44px] leading-[1.1] mb-5">Prof. Dr. Gökçe Özel</h2>
            <p className="text-[#c9c0ae] text-[16px] mb-4">{s.doctor_bio1}</p>
            <p className="text-[#c9c0ae] text-[16px] mb-4">{s.doctor_bio2}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">100+</strong>
                <span className="text-muted text-[12px]">{s.doctor_s1}</span>
              </div>
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">H-12</strong>
                <span className="text-muted text-[12px]">{s.doctor_s2}</span>
              </div>
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">TYPCD</strong>
                <span className="text-muted text-[12px]">{s.doctor_s3}</span>
              </div>
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">CMAC</strong>
                <span className="text-muted text-[12px]">{s.doctor_s4}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gold/10 to-[#8f6b2e]/5 border-y border-gold/20 py-20">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <h2 className="font-serif text-[42px] mb-4">
            {s.cta_h2a}{' '}
            <span className="bg-gradient-to-br from-[#f0d48e] via-gold to-[#8f6b2e] bg-clip-text text-transparent">{s.cta_h2b}</span>
            {' '}{s.cta_h2c}
          </h2>
          <p className="text-[#c9c0ae] mb-7">{s.cta_sub}</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <a href="https://wa.me/905342096935" className="bg-gradient-to-br from-gold-soft to-[#8f6b2e] text-[#1a1410] px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
              {s.cta_cta1}
            </a>
            <a href="tel:+905342096935" className="border border-gold/50 text-paper px-8 py-[15px] rounded-full hover:bg-gold/10 transition-colors">
              {s.cta_cta2}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
