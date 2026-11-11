"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ClosingEditorialSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-[#f8fafc] text-zinc-900 overflow-hidden" dir="rtl">
      
      {/* Background Graphic with Light Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/brand/hero-banner.webp"
          alt="خوش طعم"
          fill
          className="object-cover object-center filter brightness-105 contrast-100 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/90 to-[#f8fafc]/75" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="text-sm font-black text-red-600 block mb-3">
            همسفره طعم‌های اصیل
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 leading-tight mb-4">
            لذت آشپزی با{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
              خوش طعم
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-6 font-medium">
            محصولات صنایع غذایی خوش‌طعم کماشدون، همراه همیشگی شما در آماده‌سازی سریع و لذت‌بخش
            غذاهای ترد، خوش‌رنگ و لذیذ.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact-info"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-black text-zinc-950 hover:text-red-600 border-b-2 border-zinc-900 hover:border-red-600 pb-1.5 transition-colors"
            >
              <span>تماس با ما</span>
              <ArrowLeft className="size-4" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-red-500/25 transition-all"
            >
              <span>ورود به فروشگاه آنلاین</span>
            </Link>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
