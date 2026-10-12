"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useState } from "react";

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
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  if (!slides?.length) return null;

  return (
    <div className="relative w-full group/hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ 
          clickable: true, 
          el: ".hero-slider-pagination",
          bulletClass: "hero-bullet inline-block w-2.5 h-2.5 rounded-full bg-white/60 transition-all duration-300 cursor-pointer shadow-sm",
          bulletActiveClass: "!w-7 !bg-white !rounded-full !shadow-md"
        }}
        navigation={{ prevEl, nextEl }}
        className="w-full overflow-hidden rounded-[24px] sm:rounded-[30px] md:rounded-[34px] border border-white/80 bg-white shadow-[0_14px_45px_rgba(0,31,92,0.1)] transition-shadow duration-500 hover:shadow-[0_20px_55px_rgba(0,83,192,0.18)]"
      >
        {slides.map((slide) => {
          const content = (
            <div className="relative w-full h-[210px] xs:h-[240px] sm:h-[300px] md:h-[370px] lg:h-[390px] bg-slate-100 overflow-hidden cursor-pointer select-none">
              <Image
                src={slide.image}
                alt={slide.title || "بنر فروشگاه"}
                fill
                className="hidden md:block object-cover transition-transform duration-700 ease-out group-hover/hero:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <Image
                src={slide.mobileImage || slide.image}
                alt={slide.title || "بنر فروشگاه"}
                fill
                className="block md:hidden object-cover"
                priority
                sizes="100vw"
              />

              {/* Glossy subtle ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

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
            <SwiperSlide key={slide.id} className="relative w-full">
              {slide.link && slide.link !== "#" ? (
                <Link href={slide.link} className="block w-full h-full">
                  {content}
                </Link>
              ) : (
                content
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Glossy Nav Buttons */}
      <button
        ref={(node) => setNextEl(node)}
        aria-label="اسلاید بعدی"
        className="hidden sm:flex absolute top-1/2 left-4 z-20 w-10 h-10 md:w-11 md:h-11 bg-white/85 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-slate-800 hover:text-white rounded-2xl items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover/hero:opacity-100 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 border border-white/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
      </button>

      <button
        ref={(node) => setPrevEl(node)}
        aria-label="اسلاید قبلی"
        className="hidden sm:flex absolute top-1/2 right-4 z-20 w-10 h-10 md:w-11 md:h-11 bg-white/85 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 text-slate-800 hover:text-white rounded-2xl items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover/hero:opacity-100 shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 border border-white/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
      </button>

      {/* Pagination bullets */}
      <div className="hero-slider-pagination !bottom-3.5 flex items-center justify-center gap-2 absolute left-0 right-0 z-20" />
    </div>
  );
}
