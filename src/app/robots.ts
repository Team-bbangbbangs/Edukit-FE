import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/signup', '/find-password', '/verify-email'],
    },
    sitemap: 'https://edukit.co.kr/sitemap.xml',
  };
}
