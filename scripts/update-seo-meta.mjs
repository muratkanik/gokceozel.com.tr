/**
 * Updates SEO meta (title + description) for key service pages
 * with user-provided, Google-optimized values for 20 target keywords.
 */

import { PrismaClient } from '@prisma/client';

const DB_URL = 'postgresql://postgres.dqofmirqzyoumhzlndbv:GokceOzel2026db@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1';

const prisma = new PrismaClient({
  datasources: { db: { url: DB_URL } },
});

// ─── SEO Data: user-provided exact titles + descriptions ───────────────────
const SEO_DATA = [
  {
    slug: 'rinoplasti',
    tr: { title: 'Burun Estetiği Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Yüz oranlarını dengeleyen, doğal ve fonksiyonel burun estetiği. Prof. Dr. Gökçe Özel ile kişiye özel rinoplasti çözümleri.' },
    en: { title: 'Rhinoplasty Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Natural, functional rhinoplasty that balances facial proportions. Personalized nose surgery with Prof. Dr. Gökçe Özel.' },
    ar: { title: 'تجميل الأنف أنقرة | أ.د. غوكتشه أوزيل', desc: 'تجميل الأنف الطبيعي والوظيفي مع موازنة ملامح الوجه في أنقرة.' },
    ru: { title: 'Ринопластика Анкара | Проф. д-р Гёкче Озель', desc: 'Натуральная функциональная ринопластика в Анкаре. Индивидуальный подход к коррекции носа.' },
    fr: { title: 'Rhinoplastie Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Rhinoplastie naturelle et fonctionnelle pour équilibrer les proportions du visage. Ankara & Ankara & Antalya, Lara.' },
    de: { title: 'Rhinoplastik Ankara & Antalya | Prof. Dr. Gökçe Özel', desc: 'Natürliche, funktionelle Rhinoplastik zur Harmonisierung der Gesichtsproportionen in Ankara & Ankara & Antalya, Lara.' },
    keywords: 'Burun estetiği Ankara Antalya, Rinoplasti uzmanı, Burun ameliyatı Ankara Antalya, Rhinoplasty Ankara Antalya',
  },
  {
    slug: 'septorinoplasti',
    tr: { title: 'Septorinoplasti Ankara & Antalya | Burun Estetiği ve Septum Düzeltme', desc: 'Hem estetik hem fonksiyonel sorunları birlikte çözen septorinoplasti. Prof. Dr. Gökçe Özel ile nefes al, güzel gör.' },
    en: { title: 'Septorhinoplasty Ankara & Antalya | Functional & Aesthetic Nose Surgery', desc: 'Septorhinoplasty combining aesthetic improvement with functional correction. Expert nasal surgery in Ankara & Ankara & Antalya, Lara.' },
    ar: { title: 'سيبتورينوبلاستي أنقرة | تجميل الأنف وإصلاح الحاجز', desc: 'جراحة الأنف الجمالية والوظيفية مع إصلاح الحاجز الأنفي.' },
    ru: { title: 'Септоринопластика Анкара | Эстетика и функция носа', desc: 'Септоринопластика: одновременная коррекция формы и функции носа в Анкаре.' },
    fr: { title: 'Septorhinoplastie Ankara & Antalya | Chirurgie nasale esthétique et fonctionnelle', desc: 'Correction simultanée des problèmes esthétiques et fonctionnels du nez. Ankara & Ankara & Antalya, Lara.' },
    de: { title: 'Septorhinoplastik Ankara & Antalya | Ästhetik und Funktion der Nase', desc: 'Simultane Korrektur von Ästhetik und Funktion der Nase in Ankara & Ankara & Antalya, Lara.' },
    keywords: 'Septorinoplasti, Burun estetiği Ankara Antalya, Septum düzeltme',
  },
  {
    slug: 'revizyon-rinoplasti',
    tr: { title: 'Revizyon Rinoplasti Ankara & Antalya | İkinci Burun Estetiği', desc: 'Önceki burun ameliyatının estetik veya fonksiyonel sorunlarını düzelten revizyon rinoplasti.' },
    en: { title: 'Revision Rhinoplasty Ankara & Antalya | Secondary Nose Surgery', desc: 'Expert revision rhinoplasty for correcting previous nose surgery results in Ankara & Ankara & Antalya, Lara.' },
    ar: { title: 'تجميل الأنف التصحيحي أنقرة', desc: 'تصحيح نتائج عمليات تجميل الأنف السابقة مع حلول متخصصة.' },
    ru: { title: 'Ревизионная ринопластика Анкара', desc: 'Коррекция результатов предыдущей ринопластики. Экспертная повторная операция на носу.' },
    fr: { title: 'Rhinoplastie de révision Ankara & Antalya', desc: 'Correction des résultats insatisfaisants d\'une rhinoplastie précédente. Ankara & Ankara & Antalya, Lara.' },
    de: { title: 'Revisions-Rhinoplastik Ankara & Antalya', desc: 'Korrektur unzufriedenstellender Ergebnisse einer früheren Nasenoperation in Ankara & Ankara & Antalya, Lara.' },
    keywords: 'Revizyon rinoplasti, İkinci burun estetiği Ankara Antalya',
  },
  {
    slug: 'gz-kapa-estetii',
    tr: { title: 'Göz Kapağı Estetiği Ankara & Antalya | Üst ve Alt Blefaroplasti', desc: 'Yorgun bakışları gideren, genç ve canlı bir görünüm sağlayan üst ve alt göz kapağı estetiği.' },
    en: { title: 'Eyelid Aesthetics Ankara & Antalya | Upper & Lower Blepharoplasty', desc: 'Upper and lower blepharoplasty for a rested, youthful eye appearance. Expert eyelid surgery in Ankara & Ankara & Antalya, Lara.' },
    ar: { title: 'تجميل الجفن أنقرة | رفع الجفن العلوي والسفلي', desc: 'جراحة الجفون لإزالة مظهر التعب ومنح نظرة شابة وحيوية.' },
    ru: { title: 'Блефаропластика Анкара | Верхние и нижние веки', desc: 'Блефаропластика верхних и нижних век для свежего молодого взгляда в Анкаре.' },
    fr: { title: 'Esthétique des paupières Ankara & Antalya | Blépharoplastie', desc: 'Blépharoplastie supérieure et inférieure pour un regard reposé et rajeuni. Ankara & Ankara & Antalya, Lara.' },
    de: { title: 'Augenlidästhetik Ankara & Antalya | Ober- und Unterlidblepharoplastik', desc: 'Blepharoplastik für einen frischen, jugendlichen Blick in Ankara & Ankara & Antalya, Lara.' },
    keywords: 'Göz kapağı estetiği, Alt ve üst blefaroplasti, Eyelid aesthetics Ankara Antalya',
  },
  {
    slug: 'badem-goz-estetigi',
    tr: { title: 'Badem Göz Estetiği Ankara & Antalya | Kanto Cantoplasti', desc: 'Göze çekici badem formu kazandıran estetik planlama. Prof. Dr. Gökçe Özel ile doğal badem göz.' },
    en: { title: 'Almond Eye Aesthetics Ankara & Antalya | Canthoplasty', desc: 'Canthoplasty for a beautiful almond-shaped eye appearance. Natural results with expert planning.' },
    ar: { title: 'تجميل عيون اللوز أنقرة | كانثوبلاستي', desc: 'إعطاء العيون شكل اللوز الجذاب مع نتائج طبيعية.' },
    ru: { title: 'Эстетика миндалевидных глаз Анкара | Кантопластика', desc: 'Кантопластика для привлекательной миндалевидной формы глаз.' },
    fr: { title: 'Esthétique des yeux en amande Ankara & Antalya | Cantoplastie', desc: 'Cantoplastie pour des yeux en amande naturels et attrayants. Ankara & Ankara & Antalya, Lara.' },
    de: { title: 'Mandelauge-Ästhetik Ankara & Antalya | Kantoplastik', desc: 'Kantoplastik für attraktive Mandelaugen-Form in Ankara & Ankara & Antalya, Lara.' },
    keywords: 'Badem göz estetiği, Kanto, Cantoplasty Ankara Antalya',
  },
  {
    slug: 'botoks',
    tr: { title: 'Botoks Ankara & Antalya | Doğal Görünümlü Yüz Gençleştirme', desc: 'Mimik çizgilerini azaltan, doğal ifadeyi koruyan botoks uygulamaları Prof. Dr. Gökçe Özel kliniğinde.' },
    en: { title: 'Botox Ankara & Antalya | Natural-Looking Facial Rejuvenation', desc: 'Botox treatments that soften expression lines while preserving natural facial movement.' },
    ar: { title: 'البوتوكس أنقرة | تجديد شباب الوجه الطبيعي', desc: 'حقن البوتوكس لتخفيف التجاعيد مع الحفاظ على التعبيرات الطبيعية.' },
    ru: { title: 'Ботокс Анкара | Естественное омоложение лица', desc: 'Ботокс для разглаживания мимических морщин с сохранением естественной мимики.' },
    fr: { title: 'Botox Ankara & Antalya | Rajeunissement facial naturel', desc: 'Injections de Botox pour atténuer les rides d\'expression tout en conservant la mobilité naturelle.' },
    de: { title: 'Botox Ankara & Antalya | Natürliche Gesichtsverjüngung', desc: 'Botox-Behandlungen zum Glätten von Ausdruckslinien bei natürlicher Mimik.' },
    keywords: 'Botoks Antalya, Lara, Botox treatments, Yüz gençleştirme',
  },
  {
    slug: 'dolgu',
    tr: { title: 'Dolgu Uygulamaları Ankara & Antalya | Yüz Hattı Şekillendirme', desc: 'Hacim kaybını gideren ve yüz hatlarını belirginleştiren dolgu uygulamalarıyla anında gençleşin.' },
    en: { title: 'Filler Treatments Ankara & Antalya | Facial Contouring', desc: 'Dermal filler treatments to restore volume and define facial contours naturally.' },
    ar: { title: 'حقن الفيلر أنقرة | تشكيل ملامح الوجه', desc: 'حقن الفيلر لاستعادة الحجم وتحديد ملامح الوجه بشكل طبيعي.' },
    ru: { title: 'Филлеры Анкара | Контурирование лица', desc: 'Инъекции филлеров для восстановления объёма и контуров лица.' },
    fr: { title: 'Injections de filler Ankara & Antalya | Contourage du visage', desc: 'Injections de filler pour restaurer le volume et définir les contours du visage.' },
    de: { title: 'Filler-Behandlungen Ankara & Antalya | Gesichtskonturierung', desc: 'Filler-Injektionen zur Volumenwiederherstellung und Konturierung des Gesichts.' },
    keywords: 'Dolgu uygulamaları, Dermal fillers Antalya, Lara, Yüz şekillendirme',
  },
  {
    slug: 'dudak-dolgusu',
    tr: { title: 'Dudak Dolgusu Ankara & Antalya | Doğal Hacimli Dudaklar', desc: 'Dudaklara form, nem ve dolgunluk kazandıran, doğal sonuçlar sunan dudak dolgusu uygulamaları.' },
    en: { title: 'Lip Filler Ankara & Antalya | Natural Fuller Lips', desc: 'Lip filler treatments for natural volume, moisture and shape enhancement.' },
    ar: { title: 'حقن شفاه أنقرة | شفاه طبيعية ممتلئة', desc: 'حقن الشفاه لمنحها حجماً طبيعياً وترطيباً وشكلاً جميلاً.' },
    ru: { title: 'Филлер для губ Анкара | Натуральные пухлые губы', desc: 'Увеличение губ филлерами для естественного объёма и красивой формы.' },
    fr: { title: 'Filler lèvres Ankara & Antalya | Lèvres naturellement pulpeuses', desc: 'Injections de filler labial pour un volume, une hydratation et une forme naturels.' },
    de: { title: 'Lippenfiller Ankara & Antalya | Natürlich volle Lippen', desc: 'Lippenfiller für natürliches Volumen, Feuchtigkeit und schöne Lippenform.' },
    keywords: 'Dudak dolgusu, Lip filler Antalya, Lara, Dudak büyütme',
  },
  {
    slug: 'dudak-estetigi-liplift',
    tr: { title: 'Dudak Kaldırma Estetiği | Doğal ve Genç Gülüş', desc: 'Dudak oranlarını dengeleyen, yüz estetiğine uyumlu dudak kaldırma işlemiyle zarif bir görünüm.' },
    en: { title: 'Lip Lift Surgery Ankara & Antalya | Natural Youthful Smile', desc: 'Lip lift surgery to balance lip proportions and create a natural, youthful smile.' },
    ar: { title: 'رفع الشفاة أنقرة | ابتسامة شبابية طبيعية', desc: 'جراحة رفع الشفاة لموازنة النسب وإبراز ابتسامة شبابية طبيعية.' },
    ru: { title: 'Лифтинг губ Анкара | Молодая улыбка', desc: 'Лифтинг губ для балансировки пропорций и естественной молодой улыбки.' },
    fr: { title: 'Lip Lift Ankara & Antalya | Sourire naturel et jeune', desc: 'Chirurgie de lifting des lèvres pour équilibrer les proportions et obtenir un sourire naturel.' },
    de: { title: 'Lippen-Lift Ankara & Antalya | Natürliches junges Lächeln', desc: 'Lippen-Lift für ausgewogene Proportionen und ein natürliches, jugendliches Lächeln.' },
    keywords: 'Dudak kaldırma estetiği, Lip lift surgery, Dudak estetiği Ankara Antalya',
  },
  {
    slug: 'endolift',
    tr: { title: 'Endolift Lazer Ankara & Antalya | Cerrahsız Yüz Germe', desc: 'Lazer teknolojisiyle cilt altı dokuda sıkılaşma ve toparlanma sağlayan Endolift uygulaması.' },
    en: { title: 'Endolift Laser Ankara & Antalya | Non-surgical Face Tightening', desc: 'Endolift laser for sub-dermal tightening and facial rejuvenation without surgery.' },
    ar: { title: 'ليزر إندوليفت أنقرة | شد الوجه بدون جراحة', desc: 'تقنية الليزر إندوليفت لشد الجلد وتجديد الوجه بدون تدخل جراحي.' },
    ru: { title: 'Лазер Endolift Анкара | Подтяжка без операции', desc: 'Endolift лазер для подкожного подтягивания и омоложения без хирургии.' },
    fr: { title: 'Laser Endolift Ankara & Antalya | Lifting non-chirurgical', desc: 'Laser Endolift pour un lifting et raffermissement sous-cutané sans chirurgie.' },
    de: { title: 'Endolift Laser Ankara & Antalya | Nicht-chirurgisches Face-Lifting', desc: 'Endolift Laser für subkutanes Straffen und Verjüngung ohne Operation.' },
    keywords: 'Endolift lazer, Lazerle yüz germe, Cerrahsız yüz germe Ankara Antalya',
  },
  {
    slug: 'endolift-lazer',
    tr: { title: 'Endolift Lazer Ankara & Antalya | Cerrahsız Yüz Germe', desc: 'Lazer teknolojisiyle cilt altı dokuda sıkılaşma ve toparlanma sağlayan Endolift uygulaması.' },
    en: { title: 'Endolift Laser Ankara & Antalya | Non-surgical Face Tightening', desc: 'Endolift laser for sub-dermal tightening and facial rejuvenation without surgery.' },
    ar: { title: 'ليزر إندوليفت أنقرة | شد الوجه بدون جراحة', desc: 'تقنية الليزر إندوليفت لشد الجلد وتجديد الوجه بدون تدخل جراحي.' },
    ru: { title: 'Лазер Endolift Анкара | Подтяжка без операции', desc: 'Endolift лазер для подкожного подтягивания и омоложения без хирургии.' },
    fr: { title: 'Laser Endolift Ankara & Antalya | Lifting non-chirurgical', desc: 'Laser Endolift pour un lifting et raffermissement sous-cutané sans chirurgie.' },
    de: { title: 'Endolift Laser Ankara & Antalya | Nicht-chirurgisches Face-Lifting', desc: 'Endolift Laser für subkutanes Straffen und Verjüngung ohne Operation.' },
    keywords: 'Endolift lazer, Lazerle yüz germe, Cerrahsız yüz germe Ankara Antalya',
  },
  {
    slug: 'mezoterapi',
    tr: { title: 'Mezoterapi Ankara & Antalya | Cilt Canlandırma ve Nemlendirme', desc: 'Cilde parlaklık, nem ve elastikiyet kazandıran vitamin destekli mezoterapi uygulamaları.' },
    en: { title: 'Mesotherapy Ankara & Antalya | Skin Rejuvenation & Hydration', desc: 'Vitamin-enriched mesotherapy for skin brightness, hydration and improved elasticity.' },
    ar: { title: 'مزوثيرابي أنقرة | تجديد الجلد والترطيب', desc: 'علاجات مزوثيرابي بالفيتامينات للإشراق والترطيب ومرونة الجلد.' },
    ru: { title: 'Мезотерапия Анкара | Омоложение и увлажнение кожи', desc: 'Мезотерапия с витаминными коктейлями для яркости, увлажнения и эластичности кожи.' },
    fr: { title: 'Mésothérapie Ankara & Antalya | Revitalisation et hydratation cutanée', desc: 'Mésothérapie enrichie en vitamines pour l\'éclat, l\'hydratation et l\'élasticité de la peau.' },
    de: { title: 'Mesotherapie Ankara & Antalya | Hautverjüngung und Feuchtigkeit', desc: 'Vitamin-angereicherte Mesotherapie für Hautglanz, Feuchtigkeit und Elastizität.' },
    keywords: 'Mezoterapi uygulamaları, Cilt yenileme Ankara Antalya, Mesotherapy Ankara Antalya',
  },
  {
    slug: 'ip-aski',
    tr: { title: 'İp ile Yüz Askılama Ankara & Antalya | Cerrahsız Yüz Germe', desc: 'Sarkmaları ve kırışıklıkları gideren, ameliyatsız gençleşme sağlayan ip askı yöntemi.' },
    en: { title: 'Thread Face Lift Ankara & Antalya | Non-surgical Facial Rejuvenation', desc: 'Thread lift for lifting sagging tissues and reducing wrinkles without surgery.' },
    ar: { title: 'رفع الوجه بالخيوط أنقرة | تجديد الوجه بدون جراحة', desc: 'رفع الوجه بالخيوط لشد الأنسجة المترهلة بدون جراحة.' },
    ru: { title: 'Нитевой лифтинг Анкара | Нехирургическое омоложение', desc: 'Нитевой лифтинг для устранения птоза и морщин без операции.' },
    fr: { title: 'Lifting par fils Ankara & Antalya | Rajeunissement facial non-chirurgical', desc: 'Lifting par fils tenseurs pour corriger le relâchement sans chirurgie.' },
    de: { title: 'Fadenlifting Ankara & Antalya | Nicht-chirurgliche Gesichtsverjüngung', desc: 'Fadenlifting zur Straffung erschlaffter Gewebe ohne Operation.' },
    keywords: 'İp ile yüz askılama, İp askı Antalya, Lara, Thread face lift',
  },
  {
    slug: 'gamze-estetigi',
    tr: { title: 'Gamze Estetiği Ankara & Antalya | Doğal ve Zarif Gülüş', desc: 'Yüze doğal bir çekicilik katan, kısa sürede kalıcı sonuçlar veren gamze estetiği uygulaması.' },
    en: { title: 'Dimple Aesthetics Ankara & Antalya | Natural Charming Smile', desc: 'Dimple creation for a natural, charming smile with lasting results.' },
    ar: { title: 'تجميل الغمازات أنقرة | ابتسامة جذابة طبيعية', desc: 'إنشاء الغمازات لابتسامة جذابة طبيعية بنتائج دائمة.' },
    ru: { title: 'Эстетика ямочек Анкара | Обаятельная улыбка', desc: 'Создание ямочек на щеках для обаятельной естественной улыбки.' },
    fr: { title: 'Esthétique des fossettes Ankara & Antalya | Sourire naturel charmant', desc: 'Création de fossettes pour un sourire naturel et charmant avec des résultats durables.' },
    de: { title: 'Grübchen-Ästhetik Ankara & Antalya | Natürliches Lächeln', desc: 'Schaffung von Grübchen für ein natürliches, bezauberndes Lächeln.' },
    keywords: 'Gamze estetiği, Dimple aesthetics Ankara Antalya',
  },
  {
    slug: 'kepce-kulak-estetigi-otoplasti',
    tr: { title: 'Kepçe Kulak Ameliyatı Ankara & Antalya | Doğal Görünümlü Otoplasti', desc: 'Yüz oranlarını dengeleyen, estetik ve doğal sonuçlar sağlayan otoplasti uygulamaları.' },
    en: { title: 'Prominent Ear Surgery Ankara & Antalya | Natural Otoplasty Results', desc: 'Otoplasty for correcting prominent ears and balancing facial proportions naturally.' },
    ar: { title: 'جراحة الأذن البارزة أنقرة | أوتوبلاستي طبيعية', desc: 'تصحيح الأذن البارزة وتوازن ملامح الوجه بنتائج طبيعية.' },
    ru: { title: 'Отопластика Анкара | Коррекция торчащих ушей', desc: 'Отопластика для коррекции выступающих ушей и гармонизации пропорций лица.' },
    fr: { title: 'Otoplastie Ankara & Antalya | Correction des oreilles décollées', desc: 'Otoplastie pour corriger les oreilles décollées et harmoniser les proportions du visage.' },
    de: { title: 'Otoplastik Ankara & Antalya | Korrektur abstehender Ohren', desc: 'Otoplastik zur Korrektur abstehender Ohren und Harmonisierung der Gesichtsproportionen.' },
    keywords: 'Kepçe kulak ameliyatı, Otoplasti Antalya, Lara, Prominent ear surgery',
  },
  {
    slug: 'prp-uygulamasi',
    tr: { title: 'PRP Ankara & Antalya | Doğal Cilt Yenileme ve Gençlik Aşısı', desc: 'Kendi kanınızdan elde edilen büyüme faktörleriyle cildi yenileyen PRP tedavisi.' },
    en: { title: 'PRP Ankara & Antalya | Natural Skin Rejuvenation', desc: 'PRP therapy using your own growth factors for natural skin renewal and rejuvenation.' },
    ar: { title: 'علاج PRP أنقرة | تجديد الجلد الطبيعي', desc: 'علاج PRP بعوامل النمو الخاصة بك لتجديد الجلد بشكل طبيعي.' },
    ru: { title: 'PRP Анкара | Натуральное омоложение кожи', desc: 'PRP-терапия собственными факторами роста для естественного омоложения кожи.' },
    fr: { title: 'PRP Ankara & Antalya | Rajeunissement cutané naturel', desc: 'Traitement PRP avec vos propres facteurs de croissance pour un renouvellement naturel de la peau.' },
    de: { title: 'PRP Ankara & Antalya | Natürliche Hautverjüngung', desc: 'PRP-Therapie mit eigenen Wachstumsfaktoren für natürliche Hauterneuerung.' },
    keywords: 'PRP gençlik aşısı, Cilt yenileme Ankara Antalya, PRP treatment',
  },
  {
    slug: 'cilt-yenileme',
    tr: { title: 'Cilt Yenileme Ankara & Antalya | Parlak ve Sağlıklı Görünüm', desc: 'Lazer, PRP ve mezoterapi kombinasyonlarıyla cilt dokusunu yenileyen uygulamalar.' },
    en: { title: 'Skin Rejuvenation Ankara & Antalya | Bright & Healthy Skin', desc: 'Laser, PRP and mesotherapy combinations for skin texture renewal and radiance.' },
    ar: { title: 'تجديد الجلد أنقرة | بشرة مشرقة وصحية', desc: 'تحسين نسيج الجلد بتوليفات الليزر وPRP والمزوثيرابي.' },
    ru: { title: 'Омоложение кожи Анкара | Сияющая здоровая кожа', desc: 'Лазер, PRP и мезотерапия для обновления текстуры кожи.' },
    fr: { title: 'Renouvellement cutané Ankara & Antalya | Peau éclatante et saine', desc: 'Combinaisons de laser, PRP et mésothérapie pour renouveler la texture de la peau.' },
    de: { title: 'Hauterneuerung Ankara & Antalya | Strahlende gesunde Haut', desc: 'Laser, PRP und Mesotherapie-Kombinationen zur Erneuerung der Hauttextur.' },
    keywords: 'Cilt yenileme tedavileri, Skin rejuvenation Antalya, Lara, PRP Ankara Antalya',
  },
  {
    slug: 'cilt-soyma-kimyasal-peeling-i-slemleri',
    tr: { title: 'Kimyasal Peeling Ankara & Antalya | Cilt Yenileme Tedavisi', desc: 'Cilt dokusunu yenileyen, leke ve pürüzleri azaltan profesyonel kimyasal peeling uygulamaları.' },
    en: { title: 'Chemical Peeling Ankara & Antalya | Professional Skin Renewal', desc: 'Professional chemical peeling treatments for skin renewal, reducing spots and uneven texture.' },
    ar: { title: 'تقشير كيميائي أنقرة | علاج تجديد الجلد', desc: 'تقشير كيميائي احترافي لتجديد الجلد وتقليل البقع وتحسين الملمس.' },
    ru: { title: 'Химический пилинг Анкара | Обновление кожи', desc: 'Профессиональный химический пилинг для обновления кожи, уменьшения пятен и неровностей.' },
    fr: { title: 'Peeling chimique Ankara & Antalya | Renouvellement cutané professionnel', desc: 'Peeling chimique professionnel pour renouveler la peau et réduire les taches.' },
    de: { title: 'Chemisches Peeling Ankara & Antalya | Professionelle Hauterneuerung', desc: 'Professionelles chemisches Peeling zur Hauterneuerung und Reduzierung von Flecken.' },
    keywords: 'Kimyasal peeling Antalya, Lara, Cilt soyma, Chemical peeling',
  },
  {
    slug: 'yuz-germe-facelift',
    tr: { title: 'Yüz Germe (Facelift) Ankara & Antalya | Doğal Gençlik', desc: 'Yüz ve boyun bölgesindeki sarkmayı gideren facelift ameliyatıyla doğal bir gençlik elde edin.' },
    en: { title: 'Facelift Ankara & Antalya | Natural Facial Rejuvenation Surgery', desc: 'Facelift surgery for natural correction of facial and neck sagging.' },
    ar: { title: 'شد الوجه أنقرة | شباب طبيعي', desc: 'جراحة شد الوجه والرقبة لتصحيح الترهل بشكل طبيعي.' },
    ru: { title: 'Фейслифтинг Анкара | Естественное омоложение', desc: 'Фейслифтинг для естественной коррекции птоза лица и шеи.' },
    fr: { title: 'Lifting facial Ankara & Antalya | Rajeunissement naturel', desc: 'Chirurgie de lifting facial pour corriger naturellement le relâchement du visage et du cou.' },
    de: { title: 'Facelift Ankara & Antalya | Natürliche Gesichtsverjüngung', desc: 'Facelift-Operation zur natürlichen Korrektur von Gesichts- und Halserschlaffung.' },
    keywords: 'Yüz germe, Facelift Antalya, Lara, Yüz estetiği Ankara Antalya',
  },
  {
    slug: 'kas-kaldirma',
    tr: { title: 'Kaş Kaldırma Ankara & Antalya | Bakışlara Gençlik Kazandırma', desc: 'Kaş hattını yükselterek gözlere daha genç ve dinamik bir ifade kazandıran kaş kaldırma.' },
    en: { title: 'Brow Lift Ankara & Antalya | Youthful Eye Expression', desc: 'Brow lift to raise the brow line and create a more youthful, dynamic eye expression.' },
    ar: { title: 'رفع الحاجب أنقرة | تجديد نظرة العيون', desc: 'رفع الحاجب لرفع خط الحاجب ومنح العيون مظهراً أكثر شباباً وحيوية.' },
    ru: { title: 'Подтяжка бровей Анкара | Молодой взгляд', desc: 'Подтяжка бровей для придания глазам более молодого и динамичного выражения.' },
    fr: { title: 'Lifting des sourcils Ankara & Antalya | Regard rajeuni', desc: 'Lifting des sourcils pour rehausser la ligne des sourcils et rajeunir le regard.' },
    de: { title: 'Brauenlift Ankara & Antalya | Jugendlicher Augenausdruck', desc: 'Brauenlift zum Anheben der Brauenlinie für einen jugendlicheren Blick.' },
    keywords: 'Kaş kaldırma Ankara Antalya, Brow lift, Göz estetiği Ankara Antalya',
  },
  {
    slug: 'gokce-ozel-kimdir',
    tr: { title: 'Prof. Dr. Gökçe Özel | Kimdir? | Antalya - Lara KBB & Yüz Estetiği Uzmanı', desc: 'Prof. Dr. Gökçe Özel, Ankara\'da KBB ve yüz estetiği alanında 15+ yıl deneyimli, akademisyen bir uzman.' },
    en: { title: 'About Prof. Dr. Gökçe Özel | ENT & Facial Aesthetics Specialist', desc: 'Prof. Dr. Gökçe Özel: Ankara & Antalya (Lara) ENT and facial aesthetics specialist with 15+ years of academic experience.' },
    ar: { title: 'عن الأستاذة د. غوكتشه أوزيل | متخصصة في الأنف والأذن والحنجرة', desc: 'أستاذة د. غوكتشه أوزيل، متخصصة في طب الأنف والأذن والحنجرة وتجميل الوجه بخبرة أكاديمية تتجاوز 15 عاماً.' },
    ru: { title: 'О Проф. д-р Гёкче Озель | ЛОР-специалист и эстетик', desc: 'Профессор д-р Гёкче Озель — специалист по ЛОР и эстетике лица с 15+ летним академическим опытом.' },
    fr: { title: 'À propos de Prof. Dr. Gökçe Özel | Spécialiste ORL et esthétique', desc: 'Prof. Dr. Gökçe Özel: spécialiste ORL et esthétique faciale à Ankara & Antalya, Lara avec plus de 15 ans d\'expérience académique.' },
    de: { title: 'Über Prof. Dr. Gökçe Özel | HNO- und Ästhetikspezialistin', desc: 'Prof. Dr. Gökçe Özel: HNO- und Gesichtsästhetik-Spezialistin in Ankara & Antalya, Lara mit 15+ Jahren akademischer Erfahrung.' },
    keywords: 'Prof. Dr. Gökçe Özel, Yüz estetiği Ankara Antalya, KBB uzmanı Ankara Antalya',
  },
];

// ─── Helper ────────────────────────────────────────────────────────────────
async function getPageId(slug) {
  const page = await prisma.page.findUnique({ where: { slug }, select: { id: true } });
  return page?.id || null;
}

async function upsertSeoMeta(pageId, locale, title, desc, keywords = '') {
  const existing = await prisma.seoMeta.findFirst({ where: { pageId, locale } });
  if (existing) {
    await prisma.seoMeta.update({
      where: { id: existing.id },
      data: {
        metaTitle: title,
        metaDescription: desc,
        ...(keywords ? { keywords } : {}),
        robots: 'index,follow',
      },
    });
  } else {
    await prisma.seoMeta.create({
      data: {
        pageId,
        locale,
        metaTitle: title,
        metaDescription: desc,
        keywords: keywords || null,
        robots: 'index,follow',
      },
    });
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  let updated = 0;
  let notFound = 0;

  for (const entry of SEO_DATA) {
    const pageId = await getPageId(entry.slug);
    if (!pageId) {
      console.log(`⚠️  Page not found: ${entry.slug}`);
      notFound++;
      continue;
    }

    const locales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
    for (const locale of locales) {
      const data = entry[locale];
      if (!data) continue;
      await upsertSeoMeta(pageId, locale, data.title, data.desc, locale === 'tr' ? entry.keywords : null);
    }

    console.log(`✅ Updated SEO for: ${entry.slug}`);
    updated++;
  }

  console.log(`\nDone: ${updated} pages updated, ${notFound} not found.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
