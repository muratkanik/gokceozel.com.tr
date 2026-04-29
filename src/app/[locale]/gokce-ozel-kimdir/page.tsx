import prisma from '@/lib/prisma';
import { BiographyData } from '@/components/admin/BiographyManager';
import type { Metadata } from 'next';
import { BIOGRAPHY_DEFAULT_TR, completeBiographyData } from '@/lib/biography-defaults';

export const revalidate = 60;

const baseUrl = 'https://gokceozel.com.tr';
const allLocales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

const titles: Record<string, string> = {
  tr: 'Prof. Dr. Gökçe Özel Kimdir? | KBB ve Rinoplasti Uzmanı Ankara',
  en: 'About Prof. Dr. Gökçe Özel | ENT & Rhinoplasty Specialist Ankara',
  ar: 'من هي أ.د. غوكتشه أوزيل | أخصائية أنف وأذن وحنجرة في أنقرة',
  ru: 'О Проф. д-р Гёкче Озель | ЛОР и ринопластика в Анкаре',
  fr: 'À propos du Prof. Dr. Gökçe Özel | Spécialiste ORL Ankara',
  de: 'Über Prof. Dr. Gökçe Özel | HNO-Spezialistin Ankara',
};

const descriptions: Record<string, string> = {
  tr: '15+ yıl deneyim, 100+ uluslararası yayın ve H-index 12 ile Ankara\'nın önde gelen KBB ve rinoplasti uzmanı Prof. Dr. Gökçe Özel hakkında.',
  en: 'Learn about Prof. Dr. Gökçe Özel, Ankara\'s leading ENT and rhinoplasty specialist with 15+ years experience and 100+ international publications.',
  ar: 'تعرفوا على أ.د. غوكتشه أوزيل، اختصاصية الأنف والأذن والحنجرة وتجميل الأنف في أنقرة.',
  ru: 'Узнайте о проф. д-ре Гёкче Озель, ведущем специалисте по ЛОР и ринопластике в Анкаре.',
  fr: 'Découvrez le Prof. Dr. Gökçe Özel, spécialiste ORL et rhinoplastie à Ankara.',
  de: 'Erfahren Sie mehr über Prof. Dr. Gökçe Özel, Spezialistin für HNO und Rhinoplastik in Ankara.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/gokce-ozel-kimdir` };
  allLocales.forEach(loc => {
    languages[loc] = loc === 'tr' ? `${baseUrl}/gokce-ozel-kimdir` : `${baseUrl}/${loc}/gokce-ozel-kimdir`;
  });
  return {
    title: titles[locale] || titles.tr,
    description: descriptions[locale] || descriptions.tr,
    alternates: {
      canonical: locale === 'tr' ? `${baseUrl}/gokce-ozel-kimdir` : `${baseUrl}/${locale}/gokce-ozel-kimdir`,
      languages,
    },
    openGraph: {
      title: titles[locale] || titles.tr,
      description: descriptions[locale] || descriptions.tr,
      type: 'profile',
      images: [{ url: `${baseUrl}/images/dr-gokce-ozel.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function BiyografiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let page: any = null;
  try {
    page = await prisma.page.findUnique({
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
  } catch (e) {
    console.error('Biography fetch failed', e);
  }

  const bioBlock = page?.blocks[0];
  let data: BiographyData | null = null;
  
  if (bioBlock && bioBlock.translations.length > 0) {
    try {
      data = JSON.parse(bioBlock.translations[0].contentData);
    } catch (e) {
      console.error('Failed to parse biography JSON');
    }
  }

  data = completeBiographyData(data || BIOGRAPHY_DEFAULT_TR, locale);

  // Physician JSON-LD — E-E-A-T signal for Google + AI discovery
  const physicianJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${baseUrl}/#physician`,
    name: 'Prof. Dr. Gökçe Özel',
    givenName: 'Gökçe',
    familyName: 'Özel',
    honorificPrefix: 'Prof. Dr.',
    jobTitle: 'KBB Uzmanı ve Yüz Plastik Cerrahı',
    description: descriptions[locale] || descriptions.tr,
    url: locale === 'tr' ? `${baseUrl}/gokce-ozel-kimdir` : `${baseUrl}/${locale}/gokce-ozel-kimdir`,
    image: `${baseUrl}/images/dr-gokce-ozel.jpg`,
    telephone: '+90-534-209-69-35',
    email: 'info@gokceozel.com.tr',
    worksFor: {
      '@type': 'MedicalClinic',
      name: 'Prof. Dr. Gökçe Özel Klinik',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ankara',
        addressCountry: 'TR',
      },
    },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'İstanbul Üniversitesi Cerrahpaşa Tıp Fakültesi' },
      { '@type': 'CollegeOrUniversity', name: 'Kırıkkale Üniversitesi Tıp Fakültesi' },
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'KBB Uzmanlık Eğitimi — Dışkapı Yıldırım Beyazıt EAH' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'Doçent — 2015' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'Profesör — 2021' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'TYPCD Yönetim Kurulu Üyesi' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'CMAC Uluslararası Danışma Kurulu' },
    ],
    knowsAbout: [
      'Rinoplasti', 'Septorinoplasti', 'Blefaroplasti', 'Endolift Lazer',
      'Botoks', 'Hyalüronik Asit Dolgu', 'Dudak Kaldırma', 'İp Askılama',
      'PRP', 'Mezoterapi', 'Kepçe Kulak Ameliyatı', 'KBB Cerrahisi',
    ],
    sameAs: [
      'https://www.instagram.com/drgokceozel',
      'https://www.youtube.com/@drgokceozel',
    ],
    numberOfPublications: '100+',
    award: 'H-index 12',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: locale === 'tr' ? baseUrl : `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Prof. Dr. Gökçe Özel Kimdir?', item: locale === 'tr' ? `${baseUrl}/gokce-ozel-kimdir` : `${baseUrl}/${locale}/gokce-ozel-kimdir` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <main style={{ minHeight: '100vh', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header / Hero Profile */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px', borderRadius: '28px', marginBottom: '60px' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
            <div style={{ flexShrink: 0, width: '250px', height: '350px', position: 'relative', borderRadius: '22px', overflow: 'hidden', border: '1px solid rgba(184,135,70,.28)', boxShadow: '0 18px 55px rgba(23,32,30,.14)' }}>
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
              <h2 style={{ fontSize: '1.05rem', color: '#49685f', fontWeight: 700, letterSpacing: '1px', marginBottom: '30px', textTransform: 'uppercase' }}>
                {data.subtitle}
              </h2>
              
              <div 
                className="prose prose-invert max-w-none"
                style={{ color: '#54625e', fontSize: '1.05rem', lineHeight: 1.8 }}
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
                <div key={item.id} className="glass" style={{ display: 'flex', gap: '30px', padding: '25px', borderRadius: '18px', position: 'relative' }}>
                  {/* Dot */}
                  <div style={{ width: '15px', height: '15px', background: 'var(--color-gold)', borderRadius: '50%', position: 'absolute', left: '13.5px', top: '32px', boxShadow: '0 0 10px var(--color-gold)' }} />
                  
                  <div style={{ width: '120px', flexShrink: 0, paddingLeft: '30px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>{item.year}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', color: '#17201e', marginBottom: '10px' }}>{item.title}</h4>
                    <p style={{ color: '#54625e', lineHeight: 1.6 }}>{item.description}</p>
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
                  <h4 style={{ color: '#17201e', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>{cert.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
    </>
  );
}
