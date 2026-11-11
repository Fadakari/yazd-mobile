"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Award, CheckCircle2, ArrowLeft, Heart } from "lucide-react";

export default function BrandStorySection() {
  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative overflow-hidden">
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-10 right-0 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-amber-100 shadow-xl shadow-amber-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right Column: Visual Brand Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-full max-w-[340px] aspect-square rounded-3xl bg-gradient-to-br from-amber-100/60 via-red-50/50 to-amber-50/80 p-8 flex flex-col items-center justify-center border-2 border-amber-200/60 shadow-inner group">
              
              {/* Floating glow */}
              <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative w-48 h-48 mb-4 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/images/brand/logo.png"
                  alt="لوگوی خوش طعم کماشدون"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs shadow-md">
                <Sparkles className="size-3.5" />
                <span>Spice Up Your Life • Since 1998</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] mt-6">
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-center">
                <span className="block text-xl font-black text-red-600">+۲۵</span>
                <span className="text-[11px] text-gray-600 font-medium">سال تجربه</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-center">
                <span className="block text-xl font-black text-amber-600">+۵۰</span>
                <span className="text-[11px] text-gray-600 font-medium">محصول تخصصی</span>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-center">
                <span className="block text-xl font-black text-emerald-600">۱۰۰٪</span>
                <span className="text-[11px] text-gray-600 font-medium">کیفیت خالص</span>
              </div>
            </div>
          </motion.div>

          {/* Left Column: Brand Editorial Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
              <Award className="size-4 text-amber-700" />
              <span>اصالت، سلامت و طعم لذیذ ایرانی</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              داستان ۲۵ سال همراهی{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-600 to-amber-600">
                خوش طعم کماشدون
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              مجموعه صنایع غذایی «خوش طعم» از سال ۱۳۷۷ (Since 1998) با تکیه بر دانش فنی، فرمولاسیون
              اختصاصی و شور و اشتیاق به ارتقای عطر و طعم آشپزی ایرانی آغاز به کار کرد. از پودرهای سوخاری
              پولکی و تند گرفته تا پودر کتلت سویا و ادویه‌جات اعلا، هدف ما همواره فراهم کردن تجربه‌ای
              آسان، لذیذ و سالم برای تمام خانواده‌ها بوده است.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
              ما بر این باوریم که راز یک غذای خوشمزه و ماندگار، در خلوص مواد اولیه و دقت در ترکیب
              چاشنی‌ها نهفته است. تمامی محصولات ما تحت نظارت بهداشتی کامل و با تازه‌ترین دانه‌ها و
              فرآورده‌های طبیعی تولید و بسته‌بندی می‌شوند تا عطر دلپذیر آن‌ها در آشپزخانه شما جاودانه بماند.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
              <div className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>فرمولاسیون اختصاصی پودر سوخاری پولکی</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>پودر کتلت سویای خوش‌طعم و گیاهی</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>ادویه‌جات ۱۰۰٪ خالص و بدون خاکه</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-gray-800">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                <span>دارای نشان استاندارد و سیب سلامت</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-red-600 to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-red-600/20 hover:shadow-red-600/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>درباره ما بیشتر بدانید</span>
                <ArrowLeft className="size-4" />
              </Link>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Heart className="size-4 text-red-500 fill-red-500" />
                <span>با عشق تقدیم به سفره‌های ایرانی</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
