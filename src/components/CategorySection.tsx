"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Utensils, ChevronLeft, ChevronRight } from "lucide-react";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!categories || categories.length === 0) return null;
  if (!isMounted) return null;

  return (
    <section className="w-full py-8 md:py-12 bg-white border-y border-amber-100/60 my-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/20">
              <Utensils className="size-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                دسته‌بندی‌های خوش طعم
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                تنوع بی‌نظیر پودرهای سوخاری، ادویه‌جات اعلا و فرآورده‌های آردی
              </p>
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              ref={nextRef}
              aria-label="بعدی"
              className="w-10 h-10 rounded-xl border border-amber-200/80 bg-amber-50/50 flex items-center justify-center text-gray-700 hover:bg-gradient-to-l hover:from-red-600 hover:to-amber-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              ref={prevRef}
              aria-label="قبلی"
              className="w-10 h-10 rounded-xl border border-amber-200/80 bg-amber-50/50 flex items-center justify-center text-gray-700 hover:bg-gradient-to-l hover:from-red-600 hover:to-amber-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </div>

        {/* Mobile View: Grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                className="group flex flex-col items-center gap-2 bg-gradient-to-b from-amber-50/40 to-white p-3 rounded-2xl border border-amber-100/70 hover:border-red-300 transition-all text-center"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 z-10 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop View: Swiper */}
        <div className="hidden lg:block">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            dir="rtl"
            spaceBetween={20}
            slidesPerView="auto"
            watchOverflow={true}
            wrapperClass={categories.length < 8 ? "!justify-center !w-full" : "!w-full"}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <Link
                  href={cat.link}
                  className="group flex flex-col items-center gap-3 w-36 p-4 rounded-3xl bg-gradient-to-b from-amber-50/30 via-white to-amber-50/15 border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0 rounded-2xl bg-gradient-to-br from-amber-100/50 to-red-50/40 p-3 group-hover:scale-105 transition-transform duration-300 border border-amber-200/50">
                    <div className="relative w-16 h-16">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-gray-800 group-hover:text-red-600 text-center leading-snug line-clamp-2 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
