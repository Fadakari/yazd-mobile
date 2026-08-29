"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useState } from "react";

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
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".dp-slider-pagination" }}
        navigation={{ prevEl, nextEl }}
        className="w-full overflow-hidden rounded-[22px] md:rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.14)] dp-carousel-slider1st"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full">
            <div className="relative w-full h-[225px] xs:h-[245px] sm:h-[300px] md:h-[390px] lg:h-[350px] bg-slate-100">
              <Image
                src={slide.image}
                alt={slide.title || "بنر فروشگاه"}
                fill
                className="hidden md:block"
                priority
                sizes="(max-width: 768px) 100vw, 75vw"
              />
              <Image
                src={slide.mobileImage || slide.image}
                alt={slide.title || "بنر فروشگاه"}
                fill
                className="block md:hidden"
                priority
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-l from-slate-950/55 via-slate-950/10 to-transparent pointer-events-none" />

              {(slide.title || slide.subtitle || slide.description) && (
                <div className="absolute inset-0 flex items-center p-5 sm:p-8 md:p-10 text-white">
                  <div className="max-w-[70%] drop-shadow-lg">
                    {slide.subtitle && (
                      <p className="text-xs sm:text-sm font-bold text-white/90 mb-1 fade-in-up">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.title && (
                      <h1 className="text-xl sm:text-3xl md:text-5xl font-black leading-tight mb-2 fade-in-up">
                        {slide.title}
                      </h1>
                    )}
                    {slide.description && (
                      <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 leading-7 fade-in-up delay-100">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={(node) => setNextEl(node)}
        aria-label="اسلاید بعدی"
        className="hidden sm:flex absolute top-1/2 left-4 z-10 w-10 h-10 md:w-11 md:h-11 bg-slate-950/35 backdrop-blur-md border border-white/25 hover:bg-white text-white hover:text-slate-900 rounded-full items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover/hero:opacity-100 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
      </button>

      <button
        ref={(node) => setPrevEl(node)}
        aria-label="اسلاید قبلی"
        className="hidden sm:flex absolute top-1/2 right-4 z-10 w-10 h-10 md:w-11 md:h-11 bg-slate-950/35 backdrop-blur-md border border-white/25 hover:bg-white text-white hover:text-slate-900 rounded-full items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover/hero:opacity-100 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
      </button>

      <div className="dp-slider-pagination !bottom-3 flex justify-center gap-1.5 absolute left-0 right-0 z-10" />
    </div>
  );
}
