"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Flame, Award, Clock } from "lucide-react";

interface Props {
  apiBanners?: {
    id: number;
    image: string;
    link?: string;
    title?: string;
  }[];
}

export default function HeroGourmetShowcase({ apiBanners }: Props) {
  const primaryBanner =
    apiBanners && apiBanners.length > 0 && apiBanners[0].image
      ? apiBanners[0].image
      : "/images/brand/hero-banner.webp";

  return (
    <section className="relative w-full overflow-hidden pt-4 pb-8 md:pt-6 md:pb-12">
      <div className="container mx-auto px-4">
        {/* Main Hero Container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c130d] via-[#2a130a] to-[#0f172a] shadow-2xl border border-amber-900/30">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Image Showcase */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9] min-h-[320px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px]">
            <Image
              src={primaryBanner}
              alt="صنایع غذایی خوش طعم کماشدون - ستاره طعم‌های خوشمزه"
              fill
              priority
              className="object-cover md:object-contain object-center scale-100 hover:scale-[1.01] transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 1200px"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent flex flex-col justify-end md:justify-center p-6 sm:p-8 md:p-12 lg:p-16">
              
              <div className="max-w-2xl text-white z-10">
                {/* Brand Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600/90 to-amber-600/90 text-amber-100 text-xs sm:text-sm font-bold backdrop-blur-md border border-amber-300/30 mb-3 shadow-lg"
                >
                  <Sparkles className="size-4 text-amber-300 animate-pulse" />
                  <span>از سال ۱۳۷۷ (Since 1998) • ۲۵ سال اصالت در طعم</span>
                </motion.div>

                {/* Slogan Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 tracking-tight drop-shadow-md"
                >
                  ستاره‌ی طعم‌های{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-400 via-amber-300 to-red-400">
                    خوشمزه!
                  </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-sm sm:text-base md:text-lg text-amber-100/90 font-medium mb-6 leading-relaxed max-w-xl drop-shadow"
                >
                  طعمی که همیشه می‌چسبید... تجربه‌ای بی‌نظیر از تردی پودر سوخاری پولکی،
                  پودر کتلت و ادویه‌جات اعلای خوش طعم برای سفره‌های ایرانی.
                </motion.p>

                {/* Floating Benefit Pills matching the brand banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-200">
                    <Flame className="size-3.5 text-amber-400" />
                    <span>طعمی بی‌نظیر</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-200">
                    <Clock className="size-3.5 text-amber-400" />
                    <span>آسان و سریع</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-200">
                    <Award className="size-3.5 text-amber-400" />
                    <span>مواد اولیه باکیفیت</span>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-l from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <span>مشاهده محصولات پرفروش</span>
                    <ArrowLeft className="size-5" />
                  </Link>
                  <Link
                    href="/about-us"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <span>داستان برند خوش طعم</span>
                  </Link>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
