import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding content...');

  // 1. Seed Special Event (23 Nisan)
  const existingEvent = await prisma.special_events.findFirst({
    where: { event_name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı' }
  });

  if (!existingEvent) {
    await prisma.special_events.create({
      data: {
        event_name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
        start_date: new Date(new Date().getFullYear(), 3, 20), // April 20
        end_date: new Date(new Date().getFullYear(), 3, 24),   // April 24
        theme_class: 'national_day',
        popup_translations: {
          tr: {
            title: "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı Kutlu Olsun!",
            body: "Geleceğimizin teminatı olan çocuklarımızın bayramını ve milli egemenliğimizi gururla kutluyoruz. Çocuklarımızın gülüşü, en güzel estetikten daha değerlidir.",
            imageUrl: "https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop" // Children holding hands / happy kids
          },
          en: {
            title: "Happy April 23rd National Sovereignty and Children's Day!",
            body: "We proudly celebrate our national sovereignty and children's day. A child's smile is more precious than the finest aesthetics.",
            imageUrl: "https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop"
          }
        },
        is_active: true
      }
    });
    console.log('✅ Created 23 Nisan special event');
  } else {
    console.log('ℹ️ 23 Nisan special event already exists');
  }

  // 2. Seed Testimonials
  const testimonials = [
    {
      author: 'Ayşe Y.',
      rating: 5,
      locale: 'tr',
      text: 'Gökçe Hanım ile rinoplasti sürecim harikaydı. 3D simülasyon sayesinde sonucun nasıl olacağını önceden gördüm ve tamamen içime sinen doğal bir burnum oldu.',
      source: 'Google Yorumları',
      approved: true
    },
    {
      author: 'Mehmet K.',
      rating: 5,
      locale: 'tr',
      text: 'Endolift uygulaması için başvurduğumda çok gergindim ama Gökçe Hoca detaylı açıklamalarıyla beni inanılmaz rahatlattı. Sonuç beklediğimden çok daha iyi!',
      source: 'DoktorTakvimi',
      approved: true
    },
    {
      author: 'Zeynep B.',
      rating: 5,
      locale: 'tr',
      text: 'Göz kapağı estetiği sonrasında yılların yorgunluğu yüzümden silindi. Prof. Dr. Gökçe Özel ve ekibine sonsuz teşekkürler.',
      source: 'Instagram',
      approved: true
    }
  ];

  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { text: t.text } });
    if (!exists) {
      await prisma.testimonial.create({ data: t });
      console.log(`✅ Created testimonial for ${t.author}`);
    }
  }

  // 3. Seed FAQs
  const faqs = [
    {
      locale: 'tr',
      question: 'Rinoplasti ameliyatı ne kadar sürer ve iyileşme süreci nasıldır?',
      answer: 'Rinoplasti ameliyatı genellikle 2-3 saat sürer. Ameliyat sonrası ilk 1 hafta atel ve bantlar kalır. Çoğu hastamız 1 hafta sonra günlük hayatlarına dönebilir. Şişliklerin büyük kısmı ilk ayda inse de tam iyileşme 6 ay ile 1 yıl arasında tamamlanır.'
    },
    {
      locale: 'tr',
      question: 'Endolift lazer ağılı mıdır? İşlem sonrası iz kalır mı?',
      answer: 'Endolift lazer lokal anestezi altında uygulanan, cilt altında mikrofiber optik kablolarla yapılan bir işlemdir. Kesi gerektirmediği için iz bırakmaz. İşlem sırasında minimal bir rahatsızlık hissedilebilir ancak genellikle çok konforlu bir süreçtir.'
    },
    {
      locale: 'tr',
      question: 'Muayene öncesi 3D simülasyon yapılıyor mu?',
      answer: 'Evet, özellikle yüz plastik cerrahisi (rinoplasti vb.) düşünen hastalarımıza Vectra 3D veya benzeri ileri teknoloji sistemlerle muayene esnasında 3D simülasyon yaparak olası sonuçları detaylıca gösteriyoruz.'
    }
  ];

  for (const f of faqs) {
    const exists = await prisma.faq.findFirst({ where: { question: f.question, locale: f.locale } });
    if (!exists) {
      await prisma.faq.create({ data: f });
      console.log(`✅ Created FAQ: ${f.question}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
