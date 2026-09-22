import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Retired duplicate service pages -> newest page (keep in sync with
// RETIRED_SERVICE_SLUGS in src/lib/service-slugs.ts).
const RETIRED_SERVICES = [
  { from: 'dolgu', to: 'dolgu-islemleri', localized: { en: 'fillers', de: 'filler', fr: 'filler' } },
  { from: 'endolift', to: 'endolift-lazer', localized: { en: 'endolift-laser', de: 'endolift-laser', fr: 'laser-endolift' } },
];
const SERVICE_SEGMENT = { en: 'services', ar: 'services', ru: 'services', de: 'leistungen', fr: 'soins' };

function retiredServiceRedirects() {
  const out = [];
  for (const { from, to, localized } of RETIRED_SERVICES) {
    out.push({ source: `/hizmetler/${from}`, destination: `/hizmetler/${to}`, permanent: true });
    out.push({ source: `/tr/hizmetler/${from}`, destination: `/hizmetler/${to}`, permanent: true });
    for (const [locale, segment] of Object.entries(SERVICE_SEGMENT)) {
      const localizedFrom = localized[locale] || localized.en;
      const destination = `/${locale}/${segment}/${to}`;
      for (const oldSlug of new Set([from, localizedFrom])) {
        out.push({ source: `/${locale}/hizmetler/${oldSlug}`, destination, permanent: true });
        out.push({ source: `/${locale}/${segment}/${oldSlug}`, destination, permanent: true });
      }
    }
  }
  return out;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  typescript: { ignoreBuildErrors: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'gokceozel.com.tr' },
    ],
  },
  // Headers for SEO & security
  async redirects() {
    return [
      ...retiredServiceRedirects(),
      {
        source: '/gokce-ozel-kimdir/gokce-ozel-kimdir',
        destination: '/gokce-ozel-kimdir',
        permanent: true,
      },
      {
        source: '/gokce-ozel-kimdir/iletisim',
        destination: '/iletisim',
        permanent: true,
      },
      {
        source: '/tr/gokce-ozel-kimdir/gokce-ozel-kimdir',
        destination: '/gokce-ozel-kimdir',
        permanent: true,
      },
      {
        source: '/tr/gokce-ozel-kimdir/iletisim',
        destination: '/iletisim',
        permanent: true,
      },
      {
        source: '/rezervasyonlar',
        destination: '/admin/rezervasyonlar',
        permanent: false,
      },
      {
        source: '/tr/rezervasyonlar',
        destination: '/admin/rezervasyonlar',
        permanent: false,
      },
      {
        source: '/:locale(en|ar|ru|fr|de)/gokce-ozel-kimdir/gokce-ozel-kimdir',
        destination: '/:locale/gokce-ozel-kimdir',
        permanent: true,
      },
      {
        source: '/:locale(en|ar|ru|fr|de)/gokce-ozel-kimdir/iletisim',
        destination: '/:locale/iletisim',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
