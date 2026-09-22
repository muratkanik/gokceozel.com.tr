import { OLD_SITE_SERVICE_IMAGES } from './old-site-media';

const GENERIC_BLOG_COVERS = [
  OLD_SITE_SERVICE_IMAGES.rinoplasti,
  OLD_SITE_SERVICE_IMAGES['revizyon-rinoplasti'],
  OLD_SITE_SERVICE_IMAGES.sinuzit,
  OLD_SITE_SERVICE_IMAGES.endolift,
  OLD_SITE_SERVICE_IMAGES['gz-kapa-estetii'],
  OLD_SITE_SERVICE_IMAGES['ple-ka-kaldrma'],
  OLD_SITE_SERVICE_IMAGES.botoks,
  OLD_SITE_SERVICE_IMAGES['dudak-dolgusu'],
  OLD_SITE_SERVICE_IMAGES.mezoterapi,
  OLD_SITE_SERVICE_IMAGES['ip-aski'],
  OLD_SITE_SERVICE_IMAGES['cilt-yenileme'],
  OLD_SITE_SERVICE_IMAGES.otoplasti,
];

const KEYWORD_COVER_POOLS: Array<{ pattern: RegExp; covers: string[] }> = [
  {
    pattern: /revizyon|revision/i,
    covers: [OLD_SITE_SERVICE_IMAGES['revizyon-rinoplasti'], OLD_SITE_SERVICE_IMAGES.rinoplasti],
  },
  {
    pattern: /rinoplasti|septorinoplasti|burun|nefes|nose|nasal/i,
    covers: [
      OLD_SITE_SERVICE_IMAGES.rinoplasti,
      OLD_SITE_SERVICE_IMAGES['revizyon-rinoplasti'],
      OLD_SITE_SERVICE_IMAGES.sinuzit,
      '/images/gokcebanner.jpg',
      '/images/drgo_21.jpg',
    ],
  },
  {
    pattern: /endolift|lazer|laser|sıkılaş|germe|yüz germe|face.?lift/i,
    covers: [OLD_SITE_SERVICE_IMAGES.endolift, OLD_SITE_SERVICE_IMAGES['ip-aski']],
  },
  {
    pattern: /göz|goz|kapak|blefaro|badem|eye|eyelid/i,
    covers: [
      OLD_SITE_SERVICE_IMAGES['gz-kapa-estetii'],
      OLD_SITE_SERVICE_IMAGES['ple-ka-kaldrma'],
      OLD_SITE_SERVICE_IMAGES['ameliyatsiz-kas-kaldirma'],
    ],
  },
  {
    pattern: /kaş|kas|brow/i,
    covers: [
      OLD_SITE_SERVICE_IMAGES['ple-ka-kaldrma'],
      OLD_SITE_SERVICE_IMAGES['kas-kaldirma'],
      OLD_SITE_SERVICE_IMAGES['ameliyatsiz-kas-kaldirma'],
      OLD_SITE_SERVICE_IMAGES['dolgu-ile-kas-kaldirma'],
    ],
  },
  { pattern: /botoks|botox|migren|terleme/i, covers: [OLD_SITE_SERVICE_IMAGES.botoks, '/images/migren.png'] },
  { pattern: /dudak|lip/i, covers: [OLD_SITE_SERVICE_IMAGES['dudak-dolgusu'], OLD_SITE_SERVICE_IMAGES.dolgu] },
  {
    pattern: /dolgu|filler/i,
    covers: [OLD_SITE_SERVICE_IMAGES.dolgu, OLD_SITE_SERVICE_IMAGES['dudak-dolgusu'], OLD_SITE_SERVICE_IMAGES['dolgu-ile-kas-kaldirma']],
  },
  { pattern: /ip ask|iple|thread/i, covers: [OLD_SITE_SERVICE_IMAGES['ip-aski'], OLD_SITE_SERVICE_IMAGES['ple-ka-kaldrma']] },
  { pattern: /kulak|otoplasti|ear/i, covers: [OLD_SITE_SERVICE_IMAGES.otoplasti] },
  {
    pattern: /mezoterapi/i,
    covers: [OLD_SITE_SERVICE_IMAGES.mezoterapi, OLD_SITE_SERVICE_IMAGES['cilt-yenileme']],
  },
  {
    pattern: /prp|cilt|peeling|leke|scar|skar|yara|skin/i,
    covers: [OLD_SITE_SERVICE_IMAGES['cilt-yenileme'], OLD_SITE_SERVICE_IMAGES.mezoterapi],
  },
  { pattern: /gıdı|gidi|liposuction|lipoliz|çene|cene|jaw|chin/i, covers: [OLD_SITE_SERVICE_IMAGES.endolift, OLD_SITE_SERVICE_IMAGES.dolgu] },
  { pattern: /ameliyat|operasyon|cerrahi|surgery|surgical|hastane|klinik|clinic|nerede|işlemim|lemim/i, covers: ['/images/gokcebanner.jpg', '/images/drgo_21.jpg', OLD_SITE_SERVICE_IMAGES['revizyon-rinoplasti']] },
  { pattern: /psikoloji|psychology|etkiliyor|ruh|mental|neden|tercih|karar/i, covers: [OLD_SITE_SERVICE_IMAGES['cilt-yenileme'], OLD_SITE_SERVICE_IMAGES.endolift] },
  { pattern: /yüz|yuz|yz|estetik|estetii|prosedür|prosedrl|prosedürleri|face|facial/i, covers: [OLD_SITE_SERVICE_IMAGES.endolift, OLD_SITE_SERVICE_IMAGES['ip-aski'], OLD_SITE_SERVICE_IMAGES['cilt-yenileme']] },
  { pattern: /gökçe|gokce|doktor|prof|hakkında|kimdir|doctor/i, covers: ['/images/gokceozel.png', '/images/gokcebanner.jpg'] },
];

function stableIndex(seed: string, size: number) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) - hash + seed.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) % size;
}

export function blogCoverFor(input: {
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
}, index = 0) {
  if (input.ogImage) return input.ogImage;

  const haystack = [input.slug, input.title, input.description]
    .filter(Boolean)
    .join(' ');

  const match = KEYWORD_COVER_POOLS.find((item) => item.pattern.test(haystack));
  if (match) return match.covers[stableIndex(haystack, match.covers.length)];

  return GENERIC_BLOG_COVERS[index % GENERIC_BLOG_COVERS.length];
}
