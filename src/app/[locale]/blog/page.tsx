import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { blogCoverFor } from '@/lib/blog-cover';

export const revalidate = 60;
const localePath = (locale: string, path = '') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return normalized === '/' ? '/' : normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
};

const readMoreLabel: Record<string, string> = {
  tr: 'Devamını Oku',
  en: 'Read More',
  ar: 'اقرأ المزيد',
  ru: 'Читать далее',
  fr: 'Lire la suite',
  de: 'Lesen',
};

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let posts: any[] = [];
  try {
    posts = await prisma.page.findMany({
      where: { type: 'BLOG' },
      include: { seoMeta: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Blog fetch failed', e);
  }

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
    <main className="min-h-screen py-20 lg:py-24">
      <div className="container mx-auto px-5 max-w-7xl">
        <div className="text-center mb-14">
          <p className="section-kicker mb-3">
            Prof. Dr. Gökçe Özel
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-[#17201e] mb-4">
            {heading[locale] || heading.tr}
          </h1>
          <p className="text-[#61706b] text-base">{sub[locale] || sub.tr}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-[#61706b] text-center py-16">
            {locale === 'tr' ? 'Henüz blog yazısı bulunmamaktadır.' : 'No articles published yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const seo = post.seoMeta.find((s: { locale: string }) => s.locale === locale) || post.seoMeta.find((s: { locale: string }) => s.locale === 'tr');
              const title = seo?.metaTitle || post.titleInternal;
              const description = seo?.metaDescription || '';
              const cover = blogCoverFor({
                slug: post.slug,
                title,
                description,
                ogImage: seo?.ogImage,
              }, idx);
              const isDoctor = cover === '/images/gokceozel.png';

              return (
                <Link key={post.id} href={localePath(locale, `/blog/${post.slug}`)} className="group block">
                  <div className="soft-card rounded-[1.35rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden bg-[#111]">
                      <Image
                        src={cover}
                        alt={title || post.slug}
                        fill
                        className={`transition-transform duration-500 group-hover:scale-105 ${isDoctor ? 'object-top object-cover' : 'object-cover'}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101614]/55 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#17201e] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                        Blog
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-xl font-serif text-[#17201e] mb-2 group-hover:text-[#b88746] transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h2>
                      {description && (
                        <p className="text-[#61706b] text-sm line-clamp-3 leading-relaxed flex-1">
                          {description}
                        </p>
                      )}
                      <div className="mt-5 text-[#b88746] text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                        {readMoreLabel[locale] || readMoreLabel.tr}
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
