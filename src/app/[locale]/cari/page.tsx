import CariTakipApp from '@/components/CariTakipApp';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cari Hasta Takibi | Prof. Dr. Gökçe Özel',
  description: 'Hasta cari, tahsilat, sigorta ve ödeme takip uygulaması.',
  manifest: '/cari-manifest.webmanifest',
  robots: { index: false, follow: false },
};

export default async function CariPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CariTakipApp />;
}
