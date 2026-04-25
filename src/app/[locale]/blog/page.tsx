import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60;

const BLOG_COVERS = [
  '/images/gokceozel.png',
  '/images/content/service-04.jpg',
  '/images/content/service-05.jpg',
  '/images/content/service-06.jpg',
  '/images/content/service-07.jpg',
  '/images/content/service-08.jpg',
];

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const posts = await prisma.page.findMany({
    where: { type: 'BLOG' },
    include: { seoMeta: true },
    orderBy: { createdAt: 'desc' },
  });

  const heading: Record<string, string> = {
    tr: 'Blog & Makaleler', en: 'Blog & Articles',
    ar: 'المدونة والمقالات', ru: 'Блог и статьи',
    fr: 'Blog & Articles', de: 'Blog & Artikel',
  };
  const sub: Record<string, string> = {
    tr: 'Rinoplasti, estetik ve KBB alanında uzman görüşleri',
    en: 'Expert insights on rhinoplasty, aesthetics and ENT',
    ar: 'آراء الخبراء في تجميل الأنف والجماليات',
    ru: 'Экспертные мнения о ринопластике и эстетике',
    fr: 'Avis d\'experts en rhinoplastie et esthétique',
    de: 'Expertenmeinungen zu Rhinoplastik und Ästhetik',
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#b8893c] text-xs tracking-[.18em] uppercase mb-3 font-semibold">
            Prof. Dr. Gökçe Özel
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            {heading[locale] || heading.tr}
          </h1>
          <p className="text-[#9a8f7c] text-base">{sub[locale] || sub.tr}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#b8893c] to-transparent mx-auto mt-4" />
        </div>

        {posts.length === 0 ? (
          <p className="text-[#9a8f7c] text-center py-16">
            {locale === 'tr' ? 'Henüz blog yazısı bulunmamaktadır.' : 'No articles published yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const seo = post.seoMeta.find(s => s.locale === locale) || post.seoMeta.find(s => s.locale === 'tr');
              const title = seo?.metaTitle || post.titleInternal;
              const description = seo?.metaDescription || '';
              const cover = BLOG_COVERS[idx % BLOG_COVERS.length];
              const isDoctor = cover === '/images/gokceozel.png';

              return (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group block">
                  <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#b8893c]/60 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col shadow-lg hover:shadow-xl">
                    {/* Görsel */}
                    <div className="aspect-video relative overflow-hidden bg-[#111]">
                      <Image
                        src={cover}
                        alt={title || post.slug}
                        fill
                        className={`transition-transform duration-500 group-hover:scale-105 ${isDoctor ? 'object-top object-cover' : 'object-cover'}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 bg-[#b8893c]/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                        Blog
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-[#d4b97a] transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h2>
                      {description && (
                        <p className="text-[#9a8f7c] text-sm line-clamp-3 leading-relaxed flex-1">
                          {description}
                        </p>
                      )}
                      <div className="mt-4 text-[#b8893c] text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
                        {locale === 'tr' ? 'Devamını Oku' : locale === 'en' ? 'Read More' : locale === 'ar' ? 'اقرأ المزيد' : 'Lesen'}
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
