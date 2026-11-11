"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2, Clock } from "lucide-react";

export default function HeritageEditorial() {
  return (
    <section className="w-full py-16 md:py-24 bg-white border-b border-zinc-200" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Historical Stamp & Product Photo (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[400px] rounded-3xl bg-[#faf7f2] p-8 border-2 border-zinc-900 shadow-2xl relative">
              
              {/* Vintage Stamp */}
              <div className="absolute -top-4 -right-4 bg-zinc-900 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                ★ Since 1998 ★
              </div>

              <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                <Image
                  src="/images/brand/logo.png"
                  alt="لوگوی رسمی خوش طعم کماشدون"
                  width={260}
                  height={260}
                  className="object-contain drop-shadow-md"
                />
              </div>

              <div className="pt-4 border-t-2 border-zinc-900 text-center">
                <h4 className="text-lg font-black text-zinc-900 mb-1">
                  صنایع غذایی خوش طعم کماشدون
                </h4>
                <p className="text-xs text-zinc-500 font-mono">
                  SPICE UP YOUR LIFE • SINCE 1998
                </p>
              </div>

            </div>
          </div>

          {/* Left Column: The Manifest (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 text-xs font-black text-red-600 mb-3">
              <Award className="size-4" />
              <span>بیانیه کیفیت و استاندارد صنایع غذایی</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-6">
              راز طعمی که بیش از ۲۵ سال به یاد مانده است.
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6 text-justify">
              در مجموعه «خوش طعم کماشدون»، از سال ۱۳۷۷ با یک باور پایدار فعالیت خود را آغاز کردیم:
              اینکه غذای خانگی باید با کیفیتی بالاتر از بهترین رستوران‌ها، اما در کمال سلامت و با سریع‌ترین
              روش ممکن آماده شود. فرمولاسیون اختصاصی پودرهای سوخاری پولکی ما به گونه‌ای مهندسی شده
              که بدون جذب روغن اضافه، بالاترین درجه تردی و عطر دلپذیر را به سفره‌های ایرانی تقدیم می‌کند.
            </p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf7f2] border border-zinc-200">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-zinc-900 mb-0.5">مواد اولیه ۱۰۰٪ طبیعی</h4>
                  <p className="text-[11px] text-zinc-500">بدون رنگ‌های مصنوعی و بدون مواد نگه‌دارنده مضر</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf7f2] border border-zinc-200">
                <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-zinc-900 mb-0.5">سیب سلامت و استاندارد ملی</h4>
                  <p className="text-[11px] text-zinc-500">تحت نظارت کامل آزمایشگاه‌های بهداشتی کنترل کیفی</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf7f2] border border-zinc-200">
                <Clock className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-zinc-900 mb-0.5">آماده‌سازی فوق‌العاده سریع</h4>
                  <p className="text-[11px] text-zinc-500">تردی رستورانی در کمتر از ۱۰ دقیقه در آشپزخانه شما</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf7f2] border border-zinc-200">
                <Sparkles className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-zinc-900 mb-0.5">آسیاب و بسته‌بندی روز</h4>
                  <p className="text-[11px] text-zinc-500">ارسال مستقیم از کارخانه برای حفظ ماندگاری عطر ادویه‌ها</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <span>درباره کارخانه و تاریخچه ما</span>
                <ArrowLeft className="size-4" />
              </Link>
              <Link
                href="/contact-info"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-zinc-900 hover:bg-zinc-100 text-zinc-900 text-xs sm:text-sm font-black transition-all"
              >
                <span>ارتباط با امور نمایندگی‌ها</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
