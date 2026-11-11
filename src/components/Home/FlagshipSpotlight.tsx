"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Flame, Check, ArrowLeft, Clock, ShieldCheck, ShoppingBag } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number;
  cover_image: string | null;
}

interface Props {
  products: Product[];
}

const flagshipData = [
  {
    key: "polaki",
    title: "پودر سوخاری پولکی خوش طعم",
    subtitle: "Crispy Fried Chicken Panko",
    badge: "محصول طلایی و پرچمدار",
    description:
      "تولید شده با جدیدترین تکنولوژی پخت و پولک‌سازی. ایجاد بافت فوق‌العاده ترد، حجیم و طلایی برای مرغ، میگو، قارچ و پیاز سوخاری بدون جذب روغن اضافی.",
    specs: [
      { label: "میزان تردی و پفکی شدن", value: "۹۸٪ طلایی" },
      { label: "میزان جذب روغن", value: "۶۰٪ کمتر از پودرهای معمولی" },
      { label: "زمان پخت کامل", value: "۶ تا ۸ دقیقه" },
      { label: "مواد اولیه", value: "آرد گندم اعلا، مخمر، چاشنی اختصاصی" },
    ],
    cover: "/images/brand/hero-banner.webp",
    defaultSlug: "sokhari-polaki",
    tagColor: "bg-amber-500",
  },
  {
    key: "kotlet",
    title: "پودر کتلت سویا خوش طعم",
    subtitle: "Spice Cutlet Powder",
    badge: "فرمول اصیل گیاهی",
    description:
      "ترکیبی متوازن از پروتئین سویای باکیفیت و ادویه‌های معطر سنتی ایرانی. پخت آسان و سریع کتلت ترد، یکدست و لذیذ بدون نیاز به گوشت و تخم‌مرغ.",
    specs: [
      { label: "بافت پس از پخت", value: "کاملاً ترد و منسجم بدون وا رفتن" },
      { label: "ارزش پروتئینی", value: "سرشار از فیبر و پروتئین گیاهی" },
      { label: "زمان آماده‌سازی", value: "فقط ۵ دقیقه استراحت در آب" },
      { label: "عطر و چاشنی", value: "ادویه مخصوص کتلت کماشدون" },
    ],
    cover: "/images/brand/hero-banner.webp",
    defaultSlug: "kotlet-soya",
    tagColor: "bg-red-600",
  },
];

export default function FlagshipSpotlight({ products }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const current = flagshipData[activeTab];

  // یافتن محصول در دیتابیس برای خواندن قیمت و لینک واقعی
  const matchedProduct = products.find(
    (p) =>
      p.slug.includes(current.defaultSlug) ||
      p.name.includes(current.key === "polaki" ? "پولکی" : "کتلت")
  );

  return (
    <section className="w-full py-12 md:py-16 bg-[#18181b] text-white border-y border-zinc-800" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black mb-2">
              <Flame className="size-4 text-red-500 animate-pulse" />
              <span>قهرمانان سفره‌های ایرانی • پرچمداران صنایع غذایی خوش طعم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              ویترین تخصصی سوخاری و کتلت
            </h2>
          </div>

          {/* Interactive Flagship Tabs */}
          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 self-start md:self-auto">
            {flagshipData.map((item, idx) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(idx)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === idx
                    ? "bg-gradient-to-l from-red-600 to-amber-500 text-white shadow-lg shadow-red-900/40 scale-102"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {item.title.split(" ")[2] || item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/60 rounded-3xl p-6 sm:p-10 border border-zinc-800">
          
          {/* Right Column: Visual Product Presentation (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-[420px] rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 flex flex-col items-center justify-center border-2 border-zinc-700/60 shadow-2xl relative overflow-hidden group">
              
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Product Cover */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={matchedProduct?.cover_image || current.cover}
                  alt={current.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black shadow-lg">
                  {current.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Left Column: Product Specifications & Story (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-zinc-500 tracking-wider">
                {current.subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 text-justify">
              {current.description}
            </p>

            {/* Technical Culinary Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {current.specs.map((spec, i) => (
                <div
                  key={i}
                  className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-2xl flex flex-col justify-center"
                >
                  <span className="text-[11px] text-zinc-400 mb-1">{spec.label}</span>
                  <span className="text-xs sm:text-sm font-black text-amber-300">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing & Direct CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800">
              <div>
                <span className="text-xs text-zinc-400 block mb-1">قیمت مصرف‌کننده:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {matchedProduct?.price
                      ? matchedProduct.price.toLocaleString("fa-IR")
                      : "تماس بگیرید"}
                  </span>
                  <span className="text-xs text-zinc-400">تومان</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={matchedProduct ? `/product/${matchedProduct.slug}` : "/products"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-l from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <ShoppingBag className="size-4" />
                  <span>سفارش مستقیم از کارخانه</span>
                </Link>
                <Link
                  href="/products?category_id=2"
                  className="inline-flex items-center justify-center px-4 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold transition-colors"
                >
                  <span>سایر سوخاری‌ها</span>
                  <ArrowLeft className="size-4 mr-1" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
