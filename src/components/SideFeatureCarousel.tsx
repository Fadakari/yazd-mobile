"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// اینترفیس دیتای هر اسلاید
export interface BannerSlideItem {
  id: number;
  title: string;
  subtitle: string;
  categoryText: string; // متنی که عمودی نوشته میشه (مثلا HEADPHONE)
  buttonText: string;
  buttonLink: string;
  mainImage: string; // تصویر بزرگ
  galleryImages: string[]; // تصاویر کوچک اسلایدر پایین
  themeColor: string; // رنگ پس زمینه (مثلا #ff7900)
}

interface Props {
  slides: BannerSlideItem[];
}

export default function SideFeatureCarousel({ slides }: Props) {
  return (
    <section className="container mx-auto px-4 my-12">
      <Swiper
        modules={[Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        className="w-full relative group/main"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <SingleBannerSlide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

// کامپوننت داخلی برای هر اسلاید (جدا شده برای مدیریت بهتر استیت‌های اسلایدر داخلی)
function SingleBannerSlide({ slide }: { slide: BannerSlideItem }) {
  const [innerPrevEl, setInnerPrevEl] = useState<HTMLElement | null>(null);
  const [innerNextEl, setInnerNextEl] = useState<HTMLElement | null>(null);

  return (
    <div
      className="relative w-full rounded-[30px] overflow-hidden min-h-[350px] md:min-h-[400px] flex items-center p-6 md:p-10"
      style={{ backgroundColor: slide.themeColor }}
    >
      {/* --- پترن و دکوراسیون پس‌زمینه --- */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/assets/pattern-wave.png')] bg-repeat"></div>
      
      {/* بریدگی‌های طرح بلیط (چپ و راست) */}
      <div className="absolute top-1/2 -left-6 w-12 h-12 bg-[#fcfcfc] rounded-full -translate-y-1/2 z-20"></div>
      <div className="absolute top-1/2 -right-6 w-12 h-12 bg-[#fcfcfc] rounded-full -translate-y-1/2 z-20"></div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* --- ستون چپ: عکس اصلی + اسلایدر کوچک --- */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* عکس اصلی محصول */}
          <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] mb-6 drop-shadow-2xl">
            <Image
              src={slide.mainImage}
              alt={slide.title}
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* اسلایدر کوچک (Gallery) */}
          <div className="relative w-full max-w-[280px] px-8">
            <Swiper
              modules={[Navigation]}
              slidesPerView={3}
              spaceBetween={10}
              navigation={{
                prevEl: innerPrevEl,
                nextEl: innerNextEl,
              }}
              className="w-full h-[60px]"
            >
              {slide.galleryImages.map((img, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center">
                  <div className="relative w-full h-full bg-white/20 rounded-lg p-1 cursor-pointer hover:bg-white/40 transition-all">
                    <Image
                      src={img}
                      alt="gallery"
                      fill
                      className="object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* دکمه‌های اسلایدر کوچک (SVG های ارسالی شما) */}
            <div ref={(node) => setInnerNextEl(node)} className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-white hover:scale-110 transition-transform z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 22" fill="currentColor">
                    <path d="M13.8027 16.0574C13.9136 16.0574 14.0244 16.0166 14.1119 15.9291C14.2811 15.7599 14.2811 15.4799 14.1119 15.3107L10.3086 11.5074C10.0286 11.2274 10.0286 10.7724 10.3086 10.4924L14.1119 6.68906C14.2811 6.51989 14.2811 6.23989 14.1119 6.07072C13.9427 5.90156 13.6627 5.90156 13.4936 6.07072L9.69023 9.87406C9.39273 10.1716 9.22356 10.5741 9.22356 10.9999C9.22356 11.4257 9.38689 11.8282 9.69023 12.1257L13.4936 15.9291C13.5811 16.0107 13.6919 16.0574 13.8027 16.0574Z"></path>
                </svg>
            </div>
            <div ref={(node) => setInnerPrevEl(node)} className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-white hover:scale-110 transition-transform z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 22" fill="currentColor">
                    <path d="M9.19727 16.0574C9.08644 16.0574 8.97561 16.0166 8.88811 15.9291C8.71894 15.7599 8.71894 15.4799 8.88811 15.3107L12.6914 11.5074C12.9714 11.2274 12.9714 10.7724 12.6914 10.4924L8.88811 6.68906C8.71894 6.51989 8.71894 6.23989 8.88811 6.07072C9.05727 5.90156 9.33727 5.90156 9.50644 6.07072L13.3098 9.87406C13.6073 10.1716 13.7764 10.5741 13.7764 10.9999C13.7764 11.4257 13.6131 11.8282 13.3098 12.1257L9.50644 15.9291C9.41894 16.0107 9.30811 16.0574 9.19727 16.0574Z"></path>
                </svg>
            </div>
          </div>
        </div>

        {/* --- ستون وسط: متن و دکمه --- */}
        <div className="lg:col-span-5 text-center lg:text-right text-white px-4">
          <h1 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-md">
            {slide.title}
          </h1>
          <h5 className="text-lg md:text-xl font-medium opacity-90 mb-8">
            {slide.subtitle}
          </h5>
          
          <Link
            href={slide.buttonLink}
            className="inline-flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 px-6 py-3 rounded-full font-bold transition-all group"
          >
            {slide.buttonText}
            <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] group-hover:-translate-x-1 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="currentColor">
                    <path d="M3.91759 7.83007L0.192626 4.37528C0.057267 4.27073 2.96119e-07 4.13436 3.0198e-07 4.00025C3.07842e-07 3.86615 0.0569552 3.73024 0.170812 3.62523L3.91759 0.170443C4.15707 -0.0484354 4.55273 -0.057527 4.80262 0.149078C5.05512 0.356593 5.06293 0.703208 4.82605 0.920496L1.48634 4.00025L4.82865 7.08001C5.06537 7.29735 5.05642 7.64255 4.80425 7.85143C4.55273 8.05736 4.15707 8.04826 3.91759 7.83007Z"></path>
                </svg>
            </span>
          </Link>
        </div>

        {/* --- ستون راست: متن عمودی --- */}
        <div className="hidden lg:flex lg:col-span-2 justify-end items-center h-full">
           {/* متن عمودی بزرگ */}
          <div 
            className="text-6xl font-black text-black/10 tracking-widest select-none whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {slide.categoryText}
          </div>
        </div>

      </div>
    </div>
  );
}