"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!categories?.length || !isMounted) return null;

  return (
    <section className="w-full py-6 sm:py-8" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-[0_6px_18px_rgba(29,78,216,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">دسته‌بندی‌های برگزیده</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">انتخاب سریع از میان گروه‌های کالایی</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button ref={nextRef} aria-label="دسته بعدی" className="w-10 h-10 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" /></svg>
            </button>
            <button ref={prevRef} aria-label="دسته قبلی" className="w-10 h-10 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Grid/Scroll */}
        <div className="lg:hidden overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
          <div className="flex gap-3 min-w-max py-1">
            {categories.map((cat) => (
              <Link key={cat.id} href={cat.link} className="group w-[88px] sm:w-[100px] flex-shrink-0 text-center">
                <div className="relative w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] mx-auto mb-2 rounded-2xl bg-white border-2 border-slate-200 shadow-sm group-active:scale-95 group-hover:border-blue-600 transition-all duration-200 flex items-center justify-center overflow-hidden">
                  <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14">
                    <Image src={cat.icon} alt={cat.name} fill className="object-contain p-1 transition-transform duration-300 group-hover:scale-110" sizes="64px" />
                  </div>
                </div>
                <span className="block text-xs font-black text-slate-800 group-hover:text-blue-600 leading-snug line-clamp-2 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Swiper - with zero clipping */}
        <div className="hidden lg:block relative">
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            dir="rtl"
            spaceBetween={18}
            slidesPerView="auto"
            watchOverflow
            className="!py-3 !px-1"
            wrapperClass={categories.length < 12 ? "!justify-center !w-full" : "!w-full"}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <Link href={cat.link} className="group flex flex-col items-center gap-2.5 w-28 text-center p-1">
                  <div className="relative w-24 h-24 rounded-3xl bg-white border-2 border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.06)] group-hover:border-blue-600 group-hover:shadow-[0_8px_24px_rgba(37,99,235,0.2)] flex items-center justify-center transition-all duration-300">
                    <div className="relative z-10 w-14 h-14 transition-transform duration-300 group-hover:scale-115">
                      <Image src={cat.icon} alt={cat.name} fill className="object-contain p-1" sizes="64px" />
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{cat.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
