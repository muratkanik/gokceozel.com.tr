import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const baseUrl = 'https://gokceozel.com.tr';
const locales = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // — Static pages —
  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
    { path: '',                 priority: 1.0, freq: 'weekly' },
    { path: '/hizmetler',      priority: 0.9, freq: 'weekly' },
    { path: '/gokce-ozel-kimdir', priority: 0.8, freq: 'monthly' },
    { path: '/blog',           priority: 0.8, freq: 'weekly' },
    { path: '/iletisim',       priority: 0.7, freq: 'monthly' },
    { path: '/kurumsal',       priority: 0.7, freq: 'monthly' },
    { path: '/sss',            priority: 0.8, freq: 'monthly' },
    { path: '/hasta-yorumlari',priority: 0.7, freq: 'monthly' },
  ];

  staticPages.forEach(({ path, priority, freq }) => {
    // Turkish canonical (no prefix)
    entries.push({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: freq, priority });
    // Other locales
    locales.filter(l => l !== 'tr').forEach(locale => {
      entries.push({ url: `${baseUrl}/${locale}${path}`, lastModified: new Date(), changeFrequency: freq, priority: +(priority * 0.9).toFixed(1) });
    });
  });

  // — Dynamic: Services (Prisma) —
  try {
    const services = await prisma.page.findMany({
      where: { type: 'SERVICE' },
      select: { slug: true, updatedAt: true },
    });
    services.forEach(({ slug, updatedAt }) => {
      entries.push({ url: `${baseUrl}/hizmetler/${slug}`, lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.85 });
      locales.filter(l => l !== 'tr').forEach(locale => {
        entries.push({ url: `${baseUrl}/${locale}/hizmetler/${slug}`, lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.75 });
      });
    });
  } catch (e) {
    console.error('sitemap: services fetch failed', e);
  }

  // — Dynamic: Blog posts (Prisma) —
  try {
    const posts = await prisma.page.findMany({
      where: { type: 'BLOG' },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    posts.forEach(({ slug, updatedAt }) => {
      entries.push({ url: `${baseUrl}/blog/${slug}`, lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.75 });
      locales.filter(l => l !== 'tr').forEach(locale => {
        entries.push({ url: `${baseUrl}/${locale}/blog/${slug}`, lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.65 });
      });
    });
  } catch (e) {
    console.error('sitemap: blog fetch failed', e);
  }

  return entries;
}
