"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface OfferProduct {
  id: number;
  title: string;
  image: string;
  price: string;
  link: string;
}

interface Props {
  offers: OfferProduct[];
  startDate?: string;
  dueDate?: string;
}

export default function AmazingOfferSlider({
  offers,
  startDate = "2025-08-20 17:35",
  dueDate = "2025-08-22 00:30",
}: Props) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [progressAngle, setProgressAngle] = useState(0);
  const [statusText, setStatusText] = useState("پیشنهادات امروز");
  const [isMounted, setIsMounted] = useState(false);
  const [isExpired, setIsExpired] = useState(false); // وضعیت جدید برای بررسی پایان زمان

  useEffect(() => {
    setIsMounted(true);
    const startTimestamp = new Date(startDate).getTime();
    const dueTimestamp = new Date(dueDate).getTime();

    const updateTimer = () => {
      const nowTimestamp = new Date().getTime();

      if (nowTimestamp < startTimestamp) {
        setStatusText("هنوز شروع نشده!");
        return;
      }
      if (nowTimestamp >= dueTimestamp) {
        setIsExpired(true); // پایان یافته است
        return;
      }

      const totalTime = Math.floor((dueTimestamp - startTimestamp) / 1000);
      const elapsedTime = Math.floor((nowTimestamp - startTimestamp) / 1000);
      const remainingTime = totalTime - elapsedTime;

      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = Math.floor(remainingTime % 60);

      setTimeLeft(
        `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`
      );

      const angle = (remainingTime / totalTime) * 360;
      setProgressAngle(angle);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startDate, dueDate]);


  return (
    <div className="relative w-full h-full min-h-[360px] lg:h-[400px] rounded-3xl bg-white border-2 border-red-500/80 shadow-[0_10px_35px_rgba(239,57,78,0.18)] overflow-hidden flex flex-col justify-between" dir="rtl">
      
      {/* 1. Header with Vibrant Flame & Timer */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-4 py-3 shrink-0 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-bounce">⚡</span>
          <div>
            <h3 className="font-black text-sm tracking-tight">پیشنهاد لحظه‌ای</h3>
            <p className="text-[10px] text-white/80 font-bold">فرصت محدود خرید</p>
          </div>
        </div>

        {/* Digital Countdown Timer */}
        <div className="flex items-center gap-1 font-mono font-black text-xs bg-slate-950/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 tracking-wider">
          <span>{timeLeft}</span>
        </div>
      </div>

      {/* 2. Swiper Container */}
      <div className="w-full flex-1 min-h-0 relative p-3 flex flex-col justify-between">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".amazing-carousel-pagination" }}
          modules={[Autoplay, Pagination]}
          className="w-full h-full"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              <div className="flex flex-col items-center justify-between h-full w-full px-2 pt-1 pb-2">
                
                {/* Product Image */}
                <div className="relative w-36 h-36 my-auto shrink-0 group">
                  <Link href={offer.link} className="block w-full h-full relative" aria-label={offer.title}>
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                  </Link>
                </div>

                {/* Title */}
                <div className="w-full text-center my-2 overflow-hidden">
                  <Link 
                    href={offer.link} 
                    className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 hover:text-red-600 transition-colors leading-relaxed block"
                  >
                    {offer.title}
                  </Link>
                </div>

                {/* Price Display */}
                <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between mt-auto mb-2.5">
                   <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-lg">تخفیف ویژه</span>
                   <div className="flex items-baseline gap-1 text-red-600 font-black">
                     <span className="text-base sm:text-lg tracking-tight">{offer.price}</span>
                     <span className="text-[10px] text-slate-500 font-bold">تومان</span>
                   </div>
                </div>

                {/* Full-width CTA Button */}
                <Link
                  href={offer.link}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 active:scale-98 transition-all"
                >
                  <span>مشاهده و خرید فوری</span>
                  <span>←</span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="amazing-carousel-pagination flex flex-col justify-center gap-1 absolute left-2 top-1/2 -translate-y-1/2 z-10" />
      </div>
    </div>
  );
}