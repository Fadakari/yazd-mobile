"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// --- اینترفیس‌ها ---
export interface ProductCardType {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  discountPercentage?: number;
  link: string;
}

interface Props {
  products: ProductCardType[];
  heroImageSrc?: string; // عکس جعبه یا لوگوی شگفت انگیز
}

// --- کامپوننت تایمر شمارش معکوس ---
const CountdownTimer = () => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 dir-ltr opacity-0" dir="ltr">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl" />
      </div>
    );
  }

  const Box = ({ val, txt }: { val: number; txt: string }) => (
    <div className="flex flex-col items-center justify-center">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-sm sm:text-lg shadow-md border border-white/80">
        {val < 10 ? `0${val}` : val}
      </div>
      <span className="text-white/90 text-[10px] sm:text-xs mt-1 font-bold">{txt}</span>
    </div>
  );

  return (
    <div className="flex items-start gap-1.5 sm:gap-2.5 dir-ltr" dir="ltr">
      <Box val={timeLeft.seconds} txt="ثانیه" />
      <span className="text-white font-black text-lg mt-1">:</span>
      <Box val={timeLeft.minutes} txt="دقیقه" />
      <span className="text-white font-black text-lg mt-1">:</span>
      <Box val={timeLeft.hours} txt="ساعت" />
    </div>
  );
};

// --- کامپوننت اصلی اسلایدر ---
export default function ShegeftAngizSlider({ products, heroImageSrc = "/assets/specialoffers.png" }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 my-6 sm:my-8" dir="rtl">
      {/* کانتینر اصلی با گرادینت قرمز شگفت‌انگیز */}
      <div className="relative w-full rounded-[24px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden shadow-[0_18px_50px_rgba(239,57,78,0.25)] bg-gradient-to-l from-[#00b4d8] via-[#39efe9] to-[#00c79f] p-3 sm:p-5">
        
        {/* افکت نور ملایم شیشه‌ای */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        {/* محتوای اصلی دو تکه: سایدبار و اسلایدر */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 relative z-10">
          
          {/* --- بخش سایدبار: عنوان، تایمر و دکمه مشاهده همه --- */}
          <div className="w-full md:w-[220px] lg:w-[250px] shrink-0 flex flex-col justify-center items-center gap-3 sm:gap-4 p-3 text-center">
            
            {/* تصویر عنوان پیشنهاد شگفت انگیز */}
            <div className="relative w-[140px] h-[45px] md:w-[170px] md:h-[55px]">
               <Image
                src={heroImageSrc}
                alt="پیشنهاد شگفت‌انگیز"
                fill
                className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
              />
            </div>

            {/* تایمر معکوس دیجیتال */}
            <CountdownTimer />

            {/* لینک مشاهده همه محصولات شگفت‌انگیز */}
            <Link 
              href="/products/offers" 
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#0083b7] hover:bg-slate-100 text-xs sm:text-sm font-black transition-all duration-300 shadow-md active:scale-95 group/link mt-1"
            >
              <span>مشاهده همه</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 transition-transform group-hover/link:-translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>

          {/* --- بخش اسلایدر محصولات --- */}
          <div className="flex-1 w-full min-w-0 self-center relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={12}
              slidesPerView={1.5}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ prevEl, nextEl }}
              breakpoints={{
                360: { slidesPerView: 1.6, spaceBetween: 10 },
                480: { slidesPerView: 2.2, spaceBetween: 12 },
                768: { slidesPerView: 3.2, spaceBetween: 14 },
                1024: { slidesPerView: 4.1, spaceBetween: 14 },
                1280: { slidesPerView: 4.8, spaceBetween: 16 },
              }}
              className="!pt-3.5 !pb-5 !px-1.5"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="!h-auto flex">
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 overflow-hidden w-full flex flex-col justify-between group/card relative shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 border-2 border-white hover:border-white/80">
                    
                    <Link href={product.link} className="block flex-1 flex flex-col">
                      {/* تصویر محصول */}
                      <div className="relative w-full aspect-square mb-2.5 bg-slate-50/80 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 group-hover/card:bg-slate-50 transition-colors">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain p-2.5 transition-transform duration-500 ease-out group-hover/card:scale-108"
                          sizes="(max-width: 768px) 180px, 220px"
                        />
                      </div>

                      {/* عنوان محصول */}
                      <h3 className="text-xs sm:text-[13px] text-slate-900 font-extrabold line-clamp-2 leading-snug mb-2 hover:text-[#ef394e] transition-colors text-right min-h-[36px]">
                        {product.title}
                      </h3>

                      {/* بخش قیمت و تخفیف */}
                      <div className="flex flex-col gap-1 mt-auto border-t border-slate-100 pt-2.5">
                        {product.oldPrice && product.discountPercentage ? (
                          <div className="flex items-center justify-between">
                            <span className="bg-[#ef394e] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                              {product.discountPercentage}٪
                            </span>
                            <del className="text-slate-400 text-xs font-bold">
                              {product.oldPrice.toLocaleString("fa-IR")}
                            </del>
                          </div>
                        ) : (
                          <div className="h-5" />
                        )}
                        
                        <div className="flex items-baseline justify-end gap-1 text-slate-950 mt-0.5">
                          <span className="font-black text-base sm:text-lg text-slate-950 group-hover/card:text-[#ef394e] transition-colors">
                            {product.price.toLocaleString("fa-IR")}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">تومان</span>
                        </div>
                      </div>
                    </Link>
                    
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* دکمه‌های ناوبری چپ و راست */}
            <div className="hidden lg:block">
              <button 
                ref={(node) => setPrevEl(node)} 
                aria-label="قبلی" 
                className="absolute top-1/2 -left-2 z-20 w-10 h-10 bg-white/95 hover:bg-white shadow-lg text-slate-800 hover:text-[#ef394e] rounded-full flex items-center justify-center -translate-y-1/2 transition-all disabled:opacity-30 cursor-pointer border border-white hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                ref={(node) => setNextEl(node)} 
                aria-label="بعدی" 
                className="absolute top-1/2 -right-2 z-20 w-10 h-10 bg-white/95 hover:bg-white shadow-lg text-slate-800 hover:text-[#ef394e] rounded-full flex items-center justify-center -translate-y-1/2 transition-all disabled:opacity-30 cursor-pointer border border-white hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}