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
  // زمان پایان فرضی (مثلاً ۲۴ ساعت بعد) - در پروژه واقعی می‌توانید از پراپ بگیرید
  const calculateTimeLeft = () => {
    // اینجا یک زمان ثابت برای دمو گذاشتم. در صورت نیاز از دیتابیس بگیرید
    const difference = +new Date("2025-12-30T23:59:59") - +new Date();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const Box = ({ val, txt }: { val: number; txt: string }) => (
    <div className="flex flex-col items-center justify-center">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-md flex items-center justify-center text-gray-800 font-bold text-lg md:text-xl shadow-sm">
        {val.toLocaleString("fa-IR")}
      </div>
      <span className="text-white text-[10px] md:text-xs mt-1 font-light">{txt}</span>
    </div>
  );

  return (
    <div className="flex items-start gap-2 md:gap-3 dir-ltr" dir="ltr">
      <Box val={timeLeft.seconds} txt="ثانیه" />
      <span className="text-white text-xl font-bold mt-1">:</span>
      <Box val={timeLeft.minutes} txt="دقیقه" />
      <span className="text-white text-xl font-bold mt-1">:</span>
      <Box val={timeLeft.hours} txt="ساعت" />
    </div>
  );
};

// --- کامپوننت اصلی اسلایدر ---
export default function ShegeftAngizSlider({ products, heroImageSrc = "/assets/specialoffers.png" }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  return (
    <section className="container mx-auto px-4 my-8">
      {/* کانتینر اصلی */}
      <div className="relative w-full rounded-2xl overflow-hidden min-h-[100px] md:min-h-[180px]">
        
        {/* 1. پس‌زمینه (Background Images) */}
        {/* بک‌گراند رنگ اصلی برای جلوگیری از پرش تصویر */}
        <div className="absolute inset-0 bg-orange-500 -z-20"></div>
        
        {/* تصویر دسکتاپ */}
        <img 
          src="/assets/subtract1.png" 
          alt="Background Desktop" 
          className="absolute inset-0 w-full h-[75%] object-fill hidden md:block -z-0 top-[15%]"
        />
        {/* تصویر موبایل */}
        <img 
          src="/assets/subtract2.png" 
          alt="Background Mobile" 
          className="absolute inset-0 w-full h-full object-fill block md:hidden -z-0"
        />

        {/* 2. محتوا */}
        <div className="flex flex-col md:flex-row h-full py-6 md:py-0">
          
          {/* --- بخش سایدبار (راست): تایمر و عنوان --- */}
          <div className="w-full md:w-[220px] lg:w-[260px] shrink-0 flex flex-col justify-center items-center gap-6 md:gap-8 p-4 z-10">
            
            {/* تصویر عنوان پیشنهاد شگفت انگیز */}
            <div className="relative w-[450px] h-[80px] md:w-[180px] md:h-[80px] mt-[2.5rem]">
               {/* اگر تصویر "پیشنهاد شگفت انگیز" دارید اینجا بگذارید، وگرنه از heroImageSrc استفاده میکنیم */}
               <Image
                src={heroImageSrc}
                alt="پیشنهاد شگفت‌انگیز"
                fill
                className="object-contain"
              />
            </div>

            {/* تایمر */}
            <CountdownTimer />

            {/* لینک مشاهده همه (اختیاری اگر در طرح هست) */}
            <Link href="/products/offers" className="text-white text-sm flex items-center gap-1 hover:gap-2 transition-all mt-2">
                مشاهده همه
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>

          {/* --- بخش اسلایدر (چپ) --- */}
          <div className="flex-1 w-full min-w-0 px-2 md:pl-6 md:pr-0 self-center">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={12}
              slidesPerView={1.3}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ prevEl, nextEl }}
              breakpoints={{
                480: { slidesPerView: 2.1 },
                768: { slidesPerView: 3.1 },
                1024: { slidesPerView: 4.1 },
                1280: { slidesPerView: 5 },
              }}
              className="!py-4 !px-1"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="h-[130%]">
                  <div className="bg-white rounded-xl overflow-hidden h-full flex flex-col justify-between group/card relative shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.04] hover:border hover:border-orange-500 transition-all hover:z-10">
                    
                    <Link href={product.link} className="block p-3 flex-1">
                        {/* تصویر محصول */}
                        <div className="relative w-full aspect-square mb-3">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-contain transition-transform duration-300 group-hover/card:scale-105"
                          />
                        </div>

                        {/* عنوان محصول */}
                        <h3 className="text-[13px] text-gray-700 font-medium line-clamp-2 leading-6 mb-2">
                          {product.title}
                        </h3>

                        {/* بخش قیمت */}
                        <div className="flex flex-col gap-1 mt-auto">
                          {product.oldPrice && product.discountPercentage ? (
                            <div className="flex items-center justify-between">
                               <div className="bg-[#ef394e] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                                {product.discountPercentage}٪
                               </div>
                               <del className="text-gray-400 text-xs">
                                {product.oldPrice.toLocaleString()}
                               </del>
                            </div>
                          ) : (
                            <div className="h-[22px]"></div> // فضای خالی
                          )}
                          
                          <div className="flex items-center justify-end gap-1 text-gray-800">
                            <span className="font-bold text-lg">
                              {product.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-light">تومان</span>
                          </div>
                        </div>
                    </Link>

                    {/* دکمه افزودن به سبد خرید (پایین کارت) */}
                    <button 
                        className="w-full border-t border-gray-100 py-3 flex items-center justify-center gap-2 text-[#ef394e] text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                        // اینجا می‌توانید onClick را برای افزودن به سبد خرید هندل کنید
                        // onClick={() => addToCart(product)} 
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        افزودن به سبد خرید
                    </button>
                    
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* دکمه‌های نویگیشن */}
            <div className="hidden lg:block">
                <button ref={(node) => setPrevEl(node)} className="absolute top-1/2 left-2 z-20 w-10 h-10 bg-white/90 shadow text-gray-500 rounded-full flex items-center justify-center -translate-y-1/2 hover:text-[#ef394e] disabled:opacity-50 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button ref={(node) => setNextEl(node)} className="absolute top-1/2 right-[270px] z-20 w-10 h-10 bg-white/90 shadow text-gray-500 rounded-full flex items-center justify-center -translate-y-1/2 hover:text-[#ef394e] disabled:opacity-50 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}