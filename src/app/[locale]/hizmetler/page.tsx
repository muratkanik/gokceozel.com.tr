import prisma from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function HizmetlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const services = await prisma.page.findMany({
    where: { type: 'SERVICE' },
    include: {
      seoMeta: true
    },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-[#d4af37] text-center tracking-tight">
          {locale === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const seo = service.seoMeta.find(s => s.locale === locale) || service.seoMeta.find(s => s.locale === 'tr');
            const title = seo?.metaTitle || service.titleInternal;
            const description = seo?.metaDescription || '';

            return (
              <Link key={service.id} href={`/${locale}/hizmetler/${service.slug}`} className="group block">
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
        </div>
      </div>
    </main>
  );
}
