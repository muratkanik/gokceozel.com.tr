import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const video = await prisma.video.findUnique({ where: { slug } });
  
  if (!video) return { title: 'Bulunamadı | Prof. Dr. Gökçe Özel' };

  const localizedTitle = ((video.translations as any)?.[locale]?.title) || video.title;

  return {
    title: `${localizedTitle} | Prof. Dr. Gökçe Özel`,
    description: localizedTitle,
    openGraph: {
      images: [`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`],
    }
  };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const video = await prisma.video.findUnique({
    where: { slug }
  });

  if (!video || !video.isActive) {
    notFound();
  }

  const localizedTitle = ((video.translations as any)?.[locale]?.title) || video.title;
  // The contentHtml is from our admin panel, so it's trusted.
  const localizedContentHtml = ((video.translations as any)?.[locale]?.contentHtml) || video.contentHtml || '';

  return (
    <div className="bg-[#fcfbf9] min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          href={`/${locale}/videolar`}
          className="inline-flex items-center gap-2 text-[#887865] hover:text-[#b8893c] font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Videolara Dön
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e0d8c8]">
          {/* YouTube Embed */}
          <div className="relative aspect-video w-full bg-black">
            <iframe 
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={localizedTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            ></iframe>
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#1a1410] mb-8 leading-tight">
              {localizedTitle}
            </h1>

            {localizedContentHtml && (
              <div 
                className="prose prose-lg prose-amber max-w-none text-[#4a3f35] leading-relaxed
                  prose-headings:font-serif prose-headings:font-semibold prose-headings:text-[#1a1410]
                  prose-a:text-[#b8893c] hover:prose-a:text-[#8f6a2e]
                  prose-strong:text-[#1a1410] prose-strong:font-semibold
                  prose-ul:list-disc prose-ol:list-decimal"
                dangerouslySetInnerHTML={{ __html: localizedContentHtml }}
              />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
