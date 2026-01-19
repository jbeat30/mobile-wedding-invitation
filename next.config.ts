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
};

export default nextConfig;
