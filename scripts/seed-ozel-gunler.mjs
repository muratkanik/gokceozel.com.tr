/**
 * Seed script: Türkiye özel günlerini veritabanına ekle
 *
 * Kural: popup start_date = gün - 3, end_date = gün + 1 (GMT+3 baz alınarak)
 * Çalıştır: node scripts/seed-ozel-gunler.mjs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function eventWindow(dateStr) {
  // dateStr = 'YYYY-MM-DD'  (Istanbul/local calendar date)
  const d = new Date(dateStr + 'T00:00:00+03:00');
  const start = new Date(d); start.setDate(d.getDate() - 3);
  const end   = new Date(d); end.setDate(d.getDate() + 1);
  return { start, end };
}

// ─── Milli & Sosyal günler (sabit tarihler) ───────────────────────────────────
const FIXED = [
  // ── Yılbaşı
  {
    event_name: 'Yılbaşı 2026',
    event_date: '2026-01-01',
    theme_class: 'theme-yilbasi',
    popup_translations: {
      tr: { title: '🎉 Mutlu Yıllar!', body: 'Yeni yılda sağlık, güzellik ve mutluluk dolu günler dileriz. Özel yılbaşı kampanyalarımız için bize ulaşın.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🎉 Happy New Year!', body: 'Wishing you health, beauty and happiness in the new year. Contact us for our special New Year offers.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🎉 Frohes Neues Jahr!', body: 'Wir wünschen Ihnen Gesundheit, Schönheit und Glück im neuen Jahr.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🎉 Bonne Année !', body: 'Nous vous souhaitons santé, beauté et bonheur pour la nouvelle année.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🎉 كل عام وأنتم بخير!', body: 'نتمنى لكم صحة وجمالاً وسعادة في العام الجديد.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Sevgililer Günü
  {
    event_name: 'Sevgililer Günü 2026',
    event_date: '2026-02-14',
    theme_class: 'theme-sevgililer',
    popup_translations: {
      tr: { title: '💝 Sevgililer Günün Kutlu Olsun', body: 'Kendinize ya da sevdiklerinize en güzel hediyeyi verin — doğal ve kalıcı güzellik. Özel Sevgililer Günü paketlerimizi inceleyin.', imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '💝 Happy Valentine\'s Day', body: 'Give yourself or your loved one the most beautiful gift — natural and lasting beauty. Explore our special Valentine\'s packages.', imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '💝 Alles Gute zum Valentinstag', body: 'Schenken Sie sich oder Ihren Liebsten das schönste Geschenk — natürliche und dauerhafte Schönheit.', imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '💝 Bonne Saint-Valentin', body: 'Offrez-vous ou offrez à vos proches le plus beau cadeau — une beauté naturelle et durable.', imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '💝 عيد الحب السعيد', body: 'أهدوا أنفسكم أو أحباءكم أجمل هدية — جمال طبيعي ودائم.', imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Tıp Bayramı
  {
    event_name: 'Tıp Bayramı 2026',
    event_date: '2026-03-14',
    theme_class: 'theme-tip-bayrami',
    popup_translations: {
      tr: { title: '🩺 Tıp Bayramı Kutlu Olsun', body: '14 Mart Tıp Bayramı\'nda tüm sağlık çalışanlarını saygı ve sevgiyle selamlıyoruz. Sağlıklı ve güzel yarınlar için yanınızdayız.', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🩺 Happy Medicine Day', body: 'On March 14, Medicine Day, we salute all healthcare professionals with respect and gratitude. We are with you for healthy and beautiful tomorrows.', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🩺 Tag der Medizin', body: 'Zum 14. März, dem Tag der Medizin, grüßen wir alle Gesundheitsfachkräfte mit Respekt und Dankbarkeit.', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🩺 Journée de la Médecine', body: 'Le 14 mars, Journée de la Médecine, nous saluons avec respect tous les professionnels de santé.', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🩺 عيد الطب السعيد', body: 'في الـ 14 من مارس، يوم الطب، نحيي جميع العاملين في مجال الرعاية الصحية بكل احترام وامتنان.', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── 8 Mart
  {
    event_name: '8 Mart Dünya Kadınlar Günü 2026',
    event_date: '2026-03-08',
    theme_class: 'theme-kadinlar-gunu',
    popup_translations: {
      tr: { title: '🌸 Dünya Kadınlar Günün Kutlu Olsun', body: 'Var olduğunuz, güçlü olduğunuz ve kendinizi ifade ettiğiniz için teşekkürler. Kliniğimizde kendinize zaman ayırın.', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🌸 Happy International Women\'s Day', body: 'Thank you for being you, for being strong, and for expressing yourself. Take time for yourself at our clinic.', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🌸 Alles Gute zum Weltfrauentag', body: 'Danke, dass Sie so sind wie Sie sind – stark und ausdrucksstark. Gönnen Sie sich Zeit in unserer Klinik.', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🌸 Bonne Journée Internationale des Femmes', body: 'Merci d\'être vous-même, forte et expressive. Prenez soin de vous dans notre clinique.', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🌸 يوم المرأة العالمي السعيد', body: 'شكراً لأنكِ أنتِ، قوية ومعبّرة. خصصي وقتاً لنفسك في عيادتنا.', imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Dünya Sağlık Günü
  {
    event_name: 'Dünya Sağlık Günü 2026',
    event_date: '2026-04-07',
    theme_class: 'theme-saglik-gunu',
    popup_translations: {
      tr: { title: '💚 Dünya Sağlık Günü', body: '7 Nisan Dünya Sağlık Günü\'nde sağlığınızı öncelik olarak hatırlıyoruz. Kendinize iyi bakın — biz de buradayız.', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '💚 World Health Day', body: 'On April 7, World Health Day, we remind you to make your health a priority. Take care of yourself — we\'re here for you.', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '💚 Weltgesundheitstag', body: 'Am 7. April, dem Weltgesundheitstag, erinnern wir Sie daran, Ihre Gesundheit zur Priorität zu machen.', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '💚 Journée Mondiale de la Santé', body: 'Le 7 avril, Journée Mondiale de la Santé, nous vous rappelons de faire de votre santé une priorité.', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '💚 اليوم العالمي للصحة', body: 'في السابع من أبريل، اليوم العالمي للصحة، نذكّركم بجعل صحتكم أولوية.', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── 23 Nisan
  {
    event_name: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı 2026',
    event_date: '2026-04-23',
    theme_class: 'theme-23nisan',
    popup_translations: {
      tr: { title: '🇹🇷 23 Nisan Kutlu Olsun!', body: 'Ulusal Egemenlik ve Çocuk Bayramı\'nın 106. yılında tüm çocuklarımıza ve milletimize kutlu olsun.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🇹🇷 Happy 23rd April!', body: 'Happy National Sovereignty and Children\'s Day to all our children and our nation.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🇹🇷 Glücklicher 23. April!', body: 'Alles Gute zum Tag der nationalen Souveränität und des Kindes – an alle Kinder und unser Volk.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🇹🇷 Joyeux 23 Avril !', body: 'Joyeuse Fête de la Souveraineté Nationale et des Enfants à tous nos enfants et à notre nation.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🇹🇷 23 أبريل السعيد!', body: 'كل عام وأطفالنا وأمتنا بخير في عيد السيادة الوطنية وعيد الطفل.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── 1 Mayıs
  {
    event_name: '1 Mayıs Emek ve Dayanışma Günü 2026',
    event_date: '2026-05-01',
    theme_class: 'theme-1mayis',
    popup_translations: {
      tr: { title: '✊ 1 Mayıs Emek Bayramı', body: 'Emeğin, dayanışmanın ve birliğin günü kutlu olsun. Tüm çalışanlarımıza ve hemşehrilerimize saygıyla.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '✊ Labour Day', body: 'Happy Labour Day — celebrating solidarity, unity, and the dignity of work.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '✊ Tag der Arbeit', body: 'Alles Gute zum Tag der Arbeit — wir feiern Solidarität, Einheit und die Würde der Arbeit.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '✊ Fête du Travail', body: 'Bonne Fête du Travail — célébrons la solidarité, l\'unité et la dignité du travail.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '✊ عيد العمال', body: 'كل عام وعمالنا وتضامننا ووحدتنا بخير.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── 19 Mayıs
  {
    event_name: '19 Mayıs Atatürk\'ü Anma Gençlik ve Spor Bayramı 2026',
    event_date: '2026-05-19',
    theme_class: 'theme-19mayis',
    popup_translations: {
      tr: { title: '🇹🇷 19 Mayıs Kutlu Olsun!', body: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı\'mız kutlu olsun. Gençliğimize ve Türkiye\'mize nice güzel yıllar.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🇹🇷 Happy 19th May!', body: 'Happy Commemoration of Atatürk, Youth and Sports Day. Here\'s to many more beautiful years for our youth and Türkiye.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🇹🇷 Glücklicher 19. Mai!', body: 'Alles Gute zum Gedenktag an Atatürk, dem Jugend- und Sporttag.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🇹🇷 Joyeux 19 Mai !', body: 'Joyeux Jour commémoratif d\'Atatürk, de la Jeunesse et du Sport.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🇹🇷 19 مايو السعيد!', body: 'كل عام وشبابنا وتركيا بخير في يوم إحياء ذكرى أتاتورك ويوم الشباب والرياضة.', imageUrl: 'https://images.unsplash.com/photo-1503064010-6b3e5b89aade?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Dünya Güzellik Günü
  {
    event_name: 'Dünya Güzellik Günü 2025',
    event_date: '2025-09-09',
    theme_class: 'theme-guzellik-gunu',
    popup_translations: {
      tr: { title: '✨ Dünya Güzellik Günü', body: '9 Eylül Dünya Güzellik Günü\'nde size özel bir ön görüşme fırsatı sunuyoruz. Doğal güzelliğinizi keşfetmek için bizimle iletişime geçin.', imageUrl: 'https://images.unsplash.com/photo-1596704017234-0c5a4c3e9c0c?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '✨ World Beauty Day', body: 'On September 9, World Beauty Day, we offer you a special consultation. Contact us to discover your natural beauty.', imageUrl: 'https://images.unsplash.com/photo-1596704017234-0c5a4c3e9c0c?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '✨ Welt-Schönheitstag', body: 'Am 9. September, dem Welt-Schönheitstag, bieten wir Ihnen eine besondere Beratung an.', imageUrl: 'https://images.unsplash.com/photo-1596704017234-0c5a4c3e9c0c?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '✨ Journée Mondiale de la Beauté', body: 'Le 9 septembre, Journée Mondiale de la Beauté, nous vous proposons une consultation spéciale.', imageUrl: 'https://images.unsplash.com/photo-1596704017234-0c5a4c3e9c0c?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '✨ يوم الجمال العالمي', body: 'في التاسع من سبتمبر، يوم الجمال العالمي، نقدم لكم استشارة خاصة. تواصلوا معنا لاكتشاف جمالكم الطبيعي.', imageUrl: 'https://images.unsplash.com/photo-1596704017234-0c5a4c3e9c0c?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── 30 Ağustos
  {
    event_name: '30 Ağustos Zafer Bayramı 2025',
    event_date: '2025-08-30',
    theme_class: 'theme-30agustos',
    popup_translations: {
      tr: { title: '🇹🇷 30 Ağustos Zafer Bayramı Kutlu Olsun!', body: 'Büyük Zafer\'in 103. yıldönümünde milletimizin bu onurlu gününü saygıyla anıyoruz.', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🇹🇷 Happy 30th August Victory Day!', body: 'We respectfully commemorate the 103rd anniversary of the Great Victory on this honourable national day.', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🇹🇷 Alles Gute zum Siegestag, 30. August!', body: 'Wir gedenken ehrfurchtsvoll des 103. Jahrestages des Großen Sieges.', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🇹🇷 Joyeux 30 Août, Jour de la Victoire !', body: 'Nous commémorons avec respect le 103e anniversaire de la Grande Victoire.', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🇹🇷 عيد النصر السعيد — 30 أغسطس!', body: 'نحيي بإجلال الذكرى الـ 103 للانتصار العظيم.', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Cumhuriyet Bayramı
  {
    event_name: 'Cumhuriyet Bayramı 2025',
    event_date: '2025-10-29',
    theme_class: 'theme-cumhuriyet',
    popup_translations: {
      tr: { title: '🇹🇷 Cumhuriyet Bayramı Kutlu Olsun!', body: 'Türkiye Cumhuriyeti\'nin 102. kuruluş yıldönümünde tüm milletimize kutlu olsun.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🇹🇷 Happy Republic Day!', body: 'Happy 102nd anniversary of the Republic of Turkey to our entire nation.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🇹🇷 Alles Gute zum Republiktag!', body: 'Herzliche Glückwünsche zum 102. Jahrestag der Türkischen Republik.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🇹🇷 Joyeuse Fête de la République !', body: 'Joyeux 102e anniversaire de la République de Türkiye à toute notre nation.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🇹🇷 عيد الجمهورية السعيد!', body: 'كل عام وأمتنا بخير في الذكرى الـ 102 لتأسيس الجمهورية التركية.', imageUrl: 'https://images.unsplash.com/photo-1558025211-1db5e324c431?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Öğretmenler Günü
  {
    event_name: 'Öğretmenler Günü 2025',
    event_date: '2025-11-24',
    theme_class: 'theme-ogretmenler-gunu',
    popup_translations: {
      tr: { title: '📚 Öğretmenler Günü Kutlu Olsun!', body: 'Geleceğimizi şekillendiren tüm öğretmenlerimize sonsuz saygı ve sevgiyle.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '📚 Happy Teachers\' Day!', body: 'With endless respect and gratitude to all our teachers who shape our future.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '📚 Alles Gute zum Lehrertag!', body: 'Mit unendlichem Respekt und Dankbarkeit an alle unsere Lehrer, die unsere Zukunft gestalten.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '📚 Bonne Journée des Enseignants !', body: 'Avec un respect et une gratitude infinis à tous nos enseignants qui façonnent notre avenir.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '📚 عيد المعلمين السعيد!', body: 'بكل الاحترام والامتنان لجميع معلمينا الذين يشكّلون مستقبلنا.', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // ── Yılbaşı 2025 (Aralık sonu)
  {
    event_name: 'Yılbaşı 2025',
    event_date: '2025-01-01',
    theme_class: 'theme-yilbasi',
    popup_translations: {
      tr: { title: '🎉 Mutlu Yıllar!', body: 'Yeni yılda sağlık, güzellik ve mutluluk dolu günler dileriz.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🎉 Happy New Year!', body: 'Wishing you health, beauty and happiness in the new year.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🎉 Frohes Neues Jahr!', body: 'Wir wünschen Ihnen Gesundheit, Schönheit und Glück im neuen Jahr.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🎉 Bonne Année !', body: 'Nous vous souhaitons santé, beauté et bonheur pour la nouvelle année.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🎉 كل عام وأنتم بخير!', body: 'نتمنى لكم صحة وجمالاً وسعادة في العام الجديد.', imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=1200&auto=format&fit=crop' },
    },
  },
];

// ─── Kayan tarihli günler (2025 & 2026) ──────────────────────────────────────
const VARIABLE = [
  // Anneler Günü 2025 — Mayıs 2. Pazar = 11 Mayıs
  {
    event_name: 'Anneler Günü 2025',
    event_date: '2025-05-11',
    theme_class: 'theme-anneler-gunu',
    popup_translations: {
      tr: { title: '🌹 Anneler Günün Kutlu Olsun!', body: 'Dünyanın en güzel gününüz olan bugünde sizi sevgiyle kucaklıyoruz. Kliniğimizden annelere özel sürpriz hediyeler!', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🌹 Happy Mother\'s Day!', body: 'We embrace you with love on this most beautiful day. Special surprise gifts from our clinic for mothers!', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🌹 Alles Gute zum Muttertag!', body: 'Wir umarmen Sie liebevoll an diesem wunderschönen Tag. Besondere Überraschungsgeschenke unserer Klinik für Mütter!', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🌹 Bonne Fête des Mères !', body: 'Nous vous embrassons avec amour en ce plus beau des jours. Cadeaux surprises de notre clinique pour les mamans !', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🌹 عيد الأم السعيد!', body: 'نحتضنكِ بكل حب في هذا اليوم الجميل. هدايا مفاجأة من عيادتنا للأمهات!', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // Babalar Günü 2025 — Haziran 3. Pazar = 15 Haziran
  {
    event_name: 'Babalar Günü 2025',
    event_date: '2025-06-15',
    theme_class: 'theme-babalar-gunu',
    popup_translations: {
      tr: { title: '👔 Babalar Günün Kutlu Olsun!', body: 'Hayatımızdaki en güçlü ve en sevecen insanlar — babalarımıza sonsuz sevgilerimizle.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '👔 Happy Father\'s Day!', body: 'The strongest and most loving people in our lives — to our fathers, with endless love.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '👔 Alles Gute zum Vatertag!', body: 'Die stärksten und liebevollsten Menschen in unserem Leben — unsere Väter, mit grenzenloser Liebe.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '👔 Bonne Fête des Pères !', body: 'Les personnes les plus fortes et les plus aimantes de nos vies — à nos pères, avec amour infini.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '👔 عيد الأب السعيد!', body: 'أقوى الناس وأكثرهم محبة في حياتنا — لآبائنا، مع كل الحب.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // Ramazan Bayramı 2025 — 30 Mar–1 Nis (event_date = 30 Mar)
  {
    event_name: 'Ramazan Bayramı 2025',
    event_date: '2025-03-30',
    theme_class: 'theme-ramazan-bayrami',
    popup_translations: {
      tr: { title: '🌙 Ramazan Bayramınız Kutlu Olsun!', body: 'Güzel duygular, sağlık ve birliktelikle geçen bir bayram dileriz. Sevdiklerinizle güzel anlar biriksin.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🌙 Eid Mubarak!', body: 'Wishing you a blessed Eid filled with joy, health, and togetherness.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🌙 Eid Mubarak!', body: 'Wir wünschen Ihnen ein gesegnetes Fest voller Freude, Gesundheit und Zusammensein.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🌙 Aïd Moubarak !', body: 'Nous vous souhaitons une fête bénie, pleine de joie, de santé et de partage.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🌙 عيد مبارك!', body: 'نتمنى لكم عيداً مباركاً مليئاً بالفرح والصحة والمحبة.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // Kurban Bayramı 2025 — 5 Haz (event_date = 5 Jun)
  {
    event_name: 'Kurban Bayramı 2025',
    event_date: '2025-06-05',
    theme_class: 'theme-kurban-bayrami',
    popup_translations: {
      tr: { title: '🐑 Kurban Bayramınız Kutlu Olsun!', body: 'Kurban Bayramı\'nın tüm insanlığa huzur, bereket ve sağlık getirmesini dileriz.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🐑 Eid al-Adha Mubarak!', body: 'Wishing all humanity peace, abundance, and health on this blessed occasion.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🐑 Eid al-Adha Mubarak!', body: 'Wir wünschen der gesamten Menschheit Frieden, Fülle und Gesundheit zu diesem gesegneten Anlass.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🐑 Aïd al-Adha Moubarak !', body: 'Nous souhaitons à toute l\'humanité paix, abondance et santé en cette occasion bénie.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🐑 عيد الأضحى المبارك!', body: 'نتمنى للبشرية جمعاء السلام والخير والصحة في هذه المناسبة المباركة.', imageUrl: 'https://images.unsplash.com/photo-1608543965322-4b1bce64d01c?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // Anneler Günü 2026 — Mayıs 2. Pazar = 10 Mayıs
  {
    event_name: 'Anneler Günü 2026',
    event_date: '2026-05-10',
    theme_class: 'theme-anneler-gunu',
    popup_translations: {
      tr: { title: '🌹 Anneler Günün Kutlu Olsun!', body: 'Dünyanın en güzel gününüz olan bugünde sizi sevgiyle kucaklıyoruz.', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '🌹 Happy Mother\'s Day!', body: 'We embrace you with love on this most beautiful day.', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '🌹 Alles Gute zum Muttertag!', body: 'Wir umarmen Sie liebevoll an diesem wunderschönen Tag.', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '🌹 Bonne Fête des Mères !', body: 'Nous vous embrassons avec amour en ce plus beau des jours.', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '🌹 عيد الأم السعيد!', body: 'نحتضنكِ بكل حب في هذا اليوم الجميل.', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=1200&auto=format&fit=crop' },
    },
  },

  // Babalar Günü 2026 — Haziran 3. Pazar = 21 Haziran
  {
    event_name: 'Babalar Günü 2026',
    event_date: '2026-06-21',
    theme_class: 'theme-babalar-gunu',
    popup_translations: {
      tr: { title: '👔 Babalar Günün Kutlu Olsun!', body: 'Hayatımızdaki en güçlü ve en sevecen insanlar — babalarımıza sonsuz sevgilerimizle.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      en: { title: '👔 Happy Father\'s Day!', body: 'To our fathers, with endless love.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      de: { title: '👔 Alles Gute zum Vatertag!', body: 'Unseren Vätern, mit grenzenloser Liebe.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      fr: { title: '👔 Bonne Fête des Pères !', body: 'À nos pères, avec amour infini.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
      ar: { title: '👔 عيد الأب السعيد!', body: 'لآبائنا، مع كل الحب.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop' },
    },
  },
];

const ALL_EVENTS = [...FIXED, ...VARIABLE];

async function main() {
  console.log(`🗓️  ${ALL_EVENTS.length} özel gün ekleniyor...\n`);
  let created = 0, skipped = 0;

  for (const ev of ALL_EVENTS) {
    const { start, end } = eventWindow(ev.event_date);

    // Aynı isimde varsa atla
    const existing = await prisma.special_events.findFirst({
      where: { event_name: ev.event_name }
    });
    if (existing) {
      console.log(`  ⏭  Zaten var: ${ev.event_name}`);
      skipped++;
      continue;
    }

    await prisma.special_events.create({
      data: {
        event_name: ev.event_name,
        start_date: start,
        end_date: end,
        theme_class: ev.theme_class,
        popup_translations: ev.popup_translations,
        is_active: true,
      }
    });
    console.log(`  ✅ Eklendi: ${ev.event_name}  [${start.toISOString().slice(0,10)} → ${end.toISOString().slice(0,10)}]`);
    created++;
  }

  console.log(`\n✨ Tamamlandı. Eklendi: ${created}  Atlandı: ${skipped}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
