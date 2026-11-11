"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, Sparkles } from "lucide-react";

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

export default function HeroEditorialChapter({
  banners,
  defaultBanner = "/images/brand/hero-banner.webp",
}: Props) {
  const activeBanners: BannerItem[] =
    banners && banners.length > 0
      ? banners
      : [
          {
            id: 1,
            image: defaultBanner,
            title: "صنایع غذایی خوش طعم کماشدون",
            link: "/products",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // ۱. ردیابی اسکرول جهت اجرای افکت محو شدن هیرو با اسکرول
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ۲. اسلاید خودکار اتومات هر ۴.۵ ثانیه در صورت وجود بیش از یک بنر
  const nextBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      nextBanner();
    }, 4500);

    return () => clearInterval(interval);
  }, [activeBanners.length, currentIndex, nextBanner]);

  // ۳. محاسبه میزان محو شدن و پارالاکس هیرو با اسکرول
  const bgOpacity = Math.max(0.12, 1 - scrollY / 600);
  const bgTranslateY = scrollY * 0.26;
  const bgScale = 1 + Math.min(scrollY / 3000, 0.08);

  const cardOpacity = Math.max(0, 1 - scrollY / 420);
  const cardTranslateY = scrollY * 0.15;

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc] text-zinc-900 select-none"
      dir="rtl"
    >
      {/* 
        استیج تمام‌صفحه بنرها:
        نمایش تصویر با ترنزیشن فید نرم ۱۰۰۰ میلی‌ثانیه‌ای هنگام تغییر خودکار اسلاید
      */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-150 ease-out z-0"
        style={{
          opacity: bgOpacity,
          transform: `translateY(${bgTranslateY}px) scale(${bgScale})`,
        }}
      >
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link
                href={banner.link || "/products"}
                className="block w-full h-full cursor-pointer"
                title={banner.title || "مشاهده محصولات خوش‌طعم"}
              >
                <img
                  src={banner.image}
                  alt={banner.alt || banner.title || "صنایع غذایی خوش طعم کماشدون"}
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* 
        کارت ادیتوریال شیشه‌ای مات (Frosted Glassmorphism):
        دارای پس‌زمینه شفاف بلورشده تا عکس بنر به صورت کامل در پس‌زمینه جلوه‌گری کند و دیده شود،
        در عین حال متون و دکمه‌ها با نهایت وضوح و بدون تداخل خوانده شوند.
      */}
      <div
        className="container mx-auto px-4 sm:px-8 lg:px-14 relative z-20 pointer-events-none flex items-center justify-start h-full pt-20 pb-12"
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardTranslateY}px)`,
        }}
      >
        <div className="pointer-events-auto max-w-lg lg:max-w-[540px] w-full bg-white/45 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.12),0_4px_16px_rgba(255,255,255,0.4)] transition-all duration-300">
          
          {/* نشان برند و اصالت */}
          <div className="inline-flex items-center gap-2 mb-3.5 bg-white/80 backdrop-blur-md border border-red-200/90 px-3.5 py-1.5 rounded-full shadow-sm">
            <Flame className="size-4 text-red-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-red-800">
              صنایع غذایی خوش‌طعم کماشدون • تاسیس ۱۳۷۷
            </span>
          </div>

          {/* تیتر برجسته با کنتراست بالا */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 leading-[1.18] mb-3.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            ستاره‌ی طعم‌های{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
              خوشمزه و ترد!
            </span>
          </h1>

          {/* توضیح معتبر و اشتهاآور درباره محصولات */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-800 leading-relaxed font-semibold mb-6 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            تولیدکننده تخصصی انواع پودر سوخاری پولکی، پودر کتلت سویا و چاشنی‌های معطر غذایی با نشان استاندارد ملی و سیب سلامت.
          </p>

          {/* دکمه‌های اکشن پرکنتراست و لمسی */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>مشاهده و خرید محصولات</span>
              <span className="text-base font-bold">←</span>
            </Link>

            <a
              href="#looks"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full border-2 border-zinc-300 hover:border-red-500 bg-white/85 hover:bg-white text-zinc-950 text-sm sm:text-base font-bold backdrop-blur-md transition-all shadow-sm"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>محصولات برگزیده</span>
            </a>
          </div>

        </div>
      </div>

      {/* 
        محو شدن انتهای هیرو با اسکرول:
        فقط وقتی کاربر اسکرول کرد ظاهر می‌شود تا خط بین هیرو و بخش پایینی به طور کامل محو شود.
      */}
      <div
        className={`absolute bottom-0 inset-x-0 h-24 sm:h-36 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none z-20 transition-opacity duration-500 ease-out ${
          scrollY > 20 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* کنترل‌های اسلایدر (فقط در صورت وجود بیش از یک بنر) */}
      {activeBanners.length > 1 && (
        <>
          {/* فلش قبلی / بعدی */}
          <button
            onClick={prevBanner}
            aria-label="بنر قبلی"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/85 hover:bg-white border border-zinc-200 text-zinc-800 hover:text-red-600 flex items-center justify-center transition-all shadow-lg backdrop-blur-md group"
          >
            <ChevronRight className="size-5 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextBanner}
            aria-label="بنر بعدی"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/85 hover:bg-white border border-zinc-200 text-zinc-800 hover:text-red-600 flex items-center justify-center transition-all shadow-lg backdrop-blur-md group"
          >
            <ChevronLeft className="size-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* نشانگرهای نقطه‌ای در پایین */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-md">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`رفتن به بنر شماره ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-7 bg-red-600 shadow-sm"
                    : "w-2 bg-zinc-300 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
