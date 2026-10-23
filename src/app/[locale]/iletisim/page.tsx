import prisma from '@/lib/prisma';
import ClientPage from './ClientPage';
import type { Metadata } from 'next';

export const revalidate = 60; // 1 minute revalidation

const SEO_BASE_URL = 'https://gokceozel.com.tr';
const SEO_LOCALES = ['tr', 'en', 'ar', 'ru', 'fr', 'de'];
const seoUrl = (loc: string) => (loc === 'tr' ? `${SEO_BASE_URL}/iletisim` : `${SEO_BASE_URL}/${loc}/iletisim`);

// Sayfaya özel title/description (yinelenen ana sayfa meta'sını önler).
// Sadece tr ve en tanımlı; diğer diller layout varsayılanını kullanmaya devam eder.
const PAGE_TITLES: Record<string, string> = {
  tr: 'İletişim ve Randevu | Ankara ve Antalya - Prof. Dr. Gökçe Özel',
  en: 'Contact and Appointment | Ankara and Antalya - Prof. Dr. Gökçe Özel',
};
const PAGE_DESCRIPTIONS: Record<string, string> = {
  tr: "Prof. Dr. Gökçe Özel'in Ankara ve Antalya Lara kliniklerine ulaşın; adres, telefon ve randevu talebi için iletişim bilgileri.",
  en: "Contact details for Prof. Dr. Gökçe Özel's clinics in Ankara and Antalya Lara: address, phone and appointment requests.",
};

// Self-referencing canonical + hreflang (layout default points every page at the home page).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = { 'x-default': seoUrl('tr') };
  SEO_LOCALES.forEach((loc) => {
    languages[loc] = seoUrl(loc);
  });
  const title = PAGE_TITLES[locale];
  const description = PAGE_DESCRIPTIONS[locale];
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
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
