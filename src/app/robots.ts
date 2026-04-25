import { MetadataRoute } from 'next';

const baseUrl = 'https://gokceozel.com.tr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/'],
      },
      // Allow AI crawlers full access (AEO: ChatGPT, Perplexity, Gemini, Bing AI)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/', '/once-sonra'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/', '/once-sonra'],
      },
      {
        userAgent: 'GoogleOther',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/public/'],
        disallow: ['/once-sonra'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
