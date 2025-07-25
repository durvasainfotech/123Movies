import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://123moviesflix.info';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/image/',
        '/_next/data/',
        '/*.json$',
        '/*.txt$',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    
  };
}
