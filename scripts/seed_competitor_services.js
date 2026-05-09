import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NEW_SERVICES = [
  // Ameliyatsız Estetik
  {
    slug: 'botoks',
    titleInternal: 'Botoks',
    category: 'Ameliyatsız Estetik',
    seo: {
      tr: { title: 'Botoks', desc: 'Mimik çizgilerini yumuşatırken yüz ifadesini korumaya odaklanan medikal estetik uygulama.' },
      en: { title: 'Botox', desc: 'Medical aesthetic application focusing on softening expression lines while preserving facial expressions.' }
    }
  },
  {
    slug: 'dudak-dolgusu',
    titleInternal: 'Dudak Dolgusu',
    category: 'Ameliyatsız Estetik',
    seo: {
      tr: { title: 'Dudak Dolgusu', desc: 'Dudaklara hacim kazandıran ve asimetrileri gideren hyalüronik asit tabanlı dolgu uygulaması.' },
      en: { title: 'Lip Fillers', desc: 'Hyaluronic acid-based filler application that adds volume to lips and corrects asymmetries.' }
    }
  },
  {
    slug: 'goz-alti-isik-dolgusu',
    titleInternal: 'Göz Altı Işık Dolgusu',
    category: 'Ameliyatsız Estetik',
    seo: {
      tr: { title: 'Göz Altı Işık Dolgusu', desc: 'Göz altı morlukları ve çukurlarını gidererek daha dinç bir görünüm sağlayan dolgu işlemi.' },
      en: { title: 'Under Eye Fillers', desc: 'Filler treatment that removes under-eye dark circles and hollows for a more rested appearance.' }
    }
  },
  {
    slug: 'ip-aski',
    titleInternal: 'İp Askılama',
    category: 'Ameliyatsız Estetik',
    seo: {
      tr: { title: 'İp Askılama', desc: 'Yüz ovalini destekleyen ve hafif sarkmaları toparlamayı hedefleyen ameliyatsız askılama uygulaması.' },
      en: { title: 'Thread Lift', desc: 'Non-surgical lifting application supporting facial oval and targeting mild sagging.' }
    }
  },
  
  // Cilt Gençleştirme & Yenileme
  {
    slug: 'mezoterapi',
    titleInternal: 'Mezoterapi',
    category: 'Cilt Gençleştirme & Yenileme',
    seo: {
      tr: { title: 'Mezoterapi', desc: 'Cildin ihtiyacı olan vitamin, mineral ve amino asitlerin doğrudan cilt altına enjekte edilmesi.' },
      en: { title: 'Mesotherapy', desc: 'Direct injection of vitamins, minerals, and amino acids required by the skin.' }
    }
  },
  {
    slug: 'somon-dna',
    titleInternal: 'Somon DNA',
    category: 'Cilt Gençleştirme & Yenileme',
    seo: {
      tr: { title: 'Somon DNA Gençlik Aşısı', desc: 'Cilt hücrelerini yenileyen, nem oranını artıran ve yaşlanma belirtilerini geciktiren tedavi.' },
      en: { title: 'Salmon DNA', desc: 'Treatment that regenerates skin cells, increases moisture levels, and delays signs of aging.' }
    }
  },
  {
    slug: 'altin-igne',
    titleInternal: 'Altın İğne (Radyofrekans)',
    category: 'Cilt Gençleştirme & Yenileme',
    seo: {
      tr: { title: 'Altın İğne Tedavisi', desc: 'Cilt yenileme, leke ve akne izi tedavisinde kullanılan fraksiyonel radyofrekans uygulaması.' },
      en: { title: 'Gold Needle (Radiofrequency)', desc: 'Fractional radiofrequency application used for skin rejuvenation, blemish, and acne scar treatment.' }
    }
  },
  
  // Longevity & Sağlıklı Yaşam
  {
    slug: 'ozon-terapi',
    titleInternal: 'Ozon Terapi',
    category: 'Longevity & Sağlıklı Yaşam',
    seo: {
      tr: { title: 'Ozon Terapi', desc: 'Hücresel yenilenmeyi artıran, bağışıklık sistemini güçlendiren ve toksin atımını hızlandıran bütüncül tedavi.' },
      en: { title: 'Ozone Therapy', desc: 'Holistic treatment that increases cellular regeneration, strengthens the immune system, and accelerates detoxification.' }
    }
  },
  {
    slug: 'iv-glutatyon',
    titleInternal: 'IV Glutatyon Tedavisi',
    category: 'Longevity & Sağlıklı Yaşam',
    seo: {
      tr: { title: 'Glutatyon Tedavisi', desc: 'Vücudun en güçlü antioksidanı olan glutatyonun damar yoluyla verilerek hücresel detoks sağlanması.' },
      en: { title: 'IV Glutathione Therapy', desc: 'Providing cellular detox by administering glutathione, the body\'s strongest antioxidant, intravenously.' }
    }
  },
  
  // Cerrahi (Existing ones to keep)
  {
    slug: 'rinoplasti',
    titleInternal: 'Rinoplasti',
    category: 'Estetik Cerrahi',
    seo: {
      tr: { title: 'Rinoplasti', desc: 'Burun estetiğinde doğal görünüm ve nefes fonksiyonunu birlikte değerlendiren kişiye özel cerrahi planlama.' },
      en: { title: 'Rhinoplasty', desc: 'Personalized surgical planning in rhinoplasty evaluating natural appearance and breathing function together.' }
    }
  },
  {
    slug: 'gz-kapa-estetii',
    titleInternal: 'Göz Kapağı Estetiği',
    category: 'Estetik Cerrahi',
    seo: {
      tr: { title: 'Göz Kapağı Estetiği', desc: 'Üst ve alt göz kapağında daha dinlenmiş, doğal ve açık bir ifade hedefleyen estetik yaklaşım.' },
      en: { title: 'Blepharoplasty', desc: 'Aesthetic approach targeting a more rested, natural, and open expression in the upper and lower eyelids.' }
    }
  }
];

async function main() {
  console.log('Seeding new competitive service categories and pages...');
  
  for (const svc of NEW_SERVICES) {
    // Try to find the page first
    let page = await prisma.page.findUnique({
      where: { slug: svc.slug }
    });
    
    if (!page) {
      console.log(`Creating page for ${svc.slug}...`);
      page = await prisma.page.create({
        data: {
          slug: svc.slug,
          titleInternal: svc.titleInternal,
          type: 'SERVICE',
          seoScore: 100,
        }
      });
    } else {
      console.log(`Updating page ${svc.slug}...`);
      await prisma.page.update({
        where: { id: page.id },
        data: { titleInternal: svc.titleInternal }
      });
    }
    
    // Update or create Service relation for category
    const serviceRel = await prisma.service.findUnique({
      where: { pageId: page.id }
    });
    
    if (!serviceRel) {
      await prisma.service.create({
        data: {
          pageId: page.id,
          category: svc.category
        }
      });
    } else {
      await prisma.service.update({
        where: { id: serviceRel.id },
        data: { category: svc.category }
      });
    }

    // Update SeoMeta
    for (const [locale, seoData] of Object.entries(svc.seo)) {
      const existingSeo = await prisma.seoMeta.findUnique({
        where: {
          pageId_locale: {
            pageId: page.id,
            locale: locale
          }
        }
      });
      
      if (!existingSeo) {
        await prisma.seoMeta.create({
          data: {
            pageId: page.id,
            locale: locale,
            metaTitle: seoData.title,
            metaDescription: seoData.desc
          }
        });
      } else {
        await prisma.seoMeta.update({
          where: { id: existingSeo.id },
          data: {
            metaTitle: seoData.title,
            metaDescription: seoData.desc
          }
        });
      }
    }
  }
  
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
