import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('content_entries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) return { title: 'Bulunamadı' };

  // Fallback to 'tr' if language translation doesn't exist
  const trans = post.translations?.[lang] || post.translations?.tr;
  return {
    title: trans?.seo_title || trans?.title || post.slug,
    description: trans?.seo_description,
    openGraph: {
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('content_entries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) {
    notFound();
  }

  const trans = post.translations?.[lang] || post.translations?.tr;
  const title = trans?.title || post.slug;
  const content = trans?.content || '';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href={`/${lang}/blog`} className="text-[#d4af37] hover:text-white transition-colors mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-wider">
          &larr; {lang === 'tr' ? 'Bloga Dön' : 'Back to Blog'}
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight leading-tight">
          {title}
        </h1>
        
        {post.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a2a]">
            <img src={post.image_url} alt={title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
        
        <div className="bg-[#141414] rounded-2xl p-8 md:p-12 border border-[#2a2a2a] prose prose-invert prose-lg max-w-none prose-headings:text-[#d4af37] prose-a:text-[#d4af37] hover:prose-a:text-white">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </main>
  );
}
