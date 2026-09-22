import prisma from '@/lib/prisma';
import ClientPage from './ClientPage';
import type { Metadata } from 'next';

export const revalidate = 60; // 1 minute revalidation

const SEO_BASE_URL = 'https://gokceozel.com.tr';
const SEO_LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const seoUrl = (loc: string) => (loc === 'tr' ? `${SEO_BASE_URL}/iletisim` : `${SEO_BASE_URL}/${loc}/iletisim`);

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

export default async function IletisimPage({ params }: { params: Promise<{ locale: string }> }) {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['contact_address', 'contact_phone', 'contact_email', 'contact_lat', 'contact_lng']
      }
    }
  });

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return <ClientPage params={params} settings={settingsMap} />;
}
