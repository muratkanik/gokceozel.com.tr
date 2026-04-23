import prisma from '@/lib/prisma';
import { BiographyData } from '@/components/admin/BiographyManager';
import Image from 'next/image';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function BiyografiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch the page from Prisma
  const page = await prisma.page.findUnique({
    where: { slug: 'gokce-ozel-kimdir' },
    include: {
      blocks: {
        where: { componentType: 'biography', isActive: true },
        include: {
          translations: {
            where: { locale }
          }
        }
      }
    }
  });

  const bioBlock = page?.blocks[0];
  let data: BiographyData | null = null;
  
  if (bioBlock && bioBlock.translations.length > 0) {
    try {
      data = JSON.parse(bioBlock.translations[0].contentData);
    } catch (e) {
      console.error('Failed to parse biography JSON');
    }
  }

  // Fallback data if no blocks are configured yet
  if (!data) {
    data = {
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
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header / Hero Profile */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', md: 'row', gap: '40px', padding: '40px', borderRadius: '20px', marginBottom: '60px', border: '1px solid #222' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            <div style={{ flexShrink: 0, width: '250px', height: '350px', position: 'relative', borderRadius: '15px', overflow: 'hidden', border: '2px solid var(--color-gold)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {data.image ? (
                <img src={data.image} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#222' }} />
              )}
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <h1 className="gold-gradient-text" style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '10px', lineHeight: 1.1 }}>
                {data.title}
              </h1>
              <h2 style={{ fontSize: '1.2rem', color: '#aaa', fontWeight: 300, letterSpacing: '1px', marginBottom: '30px', textTransform: 'uppercase' }}>
                {data.subtitle}
              </h2>
              
              <div 
                className="prose prose-invert max-w-none"
                style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: data.about }} 
              />
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        {data.timeline && data.timeline.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <h3 className="gold-gradient-text" style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '40px', textAlign: 'center' }}>
              Eğitim ve Kariyer
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '20px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--color-gold) 0%, transparent 100%)', opacity: 0.3 }} />
              
              {data.timeline.map((item, i) => (
                <div key={item.id} className="glass" style={{ display: 'flex', gap: '30px', padding: '25px', borderRadius: '15px', position: 'relative', border: '1px solid #222' }}>
                  {/* Dot */}
                  <div style={{ width: '15px', height: '15px', background: 'var(--color-gold)', borderRadius: '50%', position: 'absolute', left: '13.5px', top: '32px', boxShadow: '0 0 10px var(--color-gold)' }} />
                  
                  <div style={{ width: '120px', flexShrink: 0, paddingLeft: '30px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>{item.year}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '10px' }}>{item.title}</h4>
                    <p style={{ color: '#aaa', lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Section */}
        {data.certificates && data.certificates.length > 0 && (
          <div>
            <h3 className="gold-gradient-text" style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '40px', textAlign: 'center' }}>
              Sertifika ve Belgeler
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
              {data.certificates.map(cert => (
                <div key={cert.id} className="glass hover:scale-105" style={{ padding: '15px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                  <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px', backgroundColor: '#111' }}>
                    {cert.image && (
                      <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                  </div>
                  <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '1rem', fontWeight: 500 }}>{cert.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
