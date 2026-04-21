import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gokceozel.com.tr';
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: entries } = await supabase
    .from('content_entries')
    .select('slug, type, updated_at');

  const locales = ['tr', 'en', 'de', 'ar', 'fr', 'ru'];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  const staticRoutes = ['', '/iletisim', '/kurumsal'];
  
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // Dynamic routes
  if (entries) {
    entries.forEach((entry) => {
      locales.forEach((locale) => {
        let basePath = '';
        if (entry.type === 'blog') basePath = '/blog';
        else if (entry.type === 'service') basePath = '/hizmetler';
        else if (entry.type === 'page') basePath = '/kurumsal';

        if (basePath) {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}${basePath}/${entry.slug}`,
            lastModified: new Date(entry.updated_at || new Date()),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      });
    });
  }

  return sitemapEntries;
}
