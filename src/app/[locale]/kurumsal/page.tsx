import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 60;

const SEO_BASE_URL = 'https://gokceozel.com.tr';
const SEO_LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const seoUrl = (loc: string) => (loc === 'tr' ? `${SEO_BASE_URL}/kurumsal` : `${SEO_BASE_URL}/${loc}/kurumsal`);

// Self-referencing canonical + hreflang (layout default points every page at the home page).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = { 'x-default': seoUrl('tr') };
  SEO_LOCALES.forEach((loc) => {
    languages[loc] = seoUrl(loc);
  });
  return {
    alternates: {
      canonical: seoUrl(locale),
      languages,
    },
  };
}

export default async function KurumsalPage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from('content_entries')
    .select('*')
    .eq('slug', 'prof-dr-gokce-ozel-klinigi')
    .single();

  const title = page?.translations?.tr?.title || 'Prof. Dr. Gökçe Özel Kliniği';
  const content = page?.translations?.tr?.content || '<p>Kliniğimiz hakkında detaylı bilgi yakında eklenecektir.</p>';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#d4af37] tracking-tight leading-tight text-center">
          {title}
        </h1>
        
        <div className="bg-[#141414] rounded-2xl p-8 md:p-12 border border-[#2a2a2a] prose prose-invert prose-lg max-w-none prose-headings:text-[#d4af37]">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </main>
  );
}
