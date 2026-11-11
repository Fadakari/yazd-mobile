"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function EditorialSplitSection() {
  return (
    <section className="w-full bg-white text-zinc-900 border-y-2 border-zinc-200 overflow-hidden" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px]">
        
        {/* Right: Appetizing Visual Masterpiece (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] lg:min-h-full overflow-hidden bg-amber-50/30 flex items-center justify-center border-b lg:border-b-0 lg:border-l border-zinc-200"
        >
          <Image
            src="/images/brand/hero-banner.webp"
            alt="پودر سوخاری پولکی خوش طعم"
            fill
            className="object-cover object-center filter brightness-100 contrast-105 saturate-[1.1]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-white/80 lg:via-transparent lg:to-transparent" />

          {/* Crispy Appetite Tag */}
          <div className="absolute top-5 right-5 z-10 text-xs sm:text-sm font-bold text-red-700 bg-white/95 px-4 py-2 rounded-full border border-red-200 shadow-md backdrop-blur-md flex items-center gap-2">
            <Flame className="size-3.5 text-red-600" />
            <span>تردی طلایی و دانه‌بندی پولکی</span>
          </div>
        </motion.div>

        {/* Left: Balanced Copy & Principles (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative z-10"
        >
          <div className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>فرمولاسیون اصیل و اختصاصی</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 leading-snug mb-3">
            راز طلایی شدن{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
              سوخاری ترد
            </span>{" "}
            بدون جذب چربی اضافی
          </h2>

          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-5 text-justify font-normal">
            پودر سوخاری پولکی خوش‌طعم با بهره‌گیری از نان‌های استاندارد با پخت ویژه تولید می‌شود.
            ساختار دانه‌ها در حرارت روغن، مانع از نفوذ بیش از حد چربی به بافت غذا شده و موجب
            ایجاد پوسته‌ای بسیار ترد، سبک و خوش‌خوراک می‌گردد.
          </p>

          {/* Divider */}
          <div className="h-[1px] w-full bg-zinc-200 my-3" />

          {/* 4 Feature Points */}
          <div className="space-y-4 my-3 text-sm font-semibold text-zinc-800">
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-black text-base">۱ /</span>
              <span>پولک‌های درشت و یکدست برای بیشترین حجم تردی و پف</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-black text-base">۲ /</span>
              <span>جذب کمتر روغن در مقایسه با آردهای سوخاری معمولی</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-black text-base">۳ /</span>
              <span>پخت سریع و مغزپخت شدن یکنواخت فیله و مرغ</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-black text-base">۴ /</span>
              <span>تولید کاملاً بهداشتی با نشان استاندارد ملی و سیب سلامت</span>
            </div>
          </div>

          {/* Action Link */}
          <div className="mt-6">
            <Link
              href="/products?category_id=2"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-black text-red-600 border-b-2 border-red-600 pb-1 hover:text-red-800 hover:border-red-800 transition-colors"
            >
              <span>خرید آنلاین پودر سوخاری پولکی</span>
              <ArrowLeft className="size-4" />
            </Link>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
