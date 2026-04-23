import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const supabase = await createClient();
  const { data: entries } = await supabase
    .from('content_entries')
    .select('slug, type, translations:content_translations(title, excerpt)')
    .in('type', ['blog', 'service']);

  if (!entries) return NextResponse.json({ posts: [] });

  const posts = entries.map(entry => {
    const trTranslation = entry.translations?.find((t: any) => t.locale === 'tr') || entry.translations?.[0];
    const title = trTranslation?.title || entry.slug;
    const category = entry.type === 'service' ? 'Hizmet' : 'Blog';
    
    // Simple relevance score
    let score = 0;
    if (q) {
      if (title.toLowerCase().includes(q)) score += 5;
      if (entry.slug.includes(q)) score += 3;
    }

    return {
      slug: entry.slug,
      title,
      category,
      excerpt: trTranslation?.excerpt,
      score
    };
  }).filter(p => !q || p.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const { targetSlug, blogData } = await req.json();
    const supabase = await createClient();

    let slug = targetSlug;
    let isNew = false;

    if (!slug) {
      // Create new
      isNew = true;
      slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const { error: insertError } = await supabase.from('content_entries').insert({
        slug,
        type: 'blog',
        is_active: true
      });
      if (insertError) throw insertError;
    }

    // Upsert translation
    const { error: trError } = await supabase.from('content_translations').upsert({
      entry_slug: slug,
      locale: 'tr',
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      meta_title: blogData.metaTitle,
      meta_description: blogData.metaDescription,
      keywords: blogData.seoKeyword,
    }, { onConflict: 'entry_slug, locale' });
    
    if (trError) throw trError;

    return NextResponse.json({ success: true, slug, isNew });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
