// Maps blog/service keywords to service slugs for internal cross-linking
const SERVICE_KEYWORDS: { slug: string; keywords: string[] }[] = [
  { slug: 'rinoplasti', keywords: ['rinoplasti', 'rhinoplasty', 'burun', 'nasal', 'septum', 'septorinoplasti', 'nose job'] },
  { slug: 'blefaroplasti', keywords: ['blefaroplasti', 'blepharoplasty', 'göz kapağı', 'eyelid', 'göz çevresi', 'badem göz'] },
  { slug: 'botoks', keywords: ['botoks', 'botox', 'botulinum', 'alın çizgisi', 'kaz ayağı'] },
  { slug: 'dolgu', keywords: ['dolgu', 'filler', 'hyaluronik', 'hyalüronic', 'dudak dolgu', 'lip filler'] },
  { slug: 'endolift', keywords: ['endolift', 'lazer germe', 'yağ eritme'] },
  { slug: 'yuz-germe', keywords: ['yüz germe', 'facelift', 'face lift', 'yüz-boyun'] },
  { slug: 'prp', keywords: ['prp', 'trombosit', 'platelet rich plasma', 'saç dökülmesi', 'saç prp'] },
  { slug: 'mezoterapi', keywords: ['mezoterapi', 'mesotherapy', 'cilt nemlendirme'] },
  { slug: 'kepce-kulak', keywords: ['kepçe kulak', 'otoplasti', 'otoplasty', 'kulak estetiği'] },
  { slug: 'dudak-kaldirma', keywords: ['dudak kaldırma', 'lip lift', 'bullhorn'] },
  { slug: 'ip-aski', keywords: ['ip askı', 'thread lift', 'eriyen ip'] },
  { slug: 'medikal-turizm', keywords: ['medikal turizm', 'medical tourism', 'sağlık turizmi', 'yabancı hasta', 'international patient'] },
];

export function relatedServiceSlugs(text: string, maxCount = 3): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const { slug, keywords } of SERVICE_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) {
      found.push(slug);
      if (found.length >= maxCount) break;
    }
  }
  return found;
}

export function relatedBlogKeywords(serviceSlug: string): string[] {
  const entry = SERVICE_KEYWORDS.find(s => s.slug === serviceSlug);
  return entry?.keywords ?? [];
}
