/**
 * Comprehensive service content seed script
 * - Adds hero_slider translations for all 6 locales
 * - Adds FAQs for all services in all 6 locales
 * - Fixes alt-blefaroplasti missing content
 * - Ensures all service pages have rich content
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── Image map ────────────────────────────────────────────────────────────────
const SERVICE_IMAGES = {
  'rinoplasti': '/images/content/service-02.jpg',
  'revizyon-rinoplasti': '/images/content/service-02.jpg',
  'septorinoplasti': '/images/content/service-02.jpg',
  'bisektomi': '/images/content/service-02.jpg',
  'sinuzit-ameliyati': '/images/content/service-02.jpg',
  'alt-blefaroplasti': '/old-site/services/goz-kapagi-estetigi.png',
  'kas-kaldirma': '/old-site/services/kas-kaldirma.png',
  'badem-goz-estetigi': '/old-site/services/goz-kapagi-estetigi.png',
  'goz-alti-isik-dolgusu': '/old-site/services/goz-kapagi-estetigi.png',
  'endolift': '/old-site/services/endolift-lazer.png',
  'botoks': '/old-site/services/botoks.png',
  'botulinum-toksin-uygulamasi': '/old-site/services/botoks.png',
  'botoks-ile-kas-kaldirma': '/old-site/services/botoks.png',
  'migren-tedavisi': '/old-site/services/botoks.png',
  'dolgu': '/old-site/services/dolgu.jpg',
  'dolgu-i-slemleri': '/old-site/services/dolgu.jpg',
  'dudak-dolgusu': '/old-site/services/dudak-dolgusu.png',
  'dudak-estetigi-liplift': '/old-site/services/dudak-dolgusu.png',
  'dolgu-ile-kas-kaldirma': '/old-site/services/dolgu-ile-kas-kaldirma.png',
  'ameliyatsiz-kas-kaldirma': '/old-site/services/ameliyatsiz-kas-kaldirma.png',
  'i-ple-kas-kaldirma': '/old-site/services/iple-kas-kaldirma.png',
  'i-ple-yuz-germe-fransiz-aski': '/old-site/services/ip-aski.png',
  'kepce-kulak-estetigi-otoplasti': '/old-site/services/otoplasti.png',
  'mezoterapi': '/old-site/services/mezoterapi.png',
  'yuz-mezoterapisi': '/old-site/services/mezoterapi.png',
  'lipoliz-i-nceltme-mezoterapisi': '/old-site/services/mezoterapi.png',
  'cilt-yenileme': '/old-site/services/cilt-yenileme.png',
  'prp-uygulamasi': '/old-site/services/cilt-yenileme.png',
  'mikro-i-gneleme': '/old-site/services/cilt-yenileme.png',
  'cilt-soyma-kimyasal-peeling-i-slemleri': '/old-site/services/cilt-yenileme.png',
  'skar-revizyonu-yara-izi-estetigi': '/old-site/services/cilt-yenileme.png',
  'yuz-germe-facelift': '/images/content/service-04.jpg',
  'cene-estetigi-mentoplasti': '/images/content/service-05.jpg',
  'gamze-estetigi': '/images/content/service-06.jpg',
  'ozon-uygulamasi': '/images/content/service-07.jpg',
  'damar-icine-glutatyon-uygulamasi': '/images/content/service-08.jpg',
};

function getImage(slug) {
  return SERVICE_IMAGES[slug] || '/images/content/service-04.jpg';
}

// ─── CTA labels ───────────────────────────────────────────────────────────────
const CTA = {
  tr: 'Randevu Al',
  en: 'Book Appointment',
  ar: 'احجز موعداً',
  ru: 'Записаться',
  fr: 'Prendre RDV',
  de: 'Termin buchen',
};

const CTA_URL = {
  tr: '/iletisim',
  en: '/en/iletisim',
  ar: '/ar/iletisim',
  ru: '/ru/iletisim',
  fr: '/fr/iletisim',
  de: '/de/iletisim',
};

// ─── Service hero translations ────────────────────────────────────────────────
// Format: slug → { locale: { title, subtitle } }
const HERO_DATA = {
  'rinoplasti': {
    tr: { title: 'Rinoplasti', subtitle: 'Doğal görünümlü burun estetiğinde kişisel anatomi ve nefes fonksiyonu birlikte değerlendirilir.' },
    en: { title: 'Rhinoplasty', subtitle: 'Natural-looking nose aesthetics evaluated alongside personal anatomy and breathing function.' },
    ar: { title: 'تجميل الأنف', subtitle: 'جراحة تجميل الأنف الطبيعي المظهر مع تقييم التشريح الشخصي ووظيفة التنفس.' },
    ru: { title: 'Ринопластика', subtitle: 'Эстетика носа с естественным результатом с учётом анатомии и функции дыхания.' },
    fr: { title: 'Rhinoplastie', subtitle: 'Esthétique nasale naturelle évaluée avec l\'anatomie personnelle et la fonction respiratoire.' },
    de: { title: 'Rhinoplastik', subtitle: 'Natürlich wirkende Nasenästhetik unter Berücksichtigung individueller Anatomie und Atemfunktion.' },
  },
  'revizyon-rinoplasti': {
    tr: { title: 'Revizyon Rinoplasti', subtitle: 'Önceki burun ameliyatının estetik veya fonksiyonel sorunlarını düzelten ileri cerrahi yaklaşım.' },
    en: { title: 'Revision Rhinoplasty', subtitle: 'Advanced surgical approach correcting aesthetic or functional issues from previous nose surgery.' },
    ar: { title: 'جراحة الأنف التصحيحية', subtitle: 'نهج جراحي متقدم لتصحيح المشاكل الجمالية أو الوظيفية من عملية الأنف السابقة.' },
    ru: { title: 'Ревизионная ринопластика', subtitle: 'Коррекция эстетических или функциональных проблем после предыдущей операции на носу.' },
    fr: { title: 'Rhinoplastie de révision', subtitle: 'Approche chirurgicale avancée corrigeant les problèmes esthétiques ou fonctionnels d\'une précédente opération.' },
    de: { title: 'Revisions-Rhinoplastik', subtitle: 'Fortgeschrittener chirurgischer Ansatz zur Korrektur ästhetischer oder funktioneller Probleme nach einer früheren Nasenoperation.' },
  },
  'septorinoplasti': {
    tr: { title: 'Septorinoplasti', subtitle: 'Burun estetiğini ve septum düzeltmesini bir arada gerçekleştiren kapsamlı cerrahi planlama.' },
    en: { title: 'Septorhinoplasty', subtitle: 'Comprehensive surgical planning combining nose aesthetics with septum correction in one procedure.' },
    ar: { title: 'رينوبلاستي الحاجز الأنفي', subtitle: 'تخطيط جراحي شامل يجمع بين جماليات الأنف وتصحيح الحاجز في إجراء واحد.' },
    ru: { title: 'Септоринопластика', subtitle: 'Комплексное хирургическое планирование с сочетанием эстетики носа и коррекции перегородки.' },
    fr: { title: 'Septorhinoplastie', subtitle: 'Planification chirurgicale complète combinant l\'esthétique nasale et la correction du septum en une seule procédure.' },
    de: { title: 'Septorhinoplastik', subtitle: 'Umfassende chirurgische Planung, die Nasenästhetik und Septumkorrektur in einem Eingriff kombiniert.' },
  },
  'alt-blefaroplasti': {
    tr: { title: 'Alt Blefaroplasti', subtitle: 'Göz altı torbaları ve şişlikleri için doğal ve dinlenmiş görünüm sağlayan cerrahi yaklaşım.' },
    en: { title: 'Lower Blepharoplasty', subtitle: 'Surgical approach for under-eye bags and puffiness providing a natural, rested appearance.' },
    ar: { title: 'شد جفن العين السفلي', subtitle: 'نهج جراحي لعيوب وانتفاخات تحت العين يوفر مظهراً طبيعياً ومرتاحاً.' },
    ru: { title: 'Нижняя блефаропластика', subtitle: 'Хирургический подход для устранения мешков и отёчности под глазами с естественным результатом.' },
    fr: { title: 'Blépharoplastie inférieure', subtitle: 'Approche chirurgicale pour les poches et gonflements sous les yeux offrant un aspect naturel et reposé.' },
    de: { title: 'Untere Blepharoplastik', subtitle: 'Chirurgischer Ansatz für Tränensäcke und Schwellungen unter den Augen mit natürlichem, ausgeruhtem Aussehen.' },
  },
  'kas-kaldirma': {
    tr: { title: 'Üst Blefaroplasti', subtitle: 'Üst göz kapağı sarkmasını gidererek daha açık ve canlı bir bakış elde etmeye yönelik cerrahi.' },
    en: { title: 'Upper Blepharoplasty', subtitle: 'Surgery to correct upper eyelid drooping for a more open, vibrant and youthful gaze.' },
    ar: { title: 'شد جفن العين العلوي', subtitle: 'جراحة لتصحيح ترهل الجفن العلوي للحصول على نظرة أكثر انفتاحاً وحيوية.' },
    ru: { title: 'Верхняя блефаропластика', subtitle: 'Операция по коррекции опущения верхнего века для более открытого и молодого взгляда.' },
    fr: { title: 'Blépharoplastie supérieure', subtitle: 'Chirurgie pour corriger l\'affaissement de la paupière supérieure pour un regard plus ouvert et vivant.' },
    de: { title: 'Obere Blepharoplastik', subtitle: 'Operation zur Korrektur des Hängelidlids für einen offeneren, ausdrucksvolleren Blick.' },
  },
  'badem-goz-estetigi': {
    tr: { title: 'Badem Göz Estetiği', subtitle: 'Göz şeklini badem formuna kavuşturan kanto kantoplasti uygulaması ile çekici ve zarif bakış.' },
    en: { title: 'Almond Eye Surgery', subtitle: 'Canto cantoplasty procedure reshaping the eyes to an almond form for an attractive and elegant look.' },
    ar: { title: 'عملية العيون اللوزية', subtitle: 'إجراء كانتوبلاستي لإعادة تشكيل العيون إلى شكل اللوز للحصول على مظهر جذاب وأنيق.' },
    ru: { title: 'Миндалевидный разрез глаз', subtitle: 'Кантопластика для придания глазам миндалевидной формы с привлекательным и элегантным взглядом.' },
    fr: { title: 'Chirurgie des yeux en amande', subtitle: 'Procédure de cantoplastie pour donner aux yeux une forme d\'amande pour un regard attrayant et élégant.' },
    de: { title: 'Mandelaugen-Ästhetik', subtitle: 'Kantoplastik-Eingriff zur Neuformung der Augen in eine Mandelform für einen attraktiven, eleganten Blick.' },
  },
  'goz-alti-isik-dolgusu': {
    tr: { title: 'Göz Altı Işık Dolgusu', subtitle: 'Göz altı morluk ve çukurluklarını dolduran, yüze ışıltı ve tazelik katan hyalüronik asit uygulaması.' },
    en: { title: 'Under-Eye Light Filler', subtitle: 'Hyaluronic acid treatment filling under-eye hollows and dark circles, adding radiance and freshness to the face.' },
    ar: { title: 'حشو إضاءة تحت العين', subtitle: 'علاج حمض الهيالورونيك لملء تجاويف تحت العين والهالات السوداء وإضافة توهج وانتعاش للوجه.' },
    ru: { title: 'Световой филлер под глаза', subtitle: 'Гиалуроновая кислота для заполнения впадин и тёмных кругов под глазами, придающая сияние и свежесть.' },
    fr: { title: 'Filler lumière sous les yeux', subtitle: 'Traitement à l\'acide hyaluronique comblant les creux et cernes sous les yeux, ajoutant éclat et fraîcheur.' },
    de: { title: 'Unteraugen-Lichtfüller', subtitle: 'Hyaluronsäure-Behandlung zur Auffüllung von Tränenrinnen und dunklen Augenringen mit natürlichem Strahlen.' },
  },
  'endolift': {
    tr: { title: 'Endolift Lazer', subtitle: 'Kesi olmadan yüz ve boyun bölgesinde sıkılaşma ve kontür desteği sağlayan lazer uygulaması.' },
    en: { title: 'Endolift Laser', subtitle: 'Laser treatment providing tightening and contouring for the face and neck without incisions.' },
    ar: { title: 'ليزر إندوليفت', subtitle: 'علاج بالليزر يوفر شداً وتحديداً لمنطقة الوجه والرقبة دون شقوق.' },
    ru: { title: 'Лазер Endolift', subtitle: 'Лазерная процедура для подтяжки и контурирования лица и шеи без разрезов.' },
    fr: { title: 'Laser Endolift', subtitle: 'Traitement laser offrant un raffermissement et un contourage du visage et du cou sans incision.' },
    de: { title: 'Endolift Laser', subtitle: 'Laserbehandlung für Straffung und Konturierung von Gesicht und Hals ohne Schnitte.' },
  },
  'botoks': {
    tr: { title: 'Botoks Uygulamaları', subtitle: 'Mimik çizgilerini yumuşatırken yüz ifadesini ve doğallığını koruyan medikal estetik uygulama.' },
    en: { title: 'Botox Treatments', subtitle: 'Medical aesthetic treatment softening expression lines while preserving facial expression and naturalness.' },
    ar: { title: 'علاجات البوتوكس', subtitle: 'علاج تجميلي طبي يلطف خطوط التعبير مع الحفاظ على تعابير الوجه والطبيعية.' },
    ru: { title: 'Ботокс процедуры', subtitle: 'Медицинская эстетическая процедура для сглаживания мимических морщин с сохранением естественности.' },
    fr: { title: 'Traitements Botox', subtitle: 'Traitement esthétique médical adoucissant les rides d\'expression tout en préservant les expressions du visage.' },
    de: { title: 'Botox-Behandlungen', subtitle: 'Medizinisch-ästhetische Behandlung zur Glättung von Mimikfalten bei Erhalt des natürlichen Gesichtsausdrucks.' },
  },
  'botulinum-toksin-uygulamasi': {
    tr: { title: 'Botulinum Toksin', subtitle: 'Alın, kaş arası ve göz çevresi çizgilerinde etkili, doğal sonuçlar elde eden toksin uygulaması.' },
    en: { title: 'Botulinum Toxin', subtitle: 'Toxin treatment effective for forehead, frown lines and crow\'s feet with natural results.' },
    ar: { title: 'توكسين البوتولينوم', subtitle: 'علاج فعّال لخطوط الجبهة وما بين الحاجبين وحول العينين مع نتائج طبيعية.' },
    ru: { title: 'Ботулинический токсин', subtitle: 'Токсин для эффективного лечения морщин лба, межбровных и периорбитальных с естественным результатом.' },
    fr: { title: 'Toxine botulique', subtitle: 'Traitement efficace pour les rides du front, les rides inter-sourcilières et les pattes d\'oie avec des résultats naturels.' },
    de: { title: 'Botulinumtoxin', subtitle: 'Toxinbehandlung für Stirnfalten, Glabellafalten und Krähenfüße mit natürlichen Ergebnissen.' },
  },
  'botoks-ile-kas-kaldirma': {
    tr: { title: 'Botoks ile Kaş Kaldırma', subtitle: 'Kasın seçici gevşetilmesiyle kaşı doğal pozisyonuna yükselten, ameliyatsız botoks tekniği.' },
    en: { title: 'Brow Lift with Botox', subtitle: 'Non-surgical botox technique lifting the brow to its natural position through selective muscle relaxation.' },
    ar: { title: 'رفع الحاجب بالبوتوكس', subtitle: 'تقنية بوتوكس غير جراحية لرفع الحاجب إلى موضعه الطبيعي من خلال استرخاء العضلات الانتقائي.' },
    ru: { title: 'Подтяжка бровей ботоксом', subtitle: 'Нехирургический метод подтяжки бровей через избирательное расслабление мышц ботоксом.' },
    fr: { title: 'Lifting des sourcils au Botox', subtitle: 'Technique de botox non chirurgicale soulevant le sourcil à sa position naturelle par relaxation musculaire sélective.' },
    de: { title: 'Brauenlift mit Botox', subtitle: 'Nicht-chirurgische Botox-Technik zur Hebung der Brauen in natürliche Position durch selektive Muskelentspannung.' },
  },
  'dolgu': {
    tr: { title: 'Dolgu Uygulamaları', subtitle: 'Yüz hacmi, dudak ve kontür ihtiyaçlarına göre kişiye özel planlanan hyalüronik asit dolguları.' },
    en: { title: 'Dermal Fillers', subtitle: 'Hyaluronic acid fillers customized for facial volume, lip and contouring needs.' },
    ar: { title: 'الحشوات الجلدية', subtitle: 'حشوات حمض الهيالورونيك المخصصة لحجم الوجه واحتياجات الشفاه والتحديد.' },
    ru: { title: 'Дермальные филлеры', subtitle: 'Гиалуроновые филлеры, адаптированные для объёма лица, губ и контурирования.' },
    fr: { title: 'Injections de filler', subtitle: 'Comblants à l\'acide hyaluronique personnalisés pour le volume facial, les lèvres et le contourage.' },
    de: { title: 'Dermalfiller', subtitle: 'Hyaluronsäure-Filler maßgeschneidert für Gesichtsvolumen, Lippen und Konturierung.' },
  },
  'dolgu-i-slemleri': {
    tr: { title: 'Dolgu İşlemleri', subtitle: 'Kırışıklık, hacim kaybı ve yüz kontürü için uygulanan kapsamlı dolgu tedavileri.' },
    en: { title: 'Filler Procedures', subtitle: 'Comprehensive filler treatments for wrinkles, volume loss and facial contouring.' },
    ar: { title: 'إجراءات الحشو', subtitle: 'علاجات حشو شاملة للتجاعيد وفقدان الحجم وتحديد ملامح الوجه.' },
    ru: { title: 'Процедуры с филлерами', subtitle: 'Комплексные процедуры с филлерами для морщин, потери объёма и контурирования лица.' },
    fr: { title: 'Procédures de filler', subtitle: 'Traitements complets par filler pour les rides, la perte de volume et le contourage facial.' },
    de: { title: 'Filler-Behandlungen', subtitle: 'Umfassende Filler-Behandlungen für Falten, Volumenverlust und Gesichtskonturierung.' },
  },
  'dudak-dolgusu': {
    tr: { title: 'Dudak Dolgusu', subtitle: 'Dudak hacmini ve simetrisini doğal oranlarla geliştiren, ifadeyi koruyan hyalüronik asit uygulaması.' },
    en: { title: 'Lip Filler', subtitle: 'Hyaluronic acid treatment enhancing lip volume and symmetry with natural proportions while preserving expression.' },
    ar: { title: 'حشو الشفاه', subtitle: 'علاج حمض الهيالورونيك لتعزيز حجم الشفاه وتماثلها بنسب طبيعية مع الحفاظ على التعبير.' },
    ru: { title: 'Увеличение губ', subtitle: 'Гиалуроновая кислота для объёма и симметрии губ с сохранением естественных пропорций.' },
    fr: { title: 'Filler lèvres', subtitle: 'Traitement à l\'acide hyaluronique pour améliorer le volume et la symétrie des lèvres avec des proportions naturelles.' },
    de: { title: 'Lippenfüller', subtitle: 'Hyaluronsäure-Behandlung zur Verbesserung von Lippenvolumen und -symmetrie mit natürlichen Proportionen.' },
  },
  'dudak-estetigi-liplift': {
    tr: { title: 'Dudak Kaldırma (Lip Lift)', subtitle: 'Üst dudak mesafesini kısaltarak daha genç ve dengeli bir gülüş elde etmeye yönelik cerrahi.' },
    en: { title: 'Lip Lift', subtitle: 'Surgery shortening the upper lip distance for a more youthful and balanced smile.' },
    ar: { title: 'رفع الشفة', subtitle: 'جراحة تقصير المسافة العلوية للشفة للحصول على ابتسامة أكثر شباباً وتوازناً.' },
    ru: { title: 'Подтяжка губ (Lip Lift)', subtitle: 'Операция по укорочению расстояния верхней губы для более молодой и гармоничной улыбки.' },
    fr: { title: 'Lip Lift', subtitle: 'Chirurgie raccourcissant la distance de la lèvre supérieure pour un sourire plus jeune et équilibré.' },
    de: { title: 'Lip Lift', subtitle: 'Chirurgie zur Verkürzung des Oberlippenabstands für ein jüngeres und ausgewogeneres Lächeln.' },
  },
  'i-ple-yuz-germe-fransiz-aski': {
    tr: { title: 'İp ile Yüz Askılama', subtitle: 'Fransız askı tekniğiyle cilt altına yerleştirilen iplerle cerrahisiz yüz kontürü ve asma.' },
    en: { title: 'Thread Face Lift', subtitle: 'Non-surgical facial contouring and lifting using threads placed under the skin with French lift technique.' },
    ar: { title: 'شد الوجه بالخيوط', subtitle: 'تحديد ملامح الوجه وشده غير الجراحي باستخدام خيوط موضوعة تحت الجلد بتقنية الشد الفرنسي.' },
    ru: { title: 'Нитевой лифтинг лица', subtitle: 'Нехирургическое контурирование и подтяжка лица с помощью нитей французской техники.' },
    fr: { title: 'Lifting au fil (French Lift)', subtitle: 'Contourage et lifting non chirurgical du visage avec des fils placés sous la peau par technique French Lift.' },
    de: { title: 'Fadenlifting (French Lift)', subtitle: 'Nicht-chirurgisches Gesichtskonturierung und -lifting mit unter die Haut platzierten Fäden in French-Lift-Technik.' },
  },
  'ameliyatsiz-kas-kaldirma': {
    tr: { title: 'Ameliyatsız Kaş Kaldırma', subtitle: 'Cerrahi olmadan kaş pozisyonunu ve şeklini iyileştiren botoks, dolgu veya ip uygulamaları.' },
    en: { title: 'Non-Surgical Brow Lift', subtitle: 'Botox, filler or thread procedures improving brow position and shape without surgery.' },
    ar: { title: 'رفع الحاجب غير الجراحي', subtitle: 'إجراءات بوتوكس أو حشو أو خيوط لتحسين موضع الحاجب وشكله دون جراحة.' },
    ru: { title: 'Нехирургический подъём бровей', subtitle: 'Ботокс, филлеры или нити для коррекции положения и формы бровей без операции.' },
    fr: { title: 'Relift sourcilier non chirurgical', subtitle: 'Botox, filler ou fils pour améliorer la position et la forme des sourcils sans chirurgie.' },
    de: { title: 'Nicht-chirurgischer Brauenlift', subtitle: 'Botox, Filler oder Fäden zur Verbesserung von Brauenposition und -form ohne Operation.' },
  },
  'dolgu-ile-kas-kaldirma': {
    tr: { title: 'Dolgu ile Kaş Kaldırma', subtitle: 'Kaş çevresine uygulanan hyalüronik asit dolgusuyla doğal kaş asması ve yüz kontürü.' },
    en: { title: 'Filler Brow Lift', subtitle: 'Natural brow elevation and facial contouring using hyaluronic acid filler around the brow area.' },
    ar: { title: 'رفع الحاجب بالحشو', subtitle: 'رفع طبيعي للحاجب وتحديد ملامح الوجه باستخدام حشو حمض الهيالورونيك حول منطقة الحاجب.' },
    ru: { title: 'Подъём бровей филлером', subtitle: 'Естественный подъём бровей и контурирование лица с помощью гиалуроновой кислоты.' },
    fr: { title: 'Relift sourcilier au filler', subtitle: 'Élévation naturelle des sourcils et contourage facial par filler à l\'acide hyaluronique autour des sourcils.' },
    de: { title: 'Filler-Brauenlift', subtitle: 'Natürliche Brauen-Elevation und Gesichtskonturierung mit Hyaluronsäure-Filler im Brauenbereich.' },
  },
  'i-ple-kas-kaldirma': {
    tr: { title: 'İple Kaş Kaldırma', subtitle: 'Kaşın doğal kıvrımını destekleyen ve pozisyonunu iyileştiren ameliyatsız ip askılama yöntemi.' },
    en: { title: 'Thread Brow Lift', subtitle: 'Non-surgical thread suspension method supporting the natural arch and improving brow position.' },
    ar: { title: 'رفع الحاجب بالخيوط', subtitle: 'طريقة تعليق الخيوط غير الجراحية التي تدعم القوس الطبيعي وتحسن موضع الحاجب.' },
    ru: { title: 'Нитевой подъём бровей', subtitle: 'Нехирургический метод нитевой подтяжки для поддержки естественного изгиба и подъёма бровей.' },
    fr: { title: 'Lifting des sourcils au fil', subtitle: 'Méthode de suspension non chirurgicale supportant l\'arche naturelle et améliorant la position des sourcils.' },
    de: { title: 'Fadenbrauenlift', subtitle: 'Nicht-chirurgische Fadenlifting-Methode zur Stützung des natürlichen Bogens und Verbesserung der Brauenposition.' },
  },
  'kepce-kulak-estetigi-otoplasti': {
    tr: { title: 'Kepçe Kulak Ameliyatı', subtitle: 'Kulak şeklini ve açısını düzelterek estetik ve dengeli bir görünüm sağlayan otoplasti ameliyatı.' },
    en: { title: 'Otoplasty (Ear Surgery)', subtitle: 'Otoplasty surgery correcting ear shape and angle for an aesthetically balanced and natural appearance.' },
    ar: { title: 'جراحة الأذن (أوتوبلاستي)', subtitle: 'جراحة أوتوبلاستي لتصحيح شكل الأذن وزاويتها للحصول على مظهر جمالي متوازن وطبيعي.' },
    ru: { title: 'Отопластика (ушная хирургия)', subtitle: 'Отопластика для коррекции формы и положения ушей с эстетически сбалансированным результатом.' },
    fr: { title: 'Otoplastie (chirurgie des oreilles)', subtitle: 'Chirurgie otoplastique corrigeant la forme et l\'angle des oreilles pour un aspect esthétiquement équilibré.' },
    de: { title: 'Otoplastik (Ohr-OP)', subtitle: 'Otoplastik-Operation zur Korrektur von Ohrenform und -winkel für ein ästhetisch ausgewogenes Erscheinungsbild.' },
  },
  'mezoterapi': {
    tr: { title: 'Mezoterapi', subtitle: 'Cilde vitamin, mineral ve hyalüronik asit takviyesi sağlayan mezoterapi ile derin nemlendirme ve parlaklık.' },
    en: { title: 'Mesotherapy', subtitle: 'Deep hydration and radiance through mesotherapy supplying vitamins, minerals and hyaluronic acid to the skin.' },
    ar: { title: 'الميزوثيرابي', subtitle: 'ترطيب عميق وإشراق من خلال الميزوثيرابي لتزويد الجلد بالفيتامينات والمعادن وحمض الهيالورونيك.' },
    ru: { title: 'Мезотерапия', subtitle: 'Глубокое увлажнение и сияние кожи благодаря мезотерапии с витаминами, минералами и гиалуроновой кислотой.' },
    fr: { title: 'Mésothérapie', subtitle: 'Hydratation profonde et éclat par mésothérapie fournissant vitamines, minéraux et acide hyaluronique à la peau.' },
    de: { title: 'Mesotherapie', subtitle: 'Tiefe Feuchtigkeitsversorgung und Leuchtkraft durch Mesotherapie mit Vitaminen, Mineralstoffen und Hyaluronsäure.' },
  },
  'yuz-mezoterapisi': {
    tr: { title: 'Yüz Mezoterapisi', subtitle: 'Yüz cildine özel formüle edilen kokteyl karışımlarıyla cilt canlandırma ve gençleştirme.' },
    en: { title: 'Face Mesotherapy', subtitle: 'Skin revitalization and rejuvenation with specially formulated cocktail mixtures for facial skin.' },
    ar: { title: 'ميزوثيرابي الوجه', subtitle: 'تنشيط الجلد وتجديد شبابه بخلطات كوكتيل مُصاغة خصيصاً لجلد الوجه.' },
    ru: { title: 'Мезотерапия лица', subtitle: 'Ревитализация и омоложение кожи с помощью специально разработанных коктейльных смесей.' },
    fr: { title: 'Mésothérapie du visage', subtitle: 'Revitalisation et rajeunissement de la peau avec des mélanges cocktails spécialement formulés pour la peau du visage.' },
    de: { title: 'Gesichts-Mesotherapie', subtitle: 'Hautrevitalisierung und -verjüngung mit speziell formulierten Cocktailmischungen für die Gesichtshaut.' },
  },
  'lipoliz-i-nceltme-mezoterapisi': {
    tr: { title: 'Lipoliz Mezoterapisi', subtitle: 'Yüz ve boyundaki lokal yağ birikimini hedefleyen ve kontür desteği sağlayan inceltme mezoterapisi.' },
    en: { title: 'Lipolysis Mesotherapy', subtitle: 'Slimming mesotherapy targeting local fat deposits in the face and neck, providing contouring support.' },
    ar: { title: 'ميزوثيرابي انحلال الدهون', subtitle: 'ميزوثيرابي التنحيف الذي يستهدف رواسب الدهون المحلية في الوجه والرقبة ويوفر دعماً للتحديد.' },
    ru: { title: 'Мезотерапия для похудения', subtitle: 'Мезотерапия для уменьшения локальных жировых отложений на лице и шее с эффектом контурирования.' },
    fr: { title: 'Mésothérapie lipolytique', subtitle: 'Mésothérapie minceur ciblant les dépôts graisseux locaux du visage et du cou, offrant un soutien contouring.' },
    de: { title: 'Lipolyse-Mesotherapie', subtitle: 'Abnehm-Mesotherapie zur Behandlung lokaler Fettdepots im Gesicht und Hals mit Konturierungsunterstützung.' },
  },
  'cilt-yenileme': {
    tr: { title: 'Cilt Yenileme', subtitle: 'Işıltılı ve sağlıklı cilt için lazer, peeling ve enerji bazlı teknolojilerle kapsamlı yenileme tedavileri.' },
    en: { title: 'Skin Rejuvenation', subtitle: 'Comprehensive renewal treatments with laser, peeling and energy-based technologies for radiant, healthy skin.' },
    ar: { title: 'تجديد البشرة', subtitle: 'علاجات تجديد شاملة بالليزر والتقشير والتقنيات القائمة على الطاقة للبشرة المشرقة والصحية.' },
    ru: { title: 'Омоложение кожи', subtitle: 'Комплексное омоложение с помощью лазера, пилингов и энергетических технологий для сияющей кожи.' },
    fr: { title: 'Rajeunissement cutané', subtitle: 'Traitements de renouvellement complets avec laser, peeling et technologies énergétiques pour une peau rayonnante.' },
    de: { title: 'Hautverjüngung', subtitle: 'Umfassende Erneuerungsbehandlungen mit Laser, Peeling und energiebasierten Technologien für strahlende Haut.' },
  },
  'cilt-soyma-kimyasal-peeling-i-slemleri': {
    tr: { title: 'Kimyasal Peeling', subtitle: 'Cilt yüzeyini yenileyerek leke, ince çizgi ve pürüzleri azaltan kimyasal soyma uygulamaları.' },
    en: { title: 'Chemical Peeling', subtitle: 'Chemical exfoliation treatments renewing the skin surface and reducing spots, fine lines and roughness.' },
    ar: { title: 'التقشير الكيميائي', subtitle: 'علاجات التقشير الكيميائي التي تجدد سطح الجلد وتقلل البقع والخطوط الدقيقة والخشونة.' },
    ru: { title: 'Химический пилинг', subtitle: 'Химический пилинг для обновления кожи и уменьшения пятен, мелких морщин и неровностей.' },
    fr: { title: 'Peeling chimique', subtitle: 'Traitements de peeling chimique renouvelant la surface de la peau et réduisant taches, rides fines et rugosités.' },
    de: { title: 'Chemisches Peeling', subtitle: 'Chemische Peelingbehandlungen zur Erneuerung der Hautoberfläche und Reduzierung von Flecken und Fältchen.' },
  },
  'skar-revizyonu-yara-izi-estetigi': {
    tr: { title: 'Skar Revizyonu', subtitle: 'Yara izi görünümünü en aza indirgeyen, cilt dokusunu iyileştiren cerrahi ve medikal teknikler.' },
    en: { title: 'Scar Revision', subtitle: 'Surgical and medical techniques minimizing scar appearance and improving skin texture.' },
    ar: { title: 'مراجعة الندبات', subtitle: 'تقنيات جراحية وطبية تقلل من مظهر الندبات وتحسن نسيج الجلد.' },
    ru: { title: 'Коррекция рубцов', subtitle: 'Хирургические и медицинские методы для минимизации рубцов и улучшения текстуры кожи.' },
    fr: { title: 'Révision des cicatrices', subtitle: 'Techniques chirurgicales et médicales minimisant l\'apparence des cicatrices et améliorant la texture de la peau.' },
    de: { title: 'Narbenkorrektur', subtitle: 'Chirurgische und medizinische Techniken zur Minimierung des Narbenaussehens und Verbesserung der Hauttextur.' },
  },
  'prp-uygulamasi': {
    tr: { title: 'PRP (Gençlik Aşısı)', subtitle: 'Kişinin kendi kanından elde edilen trombositlerle cilt yenileme ve doğal gençleştirme uygulaması.' },
    en: { title: 'PRP Treatment', subtitle: 'Skin renewal and natural rejuvenation using platelets derived from the patient\'s own blood.' },
    ar: { title: 'علاج PRP', subtitle: 'تجديد الجلد والتجديد الطبيعي باستخدام الصفائح الدموية المستمدة من دم المريض نفسه.' },
    ru: { title: 'PRP-терапия', subtitle: 'Обновление кожи и естественное омоложение с помощью тромбоцитов из собственной крови пациента.' },
    fr: { title: 'Traitement PRP', subtitle: 'Renouvellement cutané et rajeunissement naturel à l\'aide des plaquettes dérivées du propre sang du patient.' },
    de: { title: 'PRP-Behandlung', subtitle: 'Hauterneuerung und natürliche Verjüngung mit Thrombozyten aus dem eigenen Blut des Patienten.' },
  },
  'mikro-i-gneleme': {
    tr: { title: 'Mikro İğneleme', subtitle: 'Derma roller ile yüzeyde mikro kanallar oluşturarak cilt yenilenmesini ve kolajen üretimini teşvik etme.' },
    en: { title: 'Microneedling', subtitle: 'Stimulating skin renewal and collagen production by creating micro-channels on the surface with derma roller.' },
    ar: { title: 'الوخز الدقيق بالإبر', subtitle: 'تحفيز تجديد الجلد وإنتاج الكولاجين عن طريق إنشاء قنوات دقيقة على السطح بالدرما رولر.' },
    ru: { title: 'Микроиглинг', subtitle: 'Стимуляция обновления кожи и выработки коллагена с помощью микроканалов дерма-роллером.' },
    fr: { title: 'Microneedling', subtitle: 'Stimulation du renouvellement cutané et de la production de collagène par des micro-canaux avec derma roller.' },
    de: { title: 'Microneedling', subtitle: 'Stimulation der Hauterneuerung und Kollagenproduktion durch Mikrokanäle mit Dermaroller.' },
  },
  'ozon-uygulamasi': {
    tr: { title: 'Ozon Uygulaması', subtitle: 'Antioksidan ve rejeneratif etkileriyle cilt sağlığını destekleyen medikal ozon uygulaması.' },
    en: { title: 'Ozone Therapy', subtitle: 'Medical ozone application supporting skin health with antioxidant and regenerative effects.' },
    ar: { title: 'العلاج بالأوزون', subtitle: 'تطبيق الأوزون الطبي الذي يدعم صحة الجلد بتأثيرات مضادة للأكسدة وتجديدية.' },
    ru: { title: 'Озонотерапия', subtitle: 'Медицинский озон для поддержки здоровья кожи с антиоксидантными и регенеративными эффектами.' },
    fr: { title: 'Ozonothérapie', subtitle: 'Application médicale d\'ozone soutenant la santé de la peau avec des effets antioxydants et régénérateurs.' },
    de: { title: 'Ozontherapie', subtitle: 'Medizinische Ozon-Anwendung zur Unterstützung der Hautgesundheit mit antioxidativen und regenerativen Effekten.' },
  },
  'damar-icine-glutatyon-uygulamasi': {
    tr: { title: 'IV Glutatyon', subtitle: 'Antioksidan kapasitesi yüksek glutatyonun damar içine uygulanmasıyla cilt aydınlanması ve vücut detoksu.' },
    en: { title: 'IV Glutathione', subtitle: 'Skin brightening and body detox through intravenous application of high antioxidant capacity glutathione.' },
    ar: { title: 'الجلوتاثيون الوريدي', subtitle: 'إشراق البشرة وتطهير الجسم من خلال التطبيق الوريدي للجلوتاثيون عالي قدرة مضادات الأكسدة.' },
    ru: { title: 'Внутривенный глутатион', subtitle: 'Осветление кожи и детокс организма через внутривенное введение глутатиона с высокой антиоксидантной активностью.' },
    fr: { title: 'Glutathion IV', subtitle: 'Éclaircissement de la peau et détox corporel par application intraveineuse de glutathion à haute capacité antioxydante.' },
    de: { title: 'IV Glutathion', subtitle: 'Hautaufhellung und Körper-Detox durch intravenöse Anwendung von Glutathion mit hoher Antioxidationskapazität.' },
  },
  'bisektomi': {
    tr: { title: 'Bisektomi', subtitle: 'Burun içi konka dokusunu küçülterek nefes almayı kolaylaştıran minimal invaziv cerrahi.' },
    en: { title: 'Turbinate Reduction', subtitle: 'Minimally invasive surgery reducing nasal turbinate tissue to improve breathing.' },
    ar: { title: 'استئصال المحارة الأنفية', subtitle: 'جراحة طفيفة التوغل لتصغير أنسجة المحارة الأنفية لتحسين التنفس.' },
    ru: { title: 'Редукция носовых раковин', subtitle: 'Малоинвазивная операция по уменьшению носовых раковин для улучшения дыхания.' },
    fr: { title: 'Turbinoplastie', subtitle: 'Chirurgie mini-invasive réduisant le tissu des turbinats nasaux pour améliorer la respiration.' },
    de: { title: 'Nasenmuschelreduktion', subtitle: 'Minimalinvasive Chirurgie zur Verkleinerung des Nasenmuschel-Gewebes für verbesserte Atmung.' },
  },
  'sinuzit-ameliyati': {
    tr: { title: 'Sinüzit Ameliyatı', subtitle: 'Kronik sinüzit tedavisinde endoskopik sinüs cerrahisi ile sinüsleri temizleyerek solunumu iyileştirme.' },
    en: { title: 'Sinus Surgery', subtitle: 'Endoscopic sinus surgery clearing sinuses and improving breathing for chronic sinusitis treatment.' },
    ar: { title: 'جراحة الجيوب الأنفية', subtitle: 'جراحة الجيوب الأنفية بالمنظار لتنظيف الجيوب الأنفية وتحسين التنفس لعلاج التهاب الجيوب الأنفية المزمن.' },
    ru: { title: 'Операция на пазухах', subtitle: 'Эндоскопическая хирургия пазух для очищения синусов и улучшения дыхания при хроническом синусите.' },
    fr: { title: 'Chirurgie des sinus', subtitle: 'Chirurgie endoscopique des sinus nettoyant les cavités et améliorant la respiration pour le traitement de la sinusite chronique.' },
    de: { title: 'Nasennebenhöhlen-OP', subtitle: 'Endoskopische Nasennebenhöhlen-OP zur Reinigung der Nebenhöhlen und Verbesserung der Atmung bei chronischer Sinusitis.' },
  },
  'gamze-estetigi': {
    tr: { title: 'Gamze Estetiği', subtitle: 'Yanak bölgesinde küçük bir gamze oluşturan ya da mevcut gamzeyi belirginleştiren estetik uygulama.' },
    en: { title: 'Dimple Aesthetics', subtitle: 'Aesthetic procedure creating a small dimple in the cheek area or defining existing natural dimples.' },
    ar: { title: 'جماليات الغمازة', subtitle: 'إجراء جمالي لإنشاء غمازة صغيرة في منطقة الخد أو تحديد الغمازات الطبيعية الموجودة.' },
    ru: { title: 'Эстетика ямочек', subtitle: 'Эстетическая процедура для создания маленьких ямочек на щеках или усиления естественных.' },
    fr: { title: 'Esthétique des fossettes', subtitle: 'Procédure esthétique créant une petite fossette dans la zone des joues ou définissant des fossettes naturelles.' },
    de: { title: 'Grübchen-Ästhetik', subtitle: 'Ästhetischer Eingriff zur Bildung kleiner Grübchen im Wangenbereich oder Definition natürlicher Grübchen.' },
  },
  'migren-tedavisi': {
    tr: { title: 'Migren Tedavisi', subtitle: 'Botulinum toksin uygulamasıyla kronik migren ataklarının sıklığını ve şiddetini azaltma.' },
    en: { title: 'Migraine Treatment', subtitle: 'Reducing frequency and severity of chronic migraine attacks with botulinum toxin application.' },
    ar: { title: 'علاج الصداع النصفي', subtitle: 'تقليل تكرار وشدة نوبات الصداع النصفي المزمن بتطبيق توكسين البوتولينوم.' },
    ru: { title: 'Лечение мигрени', subtitle: 'Снижение частоты и интенсивности хронических мигреней с помощью ботулинического токсина.' },
    fr: { title: 'Traitement de la migraine', subtitle: 'Réduction de la fréquence et de l\'intensité des crises de migraine chronique par application de toxine botulique.' },
    de: { title: 'Migränebehandlung', subtitle: 'Reduzierung von Häufigkeit und Schwere chronischer Migräneanfälle durch Botulinumtoxin-Anwendung.' },
  },
  'cene-estetigi-mentoplasti': {
    tr: { title: 'Çene Estetiği (Mentoplasti)', subtitle: 'Çene profilini, oranlarını ve yüz simetrisini geliştiren dolgu veya cerrahi mentoplasti uygulaması.' },
    en: { title: 'Chin Aesthetics (Mentoplasty)', subtitle: 'Filler or surgical mentoplasty improving chin profile, proportions and facial symmetry.' },
    ar: { title: 'تجميل الذقن (مينتوبلاستي)', subtitle: 'حشو أو جراحة مينتوبلاستي لتحسين ملف الذقن ونسبه وتماثل الوجه.' },
    ru: { title: 'Эстетика подбородка (Ментопластика)', subtitle: 'Филлеры или хирургическая ментопластика для улучшения профиля подбородка и симметрии лица.' },
    fr: { title: 'Esthétique du menton (Mentoplastie)', subtitle: 'Filler ou mentoplastie chirurgicale améliorant le profil du menton, les proportions et la symétrie du visage.' },
    de: { title: 'Kinn-Ästhetik (Mentoplastik)', subtitle: 'Filler oder chirurgische Mentoplastik zur Verbesserung von Kinnprofil, Proportionen und Gesichtssymmetrie.' },
  },
  'yuz-germe-facelift': {
    tr: { title: 'Yüz Gençleştirme', subtitle: 'İp askılama, dolgu ve lazer kombinasyonuyla cerrahisiz kapsamlı yüz gençleştirme yaklaşımı.' },
    en: { title: 'Face Rejuvenation', subtitle: 'Comprehensive non-surgical face rejuvenation combining thread lifting, fillers and laser.' },
    ar: { title: 'تجديد شباب الوجه', subtitle: 'نهج شامل لتجديد شباب الوجه غير الجراحي يجمع بين شد الخيوط والحشوات والليزر.' },
    ru: { title: 'Омоложение лица', subtitle: 'Комплексное нехирургическое омоложение лица с нитями, филлерами и лазером.' },
    fr: { title: 'Rajeunissement du visage', subtitle: 'Approche complète de rajeunissement facial non chirurgical combinant fils tenseurs, fillers et laser.' },
    de: { title: 'Gesichtsverjüngung', subtitle: 'Umfassende nicht-chirurgische Gesichtsverjüngung mit Fadenlifting, Fillern und Laser kombiniert.' },
  },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────
// Format: slug → { locale: [{question, answer}] }
const FAQ_DATA = {
  'rinoplasti': {
    tr: [
      { question: 'Rinoplasti ameliyatı ne kadar sürer?', answer: 'Rinoplasti ameliyatı ortalama 2-3 saat sürer. Ameliyat süresi yapılacak değişikliklerin kapsamına ve tercih edilen tekniğe göre değişebilir.' },
      { question: 'Rinoplasti sonrası iyileşme süreci nasıldır?', answer: 'İlk 1-2 hafta morluk ve şişlik beklenen bir süreçtir. Sosyal hayata dönüş genellikle 10-14 gün içinde gerçekleşir. Nihai sonuç 6-12 ay içinde tam olarak ortaya çıkar.' },
      { question: 'Rinoplastide açık ve kapalı teknik arasındaki fark nedir?', answer: 'Açık teknikte küçük bir kesi burun kolumellasından yapılırken, kapalı teknikte tüm kesiler burun içinde kalır. Her iki tekniğin de avantaj ve endikasyonları farklıdır; en uygun yöntem muayenede belirlenir.' },
      { question: 'Rinoplasti ameliyatı kalıcı mı?', answer: 'Evet, rinoplasti sonuçları kalıcıdır. Zamanla yaşlanmayla birlikte bazı doğal değişimler olabilir, ancak ameliyatın temel sonuçları ömür boyu korunur.' },
      { question: 'Rinoplasti için en uygun yaş nedir?', answer: 'Burun gelişiminin tamamlanması için 17-18 yaş önerilir. Üst sınır yoktur; yetişkin her yaşta uygun hastalara rinoplasti uygulanabilir.' },
    ],
    en: [
      { question: 'How long does rhinoplasty surgery take?', answer: 'Rhinoplasty typically takes 2-3 hours. Duration varies depending on the scope of changes and chosen technique.' },
      { question: 'What is the rhinoplasty recovery process?', answer: 'Bruising and swelling are expected in the first 1-2 weeks. Most patients return to social life within 10-14 days. Final results fully appear within 6-12 months.' },
      { question: 'What is the difference between open and closed rhinoplasty?', answer: 'Open technique uses a small incision on the columella, while closed technique keeps all incisions inside the nose. Each has specific advantages; the best approach is determined at consultation.' },
      { question: 'Are rhinoplasty results permanent?', answer: 'Yes, rhinoplasty results are permanent. Some natural changes occur with aging over time, but the fundamental results of the surgery are preserved for life.' },
      { question: 'What is the ideal age for rhinoplasty?', answer: 'Age 17-18 is recommended for nasal development to be complete. There is no upper limit; rhinoplasty can be performed on suitable adults at any age.' },
    ],
    ar: [
      { question: 'كم من الوقت تستغرق جراحة تجميل الأنف؟', answer: 'تستغرق عادةً 2-3 ساعات. تختلف المدة حسب نطاق التغييرات والتقنية المختارة.' },
      { question: 'ما هي عملية الشفاء من تجميل الأنف؟', answer: 'الكدمات والتورم متوقعان في الأسبوعين الأولين. يعود معظم المرضى للحياة الاجتماعية خلال 10-14 يوماً. تظهر النتائج النهائية خلال 6-12 شهراً.' },
      { question: 'ما الفرق بين الجراحة المفتوحة والمغلقة؟', answer: 'يستخدم الأسلوب المفتوح شقاً صغيراً في عمود الأنف، بينما تبقى كل الشقوق في الأسلوب المغلق داخل الأنف. يتم تحديد الأسلوب الأنسب عند الاستشارة.' },
      { question: 'هل نتائج تجميل الأنف دائمة؟', answer: 'نعم، النتائج دائمة. قد تحدث بعض التغييرات الطبيعية مع التقدم في العمر، لكن النتائج الأساسية تدوم مدى الحياة.' },
      { question: 'ما هو العمر المثالي لتجميل الأنف؟', answer: 'يُنصح بعمر 17-18 عاماً لاكتمال نمو الأنف. لا يوجد حد أعلى للعمر؛ يمكن إجراء الجراحة للبالغين المناسبين في أي عمر.' },
    ],
    ru: [
      { question: 'Сколько длится операция ринопластики?', answer: 'Операция занимает в среднем 2-3 часа. Продолжительность варьируется в зависимости от объёма изменений и выбранной техники.' },
      { question: 'Каков процесс восстановления после ринопластики?', answer: 'В первые 1-2 недели ожидаются синяки и отёки. Большинство пациентов возвращаются к социальной жизни через 10-14 дней. Окончательные результаты появляются через 6-12 месяцев.' },
      { question: 'В чём разница между открытой и закрытой техникой?', answer: 'Открытая техника использует небольшой разрез на колумелле, закрытая — все разрезы остаются внутри носа. Оптимальный метод определяется на консультации.' },
      { question: 'Результаты ринопластики постоянны?', answer: 'Да, результаты постоянны. С возрастом возможны некоторые естественные изменения, но основные результаты операции сохраняются на всю жизнь.' },
      { question: 'Каков идеальный возраст для ринопластики?', answer: 'Рекомендуется 17-18 лет для завершения развития носа. Верхнего предела нет; операция может быть проведена у подходящих взрослых в любом возрасте.' },
    ],
    fr: [
      { question: 'Combien de temps dure la rhinoplastie?', answer: 'La rhinoplastie dure généralement 2-3 heures. La durée varie selon l\'étendue des modifications et la technique choisie.' },
      { question: 'Quel est le processus de récupération?', answer: 'Des ecchymoses et un gonflement sont attendus les 1-2 premières semaines. La plupart des patients reprennent leur vie sociale sous 10-14 jours. Les résultats finaux apparaissent complètement en 6-12 mois.' },
      { question: 'Quelle est la différence entre technique ouverte et fermée?', answer: 'La technique ouverte utilise une petite incision sur la columelle, tandis que la fermée garde toutes les incisions à l\'intérieur du nez. La meilleure approche est déterminée à la consultation.' },
      { question: 'Les résultats de rhinoplastie sont-ils permanents?', answer: 'Oui, les résultats sont permanents. Des changements naturels peuvent survenir avec l\'âge, mais les résultats fondamentaux durent toute la vie.' },
      { question: 'Quel est l\'âge idéal pour la rhinoplastie?', answer: '17-18 ans est recommandé pour que le développement nasal soit complet. Il n\'y a pas de limite supérieure; la rhinoplastie peut être pratiquée à tout âge adulte approprié.' },
    ],
    de: [
      { question: 'Wie lange dauert eine Rhinoplastik-Operation?', answer: 'Die Rhinoplastik dauert in der Regel 2-3 Stunden. Die Dauer variiert je nach Umfang der Änderungen und gewählter Technik.' },
      { question: 'Wie verläuft die Erholung nach Rhinoplastik?', answer: 'In den ersten 1-2 Wochen sind Blutergüsse und Schwellungen zu erwarten. Die meisten Patienten kehren innerhalb von 10-14 Tagen ins Sozialleben zurück. Endergebnisse erscheinen vollständig in 6-12 Monaten.' },
      { question: 'Was ist der Unterschied zwischen offener und geschlossener Technik?', answer: 'Die offene Technik verwendet einen kleinen Schnitt an der Columella, während die geschlossene alle Schnitte innerhalb der Nase lässt. Der beste Ansatz wird bei der Beratung bestimmt.' },
      { question: 'Sind die Ergebnisse dauerhaft?', answer: 'Ja, Rhinoplastik-Ergebnisse sind dauerhaft. Mit der Zeit können natürliche Veränderungen auftreten, aber die grundlegenden Ergebnisse bleiben lebenslang erhalten.' },
      { question: 'Was ist das ideale Alter für Rhinoplastik?', answer: '17-18 Jahre wird empfohlen, damit die Nasenentwicklung abgeschlossen ist. Es gibt keine Obergrenze; Rhinoplastik kann bei geeigneten Erwachsenen in jedem Alter durchgeführt werden.' },
    ],
  },
  'botoks': {
    tr: [
      { question: 'Botoks ne kadar sürer?', answer: 'Botoks etkisi genellikle 4-6 ay sürer. Düzenli uygulamalarla kas hafızası azalır ve etki süresi uzayabilir.' },
      { question: 'Botoks ağrılı mı?', answer: 'İğne ucu kadar hafif bir his yaşanır. Ağrı toleransı için kriyoterapi veya topikal anestezi uygulanabilir.' },
      { question: 'Botoks sonrası ne zaman etki görülür?', answer: 'Etki 3-7 gün içinde başlar, 2 hafta içinde tam sonuç ortaya çıkar.' },
      { question: 'Botoks kimler için uygun değildir?', answer: 'Hamilelik, emzirme döneminde ve nöromüsküler hastalığı olanlarda botoks uygulanmaz.' },
      { question: 'Botoks sonrası ne yapılmamalı?', answer: 'İlk 24 saat yüze yatmamak, sıcak ortamlardan kaçınmak ve uygulama bölgesine masaj yapmamak önerilir.' },
    ],
    en: [
      { question: 'How long does Botox last?', answer: 'Botox effects typically last 4-6 months. With regular treatments, muscle memory decreases and the duration may extend.' },
      { question: 'Is Botox painful?', answer: 'Only a slight needle-tip sensation is felt. Cryotherapy or topical anesthesia can be applied for pain tolerance.' },
      { question: 'When do Botox results appear?', answer: 'Effects begin within 3-7 days, with full results appearing within 2 weeks.' },
      { question: 'Who is not suitable for Botox?', answer: 'Botox is not applied during pregnancy, breastfeeding, or in patients with neuromuscular diseases.' },
      { question: 'What should be avoided after Botox?', answer: 'It is recommended to avoid lying on the face for the first 24 hours, avoiding hot environments and not massaging the treated area.' },
    ],
    ar: [
      { question: 'كم يدوم البوتوكس؟', answer: 'عادةً ما تستمر تأثيرات البوتوكس من 4-6 أشهر. مع العلاجات المنتظمة، تنخفض ذاكرة العضلات وقد تمتد المدة.' },
      { question: 'هل البوتوكس مؤلم؟', answer: 'لا يُشعر إلا بإحساس خفيف بطرف الإبرة. يمكن تطبيق التبريد أو التخدير الموضعي لتحمل الألم.' },
      { question: 'متى تظهر نتائج البوتوكس؟', answer: 'تبدأ التأثيرات خلال 3-7 أيام، وتظهر النتائج الكاملة في غضون أسبوعين.' },
      { question: 'من لا يصلح لحقن البوتوكس؟', answer: 'لا يطبق البوتوكس أثناء الحمل والرضاعة أو في المرضى الذين يعانون من أمراض عصبية عضلية.' },
      { question: 'ماذا يجب تجنبه بعد البوتوكس؟', answer: 'يُنصح بتجنب الاستلقاء على الوجه لأول 24 ساعة، وتجنب البيئات الحارة، وعدم تدليك منطقة العلاج.' },
    ],
    ru: [
      { question: 'Сколько длится эффект ботокса?', answer: 'Эффект ботокса обычно длится 4-6 месяцев. При регулярных процедурах мышечная память снижается и продолжительность может увеличиться.' },
      { question: 'Болезненна ли процедура?', answer: 'Ощущается лишь лёгкое покалывание иглой. Для снятия дискомфорта можно применить криотерапию или местную анестезию.' },
      { question: 'Когда виден результат ботокса?', answer: 'Эффект начинается через 3-7 дней, полный результат виден через 2 недели.' },
      { question: 'Кому не подходит ботокс?', answer: 'Ботокс не применяется при беременности, грудном вскармливании и нервно-мышечных заболеваниях.' },
      { question: 'Что нельзя делать после ботокса?', answer: 'Рекомендуется не лежать на лице первые 24 часа, избегать горячих помещений и не массировать обработанную зону.' },
    ],
    fr: [
      { question: 'Combien de temps dure le Botox?', answer: 'Les effets durent généralement 4-6 mois. Avec des traitements réguliers, la mémoire musculaire diminue et la durée peut s\'allonger.' },
      { question: 'Le Botox est-il douloureux?', answer: 'Seule une légère sensation de pointe d\'aiguille est ressentie. La cryothérapie ou une anesthésie topique peuvent être appliquées.' },
      { question: 'Quand les résultats du Botox apparaissent-ils?', answer: 'Les effets débutent dans les 3-7 jours, avec des résultats complets en 2 semaines.' },
      { question: 'Qui n\'est pas indiqué pour le Botox?', answer: 'Le Botox n\'est pas administré pendant la grossesse, l\'allaitement, ou aux patients atteints de maladies neuromusculaires.' },
      { question: 'Que faut-il éviter après le Botox?', answer: 'Il est recommandé d\'éviter de s\'allonger sur le visage pendant 24h, d\'éviter les environnements chauds et de ne pas masser la zone traitée.' },
    ],
    de: [
      { question: 'Wie lange hält Botox?', answer: 'Die Botox-Wirkung hält typischerweise 4-6 Monate an. Mit regelmäßigen Behandlungen nimmt das Muskelgedächtnis ab und die Dauer kann sich verlängern.' },
      { question: 'Ist Botox schmerzhaft?', answer: 'Es wird nur ein leichtes Nadelstich-Gefühl gespürt. Kryotherapie oder topische Anästhesie können zur Schmerzlinderung angewendet werden.' },
      { question: 'Wann sind Botox-Ergebnisse sichtbar?', answer: 'Die Wirkung beginnt innerhalb von 3-7 Tagen, mit vollständigen Ergebnissen in 2 Wochen.' },
      { question: 'Wer ist nicht für Botox geeignet?', answer: 'Botox wird nicht während Schwangerschaft, Stillzeit oder bei neuromuskulären Erkrankungen angewendet.' },
      { question: 'Was sollte nach Botox vermieden werden?', answer: 'Es wird empfohlen, in den ersten 24 Stunden nicht auf dem Gesicht zu liegen, heiße Umgebungen zu meiden und die behandelte Stelle nicht zu massieren.' },
    ],
  },
  'dolgu': {
    tr: [
      { question: 'Dolgu uygulaması ne kadar sürer?', answer: 'Dolgu işlemi 20-45 dakika sürer. Uygulama öncesi lokal anestezi kremi kullanılarak konfor sağlanır.' },
      { question: 'Dolgu ne kadar kalıcıdır?', answer: 'Hyalüronik asit dolgular 8-18 ay arasında etkin kalır. Süre, dolgunun bölgesine ve vücudun metabolizmasına göre değişir.' },
      { question: 'Dolgu uygulamasında ağrı olur mu?', answer: 'Modern dolgu ürünleri lidokain içerir. Ek olarak topikal anestezi kremi uygulanarak işlem rahat geçirilir.' },
      { question: 'Dolgu sonrası morluk olur mu?', answer: 'Hafif morluk ve şişlik birkaç gün sürebilir. Bölgeye göre değişmekle birlikte çoğu hasta 3-5 gün içinde normal görünüme döner.' },
      { question: 'Dolgu istenirse geri alınabilir mi?', answer: 'Hyalüronik asit dolgular hiyalüronidaz enjeksiyonu ile tamamen eritilebilir. Bu, uygulamanın güvenilirliğini artıran önemli bir özelliktir.' },
    ],
    en: [
      { question: 'How long does a filler treatment take?', answer: 'Filler procedures take 20-45 minutes. Local anesthetic cream is applied beforehand for comfort.' },
      { question: 'How long do fillers last?', answer: 'Hyaluronic acid fillers remain effective for 8-18 months. Duration varies by area and individual metabolism.' },
      { question: 'Is filler treatment painful?', answer: 'Modern filler products contain lidocaine. Topical anesthetic cream is also applied for a comfortable procedure.' },
      { question: 'Is bruising expected after filler?', answer: 'Slight bruising and swelling may last a few days. Most patients return to a normal appearance within 3-5 days.' },
      { question: 'Can fillers be reversed?', answer: 'Hyaluronic acid fillers can be completely dissolved with hyaluronidase injection, which is an important safety feature.' },
    ],
    ar: [
      { question: 'كم يستغرق علاج الحشو؟', answer: 'تستغرق إجراءات الحشو من 20-45 دقيقة. يتم تطبيق كريم مخدر موضعي مسبقاً للراحة.' },
      { question: 'كم يدوم الحشو؟', answer: 'تبقى حشوات حمض الهيالورونيك فعّالة لمدة 8-18 شهراً. تختلف المدة حسب المنطقة والتمثيل الغذائي الفردي.' },
      { question: 'هل علاج الحشو مؤلم؟', answer: 'تحتوي منتجات الحشو الحديثة على ليدوكائين. كما يتم تطبيق كريم مخدر موضعي لإجراء مريح.' },
      { question: 'هل من المتوقع حدوث كدمات بعد الحشو؟', answer: 'قد تستمر الكدمات والتورم الخفيف لبضعة أيام. يعود معظم المرضى للمظهر الطبيعي خلال 3-5 أيام.' },
      { question: 'هل يمكن عكس الحشوات؟', answer: 'يمكن إذابة حشوات حمض الهيالورونيك تماماً بحقن هيالورونيداز، وهي ميزة أمان مهمة.' },
    ],
    ru: [
      { question: 'Сколько длится процедура с филлером?', answer: 'Процедуры с филлерами занимают 20-45 минут. Перед процедурой наносится местная анестезия для комфорта.' },
      { question: 'Как долго держится филлер?', answer: 'Гиалуроновые филлеры сохраняют эффект 8-18 месяцев. Продолжительность варьируется по зоне и метаболизму.' },
      { question: 'Болезненна ли процедура с филлерами?', answer: 'Современные филлеры содержат лидокаин. Также наносится топический анестетик для комфортного проведения процедуры.' },
      { question: 'Бывают ли синяки после филлеров?', answer: 'Лёгкие синяки и отёчность могут сохраняться несколько дней. Большинство пациентов возвращаются к нормальному виду за 3-5 дней.' },
      { question: 'Можно ли растворить филлер?', answer: 'Гиалуроновые филлеры можно полностью растворить инъекцией гиалуронидазы, что является важной особенностью безопасности.' },
    ],
    fr: [
      { question: 'Combien de temps dure un traitement filler?', answer: 'Les procédures filler prennent 20-45 minutes. Une crème anesthésiante locale est appliquée au préalable pour le confort.' },
      { question: 'Combien de temps durent les fillers?', answer: 'Les fillers à l\'acide hyaluronique restent efficaces 8-18 mois. La durée varie selon la zone et le métabolisme.' },
      { question: 'Le traitement filler est-il douloureux?', answer: 'Les produits filler modernes contiennent de la lidocaïne. Une crème anesthésiante topique est également appliquée.' },
      { question: 'Des ecchymoses sont-elles attendues après filler?', answer: 'De légères ecchymoses et gonflement peuvent durer quelques jours. La plupart des patients retrouvent un aspect normal en 3-5 jours.' },
      { question: 'Les fillers peuvent-ils être inversés?', answer: 'Les fillers à l\'acide hyaluronique peuvent être complètement dissous par injection d\'hyaluronidase, une importante caractéristique de sécurité.' },
    ],
    de: [
      { question: 'Wie lange dauert eine Filler-Behandlung?', answer: 'Filler-Eingriffe dauern 20-45 Minuten. Vorher wird Lokalanästhesiecreme für Komfort aufgetragen.' },
      { question: 'Wie lange halten Filler?', answer: 'Hyaluronsäure-Filler bleiben 8-18 Monate wirksam. Die Dauer variiert je nach Bereich und Stoffwechsel.' },
      { question: 'Ist die Filler-Behandlung schmerzhaft?', answer: 'Moderne Filler enthalten Lidocain. Zudem wird topische Anästhesiecreme für eine komfortable Behandlung aufgetragen.' },
      { question: 'Sind Blutergüsse nach Fillern zu erwarten?', answer: 'Leichte Blutergüsse und Schwellungen können einige Tage anhalten. Die meisten Patienten kehren innerhalb von 3-5 Tagen zum normalen Aussehen zurück.' },
      { question: 'Können Filler rückgängig gemacht werden?', answer: 'Hyaluronsäure-Filler können mit Hyaluronidase-Injektion vollständig aufgelöst werden, ein wichtiges Sicherheitsmerkmal.' },
    ],
  },
};

// Generate generic FAQs for services without specific ones
function genericFAQs(locale, serviceName) {
  const data = {
    tr: [
      { question: `${serviceName} uygulaması nasıl yapılır?`, answer: `${serviceName} uygulaması, detaylı bir muayene ve kişiye özel planlama sonrasında uzman ekibimiz tarafından uygulanır. İşlem öncesi gerekli değerlendirmeler yapılır ve size özel bir tedavi planı hazırlanır.` },
      { question: `${serviceName} için kimler uygun adaydır?`, answer: `Genel sağlık durumu iyi olan ve gerçekçi beklentilere sahip yetişkinler bu uygulama için uygun aday olabilir. Kesin uygunluk değerlendirmesi Prof. Dr. Gökçe Özel ile muayene sonrasında belirlenir.` },
      { question: `${serviceName} sonrası iyileşme süreci nasıldır?`, answer: `İyileşme süresi uygulamanın türüne göre değişir. Detaylı bilgi ve kişiye özel öneriler için kliniğimizle iletişime geçmenizi öneririz.` },
      { question: `${serviceName} kalıcı bir uygulama mıdır?`, answer: `Uygulama türüne bağlı olarak sonuçlar değişkenlik gösterebilir. Kalıcılık konusunda muayene sırasında detaylı bilgi verilir.` },
      { question: `${serviceName} hakkında randevu nasıl alınır?`, answer: `Randevu almak için iletişim sayfamızı ziyaret edebilir veya kliniğimizi arayabilirsiniz. Prof. Dr. Gökçe Özel sizi ücretsiz ön değerlendirme için beklemektedir.` },
    ],
    en: [
      { question: `How is ${serviceName} performed?`, answer: `${serviceName} is performed by our expert team following a detailed examination and personalized planning. Necessary assessments are made before the procedure and a treatment plan tailored to you is prepared.` },
      { question: `Who is a suitable candidate for ${serviceName}?`, answer: `Adults in good general health with realistic expectations may be suitable candidates. Final suitability is determined after examination with Prof. Dr. Gökçe Özel.` },
      { question: `What is the recovery process after ${serviceName}?`, answer: `Recovery time varies depending on the type of treatment. We recommend contacting our clinic for detailed information and personalized advice.` },
      { question: `Is ${serviceName} a permanent procedure?`, answer: `Results may vary depending on the type of procedure. Detailed information about permanence will be provided during the consultation.` },
      { question: `How can I book an appointment for ${serviceName}?`, answer: `You can visit our contact page or call our clinic to book an appointment. Prof. Dr. Gökçe Özel is looking forward to welcoming you for a free initial assessment.` },
    ],
    ar: [
      { question: `كيف يتم تطبيق ${serviceName}؟`, answer: `يُطبق ${serviceName} من قِبل فريقنا المتخصص بعد فحص دقيق وتخطيط مخصص. يتم إجراء التقييمات اللازمة قبل الإجراء وإعداد خطة علاج مصممة خصيصاً لك.` },
      { question: `من هو المرشح المناسب لـ ${serviceName}؟`, answer: `البالغون الذين يتمتعون بصحة جيدة وتوقعات واقعية قد يكونون مرشحين مناسبين. يتم تحديد المدى النهائي للأهلية بعد الفحص مع الأستاذ الدكتورة غوكتشي أوزيل.` },
      { question: `ما هي عملية التعافي بعد ${serviceName}؟`, answer: `يختلف وقت الشفاء حسب نوع العلاج. نوصيك بالتواصل مع عيادتنا للحصول على معلومات تفصيلية ونصائح مخصصة.` },
      { question: `هل ${serviceName} إجراء دائم؟`, answer: `قد تختلف النتائج حسب نوع الإجراء. سيتم تقديم معلومات مفصلة حول الديمومة أثناء الاستشارة.` },
      { question: `كيف يمكنني حجز موعد لـ ${serviceName}؟`, answer: `يمكنك زيارة صفحة الاتصال الخاصة بنا أو الاتصال بعيادتنا لحجز موعد. تتطلع الأستاذة الدكتورة غوكتشي أوزيل إلى الترحيب بك لتقييم أولي مجاني.` },
    ],
    ru: [
      { question: `Как выполняется ${serviceName}?`, answer: `Процедура проводится нашей командой специалистов после детального осмотра и индивидуального планирования. Перед процедурой проводятся необходимые оценки, и для вас составляется персонализированный план лечения.` },
      { question: `Кто является подходящим кандидатом для ${serviceName}?`, answer: `Взрослые в хорошем состоянии здоровья с реалистичными ожиданиями могут быть подходящими кандидатами. Окончательная пригодность определяется после осмотра у проф. д-ра Гёкче Озел.` },
      { question: `Каков процесс восстановления после ${serviceName}?`, answer: `Время восстановления варьируется в зависимости от типа лечения. Рекомендуем связаться с нашей клиникой для получения подробной информации и персонализированных советов.` },
      { question: `Является ли ${serviceName} постоянной процедурой?`, answer: `Результаты могут варьироваться в зависимости от типа процедуры. Подробная информация о постоянстве будет предоставлена во время консультации.` },
      { question: `Как записаться на приём для ${serviceName}?`, answer: `Вы можете посетить нашу страницу контактов или позвонить в клинику для записи на приём. Проф. д-р Гёкче Озел ждёт вас на бесплатную первичную консультацию.` },
    ],
    fr: [
      { question: `Comment est réalisée la procédure ${serviceName}?`, answer: `${serviceName} est réalisée par notre équipe d'experts après un examen approfondi et une planification personnalisée. Les évaluations nécessaires sont effectuées avant la procédure et un plan de traitement adapté vous est préparé.` },
      { question: `Qui est un candidat approprié pour ${serviceName}?`, answer: `Les adultes en bonne santé générale avec des attentes réalistes peuvent être de bons candidats. L'aptitude finale est déterminée après examen avec le Prof. Dr. Gökçe Özel.` },
      { question: `Quel est le processus de récupération après ${serviceName}?`, answer: `Le temps de récupération varie selon le type de traitement. Nous vous recommandons de contacter notre clinique pour des informations détaillées et des conseils personnalisés.` },
      { question: `La ${serviceName} est-elle permanente?`, answer: `Les résultats peuvent varier selon le type de procédure. Des informations détaillées sur la permanence seront fournies lors de la consultation.` },
      { question: `Comment prendre rendez-vous pour ${serviceName}?`, answer: `Vous pouvez visiter notre page de contact ou appeler notre clinique pour prendre rendez-vous. Le Prof. Dr. Gökçe Özel vous attend pour une première évaluation gratuite.` },
    ],
    de: [
      { question: `Wie wird ${serviceName} durchgeführt?`, answer: `${serviceName} wird von unserem Expertenteam nach eingehender Untersuchung und personalisierter Planung durchgeführt. Vor dem Eingriff werden notwendige Beurteilungen vorgenommen und ein auf Sie zugeschnittener Behandlungsplan erstellt.` },
      { question: `Wer ist ein geeigneter Kandidat für ${serviceName}?`, answer: `Erwachsene in gutem Allgemeingesundheitszustand mit realistischen Erwartungen können geeignete Kandidaten sein. Die endgültige Eignung wird nach Untersuchung bei Prof. Dr. Gökçe Özel bestimmt.` },
      { question: `Wie verläuft die Erholung nach ${serviceName}?`, answer: `Die Erholungszeit variiert je nach Behandlungsart. Wir empfehlen, unsere Klinik für detaillierte Informationen und personalisierte Beratung zu kontaktieren.` },
      { question: `Ist ${serviceName} eine dauerhafte Behandlung?`, answer: `Ergebnisse können je nach Eingriff variieren. Detaillierte Informationen zur Dauerhaftigkeit werden während der Beratung bereitgestellt.` },
      { question: `Wie kann ich einen Termin für ${serviceName} buchen?`, answer: `Sie können unsere Kontaktseite besuchen oder unsere Klinik anrufen, um einen Termin zu vereinbaren. Prof. Dr. Gökçe Özel freut sich auf Ihren Besuch zur kostenlosen Erstbewertung.` },
    ],
  };
  return data[locale] || data.en;
}

// ─── alt-blefaroplasti HTML content ───────────────────────────────────────────
const ALT_BLEFARO_CONTENT = {
  tr: `<p>Alt blefaroplasti, göz altı bölgesindeki torba ve şişlik sorunlarına yönelik uygulanan cerrahi bir estetik işlemdir. Yaşlanma, genetik faktörler veya yorgunlukla oluşabilen göz altı torbaları kişinin yaşından daha yaşlı ve yorgun görünmesine yol açabilir. Prof. Dr. Gökçe Özel, her hastanın anatomisini detaylı şekilde değerlendirerek en uygun alt blefaroplasti tekniğini belirler.</p><h2>Alt Blefaroplasti Nasıl Uygulanır?</h2><p>İşlem genel anestezi altında yapılır. Alt göz kapağının içinden (transkonjonktival yaklaşım) veya dışından küçük bir kesi yapılarak yağ dokularının yeniden düzenlenmesi ve fazla deri varsa alınması sağlanır. Transkonjonktival yöntem görünür iz bırakmaz ve genç hastalarda önerilir.</p><h2>Alt Blefaroplasti Sonuçları</h2><p>Ameliyat sonrasında göz altı bölgesi daha düzgün, dinlenmiş ve genç görünümlü hale gelir. Sonuçlar uzun yıllar boyunca kalıcıdır. İlk 1-2 hafta şişlik ve morluk beklenir; 3-4 hafta içinde nihai iyileşme tamamlanır.</p><h2>Uygun Aday Kimdir?</h2><p>Alt göz kapağında belirgin torba ve şişliği olan, genel sağlık durumu operasyon için elverişli olan yetişkinler bu ameliyat için uygun adaylardır. Detaylı bir muayene ile uygunluk değerlendirilir.</p>`,
  en: `<p>Lower blepharoplasty is a surgical aesthetic procedure for under-eye bags and puffiness. Bags under the eyes, which can form due to aging, genetic factors, or fatigue, can make a person appear older and more tired than they are. Prof. Dr. Gökçe Özel determines the most appropriate lower blepharoplasty technique by evaluating each patient's anatomy in detail.</p><h2>How Is Lower Blepharoplasty Performed?</h2><p>The procedure is performed under general anesthesia. Through a small incision from inside the lower eyelid (transconjunctival approach) or outside, fatty tissues are repositioned and, if necessary, excess skin is removed. The transconjunctival method leaves no visible scar and is recommended for younger patients.</p><h2>Lower Blepharoplasty Results</h2><p>After surgery, the under-eye area becomes smoother, more rested and youthful. Results are permanent for many years. Swelling and bruising are expected in the first 1-2 weeks; complete recovery is achieved within 3-4 weeks.</p><h2>Who Is a Suitable Candidate?</h2><p>Adults with prominent under-eye bags and puffiness whose general health is suitable for surgery are good candidates. Suitability is evaluated through a detailed examination.</p>`,
  ar: `<p>شد الجفن السفلي هو إجراء جراحي تجميلي لعلاج الانتفاخات وأكياس تحت العين. يمكن أن تجعل الأكياس تحت العين، التي يمكن أن تتشكل بسبب التقدم في السن أو العوامل الوراثية أو الإرهاق، الشخص يبدو أكبر سناً وأكثر إرهاقاً مما هو عليه. تحدد الأستاذة الدكتورة غوكتشي أوزيل الأسلوب الأنسب بتقييم تشريح كل مريض بالتفصيل.</p><h2>كيف يتم إجراء شد الجفن السفلي؟</h2><p>يُجرى التدخل تحت التخدير العام. من خلال شق صغير من داخل الجفن السفلي (نهج عبر الملتحمة) أو من الخارج، تُعاد ترتيب الأنسجة الدهنية، وإذا لزم الأمر تُزال الجلد الزائد. طريقة عبر الملتحمة لا تترك أثراً مرئياً وتُوصى بها للمرضى الأصغر سناً.</p><h2>نتائج شد الجفن السفلي</h2><p>بعد الجراحة، تصبح منطقة تحت العين أكثر نعومة وانتعاشاً وشباباً. النتائج دائمة لسنوات طويلة. من المتوقع حدوث تورم وكدمات في الأسبوعين الأول والثاني؛ يكتمل الشفاء التام في غضون 3-4 أسابيع.</p>`,
  ru: `<p>Нижняя блефаропластика — хирургическая эстетическая процедура для устранения мешков и отёчности под глазами. Мешки под глазами, образующиеся из-за старения, генетических факторов или усталости, могут придавать более усталый и пожилой вид. Проф. д-р Гёкче Озел определяет наиболее подходящую технику, детально оценивая анатомию каждого пациента.</p><h2>Как проводится нижняя блефаропластика?</h2><p>Процедура проводится под общей анестезией. Через небольшой разрез изнутри нижнего века (трансконъюнктивальный подход) или снаружи жировые ткани перераспределяются, при необходимости удаляется лишняя кожа. Трансконъюнктивальный метод не оставляет видимых шрамов и рекомендуется молодым пациентам.</p><h2>Результаты нижней блефаропластики</h2><p>После операции область под глазами становится более гладкой, отдохнувшей и молодой. Результаты сохраняются много лет. В первые 1-2 недели ожидаются отёки и синяки; полное восстановление наступает через 3-4 недели.</p>`,
  fr: `<p>La blépharoplastie inférieure est une procédure chirurgicale esthétique pour les poches et gonflements sous les yeux. Les poches sous les yeux, qui peuvent se former en raison du vieillissement, de facteurs génétiques ou de la fatigue, peuvent donner un aspect plus âgé et fatigué. Le Prof. Dr. Gökçe Özel détermine la technique la plus appropriée en évaluant en détail l'anatomie de chaque patient.</p><h2>Comment est réalisée la blépharoplastie inférieure?</h2><p>La procédure est réalisée sous anesthésie générale. Par une petite incision à l'intérieur de la paupière inférieure (approche transconjonctivale) ou à l'extérieur, les tissus graisseux sont repositionnés et, si nécessaire, l'excès de peau est retiré. La méthode transconjonctivale ne laisse aucune cicatrice visible et est recommandée pour les patients plus jeunes.</p><h2>Résultats de la blépharoplastie inférieure</h2><p>Après la chirurgie, la zone sous les yeux devient plus lisse, plus reposée et jeune. Les résultats sont permanents pendant de nombreuses années. Un gonflement et des ecchymoses sont attendus dans les 1-2 premières semaines; la récupération complète est obtenue en 3-4 semaines.</p>`,
  de: `<p>Die untere Blepharoplastik ist ein chirurgisch-ästhetischer Eingriff für Tränensäcke und Schwellungen unter den Augen. Tränensäcke, die sich durch Alterung, genetische Faktoren oder Erschöpfung bilden, können einen älter und müder wirkenden Eindruck vermitteln. Prof. Dr. Gökçe Özel bestimmt die geeignetste Technik durch detaillierte Bewertung der Anatomie jedes Patienten.</p><h2>Wie wird die untere Blepharoplastik durchgeführt?</h2><p>Der Eingriff erfolgt unter Vollnarkose. Durch einen kleinen Schnitt von der Innenseite des Unterlids (transkonjunktivaler Ansatz) oder von außen werden Fettgewebe repositioniert und bei Bedarf überschüssige Haut entfernt. Die transkonjunktivale Methode hinterlässt keine sichtbaren Narben und wird für jüngere Patienten empfohlen.</p><h2>Ergebnisse der unteren Blepharoplastik</h2><p>Nach der Operation wird der Bereich unter den Augen glatter, ausgeruhter und jugendlicher. Ergebnisse sind viele Jahre dauerhaft. Schwellungen und Blutergüsse sind in den ersten 1-2 Wochen zu erwarten; vollständige Erholung erfolgt innerhalb von 3-4 Wochen.</p>`,
};

// ─── Main seed function ───────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting comprehensive service content seed...\n');

  // Get all services
  const services = await prisma.page.findMany({
    where: { type: 'SERVICE' },
    include: {
      blocks: { include: { translations: true }, orderBy: { sortOrder: 'asc' } },
      seoMeta: true,
      faqs: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Found ${services.length} service pages\n`);

  for (const service of services) {
    const slug = service.slug;
    if (slug === 'global-settings') continue;

    const trSeo = service.seoMeta.find(m => m.locale === 'tr');
    const serviceName = trSeo?.metaTitle?.replace(/ Ankara.*| \|.*/, '') || service.titleInternal || slug;

    console.log(`\n📄 Processing: ${slug} (${serviceName})`);

    // ── 1. Handle alt-blefaroplasti missing content block ──
    if (slug === 'alt-blefaroplasti') {
      const hasContent = service.blocks.some(b => b.componentType === 'legacy_content' || b.componentType === 'rich_text');
      if (!hasContent) {
        console.log('  → Creating legacy_content block for alt-blefaroplasti');
        const block = await prisma.contentBlock.create({
          data: {
            pageId: service.id,
            componentType: 'legacy_content',
            sortOrder: 1,
            schemaDef: '{}',
          },
        });
        for (const [locale, html] of Object.entries(ALT_BLEFARO_CONTENT)) {
          await prisma.translation.create({
            data: {
              blockId: block.id,
              locale,
              contentData: JSON.stringify({ slug, title: serviceName, content: html }),
            },
          });
        }
        console.log('  ✓ Created legacy_content block with 6 locale translations');
      }
    }

    // ── 2. Update hero_slider with full data ──
    const heroBlocks = service.blocks.filter(b => b.componentType === 'hero_slider');
    const heroTransData = HERO_DATA[slug];
    const image = getImage(slug);
    const locales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

    if (heroBlocks.length === 0) {
      // Create a new hero_slider block
      console.log('  → Creating new hero_slider block');
      const block = await prisma.contentBlock.create({
        data: {
          pageId: service.id,
          componentType: 'hero_slider',
          sortOrder: 0,
          schemaDef: '{}',
        },
      });
      for (const locale of locales) {
        const hd = heroTransData?.[locale];
        const title = hd?.title || serviceName;
        const subtitle = hd?.subtitle || '';
        await prisma.translation.create({
          data: {
            blockId: block.id,
            locale,
            contentData: JSON.stringify({
              title,
              subtitle,
              image,
              imageAlt: title,
              ctaPrimary: CTA[locale],
              ctaPrimaryUrl: CTA_URL[locale],
            }),
          },
        });
      }
      console.log('  ✓ Created hero_slider block with 6 locale translations');
    } else {
      // Update existing hero_slider translations
      for (const heroBlock of heroBlocks) {
        const existingLocales = heroBlock.translations.map(t => t.locale);
        for (const locale of locales) {
          const hd = heroTransData?.[locale];
          const title = hd?.title || serviceName;
          const subtitle = hd?.subtitle || '';
          const contentData = JSON.stringify({
            title,
            subtitle,
            image,
            imageAlt: title,
            ctaPrimary: CTA[locale],
            ctaPrimaryUrl: CTA_URL[locale],
          });

          if (existingLocales.includes(locale)) {
            // Update existing
            const existing = heroBlock.translations.find(t => t.locale === locale);
            const existingData = JSON.parse(existing.contentData || '{}');
            // Only update if missing key fields
            if (!existingData.image || !existingData.ctaPrimary || !existingData.subtitle) {
              await prisma.translation.update({
                where: { id: existing.id },
                data: { contentData },
              });
              console.log(`  ✓ Updated hero_slider [${locale}]`);
            }
          } else {
            // Create new translation
            await prisma.translation.create({
              data: {
                blockId: heroBlock.id,
                locale,
                contentData,
              },
            });
            console.log(`  ✓ Created hero_slider [${locale}]`);
          }
        }
      }
    }

    // ── 3. Add FAQs ──
    if (service.faqs.length === 0) {
      console.log('  → Adding FAQs for all locales');
      const specificFAQs = FAQ_DATA[slug];
      let sortOrder = 0;
      for (const locale of locales) {
        const faqs = specificFAQs?.[locale] || genericFAQs(locale, serviceName);
        for (const faq of faqs) {
          await prisma.faq.create({
            data: {
              pageId: service.id,
              locale,
              question: faq.question,
              answer: faq.answer,
              sortOrder: sortOrder++,
            },
          });
        }
      }
      console.log(`  ✓ Added ${sortOrder} FAQ entries across all locales`);
    } else {
      console.log(`  ℹ Skipping FAQs (already has ${service.faqs.length} entries)`);
    }
  }

  console.log('\n✅ Comprehensive content seed complete!\n');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Seed failed:', e);
  prisma.$disconnect();
  process.exit(1);
});
