"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, ShieldCheck, Truck } from "lucide-react";

const pillars = [
  {
    id: 1,
    title: "طعمی بی‌نظیر و اصیل",
    subtitle: "فرمولاسیون اختصاصی",
    description: "بیش از ۲۵ سال تجربه در خلق طعم‌های اصیل و خاطره‌انگیز ایرانی",
    icon: Sparkles,
    gradient: "from-amber-500 to-red-500",
    badge: "Since 1998",
  },
  {
    id: 2,
    title: "آسان، سریع و ترد",
    subtitle: "پخت حرفه‌ای در چند دقیقه",
    description: "تجربه تردی رستورانی با پودر سوخاری پولکی و کتلت سویا",
    icon: Zap,
    gradient: "from-red-500 to-rose-600",
    badge: "ترد و لذیذ",
  },
  {
    id: 3,
    title: "مواد اولیه ۱۰۰٪ باکیفیت",
    subtitle: "استاندارد و سیب سلامت",
    description: "دستچین شده از خالص‌ترین دانه‌ها و ادویه‌ها بدون مواد نگهدارنده مضر",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-600",
    badge: "تضمین خلوص",
  },
  {
    id: 4,
    title: "ارسال مستقیم و تازه",
    subtitle: "تولید روز با بسته‌بندی هوابند",
    description: "ارسال سریع به سراسر ایران برای حفظ کامل عطر و تازگی ادویه‌ها",
    icon: Truck,
    gradient: "from-amber-600 to-orange-600",
    badge: "سراسر کشور",
  },
];

export default function BrandPillars() {
  return (
    <section className="w-full py-8 md:py-12 bg-gradient-to-b from-transparent via-amber-50/40 to-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative bg-white rounded-2xl p-5 border border-amber-100/80 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all group overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/30 via-red-100/20 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="size-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-amber-700 mb-2">
                  {item.subtitle}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
