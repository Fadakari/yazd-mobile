import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      { protocol: "https", hostname: "artakalaa.com" },
      { protocol: "https", hostname: "api.artakalaa.ir" },
      { protocol: "https", hostname: "api.artakalaa.com" },
      {
        protocol: "https",
        hostname: "api.yazd-mobile.ir",
      },
      { protocol: "https", hostname: "mobilerafie.ir" },
      // --- موارد جدید اضافه شده ---
      { protocol: "https", hostname: "images.unsplash.com" }, // برای عکس‌های بلاگ
      { protocol: "https", hostname: "api.dicebear.com" }, // برای آواتار نویسنده‌ها
      {
        protocol: "https",
        hostname: "api.yazd-mobile.irir",
      },
      {
        protocol: "https",
        hostname: "api.valiasrstore.com",
      }
    ],
  },
};

export default nextConfig;
