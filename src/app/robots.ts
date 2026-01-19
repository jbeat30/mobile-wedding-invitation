import type { MetadataRoute } from 'next';

/**
 * 크롤러 접근 차단
 * @returns MetadataRoute.Robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
