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
    <section className="w-full py-5 sm:py-7 md:py-10 bg-white border-y border-slate-200/80" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-5 sm:mb-7">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-[0_8px_22px_rgba(29,78,216,0.25)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900">خرید بر اساس دسته‌بندی</h2>
              <p className="hidden sm:block text-xs text-slate-500 mt-1">محصول موردنظرتان را سریع‌تر پیدا کنید</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button ref={nextRef} aria-label="دسته بعدی" className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" /></svg>
            </button>
            <button ref={prevRef} aria-label="دسته قبلی" className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" /></svg>
            </button>
          </div>
        </div>

        <div className="lg:hidden overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          <div className="flex gap-3 sm:gap-4 min-w-max">
            {categories.map((cat) => (
              <Link key={cat.id} href={cat.link} className="group w-[88px] sm:w-[102px] flex-shrink-0 text-center">
                <div className="relative w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] mx-auto mb-2 rounded-[22px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-[0_5px_16px_rgba(15,23,42,0.08)] group-active:scale-95 group-hover:border-blue-400 group-hover:shadow-[0_10px_24px_rgba(37,99,235,0.16)] transition-all duration-200 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14">
                    <Image src={cat.icon} alt={cat.name} fill className="object-contain transition-transform duration-300 group-hover:scale-110" sizes="64px" />
                  </div>
                </div>
                <span className="block text-[11px] sm:text-xs font-extrabold text-slate-800 group-hover:text-blue-700 leading-5 line-clamp-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            dir="rtl"
            spaceBetween={22}
            slidesPerView="auto"
            watchOverflow
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
                <Link href={cat.link} className="group flex flex-col items-center gap-3 w-32">
                  <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.08)] group-hover:border-blue-400 group-hover:shadow-[0_14px_30px_rgba(37,99,235,0.16)] flex items-center justify-center overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 w-16 h-16 transition-transform duration-300 group-hover:scale-110">
                      <Image src={cat.icon} alt={cat.name} fill className="object-contain" sizes="64px" />
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-blue-700 text-center leading-snug line-clamp-2">{cat.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
