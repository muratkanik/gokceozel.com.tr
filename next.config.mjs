import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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
