"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft, Flame } from "lucide-react";

interface BannerItem {
  id: number;
  image: string;
  link?: string;
  title?: string;
  alt?: string;
}

interface Props {
  banners?: BannerItem[];
  defaultBanner?: string;
}

export default function AdaptiveHeroStage({ banners, defaultBanner = "/images/brand/hero-banner.webp" }: Props) {
  const activeBanners: BannerItem[] =
    banners && banners.length > 0
      ? banners
      : [
          {
            id: 1,
            image: defaultBanner,
            title: "ستاره‌ی طعم‌های خوشمزه! • صنایع غذایی خوش طعم",
            link: "/products",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <section className="w-full pt-4 pb-8 md:pt-6 md:pb-12" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* The Adaptive Banner Stage */}
        <div className="relative rounded-3xl overflow-hidden bg-[#18181b] border-2 border-zinc-800/80 shadow-2xl">
          
          {/* 1. Ambient Dynamic Backdrop (takes the banner's own colors and blurs them) */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-35 scale-110 pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          />

          {/* 2. Top Stage Bar */}
          <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-zinc-950/70 backdrop-blur-md border-b border-zinc-800/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-black text-zinc-200 tracking-tight">
                صنایع غذایی خوش طعم کماشدون
              </span>
              <span className="hidden sm:inline-block text-zinc-500">•</span>
              <span className="hidden sm:inline-block text-amber-400 font-bold">
                Since 1998 • اصالت و کیفیت ماندگار
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-400 hidden md:inline-block">
                طعم اصیل سوخاری و چاشنی‌های ناب
              </span>
              {activeBanners.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevBanner}
                    aria-label="بنر قبلی"
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                  <span className="text-[11px] font-mono text-zinc-400 px-1">
                    {(currentIndex + 1).toLocaleString("fa-IR")} / {activeBanners.length.toLocaleString("fa-IR")}
                  </span>
                  <button
                    onClick={nextBanner}
                    aria-label="بنر بعدی"
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. The Natural-Ratio Banner Canvas */}
          <div className="relative z-10 w-full flex items-center justify-center p-2 sm:p-4 md:p-6 min-h-[240px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[480px]">
            <Link
              href={currentBanner.link || "/products"}
              className="block relative w-full h-auto max-h-[640px] group transition-transform duration-500"
            >
              {/* Responsive Natural Aspect Ratio Container */}
              <img
                src={currentBanner.image}
                alt={currentBanner.alt || currentBanner.title || "بنر رسمی خوش طعم"}
                className="w-full h-auto max-h-[600px] object-contain mx-auto rounded-2xl shadow-xl border border-zinc-700/40 group-hover:scale-[1.008] transition-transform duration-500"
              />
            </Link>
          </div>

          {/* 4. Bottom Tactical Navigation Strip */}
          <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-800/80 divide-x-reverse border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
            <Link
              href="/products?category_id=2"
              className="px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors group text-center"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
              <span>دنیای پودر سوخاری پولکی</span>
            </Link>
            <Link
              href="/products?category_id=2"
              className="px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors group text-center"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
              <span>پودر کتلت سویا و برگر</span>
            </Link>
            <Link
              href="/products?category_id=3"
              className="px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors group text-center"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
              <span>ادویه‌جات خالص و چاشنی‌ها</span>
            </Link>
            <Link
              href="/products?category_id=1"
              className="px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors group text-center"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              <span>سبزیجات معطر خشک</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
