import { OLD_SITE_SERVICE_IMAGES } from './old-site-media';

const GENERIC_BLOG_COVERS = [
  '/old-site/blog/blog-featured-1.jpg',
  '/old-site/blog/blog-featured-2.jpg',
  '/old-site/blog/blog-featured-3.jpg',
  '/old-site/blog/blog-img-1.jpg',
  '/old-site/blog/blog-img-2.jpg',
  '/old-site/blog/blog-img-3.jpg',
  '/old-site/blog/blog-img-4.jpg',
  '/old-site/gallery/yuz-estetigi-uygulama.png',
  '/old-site/gallery/gokce-banner.jpg',
  '/images/gokceozel.png',
];

const KEYWORD_COVERS: Array<{ pattern: RegExp; cover: string }> = [
  { pattern: /rinoplasti|septorinoplasti|revizyon|burun|nose|nasal/i, cover: OLD_SITE_SERVICE_IMAGES.rinoplasti },
  { pattern: /endolift|lazer|laser|sıkılaş|germe|yüz germe|face.?lift/i, cover: OLD_SITE_SERVICE_IMAGES.endolift },
  { pattern: /göz|goz|kapak|blefaro|badem|eye|eyelid/i, cover: OLD_SITE_SERVICE_IMAGES['gz-kapa-estetii'] },
  { pattern: /kaş|kas|brow/i, cover: OLD_SITE_SERVICE_IMAGES['ple-ka-kaldrma'] },
  { pattern: /botoks|botox|migren|terleme/i, cover: OLD_SITE_SERVICE_IMAGES.botoks },
  { pattern: /dolgu|filler|dudak|lip/i, cover: OLD_SITE_SERVICE_IMAGES.dolgu },
  { pattern: /ip ask|iple|thread/i, cover: OLD_SITE_SERVICE_IMAGES['ip-aski'] },
  { pattern: /kulak|otoplasti|ear/i, cover: OLD_SITE_SERVICE_IMAGES.otoplasti },
  { pattern: /prp|mezoterapi|cilt|peeling|leke|scar|skar|yara|skin/i, cover: OLD_SITE_SERVICE_IMAGES['cilt-yenileme'] },
  { pattern: /gıdı|gidi|liposuction|lipoliz|çene|cene|jaw|chin/i, cover: OLD_SITE_SERVICE_IMAGES['gd-liposuction'] },
  { pattern: /ameliyat|operasyon|cerrahi|surgery|surgical|hastane|klinik|clinic|nerede|işlemim|lemim/i, cover: '/old-site/blog/blog-featured-2.jpg' },
  { pattern: /psikoloji|psychology|etkiliyor|ruh|mental|neden|tercih|karar/i, cover: '/old-site/blog/blog-featured-3.jpg' },
  { pattern: /yüz|yuz|yz|estetik|estetii|prosedür|prosedrl|prosedürleri|face|facial/i, cover: '/old-site/gallery/yuz-estetigi-uygulama.png' },
  { pattern: /gökçe|gokce|doktor|prof|hakkında|kimdir|doctor/i, cover: '/images/gokceozel.png' },
];

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

  const match = KEYWORD_COVERS.find((item) => item.pattern.test(haystack));
  if (match) return match.cover;

  return GENERIC_BLOG_COVERS[index % GENERIC_BLOG_COVERS.length];
}
