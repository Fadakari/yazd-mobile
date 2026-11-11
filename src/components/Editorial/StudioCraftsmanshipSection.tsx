"use client";

import React from "react";
import { ShieldCheck, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function StudioCraftsmanshipSection() {
  return (
    <section id="studio" className="relative w-full py-16 md:py-24 bg-white text-zinc-900 overflow-hidden border-b-2 border-zinc-200" dir="rtl">
      
      {/* Background Subtle Warm Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <div className="text-xs font-bold text-red-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>تعهد به کیفیت و بهداشت</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 leading-tight">
            اصالت، سلامت و{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
              کیفیت تضمین‌شده
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-700 mt-3 leading-relaxed text-justify font-normal">
            صنایع غذایی خوش طعم کماشدون بر پایه تعهد به کیفیت پایدار بنا شده است.
            محصولات ما با بهترین مواد اولیه و تحت نظارت بهداشتی تولید و عرضه می‌شوند.
          </p>
        </motion.div>

        {/* 3-Column Studio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-200 shadow-sm hover:border-red-400 hover:shadow-md transition-all"
          >
            <span className="text-sm text-red-600 font-black block mb-2">
              طعم ماندگار و اصیل
            </span>
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 mb-2">
              فرمولاسیون خوش‌طعم
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              طراحی فرمول‌های چاشنی و سوخاری به گونه‌ای است که طعم لذیذ و ماندگار را در هر وعده به ارمغان می‌آورد.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-200 shadow-sm hover:border-red-400 hover:shadow-md transition-all"
          >
            <span className="text-sm text-red-600 font-black block mb-2">
              اطمینان و سلامت
            </span>
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 mb-2">
              استاندارد ملی و سیب سلامت
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              تولید با رعایت دقیق موازین بهداشتی، دارای نشان استاندارد و پروانه معتبر سیب سلامت.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-200 shadow-sm hover:border-red-400 hover:shadow-md transition-all"
          >
            <span className="text-sm text-red-600 font-black block mb-2">
              حفظ عطر و تازگی
            </span>
            <h3 className="text-lg sm:text-xl font-black text-zinc-950 mb-2">
              بسته‌بندی مقاوم و استاندارد
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              بسته‌بندی‌های نفوذناپذیر در برابر رطوبت و نور، متضمن حفظ طراوت ادویه‌ها و تردی پولک‌های سوخاری.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
