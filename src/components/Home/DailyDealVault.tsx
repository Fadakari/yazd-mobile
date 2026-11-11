"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowLeft, ShoppingBag, Clock } from "lucide-react";

interface DealProduct {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  image: string;
  link: string;
}

interface Props {
  deals: DealProduct[];
}

export default function DailyDealVault({ deals }: Props) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!deals || deals.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-[#18181b] text-white" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Deal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-black mb-1">
              <Flame className="size-4 animate-pulse" />
              <span>پیشنهادات روزانه با تخفیف مستقیم کارخانه</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              تخفیف‌های شگفت‌انگیز امروز
            </h2>
          </div>

          {/* Live Mechanical Countdown Clock */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-2xl self-start md:self-auto">
            <Clock className="size-4 text-amber-400" />
            <span className="text-xs text-zinc-400 font-bold ml-2">فرصت باقی‌مانده:</span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black text-white dir-ltr" dir="ltr">
              <span className="bg-zinc-800 px-2 py-0.5 rounded-lg text-amber-400">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-zinc-800 px-2 py-0.5 rounded-lg text-amber-400">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-zinc-800 px-2 py-0.5 rounded-lg text-red-400">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {deals.slice(0, 5).map((deal) => (
            <div
              key={deal.id}
              className="bg-zinc-900/80 rounded-2xl p-3.5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Visual */}
              <Link
                href={deal.link}
                className="relative w-full aspect-square bg-zinc-950 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3"
              >
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-108"
                />

                {deal.discountPercentage && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                    {deal.discountPercentage.toLocaleString("fa-IR")}٪ تخفیف
                  </span>
                )}
              </Link>

              {/* Title & Price */}
              <div className="flex-1 flex flex-col justify-between">
                <Link href={deal.link}>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors mb-3">
                    {deal.title}
                  </h3>
                </Link>

                <div className="mt-auto pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    {deal.oldPrice ? (
                      <span className="text-[11px] text-zinc-500 line-through">
                        {deal.oldPrice.toLocaleString("fa-IR")}
                      </span>
                    ) : (
                      <span />
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-base font-black text-amber-400">
                        {deal.price.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-[10px] text-zinc-400">تومان</span>
                    </div>
                  </div>

                  <Link
                    href={deal.link}
                    className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-red-600 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>خرید با تخفیف</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
