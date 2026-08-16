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
      { protocol: 'https', hostname: 'abajstore.ir' },
      { protocol: 'https', hostname: 'api.abajstore.ir' },
      { protocol: 'https', hostname: 'api.abajstore.ir' },
      {
        protocol: 'https',
        hostname: 'api.abajstore.ir',
      },
      { protocol: 'https', hostname: 'abajstore.ir' },
      // --- موارد جدید اضافه شده ---
      { protocol: 'https', hostname: 'images.unsplash.com' }, // برای عکس‌های بلاگ
      { protocol: 'https', hostname: 'api.dicebear.com' },   // برای آواتار نویسنده‌ها
      {
        protocol: "https",
        hostname: "api.abajstore.ir", 
      },
    ],
  },
};

export default nextConfig;
