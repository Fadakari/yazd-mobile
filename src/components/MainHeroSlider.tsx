"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export interface SliderItem {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  link: string;
}

export default function MainHeroSlider({ slides }: { slides: SliderItem[] }) {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#12465a] via-[#1a5b73] to-[#12465a] shadow-2xl dir-rtl">
      
      {/* --- پس‌زمینه و هاله‌های نوری دکوراتیو --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* هاله نوری بالا سمت چپ */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-[#0bb2c9] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        {/* هاله نوری پایین سمت راست */}
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#0bb2c9] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        {/* پترن نقطه‌ای ظریف روی کل بک‌گراند (اختیاری) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ 
          clickable: true, 
          bulletClass: 'hero-bullet', 
          bulletActiveClass: 'hero-bullet-active' 
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full z-10 hero-main-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full px-6 lg:px-16 py-10 pt-1 lg:py-0">
              
              {/* --- سمت راست (تصویر محصول/شخص) --- */}
              {/* در سایت‌های فارسی (RTL)، اولین المان flex در سمت راست قرار می‌گیرد */}
              <div className="w-full lg:w-1/2 h-[220px] lg:h-full relative flex items-center justify-center lg:justify-start z-10 mb-8 lg:mb-0">
                <div className="relative w-full h-full max-w-[380px] lg:max-w-[450px]">
                  <Image
                    src={slide.image}
                    alt={slide.title || "پیشنهاد ویژه آموزش فخر"}
                    fill
                    className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-700 ease-out"
                    priority={index === 0}
                  />
                </div>
              </div>

              {/* --- سمت چپ (متن و دکمه CTA) --- */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-right text-white space-y-5 lg:space-y-7 z-10">
                
                {/* تگ کوچک بالای تیتر */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[#0bb2c9] text-xs font-black tracking-widest inline-block shadow-sm">
                  {slide.subtitle || "تغذیه سالم با آموزش فخر"}
                </div>

                {/* تیتر اصلی */}
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black leading-[1.4] drop-shadow-lg text-white">
                  {slide.title || "بهترین تجربه خرید محصولات رژیمی و سالم"}
                </h2>

                {/* توضیحات */}
                <p className="text-sm lg:text-base text-gray-200/90 leading-loose max-w-md font-medium">
                  {slide.description || "انواع محصولات رژیمی، پروتئینی، بدون قند و سالم را با بالاترین کیفیت، ضمانت سلامت و ارسال سریع تهیه کنید!"}
                </p>
                
                {/* دکمه با خط‌چین دکوراتیو */}
                <div className="relative mt-0 pt-0">
                  <Link 
                    href={slide.link} 
                    className="relative z-10 flex items-center lg:ms-15 lg:mb-0 ms-0 mb-6 gap-3 bg-[#0bb2c9] text-white px-8 py-3.5 rounded-full font-bold shadow-[0_8px_25px_rgba(11,178,201,0.4)] hover:bg-[#0a9eaf] hover:shadow-[0_10px_30px_rgba(11,178,201,0.6)] hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <span>مشاهده پیشنهادات</span>
                    <span className="bg-white/20 p-1.5 rounded-full group-hover:-translate-x-1 transition-transform">
                      <GoArrowLeft className="text-xl" />
                    </span>
                  </Link>

                  {/* وکتور خط‌چین فلش‌دار (SVG) که از عکس نمونه الهام گرفته شده */}
                  <div className="hidden lg:block absolute -right-15 top-1/2 -translate-y-1/2 opacity-60">
                    <svg width="80" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M98 30 Q 50 -10 2 20" stroke="white" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" fill="none" />
                      <path d="M12 10 L2 20 L12 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                </div>

              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- استایل‌های گلوبال برای نقطه‌های اسلایدر (Pagination) --- */}
      <style jsx global>{`
        .hero-main-swiper .swiper-pagination {
          bottom: 20px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
        .hero-bullet {
          width: 8px;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hero-bullet:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }
        .hero-bullet-active {
          width: 32px;
          background-color: #0bb2c9;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(11, 178, 201, 0.5);
        }
      `}</style>
    </div>
  );
}