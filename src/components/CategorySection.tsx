"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  link: string;
}

interface Props {
  categories: CategoryItem[];
}

export default function CategorySection({ categories }: Props) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full bg-white py-8 md:py-12 mb-8">
      {/* --- هدر بخش --- */}
      <div className="container mx-auto px-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
            </svg>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            خرید بر اساس دسته‌بندی
          </h2>
        </div>

        {/* دکمه‌های نویگیشن */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" />
            </svg>
          </button>
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
        </div>
      </div>

      {/* --- اسلایدر دسته‌بندی‌ها --- */}
      <div className="w-full">
        {/* موبایل - گریدی ساده */}
        <div className="lg:hidden container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-50 rounded-full border-2 border-gray-100 group-hover:border-orange-400 shadow-sm group-hover:shadow-md transition-all duration-300"></div>
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 z-10 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-700 group-hover:text-orange-600 text-center leading-tight line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* دسکتاپ - Swiper */}
        <div className="hidden lg:block px-4">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            spaceBetween={24}
            slidesPerView="auto"
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== 'boolean' && swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <Link
                  href={cat.link}
                  className="group flex flex-col items-center gap-3 w-32"
                >
                  {/* دایره آیکون */}
                  <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                    {/* پس‌زمینه دایره */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-full border-2 border-gray-100 group-hover:border-orange-400 shadow-md group-hover:shadow-[0_8px_16px_rgba(255,87,34,0.15)] transition-all duration-300"></div>

                    {/* دایره‌ی متحرک در هاور */}
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-transparent group-hover:border-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        animation: "spin 8s linear infinite",
                      }}
                    ></div>

                    {/* تصویر */}
                    <div className="relative w-16 h-16 z-10 transition-transform duration-300 group-hover:scale-125">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* نام دسته‌بندی */}
                  <span className="text-sm font-bold text-gray-800 group-hover:text-orange-600 text-center leading-snug line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}