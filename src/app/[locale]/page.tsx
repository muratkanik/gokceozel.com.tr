import prisma from "@/lib/prisma";

export const revalidate = 60; // ISR cache for 60 seconds

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Fetch services from Prisma
  const services = await prisma.service.findMany({
    include: {
      page: {
        include: {
          blocks: {
            where: { componentType: 'text_block' },
            include: { translations: { where: { locale } } }
          }
        }
      }
    },
    take: 6,
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] grid place-items-center overflow-hidden pt-[120px] pb-[60px]">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_10%,rgba(184,137,60,0.22),transparent_55%),linear-gradient(180deg,#0f0d0b_0%,#1a1410_60%,#0f0d0b_100%)] pointer-events-none"></div>
        <div className="absolute w-[560px] h-[560px] rounded-full blur-[80px] opacity-[0.18] -right-[120px] -top-[80px] bg-[radial-gradient(circle,#b8893c,transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 border border-gold/35 rounded-full text-xs text-gold-soft tracking-[0.12em] uppercase">
              ● Ankara · KBB Uzmanı · Yüz Plastik Cerrahı
            </span>
            <h1 className="font-serif text-[clamp(44px,6vw,78px)] leading-[1.05] my-5">
              Doğal güzelliğin <span className="bg-gradient-to-br from-[#f0d48e] via-gold to-[#8f6b2e] bg-clip-text text-transparent">sanatsal dokunuşu</span>
            </h1>
            <p className="text-[19px] text-[#d9d1bf] max-w-[560px] mb-8">
              Rinoplastiden Endolift'e, blefaroplastiden yüz kontürlemesine — 15+ yıllık akademik deneyimle kişiye özel estetik çözümler.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a href={`/${locale}/iletisim`} className="bg-gradient-to-br from-gold-soft to-[#8f6b2e] text-[#1a1410] px-7 py-4 rounded-full font-bold text-sm tracking-wide shadow-[0_10px_40px_-10px_rgba(184,137,60,0.6)] hover:scale-105 transition-transform">
                Ücretsiz Ön Görüşme
              </a>
              <a href={`/${locale}/hizmetler`} className="border border-gold/50 text-paper px-7 py-[15px] rounded-full font-semibold text-sm hover:bg-gold/10 transition-colors">
                Hizmetleri İncele
              </a>
            </div>
            <div className="flex gap-8 mt-11 pt-7 border-t border-gold/20">
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">15+</strong>Yıl deneyim</div>
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">100+</strong>Bilimsel yayın</div>
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">H-12</strong>Akademik indeks</div>
              <div className="text-xs text-muted"><strong className="block font-serif text-gold-soft text-[28px] font-semibold tracking-tight">4.9</strong>Hasta puanı ★</div>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-gold/20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2a2420] to-[#17130f] grid place-items-center">
              {/* Fallback image if drgo_21 doesn't load */}
              <img src="/images/drgo_21.jpg" alt="Prof. Dr. Gökçe Özel" className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-90" />
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
            <span className="text-xs tracking-[0.2em] uppercase text-gold block mb-3.5">Uzmanlık Alanları</span>
            <h2 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1]">Hizmetlerimiz</h2>
            <p className="text-muted max-w-[640px] mx-auto mt-4">Kişiye özel planlama, kanıta dayalı teknikler, şeffaf takip — altı ana alanda kapsamlı estetik çözümleri.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {services.slice(0,6).map((service) => {
              const trans = service.page?.blocks?.[0]?.translations?.[0];
              let parsed = { title: service.page?.slug || '', content: '' };
              if (trans) {
                try {
                  parsed = JSON.parse(trans.contentData);
                } catch(e){}
              }
              return (
                <div key={service.id} className="bg-gradient-to-b from-[#1a1410] to-[#14110e] border border-gold/15 rounded-[18px] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 group relative overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-[#8f6b2e]/10 grid place-items-center text-gold-soft text-[22px] mb-5">
                    {service.iconKey ? '◈' : '◈'}
                  </div>
                  <h3 className="font-serif text-[22px] mb-2.5">{parsed.title}</h3>
                  <div className="text-muted text-sm mb-4.5 line-clamp-3" dangerouslySetInnerHTML={{ __html: parsed.content }} />
                  <a href={`/${locale}/hizmetler/${service.page?.slug}`} className="text-gold-soft text-[13px] font-semibold tracking-wider group-hover:text-gold transition-colors mt-4 inline-block">
                    Keşfet →
                  </a>
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
            <img src="/images/gokcebanner.jpg" alt="Prof. Dr. Gökçe Özel" className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-80" />
          </div>
          <div>
            <div className="text-left mb-5">
              <span className="text-xs tracking-[0.2em] uppercase text-gold">Tanışalım</span>
            </div>
            <h2 className="font-serif text-[44px] leading-[1.1] mb-5">Prof. Dr. Gökçe Özel</h2>
            <p className="text-[#c9c0ae] text-[16px] mb-4">
              İstanbul Üniversitesi Cerrahpaşa İngilizce Tıp Fakültesi mezunu. Dışkapı Yıldırım Beyazıt EAH KBB Kliniği'nde uzmanlık eğitimi. 2013-2021 Kırıkkale Üniversitesi Tıp Fakültesi KBB Anabilim Dalı öğretim üyesi.
            </p>
            <p className="text-[#c9c0ae] text-[16px] mb-4">
              2015'te Doçent, 2021'de Profesör unvanı aldı. Türkiye Yüz Plastik Cerrahi Derneği Yönetim Kurulu ve Avrupa Fasiyal Plastik Cerrahi Derneği üyesi. CMAC uluslararası danışma kurulunda görev alıyor.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">100+</strong>
                <span className="text-muted text-[12px]">Ulusal ve uluslararası yayın</span>
              </div>
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">H-12</strong>
                <span className="text-muted text-[12px]">Akademik atıf indeksi</span>
              </div>
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">TYPCD</strong>
                <span className="text-muted text-[12px]">Yönetim Kurulu üyesi</span>
              </div>
              <div className="p-[18px] border border-gold/15 rounded-xl bg-[#0f0d0b]/50">
                <strong className="block font-serif text-gold-soft text-[22px]">CMAC</strong>
                <span className="text-muted text-[12px]">Uluslararası danışma kurulu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gold/10 to-[#8f6b2e]/5 border-y border-gold/20 py-20">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <h2 className="font-serif text-[42px] mb-4">Kişiye özel <span className="bg-gradient-to-br from-[#f0d48e] via-gold to-[#8f6b2e] bg-clip-text text-transparent">ön görüşmenizi</span> planlayın</h2>
          <p className="text-[#c9c0ae] mb-7">Ankara Ümitköy'deki kliniğimizde yüz yüze veya online görüşme fırsatı.</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <a href="https://wa.me/905342096935" className="bg-gradient-to-br from-gold-soft to-[#8f6b2e] text-[#1a1410] px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
              WhatsApp ile iletişim
            </a>
            <a href="tel:+905342096935" className="border border-gold/50 text-paper px-8 py-[15px] rounded-full hover:bg-gold/10 transition-colors">
              +90 534 209 69 35
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
