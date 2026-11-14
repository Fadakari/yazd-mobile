"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

export interface ProductCardType {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  image: string;
  link: string;
}

interface Props {
  products: ProductCardType[];
}

export default function ShegeftAngizSlider({ products }: Props) {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-20 bg-[#12465a] dir-rtl relative overflow-hidden">
      {/* دکوراسیون پس‌زمینه */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">پیشنهادات شگفت‌انگیز</h2>
            <div className="flex items-center gap-2 bg-[#0bb2c9] px-4 py-2 rounded-2xl text-white font-black shadow-lg">
               <span>{timeLeft.s.toString().padStart(2, '0')}</span>:
               <span>{timeLeft.m.toString().padStart(2, '0')}</span>:
               <span>{timeLeft.h.toString().padStart(2, '0')}</span>
            </div>
          </div>
          <Link href="/products" className="text-white font-bold hover:text-[#0bb2c9] transition-colors border-b-2 border-white/20 pb-1">
            مشاهده همه محصولات
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
          autoplay={{ delay: 4000 }}
          className="w-full !py-8"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                href={product.link}
                className="group block bg-white rounded-[2.5rem] p-6 border-2 border-dashed border-[#0bb2c9]/30 transition-all duration-500 hover:border-[#0bb2c9] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 relative"
              >
                {/* Discount Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-8 right-6 bg-[#12465a] text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg z-10">
                    {product.discountPercentage}% تخفیف
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-50 p-2">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    className="object-contain transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold text-[#12465a] mb-6 min-h-[40px] leading-relaxed line-clamp-2">
                  {product.title}
                </h3>

                {/* Price Box */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    {product.oldPrice && (
                       <span className="text-[11px] text-gray-400 line-through">
                         {product.oldPrice.toLocaleString("fa-IR")}
                       </span>
                    )}
                    <span className="text-sm font-black text-[#12465a]">
                      {product.price.toLocaleString("fa-IR")} <span className="text-[10px]">تومان</span>
                    </span>
                  </div>

                  {/* Add to cart Button */}
                  <div className="w-12 h-12 flex items-center justify-center bg-[#0bb2c9] text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-[#12465a] group-hover:rotate-12">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}