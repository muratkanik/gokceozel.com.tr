import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('content_entries')
    .select('*')
    .eq('type', 'blog')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-[#d4af37] text-center tracking-tight">Blog & Makaleler</h1>
        
        {error ? (
          <p className="text-red-500">İçerik yüklenirken hata oluştu.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-video bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                     <span className="text-[#333] text-4xl">GÖ</span>
                     <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                      {post.translations?.tr?.title || post.slug}
                    </h2>
                    <div 
                      className="text-gray-400 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.translations?.tr?.content?.substring(0, 150) + '...' }}
                    />
                  </div>
                </div>
              </Link>
            ))}
            {posts?.length === 0 && (
                <p className="text-gray-400 col-span-full text-center py-12">Henüz blog yazısı bulunmamaktadır.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
