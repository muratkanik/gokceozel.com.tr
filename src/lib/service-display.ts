type Locale = 'tr' | 'en' | 'ar' | 'ru' | 'fr' | 'de';

const TITLE_BY_SLUG: Record<string, Partial<Record<Locale, string>> & { tr: string; en: string }> = {
  'badem-gz-estetii': {
    tr: 'Badem Göz Estetiği',
    en: 'Almond Eye Aesthetics',
    ar: 'تجميل عيون اللوز',
    ru: 'Эстетика миндалевидных глаз',
    fr: 'Esthétique des yeux en amande',
    de: 'Mandelauge-Ästhetik',
  },
  'ple-ka-kaldrma': {
    tr: 'İple Kaş Kaldırma',
    en: 'Thread Brow Lift',
    ar: 'رفع الحاجب بالخيوط',
    ru: 'Нитевой подъём бровей',
    fr: 'Lifting des sourcils par fils',
    de: 'Fadenbrauenlift',
  },
  'gd-liposuction': {
    tr: 'Gıdı Liposuction',
    en: 'Submental Liposuction',
    ar: 'شفط دهون الذقن',
    ru: 'Липосакция подбородка',
    fr: 'Liposuccion sous-mentale',
    de: 'Submentale Liposuktion',
  },
  'page-20': {
    tr: 'İple Yüz Germe — Fransız Askısı',
    en: 'Thread Face Lift — French Lift',
    ar: 'رفع الوجه بالخيوط الفرنسية',
    ru: 'Нитевой лифтинг лица — Французский метод',
    fr: 'Lifting facial par fils — Méthode française',
    de: 'Fadenlifting — Französische Methode',
  },
  'page-44': {
    tr: 'Botoks ile Kaş Kaldırma',
    en: 'Brow Lift with Botox',
    ar: 'رفع الحاجب بالبوتوكس',
    ru: 'Подъём бровей ботоксом',
    fr: 'Lifting des sourcils au Botox',
    de: 'Brauenlift mit Botox',
  },
  'revizyon-rinoplasti': {
    tr: 'Revizyon Rinoplasti',
    en: 'Revision Rhinoplasty',
    ar: 'تجميل الأنف التصحيحي',
    ru: 'Ревизионная ринопластика',
    fr: 'Rhinoplastie de révision',
    de: 'Revisions-Rhinoplastik',
  },
  'gz-kapa-estetii': {
    tr: 'Göz Kapağı Estetiği',
    en: 'Eyelid Aesthetics',
    ar: 'تجميل الجفن',
    ru: 'Эстетика век',
    fr: 'Esthétique des paupières',
    de: 'Augenlidästhetik',
  },
  rinoplasti: {
    tr: 'Rinoplasti',
    en: 'Rhinoplasty',
    ar: 'تجميل الأنف',
    ru: 'Ринопластика',
    fr: 'Rhinoplastie',
    de: 'Rhinoplastik',
  },
  septorinoplasti: {
    tr: 'Septorinoplasti',
    en: 'Septorhinoplasty',
    ar: 'سيبتورينوبلاستي',
    ru: 'Септоринопластика',
    fr: 'Septorhinoplastie',
    de: 'Septorhinoplastik',
  },
  endolift: {
    tr: 'Endolift Lazer',
    en: 'Endolift Laser',
    ar: 'ليزر إندوليفت',
    ru: 'Лазер Endolift',
    fr: 'Laser Endolift',
    de: 'Endolift Laser',
  },
  botoks: {
    tr: 'Botoks',
    en: 'Botox',
    ar: 'البوتوكس',
    ru: 'Ботокс',
    fr: 'Botox',
    de: 'Botox',
  },
  dolgu: {
    tr: 'Dolgu Uygulamaları',
    en: 'Filler Treatments',
    ar: 'حقن الفيلر',
    ru: 'Филлеры',
    fr: 'Injections de filler',
    de: 'Filler-Behandlungen',
  },
  'ip-aski': {
    tr: 'İp Askılama',
    en: 'Thread Lift',
    ar: 'رفع الوجه بالخيوط',
    ru: 'Нитевой лифтинг',
    fr: 'Lifting par fils',
    de: 'Fadenlifting',
  },
  'cilt-yenileme': {
    tr: 'Cilt Yenileme',
    en: 'Skin Rejuvenation',
    ar: 'تجديد الجلد',
    ru: 'Омоложение кожи',
    fr: 'Renouvellement cutané',
    de: 'Hauterneuerung',
  },
};

const DESCRIPTION_BY_SLUG: Record<string, Partial<Record<Locale, string>> & { tr: string; en: string }> = {
  'badem-gz-estetii': {
    tr: 'Göz çevresinde daha canlı, açık ve çekik bir ifade hedefleyen kişiye özel estetik planlama.',
    en: 'A personalized approach for a brighter, more lifted almond-shaped eye expression.',
    ar: 'تخطيط جمالي مخصص لتحقيق تعبير عيون أكثر حيوية وانفتاحاً.',
    ru: 'Индивидуальный эстетический подход для более яркого и приподнятого вида глаз.',
    fr: 'Planification esthétique personnalisée pour un regard plus vif et plus ouvert.',
    de: 'Individuelle ästhetische Planung für einen lebhafteren, offeneren Augenausdruck.',
  },
  'ple-ka-kaldrma': {
    tr: 'Kaş hattını ameliyatsız desteklemeye ve bakışlara daha dinamik bir görünüm kazandırmaya yönelik ip askı uygulaması.',
    en: 'A non-surgical thread technique designed to support the brow line and refresh the gaze.',
    ar: 'تقنية خيوط غير جراحية لدعم خط الحاجب وتجديد النظرة.',
    ru: 'Нехирургическая нитевая техника для поддержки линии бровей и обновления взгляда.',
    fr: 'Technique par fils non-chirurgicale pour soutenir la ligne des sourcils et rajeunir le regard.',
    de: 'Nicht-chirurgische Fadentechnik zur Unterstützung der Brauenlinie.',
  },
  'gd-liposuction': {
    tr: 'Çene altı ve boyun geçişinde daha net bir kontür elde etmeye yönelik gıdı bölgesi yağ alma uygulaması.',
    en: 'A contouring procedure for a sharper transition between the chin and neck.',
    ar: 'إجراء تشكيل لانتقال أكثر وضوحاً بين الذقن والرقبة.',
    ru: 'Процедура контурирования для четкого перехода между подбородком и шеей.',
    fr: 'Procédure de contourage pour une transition plus nette entre le menton et le cou.',
    de: 'Konturierungseingriff für einen schärferen Übergang zwischen Kinn und Hals.',
  },
  'page-20': {
    tr: 'Yüz ovalini ve orta-alt yüz hattını desteklemek için planlanan ameliyatsız ip askılama yaklaşımı.',
    en: 'A non-surgical thread lifting approach planned to support the facial oval and lower face.',
    ar: 'نهج رفع الخيوط غير الجراحي لدعم بيضاوي الوجه والمنطقة السفلية.',
    ru: 'Нехирургический нитевой лифтинг для поддержки овала лица и нижней части.',
    fr: 'Approche de lifting par fils non-chirurgical pour soutenir l\'ovale du visage.',
    de: 'Nicht-chirurgisches Fadenlifting zur Unterstützung des Gesichtsovals.',
  },
  'page-44': {
    tr: 'Kaş pozisyonunu ve bakış ifadesini botoks ile daha dengeli hale getirmeye yönelik medikal estetik uygulama.',
    en: 'A medical aesthetic treatment using Botox to create a more balanced brow position.',
    ar: 'علاج تجميلي طبي باستخدام البوتوكس لتحسين موضع الحاجب وتعبير النظرة.',
    ru: 'Медицинская эстетическая процедура с ботоксом для более сбалансированного положения бровей.',
    fr: 'Traitement esthétique médical au Botox pour équilibrer la position des sourcils.',
    de: 'Medizinisch-ästhetische Botox-Behandlung für eine ausgewogenere Brauenposition.',
  },
  'revizyon-rinoplasti': {
    tr: 'Daha önce burun ameliyatı geçirmiş hastalarda estetik ve fonksiyonel ihtiyaçların birlikte değerlendirildiği ikinci planlama.',
    en: 'Secondary nasal surgery planning that evaluates both aesthetic and functional needs.',
    ar: 'تخطيط جراحة الأنف الثانوية التي تقيّم الاحتياجات الجمالية والوظيفية معاً.',
    ru: 'Повторная ринопластика с оценкой эстетических и функциональных потребностей.',
    fr: 'Planification de rhinoplastie secondaire évaluant les besoins esthétiques et fonctionnels.',
    de: 'Sekundäre Rhinoplastik-Planung für ästhetische und funktionelle Bedürfnisse.',
  },
  endolift: {
    tr: 'Endolift lazer ile cilt altı dokuda sıkılaşma ve yüz konturunda toparlanma. Antalya ve Lara\'da cerrahsız yüz germe.',
    en: 'Endolift laser for sub-dermal tightening and facial rejuvenation. Non-surgical face lift in Antalya, Lara.',
    ar: 'ليزر إندوليفت لشد الجلد وتجديد الوجه بدون جراحة في أنطاليا ولارا.',
    ru: 'Endolift лазер для подкожного подтягивания и омоложения лица в Анталии, Лара.',
    fr: 'Laser Endolift pour un raffermissement sous-cutané et un rajeunissement facial à Antalya, Lara.',
    de: 'Endolift Laser für subkutane Straffung und Gesichtsverjüngung in Antalya, Lara.',
  },
  botoks: {
    tr: 'Mimik çizgilerini yumuşatarak doğal ifadeyi koruyan botoks uygulamaları. Antalya ve Lara\'da uzman botoks merkezi.',
    en: 'Botox treatments softening expression lines while preserving natural movement. Expert Botox in Antalya, Lara.',
    ar: 'حقن البوتوكس لتخفيف تجاعيد التعبير مع الحفاظ على حركة الوجه الطبيعية في أنطاليا ولارا.',
    ru: 'Ботокс для разглаживания мимических морщин с сохранением естественной мимики. Анталия, Лара.',
    fr: 'Botox pour atténuer les rides d\'expression tout en préservant la mobilité naturelle. Antalya, Lara.',
    de: 'Botox-Behandlungen zum Glätten von Ausdruckslinien bei natürlicher Mimik. Antalya, Lara.',
  },
  dolgu: {
    tr: 'Yüz hacmini ve konturunu destekleyen dolgu uygulamaları. Antalya ve Lara\'da kişiye özel yüz şekillendirme.',
    en: 'Filler treatments to restore facial volume and define contours. Personalized face shaping in Antalya, Lara.',
    ar: 'حقن الفيلر لاستعادة حجم الوجه وتحديد الملامح. تشكيل الوجه في أنطاليا ولارا.',
    ru: 'Филлеры для восстановления объёма лица и контурирования. Индивидуальный подход в Анталии, Лара.',
    fr: 'Filler pour restaurer le volume et définir les contours du visage. Contourage personnalisé à Antalya, Lara.',
    de: 'Filler für Volumenwiederherstellung und Konturierung des Gesichts. Personalisiertes Shaping in Antalya, Lara.',
  },
  'ip-aski': {
    tr: 'Sarkmaları gideren, yüz ovalini destekleyen ip askılama yöntemi. Antalya ve Lara\'da ameliyatsız yüz germe.',
    en: 'Thread lift to address sagging and support facial contours. Non-surgical facelift in Antalya, Lara.',
    ar: 'رفع الوجه بالخيوط لمعالجة الترهل ودعم ملامح الوجه. شد الوجه بدون جراحة في أنطاليا ولارا.',
    ru: 'Нитевой лифтинг для устранения птоза и поддержки контуров лица. Нехирургический лифтинг в Анталии, Лара.',
    fr: 'Lifting par fils pour corriger le relâchement et soutenir les contours. Lifting non-chirurgical à Antalya, Lara.',
    de: 'Fadenlifting gegen Erschlaffung und zur Unterstützung der Gesichtskonturen. Nicht-chirurgisch in Antalya, Lara.',
  },
  'cilt-yenileme': {
    tr: 'Lazer, PRP ve mezoterapi ile cilt dokusunu yenileyen uygulamalar. Antalya ve Lara\'da cilt bakım merkezi.',
    en: 'Skin rejuvenation with laser, PRP and mesotherapy. Expert skin care in Antalya, Lara.',
    ar: 'تجديد الجلد بالليزر وPRP والمزوثيرابي في أنطاليا ولارا.',
    ru: 'Омоложение кожи лазером, PRP и мезотерапией в Анталии, Лара.',
    fr: 'Renouvellement cutané par laser, PRP et mésothérapie à Antalya, Lara.',
    de: 'Hauterneuerung mit Laser, PRP und Mesotherapie in Antalya, Lara.',
  },
};

const TECHNICAL_TITLE_PATTERN = /^(page-\d+|content-\d+(?:-\d+)?|hizmetler\/|[-_/a-z0-9]+)$/i;
const MOJIBAKE_PATTERN = /Ã|Ä|Å|Ð|Ø|Ù|�/;
const SERVICE_PREFIX_PATTERN = /^(?:service|hizmet|hizmetler)\s*[-–—:\/]\s*/i;

function normalizeLocale(locale: string): Locale {
  return ['tr', 'en', 'ar', 'ru', 'fr', 'de'].includes(locale) ? (locale as Locale) : 'tr';
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugifyCandidate(value: string) {
  return stripTags(value)
    .toLocaleLowerCase('tr-TR')
    .replace(SERVICE_PREFIX_PATTERN, '')
    .replace(/^\/?(?:tr|en|ar|ru|fr|de)\/hizmetler\//, '')
    .replace(/^\/?hizmetler\//, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s*[-–—:]\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9ğüşıöç-]/gi, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function canonicalServiceSlug(slug: string, candidates: Array<string | null | undefined> = []) {
  const values = [slug, ...candidates].filter((value): value is string => Boolean(value));

  for (const value of values) {
    const normalized = slugifyCandidate(value);
    if (TITLE_BY_SLUG[normalized]) return normalized;
  }

  return slugifyCandidate(slug) || slug;
}

export function isMeaningfulText(value?: string | null) {
  if (!value) return false;
  const text = stripTags(value);
  if (text.length < 3) return false;
  if (MOJIBAKE_PATTERN.test(text)) return false;
  if (SERVICE_PREFIX_PATTERN.test(text)) return false;
  if (TECHNICAL_TITLE_PATTERN.test(text)) return false;
  return /[A-Za-zÇĞİÖŞÜçğıöşüА-Яа-яء-يÀ-ÿ]/.test(text);
}

export function serviceTitleFor(slug: string, locale: string, candidates: Array<string | null | undefined> = []) {
  const loc = normalizeLocale(locale);
  const canonicalSlug = canonicalServiceSlug(slug, candidates);
  const mapped = TITLE_BY_SLUG[canonicalSlug];

  if (mapped?.[loc]) return mapped[loc] as string;
  if (mapped?.tr) return mapped.tr;

  const candidate = candidates.find(isMeaningfulText);
  if (candidate) return stripTags(candidate);

  return canonicalSlug
    .replace(/^page-(\d+)$/, 'Hizmet')
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toLocaleUpperCase('tr-TR') + part.slice(1))
    .join(' ');
}

export function serviceDescriptionFor(slug: string, locale: string, candidates: Array<string | null | undefined> = []) {
  const loc = normalizeLocale(locale);
  const canonicalSlug = canonicalServiceSlug(slug, candidates);
  const mapped = DESCRIPTION_BY_SLUG[canonicalSlug];

  if (mapped?.[loc]) return mapped[loc] as string;
  if (mapped?.tr) return mapped.tr;

  const candidate = candidates.find(isMeaningfulText);
  return candidate ? stripTags(candidate) : '';
}

export function hasDisplayableServiceText(slug: string, candidates: Array<string | null | undefined> = []) {
  const canonicalSlug = canonicalServiceSlug(slug, candidates);

  if (TITLE_BY_SLUG[canonicalSlug]) return true;
  if (candidates.some(isMeaningfulText)) return true;

  return !/^page-\d+$/i.test(canonicalSlug) && !/^content-\d+/i.test(canonicalSlug);
}
