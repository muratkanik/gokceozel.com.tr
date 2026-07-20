import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Play, ListVideo } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: `Videolar | Prof. Dr. Gökçe Özel`,
    description: `Prof. Dr. Gökçe Özel'in YouTube kanalındaki güncel bilgilendirme videoları ve operasyon detayları.`,
  };
}

export default async function VideolarPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category;
  
  const videos = await prisma.video.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  // Group videos by playlistTitle
  const groupedVideos = videos.reduce((acc, video) => {
    const category = video.playlistTitle || 'Diğer Videolar';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(video);
    return acc;
  }, {} as Record<string, typeof videos>);

  // Sort groups: put 'Diğer Videolar' at the end, or specific order
  const categories = Object.keys(groupedVideos).sort((a, b) => {
    if (a === 'Diğer Videolar') return 1;
    if (b === 'Diğer Videolar') return -1;
    return a.localeCompare(b);
  });

  const categoriesToRender = activeCategory && categories.includes(activeCategory) 
    ? [activeCategory] 
    : categories;

  return (
    <div className="bg-[#fcfbf9] min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1a1410] mb-6">
            Video <span className="italic text-[#b8893c]">Galerisi</span>
          </h1>
          <p className="text-[#66574a] text-lg leading-relaxed">
            Operasyon süreçleri, iyileşme dönemleri ve merak edilen konular hakkında bilgilendirici videolar.
          </p>
        </header>

        {videos.length === 0 ? (
          <div className="text-center py-24 text-[#887865]">
            <p>Henüz video eklenmemiş.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex overflow-x-auto gap-3 pb-4 mb-12 scrollbar-hide justify-start md:justify-center">
              <Link 
                href={`/${locale}/videolar`} 
                scroll={false}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${!activeCategory ? 'bg-[#1a1410] text-white shadow-md' : 'bg-white text-[#66574a] border border-[#e0d8c8] hover:border-[#b8893c] hover:text-[#b8893c]'}`}
              >
                Tümü
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat} 
                  href={`/${locale}/videolar?category=${encodeURIComponent(cat)}`}
                  scroll={false}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-[#1a1410] text-white shadow-md' : 'bg-white text-[#66574a] border border-[#e0d8c8] hover:border-[#b8893c] hover:text-[#b8893c]'}`}
                >
                  {cat}
                </Link>
              ))}
            </div>

            <div className="space-y-16">
              {categoriesToRender.map((category) => (
                <section key={category}>
                  {/* Sadece "Tümü" seçiliyse kategori başlıklarını göster, yoksa gizle */}
                  {!activeCategory && (
                    <div className="flex items-center gap-3 mb-8 border-b border-[#e0d8c8] pb-4">
                      <ListVideo className="w-6 h-6 text-[#b8893c]" />
                      <h2 className="text-2xl font-serif font-semibold text-[#1a1410]">
                        {category}
                      </h2>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedVideos[category].map(video => (
                      <Link 
                        href={`/${locale}/videolar/${video.slug}`} 
                        key={video.id}
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e0d8c8]"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                            alt={video.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-[#b8893c] ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-serif font-semibold text-[#1a1410] mb-3 line-clamp-2 group-hover:text-[#b8893c] transition-colors">
                            {((video.translations as any)?.[locale]?.title) || video.title}
                          </h3>
                          <div className="mt-auto pt-4 border-t border-[#f0ebe1] flex items-center text-sm font-medium text-[#b8893c]">
                            İzle ve Oku <span className="ml-2">→</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
