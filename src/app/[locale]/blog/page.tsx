import prisma from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const posts = await prisma.page.findMany({
    where: { type: 'BLOG' },
    include: {
      seoMeta: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-[#d4af37] text-center tracking-tight">
          {locale === 'tr' ? 'Blog' : 'Blog'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const seo = post.seoMeta.find(s => s.locale === locale) || post.seoMeta.find(s => s.locale === 'tr');
            const title = seo?.metaTitle || post.titleInternal;
            const description = seo?.metaDescription || '';

            return (
              <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group block">
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                  <div className="aspect-video bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                     <span className="text-[#333] text-4xl">GÖ</span>
                     <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
          {posts.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-12">Henüz blog yazısı bulunmamaktadır.</p>
          )}
        </div>
      </div>
    </main>
  );
}
