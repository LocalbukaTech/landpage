import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/secure-login/', '/api/'],
    },
    sitemap: 'https://localbuka.com/sitemap.xml',
  };
}
