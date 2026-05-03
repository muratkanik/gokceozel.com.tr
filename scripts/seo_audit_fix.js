// SEO Audit & Fix Script
// Run: DATABASE_URL="..." node scripts/seo_audit_fix.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// All 20 required services with full multilingual SEO data
const SERVICES = [
  {
    slug: 'rinoplasti',
    titleInternal: 'Rinoplasti',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Burun Estetiği Ankara | Prof. Dr. Gökçe Özel',
        metaDescription: 'Yüz oranlarını dengeleyen, doğal ve fonksiyonel burun estetiği. Prof. Dr. Gökçe Özel ile kişiye özel rinoplasti çözümleri.',
        keywords: 'Burun estetiği Ankara, Rinoplasti uzmanı, Burun ameliyatı Ankara, Rinoplasti Ankara',
      },
      en: {
        metaTitle: 'Rhinoplasty Ankara | Prof. Dr. Gökçe Özel',
        metaDescription: 'Natural, functional rhinoplasty that balances facial proportions. Personalized nose surgery with Prof. Dr. Gökçe Özel.',
        keywords: 'Rhinoplasty Ankara, nose surgery Turkey, rhinoplasty specialist',
      },
      de: {
        metaTitle: 'Rhinoplastik Ankara | Prof. Dr. Gökçe Özel',
        metaDescription: 'Natürliche und funktionelle Rhinoplastik zur Harmonisierung der Gesichtsproportionen. Individuell gestaltete Nasenkorrektur.',
        keywords: 'Rhinoplastik Ankara, Nasenkorrektur Türkei',
      },
      fr: {
        metaTitle: 'Rhinoplastie Ankara | Prof. Dr. Gökçe Özel',
        metaDescription: 'Rhinoplastie naturelle et fonctionnelle pour équilibrer les proportions du visage. Solutions personnalisées avec le Prof. Dr. Gökçe Özel.',
        keywords: 'Rhinoplastie Ankara, chirurgie du nez Turquie',
      },
      ar: {
        metaTitle: 'تجميل الأنف أنقرة | أ.د. غوكجة أوزال',
        metaDescription: 'تجميل الأنف الطبيعي والوظيفي مع موازنة ملامح الوجه في أنقرة. حلول شخصية مع أ.د. غوكجة أوزال.',
        keywords: 'تجميل الأنف أنقرة, جراحة الأنف تركيا',
      },
      ru: {
        metaTitle: 'Ринопластика Анкара | Проф. д-р Гёкче Озель',
        metaDescription: 'Натуральная и функциональная ринопластика для гармонизации пропорций лица. Индивидуальный подход.',
        keywords: 'Ринопластика Анкара, операция на нос Турция',
      },
    },
    description: {
      tr: 'Yüzün doğal dengesini koruyarak kişiye özel burun estetiği uygulamaları. Fonksiyonel ve estetik sonuçlar, doğal bir görünümle birleşiyor.',
      en: 'Personalized rhinoplasty preserving the natural balance of the face. Functional and aesthetic results combined with a natural look.',
      de: 'Individuelle Rhinoplastik unter Wahrung der natürlichen Gesichtsbalance. Funktionelle und ästhetische Ergebnisse mit natürlichem Aussehen.',
      fr: 'Rhinoplastie personnalisée préservant l\'équilibre naturel du visage. Résultats fonctionnels et esthétiques avec un aspect naturel.',
      ar: 'جراحة تجميل الأنف الشخصية للحفاظ على التوازن الطبيعي للوجه. نتائج وظيفية وجمالية بمظهر طبيعي.',
      ru: 'Индивидуальная ринопластика с сохранением естественного баланса лица. Функциональные и эстетические результаты.',
    },
  },
  {
    slug: 'goz-kapagi-estetigi',
    titleInternal: 'Göz Kapağı Estetiği',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Göz Kapağı Estetiği Ankara | Üst ve Alt Blefaroplasti',
        metaDescription: 'Yorgun bakışları gideren, genç ve canlı bir görünüm sağlayan üst ve alt göz kapağı estetiği.',
        keywords: 'Göz kapağı estetiği, Blefaroplasti Ankara, Üst göz kapağı, Alt göz kapağı',
      },
      en: {
        metaTitle: 'Eyelid Surgery Ankara | Upper and Lower Blepharoplasty',
        metaDescription: 'Upper and lower eyelid aesthetics that eliminate tired looks and provide a youthful, vibrant appearance.',
        keywords: 'Eyelid surgery Ankara, blepharoplasty Turkey, upper eyelid, lower eyelid',
      },
      de: {
        metaTitle: 'Lidchirurgie Ankara | Ober- und Unterlidstraffung',
        metaDescription: 'Ober- und Unterlidkorrektur für ein frisches, jugendliches Aussehen. Blepharoplastik in Ankara.',
        keywords: 'Lidchirurgie Ankara, Blepharoplastik Türkei',
      },
      fr: {
        metaTitle: 'Chirurgie des paupières Ankara | Blépharoplastie',
        metaDescription: 'Esthétique des paupières supérieures et inférieures pour un regard jeune et dynamique.',
        keywords: 'Chirurgie des paupières Ankara, blépharoplastie Turquie',
      },
      ar: {
        metaTitle: 'جراحة الجفون أنقرة | رفع الجفون العلوية والسفلية',
        metaDescription: 'جراحة تجميل الجفون العلوية والسفلية للحصول على مظهر شاب ومنتعش.',
        keywords: 'جراحة الجفون أنقرة, تجميل الجفون تركيا',
      },
      ru: {
        metaTitle: 'Блефаропластика Анкара | Верхние и нижние веки',
        metaDescription: 'Эстетика верхних и нижних век для молодого и свежего взгляда. Блефаропластика в Анкаре.',
        keywords: 'Блефаропластика Анкара, операция на веки Турция',
      },
    },
    description: {
      tr: 'Alt ve üst göz kapağı estetiği ile yorgun görünüm giderilir, bakışlara gençlik ve canlılık kazandırılır.',
      en: 'Upper and lower eyelid aesthetics eliminate tired appearance, restoring youth and vitality to the eyes.',
      de: 'Ober- und Unterlidkorrektur beseitigt müdes Aussehen und verleiht dem Blick Jugendlichkeit und Frische.',
      fr: 'L\'esthétique des paupières supérieures et inférieures élimine l\'apparence fatiguée et redonne jeunesse et vitalité au regard.',
      ar: 'تجميل الجفون العلوية والسفلية يزيل المظهر المتعب ويمنح النظرة الشباب والحيوية.',
      ru: 'Эстетика верхних и нижних век устраняет усталый вид и придаёт взгляду молодость и живость.',
    },
  },
  {
    slug: 'botoks-ile-kas-kaldirma',
    titleInternal: 'Botoks ile Kaş Kaldırma',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Botoks Ankara | Doğal Görünümlü Yüz Gençleştirme',
        metaDescription: 'Mimik çizgilerini azaltan, doğal ifadeyi koruyan botoks uygulamaları Prof. Dr. Gökçe Özel kliniğinde.',
        keywords: 'Botoks Ankara, Yüz gençleştirme, Mimik çizgileri, Botoks uygulamaları',
      },
      en: {
        metaTitle: 'Botox Ankara | Natural-Looking Facial Rejuvenation',
        metaDescription: 'Botox treatments that reduce expression lines while preserving natural facial expressions. At Prof. Dr. Gökçe Özel clinic.',
        keywords: 'Botox Ankara, facial rejuvenation, expression lines botox',
      },
      de: {
        metaTitle: 'Botox Ankara | Natürliche Gesichtsverjüngung',
        metaDescription: 'Botox-Behandlungen, die Mimikfalten reduzieren und den natürlichen Gesichtsausdruck erhalten.',
        keywords: 'Botox Ankara, Gesichtsverjüngung, Mimikfalten',
      },
      fr: {
        metaTitle: 'Botox Ankara | Rajeunissement facial naturel',
        metaDescription: 'Traitements botox qui réduisent les rides d\'expression tout en préservant l\'expression naturelle du visage.',
        keywords: 'Botox Ankara, rajeunissement facial, rides expression',
      },
      ar: {
        metaTitle: 'بوتوكس أنقرة | تجديد شباب الوجه بمظهر طبيعي',
        metaDescription: 'علاجات البوتوكس التي تقلل خطوط التعبير مع الحفاظ على التعبيرات الطبيعية للوجه.',
        keywords: 'بوتوكس أنقرة, تجديد شباب الوجه, خطوط التعبير',
      },
      ru: {
        metaTitle: 'Ботокс Анкара | Естественное омоложение лица',
        metaDescription: 'Процедуры ботокса, уменьшающие мимические морщины при сохранении естественной мимики.',
        keywords: 'Ботокс Анкара, омоложение лица, мимические морщины',
      },
    },
    description: {
      tr: 'Mimik çizgilerini yumuşatarak yüzü dinlenmiş ve taze bir görünüme kavuşturan botoks uygulamaları, doğal ifadeyi korur.',
      en: 'Botox treatments that soften expression lines for a rested, fresh appearance while preserving natural facial expression.',
      de: 'Botox-Behandlungen glätten Mimikfalten für ein ausgeruhtes, frisches Aussehen und erhalten den natürlichen Gesichtsausdruck.',
      fr: 'Les traitements botox atténuent les rides d\'expression pour un aspect reposé et frais tout en préservant l\'expression naturelle.',
      ar: 'علاجات البوتوكس التي تلين خطوط التعبير للحصول على مظهر مرتاح ومنعش مع الحفاظ على تعبيرات الوجه الطبيعية.',
      ru: 'Процедуры ботокса разглаживают мимические морщины для отдохнувшего, свежего вида при сохранении естественной мимики.',
    },
  },
  {
    slug: 'dolgu-i-slemleri',
    titleInternal: 'Dolgu İşlemleri',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Dolgu Uygulamaları Ankara | Yüz Hattı Şekillendirme',
        metaDescription: 'Hacim kaybını gideren ve yüz hatlarını belirginleştiren dolgu uygulamalarıyla anında gençleşin.',
        keywords: 'Dolgu uygulamaları Ankara, Yüz dolgusu, Hyaluronik asit dolgu, Yüz şekillendirme',
      },
      en: {
        metaTitle: 'Dermal Fillers Ankara | Facial Contouring',
        metaDescription: 'Instantly rejuvenate with dermal fillers that restore volume loss and define facial contours.',
        keywords: 'Dermal fillers Ankara, facial contouring, hyaluronic acid filler',
      },
      de: {
        metaTitle: 'Fillertherapie Ankara | Gesichtskonturierung',
        metaDescription: 'Sofortige Verjüngung mit Fillern, die Volumenverlust ausgleichen und Gesichtskonturen definieren.',
        keywords: 'Fillertherapie Ankara, Gesichtskonturierung, Hyaluronsäure',
      },
      fr: {
        metaTitle: 'Injection de fillers Ankara | Remodelage facial',
        metaDescription: 'Rajeunissez instantanément avec des fillers qui restaurent la perte de volume et définissent les contours du visage.',
        keywords: 'Injection fillers Ankara, remodelage facial, acide hyaluronique',
      },
      ar: {
        metaTitle: 'حقن الفيلر أنقرة | تشكيل ملامح الوجه',
        metaDescription: 'تجدد شبابك فوراً مع حقن الفيلر التي تستعيد فقدان الحجم وتحدد ملامح الوجه.',
        keywords: 'حقن الفيلر أنقرة, تشكيل الوجه, حمض الهيالورونيك',
      },
      ru: {
        metaTitle: 'Контурная пластика Анкара | Коррекция овала лица',
        metaDescription: 'Мгновенное омоложение с помощью филлеров, восполняющих потерю объёма и формирующих контур лица.',
        keywords: 'Контурная пластика Анкара, коррекция лица, гиалуроновая кислота',
      },
    },
    description: {
      tr: 'Yüz hatlarını belirginleştiren ve hacim kaybını gideren dolgu işlemleriyle ciltte anında tazelenme ve gençleşme sağlanır.',
      en: 'Dermal filler treatments that define facial features and restore volume loss for instant skin freshness and rejuvenation.',
      de: 'Filler-Behandlungen, die Gesichtszüge definieren und Volumenverlust ausgleichen, für sofortige Frische und Verjüngung.',
      fr: 'Les traitements aux fillers définissent les traits du visage et restaurent la perte de volume pour un effet jeunesse instantané.',
      ar: 'علاجات حقن الفيلر التي تحدد ملامح الوجه وتستعيد فقدان الحجم لتجديد فوري للبشرة.',
      ru: 'Процедуры с филлерами, которые очерчивают черты лица и восполняют потерю объёма для мгновенного омоложения.',
    },
  },
  {
    slug: 'dudak-estetigi-liplift',
    titleInternal: 'Dudak Estetiği (Liplift)',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Dudak Kaldırma Estetiği | Doğal ve Genç Gülüş',
        metaDescription: 'Dudak oranlarını dengeleyen, yüz estetiğine uyumlu dudak kaldırma işlemiyle zarif bir görünüm.',
        keywords: 'Dudak kaldırma, Lip lift Ankara, Dudak estetiği, Gülüş tasarımı',
      },
      en: {
        metaTitle: 'Lip Lift Surgery | Natural and Youthful Smile',
        metaDescription: 'Lip lift procedure that balances lip proportions and creates an elegant appearance in harmony with facial aesthetics.',
        keywords: 'Lip lift Ankara, lip aesthetics, smile design Turkey',
      },
      de: {
        metaTitle: 'Lippenkorrektur | Natürliches und jugendliches Lächeln',
        metaDescription: 'Lippenkorrektur, die die Lippenverhältnisse ausgleicht und ein elegantes Aussehen in Harmonie mit der Gesichtsästhetik schafft.',
        keywords: 'Lippenkorrektur Ankara, Lippenästhetik, Lächeln Design',
      },
      fr: {
        metaTitle: 'Lifting des lèvres | Sourire naturel et jeune',
        metaDescription: 'Lifting des lèvres qui équilibre les proportions labiales pour une apparence élégante en harmonie avec l\'esthétique faciale.',
        keywords: 'Lifting des lèvres Ankara, esthétique des lèvres, design sourire',
      },
      ar: {
        metaTitle: 'رفع الشفاه | ابتسامة طبيعية وشابة',
        metaDescription: 'عملية رفع الشفاه التي توازن نسب الشفاه وتخلق مظهراً أنيقاً متناغماً مع جماليات الوجه.',
        keywords: 'رفع الشفاه أنقرة, تجميل الشفاه, تصميم الابتسامة',
      },
      ru: {
        metaTitle: 'Лифтинг губ | Естественная и молодая улыбка',
        metaDescription: 'Лифтинг губ для балансировки пропорций и элегантного вида в гармонии с эстетикой лица.',
        keywords: 'Лифтинг губ Анкара, эстетика губ, дизайн улыбки',
      },
    },
    description: {
      tr: 'Dudak konturunu belirginleştirerek daha genç, dengeli ve estetik bir gülüş sağlar.',
      en: 'Defines the lip contour for a younger, balanced, and aesthetically pleasing smile.',
      de: 'Definiert die Lippenkontur für ein jüngeres, ausgewogenes und ästhetisch ansprechendes Lächeln.',
      fr: 'Définit le contour des lèvres pour un sourire plus jeune, équilibré et esthétiquement agréable.',
      ar: 'يحدد خط الشفاه للحصول على ابتسامة أكثر شباباً وتوازناً وجمالاً.',
      ru: 'Очерчивает контур губ для более молодой, сбалансированной и эстетически привлекательной улыбки.',
    },
  },
  {
    slug: 'dudak-dolgusu',
    titleInternal: 'Dudak Dolgusu',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Dudak Dolgusu Ankara | Doğal Hacimli Dudaklar',
        metaDescription: 'Dudaklara form, nem ve dolgunluk kazandıran, doğal sonuçlar sunan dudak dolgusu uygulamaları.',
        keywords: 'Dudak dolgusu Ankara, Dudak büyütme, Hyaluronik asit dudak, Doğal dudaklar',
      },
      en: {
        metaTitle: 'Lip Filler Ankara | Natural Fuller Lips',
        metaDescription: 'Lip filler applications that add shape, moisture, and fullness to lips with natural-looking results.',
        keywords: 'Lip filler Ankara, lip augmentation, natural lips Turkey',
      },
      de: {
        metaTitle: 'Lippenaufspritzung Ankara | Natürlich vollere Lippen',
        metaDescription: 'Lippenaufspritzung für mehr Form, Feuchtigkeit und Fülle mit natürlichen Ergebnissen.',
        keywords: 'Lippenaufspritzung Ankara, Lippenvergrößerung Türkei',
      },
      fr: {
        metaTitle: 'Augmentation des lèvres Ankara | Lèvres naturellement pulpeuses',
        metaDescription: 'Injections lèvres pour ajouter forme, hydratation et volume avec des résultats naturels.',
        keywords: 'Augmentation des lèvres Ankara, lèvres naturelles Turquie',
      },
      ar: {
        metaTitle: 'تكبير الشفاه أنقرة | شفاه أكثر امتلاءً بشكل طبيعي',
        metaDescription: 'حقن الشفاه التي تضيف الشكل والرطوبة والامتلاء مع نتائج طبيعية المظهر.',
        keywords: 'تكبير الشفاه أنقرة, حقن الشفاه, شفاه طبيعية',
      },
      ru: {
        metaTitle: 'Увеличение губ Анкара | Естественно пышные губы',
        metaDescription: 'Инъекции для губ, придающие форму, увлажнение и объём с естественными результатами.',
        keywords: 'Увеличение губ Анкара, филлер для губ Турция',
      },
    },
    description: {
      tr: 'Dudaklara hacim, nem ve form kazandıran doğal görünümlü dudak dolgusu ile yüz ifadesi yumuşatılır.',
      en: 'Natural-looking lip filler that adds volume, moisture and shape to lips, softening facial expression.',
      de: 'Natürlich wirkende Lippenaufspritzung verleiht Volumen, Feuchtigkeit und Form und mildert den Gesichtsausdruck.',
      fr: 'Le filler lèvres à l\'aspect naturel apporte volume, hydratation et forme aux lèvres, adoucissant l\'expression du visage.',
      ar: 'حشو الشفاه الطبيعي المظهر الذي يضيف الحجم والرطوبة والشكل للشفاه، ويلطف تعابير الوجه.',
      ru: 'Филлер для губ с естественным видом, добавляющий объём, влажность и форму, смягчая выражение лица.',
    },
  },
  {
    slug: 'endolift',
    titleInternal: 'Endolift Lazer',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Endolift Lazer Ankara | Cerrahsız Yüz Germe',
        metaDescription: 'Lazer teknolojisiyle cilt altı dokuda sıkılaşma ve toparlanma sağlayan Endolift uygulaması.',
        keywords: 'Endolift Ankara, Lazer yüz germe, Cerrahsız yüz germe, Endolift lazer',
      },
      en: {
        metaTitle: 'Endolift Laser Ankara | Non-Surgical Face Lifting',
        metaDescription: 'Endolift laser treatment that provides tightening and recovery in subcutaneous tissue using laser technology.',
        keywords: 'Endolift laser Ankara, non-surgical face lift, laser face tightening',
      },
      de: {
        metaTitle: 'Endolift Laser Ankara | Nicht-chirurgisches Facelift',
        metaDescription: 'Endolift-Laserbehandlung, die das Unterhautgewebe mit Lasertechnologie strafft und regeneriert.',
        keywords: 'Endolift Laser Ankara, nicht-chirurgisches Facelift',
      },
      fr: {
        metaTitle: 'Laser Endolift Ankara | Lifting facial non chirurgical',
        metaDescription: 'Traitement laser Endolift qui raffermit et régénère le tissu sous-cutané par technologie laser.',
        keywords: 'Laser Endolift Ankara, lifting non chirurgical',
      },
      ar: {
        metaTitle: 'ليزر إندوليفت أنقرة | شد الوجه بدون جراحة',
        metaDescription: 'علاج ليزر إندوليفت الذي يوفر شداً وتجديداً في الأنسجة تحت الجلد باستخدام تقنية الليزر.',
        keywords: 'ليزر إندوليفت أنقرة, شد الوجه بدون جراحة',
      },
      ru: {
        metaTitle: 'Лазер Endolift Анкара | Нехирургический лифтинг лица',
        metaDescription: 'Лазерная процедура Endolift, обеспечивающая подтяжку и восстановление подкожных тканей.',
        keywords: 'Лазер Endolift Анкара, нехирургический лифтинг лица',
      },
    },
    description: {
      tr: 'Cilt altı dokuda kolajen üretimini artıran Endolift lazer, cerrahi işlem gerektirmeden yüzü sıkılaştırır ve toparlar.',
      en: 'Endolift laser boosts collagen production in subcutaneous tissue, tightening and firming the face without surgery.',
      de: 'Endolift-Laser fördert die Kollagenproduktion im Unterhautgewebe und strafft das Gesicht ohne chirurgischen Eingriff.',
      fr: 'Le laser Endolift stimule la production de collagène dans le tissu sous-cutané, raffermissant le visage sans chirurgie.',
      ar: 'ليزر إندوليفت يعزز إنتاج الكولاجين في الأنسجة تحت الجلد، يشد الوجه ويدعمه دون جراحة.',
      ru: 'Лазер Endolift усиливает выработку коллагена в подкожных тканях, подтягивая лицо без хирургии.',
    },
  },
  {
    slug: 'mezoterapi',
    titleInternal: 'Mezoterapi',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Mezoterapi Ankara | Cilt Canlandırma ve Nemlendirme',
        metaDescription: 'Cilde parlaklık, nem ve elastikiyet kazandıran vitamin destekli mezoterapi uygulamaları.',
        keywords: 'Mezoterapi Ankara, Cilt canlandırma, Yüz mezoterapisi, Cilt nemlendirme',
      },
      en: {
        metaTitle: 'Mesotherapy Ankara | Skin Revitalization and Hydration',
        metaDescription: 'Vitamin-enriched mesotherapy treatments that give skin brightness, moisture and elasticity.',
        keywords: 'Mesotherapy Ankara, skin revitalization, facial mesotherapy',
      },
      de: {
        metaTitle: 'Mesotherapie Ankara | Hautrevitalisierung und Feuchtigkeitspflege',
        metaDescription: 'Vitaminreiche Mesotherapie-Behandlungen für Hautglanz, Feuchtigkeit und Elastizität.',
        keywords: 'Mesotherapie Ankara, Hautrevitalisierung',
      },
      fr: {
        metaTitle: 'Mésothérapie Ankara | Revitalisation et hydratation cutanée',
        metaDescription: 'Traitements de mésothérapie enrichis en vitamines pour éclat, hydratation et élasticité de la peau.',
        keywords: 'Mésothérapie Ankara, revitalisation cutanée',
      },
      ar: {
        metaTitle: 'مزوثيرابي أنقرة | تجديد البشرة والترطيب',
        metaDescription: 'علاجات المزوثيرابي الغنية بالفيتامينات التي تمنح البشرة الإشراق والرطوبة والمرونة.',
        keywords: 'مزوثيرابي أنقرة, تجديد البشرة',
      },
      ru: {
        metaTitle: 'Мезотерапия Анкара | Восстановление и увлажнение кожи',
        metaDescription: 'Витаминизированные процедуры мезотерапии для яркости, увлажнения и эластичности кожи.',
        keywords: 'Мезотерапия Анкара, восстановление кожи',
      },
    },
    description: {
      tr: 'Cildin ihtiyacına göre özel karışımlarla yapılan mezoterapi, nem, parlaklık ve elastikiyet kazandırarak cildi canlandırır.',
      en: 'Customized mesotherapy with specialized mixtures revitalizes skin, providing moisture, brightness and elasticity.',
      de: 'Individuell angepasste Mesotherapie revitalisiert die Haut und verleiht ihr Feuchtigkeit, Glanz und Elastizität.',
      fr: 'La mésothérapie personnalisée revitalise la peau en lui apportant hydratation, éclat et élasticité.',
      ar: 'مزوثيرابي مخصصة بمزيج متخصص تجدد البشرة، تمنحها الرطوبة والإشراق والمرونة.',
      ru: 'Индивидуально подобранная мезотерапия восстанавливает кожу, обеспечивая увлажнение, сияние и эластичность.',
    },
  },
  {
    slug: 'i-ple-yuz-germe-fransiz-aski',
    titleInternal: 'İple Yüz Germe (Fransız Askı)',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'İp ile Yüz Askılama Ankara | Cerrahsız Yüz Germe',
        metaDescription: 'Sarkmaları ve kırışıklıkları gideren, ameliyatsız gençleşme sağlayan ip askı yöntemi.',
        keywords: 'İp ile yüz germe Ankara, Fransız askı, Cerrahsız yüz germe, Thread lift',
      },
      en: {
        metaTitle: 'Thread Face Lift Ankara | Non-Surgical Face Lifting',
        metaDescription: 'Thread lift method that eliminates sagging and wrinkles, providing non-surgical rejuvenation.',
        keywords: 'Thread face lift Ankara, French thread lift, non-surgical rejuvenation',
      },
      de: {
        metaTitle: 'Thread-Lifting Ankara | Nicht-chirurgisches Facelift',
        metaDescription: 'Thread-Lifting-Methode, die Erschlaffungen und Falten beseitigt und nicht-chirurgische Verjüngung bietet.',
        keywords: 'Thread-Lifting Ankara, französisches Thread-Lifting',
      },
      fr: {
        metaTitle: 'Thread lifting Ankara | Lifting facial non chirurgical',
        metaDescription: 'Méthode de thread lifting qui élimine le relâchement et les rides pour un rajeunissement sans chirurgie.',
        keywords: 'Thread lifting Ankara, lifting français, rajeunissement sans chirurgie',
      },
      ar: {
        metaTitle: 'شد الخيوط أنقرة | رفع الوجه بدون جراحة',
        metaDescription: 'طريقة شد الخيوط التي تزيل الترهل والتجاعيد وتوفر تجديد الشباب بدون جراحة.',
        keywords: 'شد الخيوط أنقرة, رفع الوجه بدون جراحة',
      },
      ru: {
        metaTitle: 'Нитевой лифтинг Анкара | Нехирургическая подтяжка лица',
        metaDescription: 'Нитевой лифтинг устраняет птоз и морщины, обеспечивая нехирургическое омоложение.',
        keywords: 'Нитевой лифтинг Анкара, французский лифтинг',
      },
    },
    description: {
      tr: 'Kırışıklıkları ve sarkmaları gideren ip askı yöntemi, ameliyatsız yüz germe için etkili ve konforlu bir çözümdür.',
      en: 'Thread lift method that eliminates wrinkles and sagging is an effective and comfortable solution for non-surgical face lifting.',
      de: 'Thread-Lifting-Methode beseitigt Falten und Erschlaffungen – eine effektive und komfortable Lösung für nicht-chirurgisches Facelift.',
      fr: 'La méthode de thread lifting élimine rides et relâchement – une solution efficace et confortable pour le lifting non chirurgical.',
      ar: 'طريقة شد الخيوط التي تزيل التجاعيد والترهل هي حل فعال ومريح لشد الوجه بدون جراحة.',
      ru: 'Нитевой лифтинг устраняет морщины и птоз — эффективное и комфортное решение для нехирургической подтяжки лица.',
    },
  },
  {
    slug: 'gamze-estetigi',
    titleInternal: 'Gamze Estetiği',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Gamze Estetiği Ankara | Doğal ve Zarif Gülüş',
        metaDescription: 'Yüze doğal bir çekicilik katan, kısa sürede kalıcı sonuçlar veren gamze estetiği uygulaması.',
        keywords: 'Gamze estetiği Ankara, Gamze yaptırma, Doğal gülüş, Dimple aesthetics',
      },
      en: {
        metaTitle: 'Dimple Surgery Ankara | Natural and Elegant Smile',
        metaDescription: 'Dimple aesthetics that add natural attractiveness to the face with lasting results in a short time.',
        keywords: 'Dimple surgery Ankara, dimple aesthetics Turkey, natural smile',
      },
      de: {
        metaTitle: 'Grübchen-Ästhetik Ankara | Natürliches und elegantes Lächeln',
        metaDescription: 'Grübchen-Ästhetik, die dem Gesicht natürliche Attraktivität mit dauerhaften Ergebnissen verleiht.',
        keywords: 'Grübchen-Ästhetik Ankara, Dimple Türkei',
      },
      fr: {
        metaTitle: 'Plastie des fossettes Ankara | Sourire naturel et élégant',
        metaDescription: 'Esthétique des fossettes qui ajoute un charme naturel au visage avec des résultats durables.',
        keywords: 'Plastie fossettes Ankara, fossettes naturelles Turquie',
      },
      ar: {
        metaTitle: 'تجميل الغمازات أنقرة | ابتسامة طبيعية وأنيقة',
        metaDescription: 'تجميل الغمازات الذي يضيف جاذبية طبيعية للوجه مع نتائج دائمة في وقت قصير.',
        keywords: 'تجميل الغمازات أنقرة, غمازات طبيعية',
      },
      ru: {
        metaTitle: 'Эстетика ямочек Анкара | Естественная и изящная улыбка',
        metaDescription: 'Эстетика ямочек, добавляющая естественную привлекательность лицу с длительными результатами.',
        keywords: 'Эстетика ямочек Анкара, ямочки на щеках',
      },
    },
    description: {
      tr: 'Yüzün ifadesine doğal bir çekicilik katan gamze estetiği, kısa sürede kalıcı ve zarif sonuçlar sunar.',
      en: 'Dimple aesthetics that add natural attractiveness to facial expression offer lasting and elegant results quickly.',
      de: 'Grübchen-Ästhetik verleiht dem Gesichtsausdruck natürliche Anziehungskraft und bietet dauerhafte, elegante Ergebnisse.',
      fr: 'L\'esthétique des fossettes apporte un charme naturel à l\'expression du visage avec des résultats durables et élégants rapidement.',
      ar: 'تجميل الغمازات يضيف جاذبية طبيعية لتعابير الوجه ويقدم نتائج دائمة وأنيقة بسرعة.',
      ru: 'Эстетика ямочек добавляет естественную привлекательность выражению лица и даёт долговременные элегантные результаты.',
    },
  },
  {
    slug: 'kepce-kulak-estetigi-otoplasti',
    titleInternal: 'Kepçe Kulak Estetiği (Otoplasti)',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Kepçe Kulak Ameliyatı Ankara | Doğal Görünümlü Sonuçlar',
        metaDescription: 'Yüz oranlarını dengeleyen, estetik ve doğal sonuçlar sağlayan otoplasti uygulamaları.',
        keywords: 'Kepçe kulak ameliyatı Ankara, Otoplasti, Kulak estetiği, Kepçe kulak düzeltme',
      },
      en: {
        metaTitle: 'Otoplasty Ankara | Natural-Looking Ear Pinning Results',
        metaDescription: 'Otoplasty procedures that balance facial proportions with aesthetic and natural results.',
        keywords: 'Otoplasty Ankara, ear pinning Turkey, prominent ear correction',
      },
      de: {
        metaTitle: 'Abstehende Ohren OP Ankara | Natürliches Ergebnis',
        metaDescription: 'Otoplastik-Eingriffe, die Gesichtsproportionen mit ästhetischen und natürlichen Ergebnissen ausgleichen.',
        keywords: 'Abstehende Ohren OP Ankara, Otoplastik Türkei',
      },
      fr: {
        metaTitle: 'Otoplastie Ankara | Résultats naturels pour oreilles décollées',
        metaDescription: 'Procédures d\'otoplastie qui équilibrent les proportions faciales avec des résultats esthétiques et naturels.',
        keywords: 'Otoplastie Ankara, correction oreilles Turquie',
      },
      ar: {
        metaTitle: 'تجميل الأذن أنقرة | نتائج طبيعية المظهر',
        metaDescription: 'إجراءات تجميل الأذن التي توازن نسب الوجه بنتائج جمالية وطبيعية.',
        keywords: 'تجميل الأذن أنقرة, تصحيح الأذن تركيا',
      },
      ru: {
        metaTitle: 'Отопластика Анкара | Естественные результаты',
        metaDescription: 'Отопластика для гармонизации пропорций лица с эстетическими и естественными результатами.',
        keywords: 'Отопластика Анкара, коррекция ушей Турция',
      },
    },
    description: {
      tr: 'Kulak kepçesindeki belirginliği gidererek yüz oranlarını dengeleyen, izsiz ve doğal sonuçlar veren bir estetik cerrahi uygulamadır.',
      en: 'Aesthetic surgery that corrects prominent ears to balance facial proportions, leaving natural results without visible scars.',
      de: 'Ästhetische Chirurgie, die abstehende Ohren korrigiert und Gesichtsproportionen mit narbenfreien, natürlichen Ergebnissen ausgleicht.',
      fr: 'Chirurgie esthétique qui corrige les oreilles décollées pour équilibrer les proportions du visage avec des résultats naturels.',
      ar: 'جراحة تجميلية تصحح بروز الأذن لتوازن نسب الوجه بنتائج طبيعية دون ندوب ظاهرة.',
      ru: 'Эстетическая операция по коррекции оттопыренных ушей для гармонизации пропорций лица с естественными результатами.',
    },
  },
  {
    slug: 'prp-uygulamasi',
    titleInternal: 'Prp Uygulaması',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'PRP Ankara | Doğal Cilt Yenileme ve Gençlik Aşısı',
        metaDescription: 'Kendi kanınızdan elde edilen büyüme faktörleriyle cildi yenileyen PRP tedavisi.',
        keywords: 'PRP Ankara, Gençlik aşısı, Cilt yenileme PRP, Kan plazması tedavisi',
      },
      en: {
        metaTitle: 'PRP Ankara | Natural Skin Renewal and Youth Injection',
        metaDescription: 'PRP treatment that renews skin using growth factors obtained from your own blood.',
        keywords: 'PRP Ankara, youth injection, skin renewal PRP, platelet rich plasma',
      },
      de: {
        metaTitle: 'PRP Ankara | Natürliche Hautregeneration',
        metaDescription: 'PRP-Behandlung, die die Haut mit aus Eigenblut gewonnenen Wachstumsfaktoren erneuert.',
        keywords: 'PRP Ankara, Hautregeneration, Eigenbluttherapie',
      },
      fr: {
        metaTitle: 'PRP Ankara | Renouvellement cutané naturel',
        metaDescription: 'Traitement PRP qui renouvelle la peau grâce aux facteurs de croissance extraits de votre propre sang.',
        keywords: 'PRP Ankara, renouvellement cutané, plasma riche en plaquettes',
      },
      ar: {
        metaTitle: 'علاج PRP أنقرة | تجديد البشرة الطبيعي',
        metaDescription: 'علاج البلازما الغنية بالصفائح الدموية الذي يجدد البشرة باستخدام عوامل النمو من دمك الخاص.',
        keywords: 'علاج PRP أنقرة, تجديد البشرة, البلازما',
      },
      ru: {
        metaTitle: 'PRP Анкара | Натуральное обновление кожи',
        metaDescription: 'Процедура PRP обновляет кожу с помощью факторов роста, полученных из собственной крови.',
        keywords: 'PRP Анкара, обновление кожи, плазмотерапия',
      },
    },
    description: {
      tr: 'Kişinin kendi kanından elde edilen büyüme faktörleriyle cilt yenilenmesini destekleyen PRP, doğal bir gençlik etkisi sağlar.',
      en: 'PRP supports skin renewal with growth factors from the patient\'s own blood, providing a natural rejuvenation effect.',
      de: 'PRP unterstützt die Hauterneuerung mit Wachstumsfaktoren aus dem Eigenblut des Patienten für einen natürlichen Verjüngungseffekt.',
      fr: 'Le PRP soutient le renouvellement cutané grâce aux facteurs de croissance du propre sang du patient pour un effet naturel.',
      ar: 'علاج PRP يدعم تجديد البشرة بعوامل النمو من دم المريض نفسه، مما يوفر تأثيراً طبيعياً لتجديد الشباب.',
      ru: 'PRP поддерживает обновление кожи с помощью факторов роста из собственной крови пациента для натурального эффекта.',
    },
  },
  {
    slug: 'cilt-yenileme',
    titleInternal: 'Cilt Yenileme Tedavileri',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Cilt Yenileme Ankara | Parlak ve Sağlıklı Görünüm',
        metaDescription: 'Lazer, PRP ve mezoterapi kombinasyonlarıyla cilt dokusunu yenileyen uygulamalar.',
        keywords: 'Cilt yenileme Ankara, Lazer cilt, PRP cilt, Cilt tedavileri',
      },
      en: {
        metaTitle: 'Skin Rejuvenation Ankara | Bright and Healthy Appearance',
        metaDescription: 'Applications that renew skin texture with combinations of laser, PRP and mesotherapy.',
        keywords: 'Skin rejuvenation Ankara, laser skin treatment, PRP skin',
      },
      de: {
        metaTitle: 'Hautregeneration Ankara | Strahlend und gesund',
        metaDescription: 'Anwendungen zur Hauterneuerung mit Kombinationen aus Laser, PRP und Mesotherapie.',
        keywords: 'Hautregeneration Ankara, Laserbehandlung Haut',
      },
      fr: {
        metaTitle: 'Régénération cutanée Ankara | Teint lumineux et sain',
        metaDescription: 'Applications qui renouvellent la texture de la peau avec des combinaisons laser, PRP et mésothérapie.',
        keywords: 'Régénération cutanée Ankara, laser peau, PRP peau',
      },
      ar: {
        metaTitle: 'تجديد البشرة أنقرة | مظهر مشرق وصحي',
        metaDescription: 'تطبيقات تجدد ملمس البشرة بمجموعات من الليزر وPRP والمزوثيرابي.',
        keywords: 'تجديد البشرة أنقرة, ليزر البشرة, علاج PRP',
      },
      ru: {
        metaTitle: 'Омоложение кожи Анкара | Яркий и здоровый вид',
        metaDescription: 'Процедуры обновления кожи с комбинацией лазера, PRP и мезотерапии.',
        keywords: 'Омоложение кожи Анкара, лазерное лечение кожи',
      },
    },
    description: {
      tr: 'Lazer, mezoterapi ve PRP kombinasyonlarıyla cildin dokusu ve parlaklığı yenilenir, daha taze bir görünüm elde edilir.',
      en: 'Skin texture and brightness are renewed with combinations of laser, mesotherapy and PRP for a fresher appearance.',
      de: 'Hauttextur und Glanz werden mit Kombinationen aus Laser, Mesotherapie und PRP für ein frischeres Aussehen erneuert.',
      fr: 'La texture et l\'éclat de la peau sont renouvelés grâce aux combinaisons laser, mésothérapie et PRP pour un aspect plus frais.',
      ar: 'يتجدد ملمس البشرة وإشراقها بمجموعات من الليزر والمزوثيرابي وPRP للحصول على مظهر أكثر نضارة.',
      ru: 'Текстура и сияние кожи обновляются с помощью комбинаций лазера, мезотерапии и PRP для более свежего вида.',
    },
  },
  {
    slug: 'yuz-germe-facelift',
    titleInternal: 'Yüz Germe (Facelift)',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Cerrahsız Yüz Gençleştirme | Doğal ve Etkili Sonuçlar',
        metaDescription: 'Botoks, dolgu, lazer ve ip uygulamalarıyla ameliyatsız yüz gençleştirme çözümleri.',
        keywords: 'Cerrahsız yüz gençleştirme Ankara, Yüz germe, Yüz gençleştirme, Non-surgical facelift',
      },
      en: {
        metaTitle: 'Non-Surgical Facial Rejuvenation | Natural and Effective Results',
        metaDescription: 'Non-surgical facial rejuvenation solutions with botox, fillers, laser and thread applications.',
        keywords: 'Non-surgical facelift Ankara, facial rejuvenation, face lifting Turkey',
      },
      de: {
        metaTitle: 'Nicht-chirurgische Gesichtsverjüngung | Natürliche Ergebnisse',
        metaDescription: 'Nicht-chirurgische Gesichtsverjüngung mit Botox, Fillern, Laser und Fadenbehandlungen.',
        keywords: 'Nicht-chirurgische Gesichtsverjüngung Ankara, Facelift',
      },
      fr: {
        metaTitle: 'Rajeunissement facial non chirurgical | Résultats naturels',
        metaDescription: 'Solutions de rajeunissement facial sans chirurgie avec botox, fillers, laser et fils tenseurs.',
        keywords: 'Rajeunissement facial non chirurgical Ankara, lifting',
      },
      ar: {
        metaTitle: 'تجديد الوجه بدون جراحة | نتائج طبيعية وفعالة',
        metaDescription: 'حلول تجديد الوجه بدون جراحة بالبوتوكس والفيلر والليزر وخيوط الشد.',
        keywords: 'تجديد الوجه بدون جراحة أنقرة, شد الوجه',
      },
      ru: {
        metaTitle: 'Нехирургическое омоложение лица | Естественные результаты',
        metaDescription: 'Нехирургическое омоложение лица с ботоксом, филлерами, лазером и нитями.',
        keywords: 'Нехирургическое омоложение лица Анкара, лифтинг',
      },
    },
    description: {
      tr: 'Botoks, dolgu, mezoterapi ve lazer yöntemleriyle ameliyatsız olarak yüzün yaşlanma belirtileri azaltılır.',
      en: 'Signs of facial aging are reduced non-surgically with botox, fillers, mesotherapy and laser methods.',
      de: 'Zeichen der Gesichtsalterung werden nicht-chirurgisch mit Botox, Fillern, Mesotherapie und Laser reduziert.',
      fr: 'Les signes du vieillissement facial sont réduits sans chirurgie avec botox, fillers, mésothérapie et laser.',
      ar: 'يتم تقليل علامات شيخوخة الوجه بشكل غير جراحي بالبوتوكس والفيلر والمزوثيرابي والليزر.',
      ru: 'Признаки старения лица уменьшаются нехирургически с ботоксом, филлерами, мезотерапией и лазером.',
    },
  },
  {
    slug: 'dolgu-ile-kas-kaldirma',
    titleInternal: 'Dolgu ile Kaş Kaldırma',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Yüz Şekillendirme Ankara | Dolgu ve İp Askı Uygulamaları',
        metaDescription: 'Çene, elmacık ve yüz ovalini yeniden tanımlayan estetik şekillendirme uygulamaları.',
        keywords: 'Yüz şekillendirme Ankara, Dolgu ile kaş kaldırma, Elmacık dolgusu, Çene şekillendirme',
      },
      en: {
        metaTitle: 'Facial Contouring Ankara | Filler and Thread Applications',
        metaDescription: 'Aesthetic shaping applications that redefine the chin, cheekbones and facial oval.',
        keywords: 'Facial contouring Ankara, cheekbone filler, chin shaping Turkey',
      },
      de: {
        metaTitle: 'Gesichtskonturierung Ankara | Filler und Fadenbehandlungen',
        metaDescription: 'Ästhetische Formgebung zur Neudefinition von Kinn, Wangenknochen und Gesichtsoval.',
        keywords: 'Gesichtskonturierung Ankara, Wangenknochen Filler',
      },
      fr: {
        metaTitle: 'Remodelage facial Ankara | Fillers et fils tenseurs',
        metaDescription: 'Applications de modelage esthétique qui redéfinissent le menton, les pommettes et l\'ovale du visage.',
        keywords: 'Remodelage facial Ankara, filler pommettes Turquie',
      },
      ar: {
        metaTitle: 'تشكيل ملامح الوجه أنقرة | الفيلر وخيوط الشد',
        metaDescription: 'تطبيقات التشكيل الجمالي التي تعيد تعريف الذقن وعظام الخد وشكل الوجه.',
        keywords: 'تشكيل الوجه أنقرة, فيلر عظام الخد',
      },
      ru: {
        metaTitle: 'Контурирование лица Анкара | Филлеры и нити',
        metaDescription: 'Эстетические процедуры для переопределения контура подбородка, скул и овала лица.',
        keywords: 'Контурирование лица Анкара, скулы филлер',
      },
    },
    description: {
      tr: 'Çene, elmacık kemiği ve yüz ovalini yeniden tanımlayan dolgu ve ip uygulamalarıyla yüz hatları ideal forma kavuşturulur.',
      en: 'Filler and thread applications that redefine chin, cheekbones and facial oval bring facial features to their ideal form.',
      de: 'Filler und Fadenbehandlungen zur Neudefinition von Kinn, Wangenknochen und Gesichtsoval bringen die Gesichtszüge in ideale Form.',
      fr: 'Les applications de fillers et fils tenseurs redéfinissent le menton, les pommettes et l\'ovale pour des traits idéaux.',
      ar: 'تطبيقات الفيلر والخيوط التي تعيد تعريف الذقن وعظام الخد وشكل الوجه تجعل ملامح الوجه في الشكل المثالي.',
      ru: 'Процедуры с филлерами и нитями для переопределения подбородка, скул и овала придают чертам лица идеальную форму.',
    },
  },
  {
    slug: 'alt-blefaroplasti',
    titleInternal: 'Alt Blefaroplasti',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Alt Blefaroplasti Ankara | Göz Altı Torbaları İçin Çözüm',
        metaDescription: 'Göz altı torbalanma ve morluklarını gidererek daha genç bir ifade kazandıran cerrahi işlem.',
        keywords: 'Alt blefaroplasti Ankara, Göz altı torbası, Göz altı estetiği, Lower blepharoplasty',
      },
      en: {
        metaTitle: 'Lower Blepharoplasty Ankara | Solution for Under-Eye Bags',
        metaDescription: 'Surgical procedure that eliminates under-eye bags and dark circles for a younger expression.',
        keywords: 'Lower blepharoplasty Ankara, under-eye bags surgery, lower eyelid Turkey',
      },
      de: {
        metaTitle: 'Unterlid-Blepharoplastik Ankara | Lösung für Tränensäcke',
        metaDescription: 'Chirurgischer Eingriff, der Tränensäcke und Augenringe beseitigt für einen jüngeren Ausdruck.',
        keywords: 'Unterlid-Blepharoplastik Ankara, Tränensäcke OP',
      },
      fr: {
        metaTitle: 'Blépharoplastie inférieure Ankara | Solution pour poches sous les yeux',
        metaDescription: 'Intervention chirurgicale qui élimine les poches et cernes sous les yeux pour une expression plus jeune.',
        keywords: 'Blépharoplastie inférieure Ankara, poches sous les yeux',
      },
      ar: {
        metaTitle: 'الجفن السفلي أنقرة | حل لأكياس تحت العين',
        metaDescription: 'إجراء جراحي يزيل أكياس العين والهالات السوداء للحصول على تعبير أكثر شباباً.',
        keywords: 'تجميل الجفن السفلي أنقرة, أكياس تحت العين',
      },
      ru: {
        metaTitle: 'Нижняя блефаропластика Анкара | Решение для мешков под глазами',
        metaDescription: 'Хирургическая процедура, устраняющая мешки и тёмные круги под глазами для более молодого вида.',
        keywords: 'Нижняя блефаропластика Анкара, мешки под глазами',
      },
    },
    description: {
      tr: 'Göz altındaki torbalanma ve morlukları gidererek daha dinlenmiş, genç bir ifade sağlar.',
      en: 'Eliminates under-eye bags and dark circles for a more rested, youthful expression.',
      de: 'Beseitigt Tränensäcke und Augenringe für einen ausgeruhteren, jüngeren Ausdruck.',
      fr: 'Élimine les poches et cernes sous les yeux pour une expression plus reposée et jeune.',
      ar: 'يزيل أكياس العين والهالات السوداء للحصول على تعبير أكثر راحة وشباباً.',
      ru: 'Устраняет мешки и тёмные круги под глазами для более отдохнувшего молодого вида.',
    },
  },
  {
    slug: 'kas-kaldirma',
    titleInternal: 'Kaş Kaldırma',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Üst Blefaroplasti Ankara | Göz Kapağı Sarkması Tedavisi',
        metaDescription: 'Göz kapağındaki sarkmayı ve fazla deriyi gidererek bakışlara açıklık ve canlılık kazandırır.',
        keywords: 'Üst blefaroplasti Ankara, Göz kapağı sarkması, Kaş kaldırma, Upper blepharoplasty',
      },
      en: {
        metaTitle: 'Upper Blepharoplasty Ankara | Eyelid Drooping Treatment',
        metaDescription: 'Eliminates eyelid drooping and excess skin, giving openness and vitality to the eyes.',
        keywords: 'Upper blepharoplasty Ankara, eyelid drooping, brow lift Turkey',
      },
      de: {
        metaTitle: 'Oberlid-Blepharoplastik Ankara | Behandlung hängender Augenlider',
        metaDescription: 'Beseitigt hängende Augenlider und überschüssige Haut, verleiht dem Blick Offenheit und Vitalität.',
        keywords: 'Oberlid-Blepharoplastik Ankara, hängende Augenlider',
      },
      fr: {
        metaTitle: 'Blépharoplastie supérieure Ankara | Traitement ptosis palpébral',
        metaDescription: 'Élimine le ptosis palpébral et l\'excès de peau pour plus d\'ouverture et de vitalité au regard.',
        keywords: 'Blépharoplastie supérieure Ankara, ptosis palpébral',
      },
      ar: {
        metaTitle: 'الجفن العلوي أنقرة | علاج ترهل جفن العين',
        metaDescription: 'يزيل ترهل الجفن والجلد الزائد، مما يمنح النظرة انفتاحاً وحيوية.',
        keywords: 'تجميل الجفن العلوي أنقرة, ترهل الجفن',
      },
      ru: {
        metaTitle: 'Верхняя блефаропластика Анкара | Лечение птоза века',
        metaDescription: 'Устраняет птоз века и избыток кожи, придавая взгляду открытость и живость.',
        keywords: 'Верхняя блефаропластика Анкара, птоз века',
      },
    },
    description: {
      tr: 'Göz kapağındaki sarkmayı ve fazla deriyi gidererek bakışlara açıklık ve canlılık kazandırır.',
      en: 'Eliminates eyelid drooping and excess skin, providing openness and vitality to the eyes.',
      de: 'Beseitigt Erschlaffung und überschüssige Haut am Augenlid für mehr Offenheit und Vitalität im Blick.',
      fr: 'Élimine le relâchement de la paupière et l\'excès de peau, apportant ouverture et vitalité au regard.',
      ar: 'يزيل ترهل جفن العين والجلد الزائد، مما يمنح النظرة الانفتاح والحيوية.',
      ru: 'Устраняет птоз века и избыток кожи, придавая взгляду открытость и живость.',
    },
  },
  {
    slug: 'lipoliz-i-nceltme-mezoterapisi',
    titleInternal: 'Lipoliz(İnceltme) Mezoterapisi',
    category: 'noninvaziv',
    seoMeta: {
      tr: {
        metaTitle: 'Lipoliz Mezoterapisi Ankara | İnceltme ve Yağ Eritme',
        metaDescription: 'Cilt altı yağ dokusuna etki eden lipoliz mezoterapisi ile bölgesel incelme ve sıkılaşma.',
        keywords: 'Lipoliz mezoterapisi Ankara, İnceltme mezoterapisi, Yağ eritme, Bölgesel incelme',
      },
      en: {
        metaTitle: 'Lipolysis Mesotherapy Ankara | Slimming and Fat Dissolving',
        metaDescription: 'Regional slimming and tightening with lipolysis mesotherapy that affects subcutaneous fat tissue.',
        keywords: 'Lipolysis mesotherapy Ankara, slimming mesotherapy, fat dissolving',
      },
      de: {
        metaTitle: 'Lipolyse Mesotherapie Ankara | Schlankheitsbehandlung',
        metaDescription: 'Regionale Verschlankung und Straffung mit Lipolyse-Mesotherapie, die das Unterhautfettgewebe beeinflusst.',
        keywords: 'Lipolyse Mesotherapie Ankara, Fett auflösen',
      },
      fr: {
        metaTitle: 'Mésothérapie lipolytique Ankara | Minceur et dissolution des graisses',
        metaDescription: 'Amincissement régional et raffermissement avec mésothérapie lipolytique agissant sur le tissu adipeux.',
        keywords: 'Mésothérapie lipolytique Ankara, dissolution graisses',
      },
      ar: {
        metaTitle: 'مزوثيرابي تحلل الدهون أنقرة | التنحيف وحرق الدهون',
        metaDescription: 'تنحيف موضعي وشد باستخدام مزوثيرابي تحلل الدهون التي تؤثر على الأنسجة الدهنية تحت الجلد.',
        keywords: 'مزوثيرابي تحلل الدهون أنقرة, حرق الدهون',
      },
      ru: {
        metaTitle: 'Липолитическая мезотерапия Анкара | Похудение',
        metaDescription: 'Локальное похудение и подтяжка с липолитической мезотерапией, воздействующей на подкожный жир.',
        keywords: 'Липолитическая мезотерапия Анкара, растворение жира',
      },
    },
    description: {
      tr: 'Cilt altı yağ dokusuna etki eden lazer enerjisiyle kolajen üretimi tetiklenir, yüz kontürü belirginleşir.',
      en: 'Laser energy targeting subcutaneous fat tissue triggers collagen production and enhances facial contour definition.',
      de: 'Laserenergie, die auf das Unterhautfettgewebe wirkt, stimuliert die Kollagenproduktion und definiert den Gesichtskontur.',
      fr: 'L\'énergie laser ciblant le tissu adipeux sous-cutané déclenche la production de collagène et affine le contour du visage.',
      ar: 'طاقة الليزر التي تستهدف الأنسجة الدهنية تحت الجلد تحفز إنتاج الكولاجين وتعزز تحديد ملامح الوجه.',
      ru: 'Лазерная энергия, воздействующая на подкожный жир, стимулирует выработку коллагена и улучшает контуры лица.',
    },
  },
  {
    slug: 'sinuzit-ameliyati',
    titleInternal: 'Sinüzit Ameliyatı',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Sinüzit Ameliyatı Ankara | Fonksiyonel Burun Cerrahisi',
        metaDescription: 'Kronik sinüzit ve nefes güçlüğünü gideren, yaşam kalitesini artıran cerrahi çözümler.',
        keywords: 'Sinüzit ameliyatı Ankara, Kronik sinüzit, Burun cerrahisi, FESS ameliyatı',
      },
      en: {
        metaTitle: 'Sinusitis Surgery Ankara | Functional Nasal Surgery',
        metaDescription: 'Surgical solutions that eliminate chronic sinusitis and breathing difficulties, improving quality of life.',
        keywords: 'Sinusitis surgery Ankara, chronic sinusitis, functional nasal surgery',
      },
      de: {
        metaTitle: 'Sinusitis-Operation Ankara | Funktionelle Nasenchirugie',
        metaDescription: 'Chirurgische Lösungen zur Behandlung von chronischer Sinusitis und Atemwegsbeschwerden.',
        keywords: 'Sinusitis OP Ankara, chronische Sinusitis, Nasenchirugie',
      },
      fr: {
        metaTitle: 'Chirurgie sinusite Ankara | Chirurgie nasale fonctionnelle',
        metaDescription: 'Solutions chirurgicales qui éliminent la sinusite chronique et les difficultés respiratoires.',
        keywords: 'Chirurgie sinusite Ankara, sinusite chronique, chirurgie nasale',
      },
      ar: {
        metaTitle: 'عملية الجيوب الأنفية أنقرة | جراحة الأنف الوظيفية',
        metaDescription: 'حلول جراحية تزيل التهاب الجيوب الأنفية المزمن وصعوبات التنفس، مما يحسن جودة الحياة.',
        keywords: 'عملية الجيوب الأنفية أنقرة, التهاب الجيوب الأنفية المزمن',
      },
      ru: {
        metaTitle: 'Операция на синусы Анкара | Функциональная хирургия носа',
        metaDescription: 'Хирургические решения для лечения хронического синусита и затруднённого дыхания.',
        keywords: 'Операция на синусы Анкара, хронический синусит',
      },
    },
    description: {
      tr: 'Kronik sinüzit, tıkalı burun ve nefes güçlüğü için uzman cerrahi çözümler.',
      en: 'Expert surgical solutions for chronic sinusitis, nasal obstruction and breathing difficulties.',
      de: 'Fachkundige chirurgische Lösungen für chronische Sinusitis, Nasenobstruktion und Atemwegsbeschwerden.',
      fr: 'Solutions chirurgicales expertes pour la sinusite chronique, l\'obstruction nasale et les difficultés respiratoires.',
      ar: 'حلول جراحية متخصصة لالتهاب الجيوب الأنفية المزمن وانسداد الأنف وصعوبات التنفس.',
      ru: 'Профессиональные хирургические решения при хроническом синусите, заложенности носа и затруднённом дыхании.',
    },
  },
  {
    slug: 'revizyon-rinoplasti',
    titleInternal: 'Revizyon Rinoplasti',
    category: 'cerrahi',
    seoMeta: {
      tr: {
        metaTitle: 'Revizyon Rinoplasti Ankara | İkincil Burun Estetiği',
        metaDescription: 'Önceki burun operasyonlarının düzeltilmesi için uzman revizyon rinoplasti uygulamaları.',
        keywords: 'Revizyon rinoplasti Ankara, İkincil burun estetiği, Burun düzeltme, Revision rhinoplasty',
      },
      en: {
        metaTitle: 'Revision Rhinoplasty Ankara | Secondary Nose Aesthetics',
        metaDescription: 'Expert revision rhinoplasty procedures for correcting previous nose surgeries.',
        keywords: 'Revision rhinoplasty Ankara, secondary nose surgery, nose correction Turkey',
      },
      de: {
        metaTitle: 'Revisionsrhinoplastik Ankara | Sekundäre Nasenkorrektur',
        metaDescription: 'Fachkundige Revisionsrhinoplastik-Eingriffe zur Korrektur vorheriger Nasenoperationen.',
        keywords: 'Revisionsrhinoplastik Ankara, sekundäre Nasenkorrektur',
      },
      fr: {
        metaTitle: 'Rhinoplastie de révision Ankara | Rhinoplastie secondaire',
        metaDescription: 'Procédures de rhinoplastie de révision pour corriger les chirurgies nasales antérieures.',
        keywords: 'Rhinoplastie révision Ankara, rhinoplastie secondaire',
      },
      ar: {
        metaTitle: 'تصحيح تجميل الأنف أنقرة | جراحة الأنف الثانوية',
        metaDescription: 'إجراءات تصحيح تجميل الأنف المتخصصة لتصحيح عمليات الأنف السابقة.',
        keywords: 'تصحيح تجميل الأنف أنقرة, جراحة الأنف الثانوية',
      },
      ru: {
        metaTitle: 'Ревизионная ринопластика Анкара | Вторичная коррекция носа',
        metaDescription: 'Профессиональные процедуры ревизионной ринопластики для исправления предыдущих операций.',
        keywords: 'Ревизионная ринопластика Анкара, вторичная коррекция носа',
      },
    },
    description: {
      tr: 'Önceki operasyondan memnun kalmayan hastalara yönelik uzman ikincil burun estetiği.',
      en: 'Expert secondary nose aesthetics for patients dissatisfied with their previous rhinoplasty.',
      de: 'Fachkundige sekundäre Nasenkorrektur für Patienten, die mit ihrer vorherigen Rhinoplastik unzufrieden sind.',
      fr: 'Rhinoplastie secondaire experte pour les patients insatisfaits de leur rhinoplastie précédente.',
      ar: 'تجميل الأنف الثانوي المتخصص للمرضى غير الراضين عن عملية الأنف السابقة.',
      ru: 'Профессиональная вторичная коррекция носа для пациентов, неудовлетворённых предыдущей операцией.',
    },
  },
];

async function main() {
  console.log('Starting SEO audit and fix...\n');

  const locales = ['tr', 'en', 'de', 'fr', 'ar', 'ru'];

  for (const service of SERVICES) {
    console.log(`\nProcessing: ${service.slug}`);

    // Find or create the page
    let page = await prisma.page.findUnique({ where: { slug: service.slug } });

    if (!page) {
      console.log(`  Creating new page: ${service.slug}`);
      page = await prisma.page.create({
        data: {
          slug: service.slug,
          titleInternal: service.titleInternal,
          type: 'SERVICE',
        },
      });

      // Create a legacy_content block
      await prisma.contentBlock.create({
        data: {
          pageId: page.id,
          componentType: 'legacy_content',
          sortOrder: 0,
          isActive: true,
          schemaDef: JSON.stringify({
            hero: {
              tr: { title: service.seoMeta.tr.metaTitle, subtitle: service.description.tr },
              en: { title: service.seoMeta.en.metaTitle, subtitle: service.description.en },
              de: { title: service.seoMeta.de.metaTitle, subtitle: service.description.de },
              fr: { title: service.seoMeta.fr.metaTitle, subtitle: service.description.fr },
              ar: { title: service.seoMeta.ar.metaTitle, subtitle: service.description.ar },
              ru: { title: service.seoMeta.ru.metaTitle, subtitle: service.description.ru },
            },
            description: {
              tr: service.description.tr,
              en: service.description.en,
              de: service.description.de,
              fr: service.description.fr,
              ar: service.description.ar,
              ru: service.description.ru,
            },
          }),
        },
      });

      // Create Service record
      await prisma.service.create({
        data: {
          pageId: page.id,
          category: service.category,
          sortOrder: 0,
        },
      });

      console.log(`  Created page, block, and service for: ${service.slug}`);
    } else {
      // Update existing block schemaDef with descriptions if it's empty
      const block = await prisma.contentBlock.findFirst({ where: { pageId: page.id } });
      if (block && block.schemaDef === '{}') {
        await prisma.contentBlock.update({
          where: { id: block.id },
          data: {
            schemaDef: JSON.stringify({
              hero: {
                tr: { title: service.seoMeta.tr.metaTitle, subtitle: service.description.tr },
                en: { title: service.seoMeta.en.metaTitle, subtitle: service.description.en },
                de: { title: service.seoMeta.de.metaTitle, subtitle: service.description.de },
                fr: { title: service.seoMeta.fr.metaTitle, subtitle: service.description.fr },
                ar: { title: service.seoMeta.ar.metaTitle, subtitle: service.description.ar },
                ru: { title: service.seoMeta.ru.metaTitle, subtitle: service.description.ru },
              },
              description: {
                tr: service.description.tr,
                en: service.description.en,
                de: service.description.de,
                fr: service.description.fr,
                ar: service.description.ar,
                ru: service.description.ru,
              },
            }),
          },
        });
        console.log(`  Updated block schemaDef for: ${service.slug}`);
      }
      console.log(`  Page exists: ${service.slug}`);
    }

    // Upsert SeoMeta for all 6 locales
    for (const locale of locales) {
      const meta = service.seoMeta[locale];
      if (!meta) continue;

      await prisma.seoMeta.upsert({
        where: { pageId_locale: { pageId: page.id, locale } },
        create: {
          pageId: page.id,
          locale,
          metaTitle: meta.metaTitle,
          metaDescription: meta.metaDescription,
          keywords: meta.keywords || null,
          robots: 'index,follow',
        },
        update: {
          metaTitle: meta.metaTitle,
          metaDescription: meta.metaDescription,
          keywords: meta.keywords || null,
        },
      });
    }
    console.log(`  Updated SeoMeta for all 6 locales`);
  }

  console.log('\n\nAll done! Summary:');
  const count = await prisma.seoMeta.count({
    where: {
      page: {
        slug: { in: SERVICES.map(s => s.slug) }
      }
    }
  });
  console.log(`Total SeoMeta records for required slugs: ${count}`);
  console.log('Expected: ' + (SERVICES.length * 6));
}

main()
  .then(() => {
    console.log('\nScript completed successfully!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
