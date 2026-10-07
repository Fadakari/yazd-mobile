import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: true,
  experimental: {
    // این گزینه از تلاش نکست برای لود کردنِ ماژول‌های پویا مثل postcss در حالتِ standalone جلوگیری می‌کند
    optimizePackageImports: [], 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'yazd-mobile.ir' },
      { protocol: 'https', hostname: 'api.yazd-mobile.ir' },
      { protocol: 'https', hostname: 'api.yazd-mobile.ir' },
      {
        protocol: 'https',
        hostname: 'api.yazd-mobile.ir',
      },
      { protocol: 'https', hostname: 'yazd-mobile.ir' },
      // --- موارد جدید اضافه شده ---
      { protocol: 'https', hostname: 'images.unsplash.com' }, // برای عکس‌های بلاگ
      { protocol: 'https', hostname: 'api.dicebear.com' },   // برای آواتار نویسنده‌ها
      {
        protocol: "https",
        hostname: "api.yazd-mobile.ir", 
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=30, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/internal-api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
 