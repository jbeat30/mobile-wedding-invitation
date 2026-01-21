import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'pub-ecba8b247b734521bfc0133916cd8ccd.r2.dev',
      },
    ],
  },
  /**
   * 모든 라우트에 검색엔진 차단 헤더를 추가
   * @returns 헤더 설정 배열
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noimageindex, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
