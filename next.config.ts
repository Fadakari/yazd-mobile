import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  experimental: {
    // جلوگیری از گیر کردن کش در سطح روتینگ کلاینت و هماهنگی ۳۰ ثانیه‌ای
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
    // این گزینه از تلاش نکست برای لود کردنِ ماژول‌های پویا مثل postcss در حالتِ standalone جلوگیری می‌کند
    optimizePackageImports: [],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "api.akhoondigroup.ir" },
      { protocol: "https", hostname: "akhoondigroup.ir" },
      { protocol: "https", hostname: "valiasrstore.com" },
      { protocol: "https", hostname: "api.valiasrstore.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "api.hafezdaroo.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(eitaa.png|eitaa.svg|logo.png|favicon.ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
