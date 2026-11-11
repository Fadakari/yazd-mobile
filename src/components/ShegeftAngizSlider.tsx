"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sparkles, Flame, ArrowLeft, ShoppingBasket, ChevronLeft, ChevronRight } from "lucide-react";

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
}

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const difference = Math.max(0, endOfDay.getTime() - now.getTime());

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
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
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/95 rounded-xl flex items-center justify-center text-gray-900 font-black text-base sm:text-lg shadow-md">
        {val.toLocaleString("fa-IR")}
      </div>
      <span className="text-white text-[10px] mt-1 font-bold">{txt}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 dir-ltr" dir="ltr">
      <Box val={timeLeft.seconds} txt="ثانیه" />
      <span className="text-white text-lg font-black">:</span>
      <Box val={timeLeft.minutes} txt="دقیقه" />
      <span className="text-white text-lg font-black">:</span>
      <Box val={timeLeft.hours} txt="ساعت" />
    </div>
  );
};

export default function ShegeftAngizSlider({ products }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 my-10">
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-l from-red-700 via-red-600 to-amber-600 shadow-2xl shadow-red-900/20 p-4 md:p-6">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-red-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          
          {/* Right Column: Title & Timer */}
          <div className="w-full md:w-[240px] lg:w-[260px] shrink-0 flex flex-col items-center text-center p-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-bold mb-3 border border-zinc-300">
              <Flame className="size-4 text-amber-300 animate-bounce" />
              <span>تخفیف‌های داغ روز</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
              پیشنهادات شگفت‌انگیز
            </h3>
            <p className="text-xs text-amber-100/90 font-medium mb-5">
              فرصت محدود برای خرید محصولات منتخب خوش طعم
            </p>

            <CountdownTimer />

            <Link
              href="/products/offers"
              className="mt-6 inline-flex items-center gap-2 text-white bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-300 shadow-sm"
            >
              <span>مشاهده همه تخفیف‌ها</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          {/* Left Column: Swiper */}
          <div className="flex-1 w-full min-w-0 relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={14}
              slidesPerView={1.3}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ prevEl, nextEl }}
              breakpoints={{
                480: { slidesPerView: 2.1 },
                768: { slidesPerView: 3.1 },
                1024: { slidesPerView: 4.1 },
                1280: { slidesPerView: 4.5 },
              }}
              className="!py-2"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="bg-white rounded-2xl p-3 flex flex-col justify-between h-[310px] group/card border border-amber-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                    
                    <Link href={product.link} className="block flex-1">
                      {/* Image */}
                      <div className="relative w-full aspect-square rounded-xl bg-gradient-to-b from-amber-50/40 to-white p-2 mb-2">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain p-2 transition-transform duration-300 group-hover/card:scale-108"
                        />
                        {product.discountPercentage ? (
                          <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                            {product.discountPercentage.toLocaleString("fa-IR")}٪
                          </span>
                        ) : null}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 line-clamp-2 leading-snug group-hover/card:text-red-600 transition-colors">
                        {product.title}
                      </h4>
                    </Link>

                    {/* Price and Cart */}
                    <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        {product.oldPrice ? (
                          <span className="text-[11px] text-gray-400 line-through">
                            {product.oldPrice.toLocaleString("fa-IR")}
                          </span>
                        ) : (
                          <span />
                        )}
                        <div className="flex items-center gap-1">
                          <span className="font-black text-base text-red-600">
                            {product.price.toLocaleString("fa-IR")}
                          </span>
                          <span className="text-[10px] text-gray-500">تومان</span>
                        </div>
                      </div>

                      <Link
                        href={product.link}
                        className="w-full py-2 rounded-xl bg-gradient-to-l from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <ShoppingBasket className="size-3.5" />
                        <span>سفارش سریع</span>
                      </Link>
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Desktop Navigation Arrows */}
            <div className="hidden lg:block">
              <button
                ref={(node) => setPrevEl(node)}
                aria-label="قبلی"
                className="absolute top-1/2 -left-3 z-20 w-10 h-10 bg-white shadow-xl text-gray-800 rounded-full flex items-center justify-center -translate-y-1/2 hover:text-red-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                ref={(node) => setNextEl(node)}
                aria-label="بعدی"
                className="absolute top-1/2 -right-3 z-20 w-10 h-10 bg-white shadow-xl text-gray-800 rounded-full flex items-center justify-center -translate-y-1/2 hover:text-red-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
