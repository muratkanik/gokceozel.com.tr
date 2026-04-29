export type OldSiteMediaItem = {
  name: string;
  url: string;
  category: 'Hizmet' | 'Galeri';
  source: string;
};

export const OLD_SITE_SERVICE_IMAGES: Record<string, string> = {
  'rinoplasti': '/images/content/service-02.jpg',
  'septorinoplasti': '/images/content/service-02.jpg',
  'revizyon-rinoplasti': '/images/content/service-02.jpg',

  'gz-kapa-estetii': '/old-site/services/goz-kapagi-estetigi.png',
  'blefaroplasti': '/old-site/services/goz-kapagi-estetigi.png',
  'alt-blefaroplasti': '/old-site/services/goz-kapagi-estetigi.png',
  'ust-blefaroplasti': '/old-site/services/goz-kapagi-estetigi.png',
  'badem-gz-estetii': '/old-site/services/goz-kapagi-estetigi.png',

  'endolift': '/old-site/services/endolift-lazer.png',
  'endolift-lazer': '/old-site/services/endolift-lazer.png',
  'lazerle-yuz-germe': '/old-site/services/endolift-lazer.png',

  'botoks': '/old-site/services/botoks.png',
  'page-44': '/old-site/services/botoks.png',

  'dolgu': '/old-site/services/dolgu.jpg',
  'dudak-dolgusu': '/old-site/services/dudak-dolgusu.png',
  'dudak-kaldirma': '/old-site/services/dudak-dolgusu.png',
  'dolgu-ile-kas-kaldirma': '/old-site/services/dolgu-ile-kas-kaldirma.png',

  'ip-aski': '/old-site/services/ip-aski.png',
  'page-20': '/old-site/services/ip-aski.png',
  'ip-ile-yuz-askılama': '/old-site/services/ip-aski.png',
  'ple-ka-kaldrma': '/old-site/services/iple-kas-kaldirma.png',
  'iple-kas-kaldirma': '/old-site/services/iple-kas-kaldirma.png',

  'kas-kaldirma': '/old-site/services/kas-kaldirma.png',
  'ameliyatsiz-kas-kaldirma': '/old-site/services/ameliyatsiz-kas-kaldirma.png',

  'kepce-kulak': '/old-site/services/otoplasti.png',
  'otoplasti': '/old-site/services/otoplasti.png',

  'prp': '/old-site/services/cilt-yenileme.png',
  'mezoterapi': '/old-site/services/mezoterapi.png',
  'cilt-yenileme': '/old-site/services/cilt-yenileme.png',

  'gd-liposuction': '/old-site/services/endolift-lazer.png',
};

export const OLD_SITE_MEDIA: OldSiteMediaItem[] = [
  { name: 'Göz Kapağı Estetiği', url: '/old-site/services/goz-kapagi-estetigi.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/gozaltiisik.png' },
  { name: 'İple Kaş Kaldırma', url: '/old-site/services/iple-kas-kaldirma.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/ipekkas.png' },
  { name: 'Kaş Kaldırma', url: '/old-site/services/kas-kaldirma.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/kaskaldirma.png' },
  { name: 'Ameliyatsız Kaş Kaldırma', url: '/old-site/services/ameliyatsiz-kas-kaldirma.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/sizkaskaldir.png' },
  { name: 'Dolgu ile Kaş Kaldırma', url: '/old-site/services/dolgu-ile-kas-kaldirma.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/dolgukas.png' },
  { name: 'Botoks', url: '/old-site/services/botoks.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/botillinhum.png' },
  { name: 'Dolgu Uygulamaları', url: '/old-site/services/dolgu.jpg', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/dolgu.jpg' },
  { name: 'Dudak Dolgusu', url: '/old-site/services/dudak-dolgusu.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/dudakdolgusu.png' },
  { name: 'Mezoterapi', url: '/old-site/services/mezoterapi.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/images/mezoterapi.png' },
  { name: 'Endolift Lazer', url: '/old-site/services/endolift-lazer.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/dosya/endolift_lazer.png' },
  { name: 'İp Askı', url: '/old-site/services/ip-aski.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/dosya/ip_aski.png' },
  { name: 'Otoplasti', url: '/old-site/services/otoplasti.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/dosya/otoplasti.png' },
  { name: 'Cilt Yenileme', url: '/old-site/services/cilt-yenileme.png', category: 'Hizmet', source: 'archive/site_backup/public_html/yonetim/dosya/cilt_yenileme.png' },
  { name: 'Yüz Estetiği Uygulama Görseli', url: '/old-site/gallery/yuz-estetigi-uygulama.png', category: 'Galeri', source: 'archive/site_backup/public_html/yonetim/dosya/369a81fc12eyalcin.png' },
  { name: 'Gökçe Özel Eski Banner', url: '/old-site/gallery/gokce-banner.jpg', category: 'Galeri', source: 'archive/site_backup/public_html/yonetim/images/gokcebanner.jpg' },
  { name: 'Blog Kapak 1', url: '/old-site/blog/blog-img-1.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-img-1.jpg' },
  { name: 'Blog Kapak 2', url: '/old-site/blog/blog-img-2.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-img-2.jpg' },
  { name: 'Blog Kapak 3', url: '/old-site/blog/blog-img-3.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-img-3.jpg' },
  { name: 'Blog Kapak 4', url: '/old-site/blog/blog-img-4.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-img-4.jpg' },
  { name: 'Blog Öne Çıkan 1', url: '/old-site/blog/blog-featured-1.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-featured-1.jpg' },
  { name: 'Blog Öne Çıkan 2', url: '/old-site/blog/blog-featured-2.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-featured-2.jpg' },
  { name: 'Blog Öne Çıkan 3', url: '/old-site/blog/blog-featured-3.jpg', category: 'Galeri', source: 'archive/site_backup/blog/blog-post-featured-3.jpg' },
];
