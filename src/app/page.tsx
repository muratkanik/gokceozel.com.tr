import { supabase } from "@/lib/supabase/client";

export default async function Home() {
  // Fetch Maintenance Mode
  const { data: maintenanceData } = await supabase
    .from('content_entries')
    .select('translations')
    .eq('slug', 'maintenance_mode')
    .single();

  const isMaintenanceMode = maintenanceData?.translations?.is_active === true;

  if (isMaintenanceMode) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px',
        background: 'var(--color-bg-dark)'
      }}>
        <img src="/images/logo.png" alt="Gökçe Özel Logo" style={{ height: '80px', marginBottom: '30px', filter: 'brightness(0) invert(1)' }} />
        <h1 className="gold-gradient-text" style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>
          Yapım Aşamasında
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.6 }}>
          Prof. Dr. Gökçe Özel kliniği web sitesi çok yakında yeni ve modern yüzüyle sizlerle olacak. Anlayışınız için teşekkür ederiz.
        </p>
      </main>
    );
  }

  // Fetch Hero translations
  const { data: heroData } = await supabase
    .from('content_entries')
    .select('translations')
    .eq('slug', 'hero_section')
    .single();

  const heroContent = heroData?.translations?.tr || {
    title: "DOĞAL GÜZELLİĞİNİZİ YENİDEN TASARLAYIN.",
    subtitle: "Ankara'nın Yüz Estetiği ve Plastik Cerrahi Merkezi",
    button: "Tedavileri Keşfet"
  };

  // Fetch Services
  const { data: services } = await supabase
    .from('content_entries')
    .select('*')
    .eq('type', 'service')
    .contains('visible_locales', ['tr'])
    .limit(6);

  return (
    <main>
      <section className="hero-container" style={{
        backgroundImage: "radial-gradient(circle at center, rgba(183,110,121,0.15) 0%, rgba(10,10,12,1) 70%)"
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', padding: '0 40px', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ 
              fontSize: '4.5rem', 
              fontFamily: 'var(--font-serif)', 
              lineHeight: 1.1,
              marginBottom: '20px',
              color: 'var(--color-gold)'
            }} className="gold-gradient-text">
              {heroContent.title}
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '40px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              {heroContent.subtitle}
            </p>
            <a href="#treatments" className="btn-primary">{heroContent.button}</a>
          </div>
        </div>
      </section>

      <section id="treatments" style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="gold-gradient-text" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginBottom: '50px', textAlign: 'center' }}>
          İMZA TEDAVİLERİMİZ
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {services?.map((service) => {
            const content = service.translations.tr;
            return (
              <div key={service.id} className="glass" style={{ 
                borderRadius: '15px', 
                padding: '30px', 
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '15px', color: 'var(--color-gold)' }}>
                  {content.title || service.slug}
                </h3>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }} 
                     dangerouslySetInnerHTML={{ __html: content.content?.substring(0, 150) + '...' }} />
                <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Daha Fazla →
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  );
}
