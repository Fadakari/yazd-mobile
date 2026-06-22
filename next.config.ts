import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'artakalaa.com' },
      { protocol: 'https', hostname: 'api.artakalaa.ir' },
      { protocol: 'https', hostname: 'api.artakalaa.com' },
      { protocol: 'https', hostname: 'api.yazd-mobile.ir' },
      { protocol: 'https', hostname: 'mobilerafie.ir' },
      // --- موارد جدید اضافه شده ---
      { protocol: 'https', hostname: 'images.unsplash.com' }, // برای عکس‌های بلاگ
      { protocol: 'https', hostname: 'api.dicebear.com' },   // برای آواتار نویسنده‌ها
    ],
    unoptimized: false
  },
};

export default nextConfig;
