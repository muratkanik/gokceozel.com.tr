type Locale = 'tr' | 'en' | 'ar' | 'ru' | 'fr' | 'de';

const TITLE_BY_SLUG: Record<string, Partial<Record<Locale, string>> & { tr: string; en: string }> = {
  'badem-gz-estetii': {
    tr: 'Badem Göz Estetiği',
    en: 'Almond Eye Aesthetics',
  },
  'ple-ka-kaldrma': {
    tr: 'İple Kaş Kaldırma',
    en: 'Thread Brow Lift',
  },
  'gd-liposuction': {
    tr: 'Gıdı Liposuction',
    en: 'Submental Liposuction',
  },
  'page-20': {
    tr: 'İple Yüz Germe',
    en: 'Thread Face Lift',
  },
  'page-44': {
    tr: 'Botoks ile Kaş Kaldırma',
    en: 'Brow Lift with Botox',
  },
  'revizyon-rinoplasti': {
    tr: 'Revizyon Rinoplasti',
    en: 'Revision Rhinoplasty',
  },
  'gz-kapa-estetii': {
    tr: 'Göz Kapağı Estetiği',
    en: 'Eyelid Aesthetics',
  },
  rinoplasti: {
    tr: 'Rinoplasti',
    en: 'Rhinoplasty',
  },
  septorinoplasti: {
    tr: 'Septorinoplasti',
    en: 'Septorhinoplasty',
  },
  endolift: {
    tr: 'Endolift Lazer',
    en: 'Endolift Laser',
  },
  botoks: {
    tr: 'Botoks',
    en: 'Botox',
  },
  dolgu: {
    tr: 'Dolgu Uygulamaları',
    en: 'Filler Treatments',
  },
  'ip-aski': {
    tr: 'İp Askılama',
    en: 'Thread Lift',
  },
};

const DESCRIPTION_BY_SLUG: Record<string, Partial<Record<Locale, string>> & { tr: string; en: string }> = {
  'badem-gz-estetii': {
    tr: 'Göz çevresinde daha canlı, açık ve çekik bir ifade hedefleyen kişiye özel estetik planlama.',
    en: 'A personalized approach for a brighter, more lifted almond-shaped eye expression.',
  },
  'ple-ka-kaldrma': {
    tr: 'Kaş hattını ameliyatsız desteklemeye ve bakışlara daha dinamik bir görünüm kazandırmaya yönelik ip askı uygulaması.',
    en: 'A non-surgical thread technique designed to support the brow line and refresh the gaze.',
  },
  'gd-liposuction': {
    tr: 'Çene altı ve boyun geçişinde daha net bir kontür elde etmeye yönelik gıdı bölgesi yağ alma uygulaması.',
    en: 'A contouring procedure for a sharper transition between the chin and neck.',
  },
  'page-20': {
    tr: 'Yüz ovalini ve orta-alt yüz hattını desteklemek için planlanan ameliyatsız ip askılama yaklaşımı.',
    en: 'A non-surgical thread lifting approach planned to support the facial oval and lower face.',
  },
  'page-44': {
    tr: 'Kaş pozisyonunu ve bakış ifadesini botoks ile daha dengeli hale getirmeye yönelik medikal estetik uygulama.',
    en: 'A medical aesthetic treatment using Botox to create a more balanced brow position.',
  },
  'revizyon-rinoplasti': {
    tr: 'Daha önce burun ameliyatı geçirmiş hastalarda estetik ve fonksiyonel ihtiyaçların birlikte değerlendirildiği ikinci planlama.',
    en: 'Secondary nasal surgery planning that evaluates both aesthetic and functional needs.',
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
