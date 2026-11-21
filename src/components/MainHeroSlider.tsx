"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export interface SliderItem {
  id: number;
  image: string;
  mobileImage?: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
}

interface Props {
  slides: SliderItem[];
}

export default function MainHeroSlider({ slides }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = slides?.length || 0;

  const nextSlide = useCallback(() => {
    if (total > 1) {
      setCurrentIndex((prev) => (prev + 1) % total);
    }
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total > 1) {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
    }
  }, [total]);

  // اسکرول خودکار اسلایدرها فقط در صورتی که بیشتر از یک اسلاید وجود داشته باشد
  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [total, nextSlide]);

  if (!slides?.length) return null;

  // بهینه‌سازی ۱۰۰٪ برای اسلاید تکی: رندر کاملاً ایستا، بدون تاخیر جاوااسکریپت و ثبت قطعی LCP
  if (total === 1) {
    const slide = slides[0];
    const content = (
      <div className="relative w-full h-[210px] xs:h-[240px] sm:h-[300px] md:h-[370px] lg:h-[390px] bg-slate-100 overflow-hidden select-none">
        <Image
          src={slide.image}
          alt={slide.title || "بنر فروشگاه مبلمان و صندلی اداری آخوندی"}
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          loading="eager"
          unoptimized={true}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        {/* گرادیانت ملایم برای بهبود کنتراست */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />

        {(slide.title || slide.subtitle || slide.description) && (
          <div className="absolute inset-0 flex items-end sm:items-center p-4 sm:p-8 md:p-10 text-white">
            <div className="max-w-[85%] sm:max-w-[70%] drop-shadow-md">
              {slide.subtitle && (
                <span className="inline-block px-2.5 py-1 mb-1.5 rounded-lg bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white border border-white/30">
                  {slide.subtitle}
                </span>
              )}
              {slide.title && (
                <h2 className="text-lg sm:text-2xl md:text-4xl font-black leading-tight mb-1 sm:mb-2 text-white">
                  {slide.title}
                </h2>
              )}
              {slide.description && (
                <p className="hidden sm:block text-xs sm:text-sm md:text-base font-medium text-white/95 leading-relaxed line-clamp-2">
                  {slide.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[30px] md:rounded-[34px] border border-white/80 bg-white shadow-[0_14px_45px_rgba(0,31,92,0.1)]">
        {slide.link && slide.link !== "#" ? (
          <Link href={slide.link} className="block w-full h-full" aria-label={slide.title || "مشاهده بنر تبلیغاتی"}>
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  }

  // چند اسلاید: اسلایدر مدرن، سبک، سریع و سازگار کامل با لمس موبایل
  return (
    <div
      className="relative w-full group/hero overflow-hidden rounded-[24px] sm:rounded-[30px] md:rounded-[34px] border border-white/80 bg-white shadow-[0_14px_45px_rgba(0,31,92,0.1)]"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        if (touchStartX.current !== null && touchEndX.current !== null) {
          const diff = touchStartX.current - touchEndX.current;
          if (diff > 50) nextSlide();
          if (diff < -50) prevSlide();
        }
      }}
    >
      <div className="relative w-full h-[210px] xs:h-[240px] sm:h-[300px] md:h-[370px] lg:h-[390px] bg-slate-100 overflow-hidden select-none">
        {slides.map((slide, index) => {
          const isFirst = index === 0;
          const isActive = index === currentIndex;

          const content = (
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title || "بنر فروشگاه مبلمان و صندلی اداری آخوندی"}
                fill
                className="object-cover"
                priority={isFirst}
                fetchPriority={isFirst ? "high" : "auto"}
                loading={isFirst ? "eager" : "lazy"}
                unoptimized={isFirst}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />

              {(slide.title || slide.subtitle || slide.description) && (
                <div className="absolute inset-0 flex items-end sm:items-center p-4 sm:p-8 md:p-10 text-white">
                  <div className="max-w-[85%] sm:max-w-[70%] drop-shadow-md">
                    {slide.subtitle && (
                      <span className="inline-block px-2.5 py-1 mb-1.5 rounded-lg bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white border border-white/30">
                        {slide.subtitle}
                      </span>
                    )}
                    {slide.title && (
                      <h2 className="text-lg sm:text-2xl md:text-4xl font-black leading-tight mb-1 sm:mb-2 text-white">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="hidden sm:block text-xs sm:text-sm md:text-base font-medium text-white/95 leading-relaxed line-clamp-2">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {slide.link && slide.link !== "#" ? (
                <Link href={slide.link} className="block w-full h-full" aria-label={slide.title || "مشاهده اسلاید"}>
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      {/* دکمه‌های ناوبری دسکتاپ */}
      <button
        onClick={prevSlide}
        aria-label="اسلاید بعدی"
        className="hidden sm:flex absolute top-1/2 left-4 z-20 w-10 h-10 md:w-11 md:h-11 bg-white/85 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-sky-500 text-slate-800 hover:text-white rounded-2xl items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover/hero:opacity-100 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 border border-white/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="اسلاید قبلی"
        className="hidden sm:flex absolute top-1/2 right-4 z-20 w-10 h-10 md:w-11 md:h-11 bg-white/85 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-sky-500 text-slate-800 hover:text-white rounded-2xl items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover/hero:opacity-100 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 border border-white/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* نقاط نشانگر صفحات (Pagination Dots) */}
      <div className="flex items-center justify-center gap-2 absolute bottom-3.5 left-0 right-0 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`رفتن به اسلاید ${idx + 1}`}
            className={`transition-all duration-300 rounded-full h-2.5 ${
              idx === currentIndex ? "w-7 bg-white shadow-md" : "w-2.5 bg-white/60 shadow-sm"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
