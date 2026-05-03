// Canonical (TR) slug → localized slugs for Latin-script locales
// AR and RU always use the EN slug
const SLUG_MAP: Record<string, { en: string; de: string; fr: string }> = {
  'rinoplasti':                              { en: 'rhinoplasty',                  de: 'rhinoplastik',                       fr: 'rhinoplastie' },
  'revizyon-rinoplasti':                     { en: 'revision-rhinoplasty',          de: 'revisions-rhinoplastik',             fr: 'revision-rhinoplastie' },
  'septorinoplasti':                         { en: 'septorhinoplasty',              de: 'septorhinoplastik',                  fr: 'septorhinoplastie' },
  'sinuzit-ameliyati':                       { en: 'sinusitis-surgery',             de: 'sinus-operation',                    fr: 'chirurgie-sinusite' },
  'goz-kapagi-estetigi':                     { en: 'eyelid-surgery',               de: 'lidkorrektur',                       fr: 'chirurgie-paupieres' },
  'alt-blefaroplasti':                       { en: 'lower-blepharoplasty',          de: 'untere-lidkorrektur',                fr: 'blepharoplastie-inferieure' },
  'kas-kaldirma':                            { en: 'upper-blepharoplasty',          de: 'obere-lidkorrektur',                 fr: 'blepharoplastie-superieure' },
  'ameliyatsiz-kas-kaldirma':                { en: 'non-surgical-brow-lift',        de: 'nicht-chirurgischer-brauenlift',     fr: 'releve-sourcils-sans-chirurgie' },
  'botoks-ile-kas-kaldirma':                 { en: 'botox-brow-lift',              de: 'botox-brauenlift',                   fr: 'botox-releve-sourcils' },
  'botulinum-toksin-uygulamasi':             { en: 'botulinum-toxin',              de: 'botulinumtoxin',                     fr: 'toxine-botulinique' },
  'botoks':                                  { en: 'botox',                         de: 'botox',                              fr: 'botox' },
  'dolgu-i-slemleri':                        { en: 'filler-treatments',            de: 'filler-behandlungen',                fr: 'injections-filler' },
  'dolgu':                                   { en: 'fillers',                       de: 'filler',                             fr: 'filler' },
  'dolgu-ile-kas-kaldirma':                  { en: 'brow-lift-filler',             de: 'brauenlift-filler',                  fr: 'releve-sourcils-filler' },
  'dudak-dolgusu':                           { en: 'lip-filler',                   de: 'lippenauffullung',                   fr: 'injection-levres' },
  'dudak-estetigi-liplift':                  { en: 'lip-lift',                     de: 'lippenkorrektur',                    fr: 'releve-levres' },
  'endolift':                                { en: 'endolift-laser',               de: 'endolift-laser',                     fr: 'laser-endolift' },
  'mezoterapi':                              { en: 'mesotherapy',                   de: 'mesotherapie',                       fr: 'mesotherapie' },
  'yuz-mezoterapisi':                        { en: 'facial-mesotherapy',            de: 'gesichts-mesotherapie',              fr: 'mesotherapie-visage' },
  'lipoliz-i-nceltme-mezoterapisi':          { en: 'lipolysis-mesotherapy',        de: 'lipolyse-mesotherapie',              fr: 'mesotherapie-lipolyse' },
  'i-ple-yuz-germe-fransiz-aski':            { en: 'thread-face-lift',             de: 'faden-lifting',                      fr: 'lifting-fils' },
  'i-ple-kas-kaldirma':                      { en: 'thread-brow-lift',             de: 'faden-brauenlift',                   fr: 'releve-sourcils-fils' },
  'gamze-estetigi':                          { en: 'dimple-surgery',               de: 'grubchen-asthetik',                  fr: 'esthetique-fossettes' },
  'kepce-kulak-estetigi-otoplasti':          { en: 'otoplasty',                    de: 'otoplastik',                         fr: 'otoplastie' },
  'prp-uygulamasi':                          { en: 'prp-treatment',                de: 'prp-behandlung',                     fr: 'traitement-prp' },
  'cilt-yenileme':                           { en: 'skin-rejuvenation',            de: 'hauterneuerung',                     fr: 'renouvellement-cutane' },
  'mikro-i-gneleme':                         { en: 'microneedling',                de: 'microneedling',                      fr: 'micro-aiguilletage' },
  'cilt-soyma-kimyasal-peeling-i-slemleri':  { en: 'chemical-peeling',             de: 'chemisches-peeling',                 fr: 'peeling-chimique' },
  'skar-revizyonu-yara-izi-estetigi':        { en: 'scar-revision',                de: 'narbenkorrektur',                    fr: 'revision-cicatrice' },
  'ozon-uygulamasi':                         { en: 'ozone-therapy',                de: 'ozon-therapie',                      fr: 'therapie-ozone' },
  'damar-icine-glutatyon-uygulamasi':        { en: 'glutathione-iv',               de: 'glutathion-iv',                      fr: 'glutathion-iv' },
  'yuz-germe-facelift':                      { en: 'facelift',                     de: 'facelift',                           fr: 'lifting-visage' },
  'bisektomi':                               { en: 'bichectomy',                   de: 'bichektomie',                        fr: 'bichectomie' },
  'cene-estetigi-mentoplasti':               { en: 'mentoplasty',                  de: 'mentoplastik',                       fr: 'mentoplastie' },
  'gidi-liposuction':                        { en: 'double-chin-liposuction',      de: 'doppelkinn-liposuktion',             fr: 'liposuccion-double-menton' },
  'badem-goz-estetigi':                      { en: 'almond-eye-aesthetics',        de: 'mandelauge-asthetik',                fr: 'esthetique-yeux-amande' },
  'goz-alti-isik-dolgusu':                   { en: 'under-eye-filler',             de: 'augenringe-filler',                  fr: 'cernes-filler' },
  'migren-tedavisi':                         { en: 'migraine-treatment',           de: 'migrane-behandlung',                 fr: 'traitement-migraine' },
};

// Build reverse map: { locale → { localizedSlug → canonicalSlug } }
const REVERSE_MAP: Partial<Record<string, Record<string, string>>> = {};
for (const [canonical, locales] of Object.entries(SLUG_MAP)) {
  for (const [lang, slug] of Object.entries(locales)) {
    if (!REVERSE_MAP[lang]) REVERSE_MAP[lang] = {};
    REVERSE_MAP[lang]![slug] = canonical;
  }
  // AR and RU use EN slug
  const enSlug = locales.en;
  for (const lang of ['ar', 'ru']) {
    if (!REVERSE_MAP[lang]) REVERSE_MAP[lang] = {};
    REVERSE_MAP[lang]![enSlug] = canonical;
  }
}

// ── Path segment translations ──────────────────────────────────────────────
const SEGMENT: Record<string, string> = {
  tr: 'hizmetler',
  en: 'services',
  de: 'leistungen',
  fr: 'soins',
  ar: 'services',
  ru: 'services',
};

/** Returns the locale-appropriate path segment for the services section */
export function hizmetlerSegment(locale: string): string {
  return SEGMENT[locale] ?? 'hizmetler';
}

/**
 * Returns the locale-specific slug for a canonical (TR) slug.
 * - EN/DE/FR: translated slug
 * - AR/RU: English slug
 * - TR: canonical slug unchanged
 */
export function localizedServiceSlug(canonicalSlug: string, locale: string): string {
  if (locale === 'tr') return canonicalSlug;
  const map = SLUG_MAP[canonicalSlug];
  if (!map) return canonicalSlug;
  if (locale === 'ar' || locale === 'ru') return map.en;
  return map[locale as 'en' | 'de' | 'fr'] ?? map.en ?? canonicalSlug;
}

/**
 * Given a (possibly localized) slug and locale, returns the canonical TR slug.
 * Returns the input unchanged if no mapping found (it may already be canonical).
 */
export function canonicalFromLocalized(localizedSlug: string, locale: string): string {
  if (locale === 'tr') return localizedSlug;
  const revLang = (locale === 'ar' || locale === 'ru') ? 'en' : locale;
  return REVERSE_MAP[revLang]?.[localizedSlug] ?? localizedSlug;
}
