"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Utensils, Wheat, Leaf, Flame } from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon?: string;
  link: string;
}

interface Props {
  categories: Category[];
}

const sensoryCards = [
  {
    title: "دنیای پودر سوخاری و کتلت",
    subtitle: "Panko, Cutlet & Soy Flakes",
    description: "فرمولاسیون انحصاری با تردی ماندگار، پولک‌های درشت طلایی و عدم جذب روغن اضافی.",
    icon: Flame,
    color: "from-amber-600 to-red-600",
    bgPattern: "bg-amber-500/10",
    accentBorder: "border-amber-500/40",
    href: "/products?category_id=2",
    countText: "۷ محصول تخصصی",
    tags: ["سوخاری پولکی", "سوخاری تند", "کتلت سویا", "آرد سوخاری"],
  },
  {
    title: "سبزیجات خشک معطر سنتی",
    subtitle: "Sun-Dried Persian Herbs",
    description: "دستچین شده و خشک‌شده با دستگاه‌های صنعتی مکانیزه بدون خاکه، با حفظ ۱۰۰٪ عطر و طعم طبیعی.",
    icon: Leaf,
    color: "from-emerald-600 to-teal-700",
    bgPattern: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/40",
    href: "/products?category_id=1",
    countText: "۵ محصول معطر",
    tags: ["قورمه سبزی", "سبزی کوکو", "ترخون خشک", "سبزی آش", "سبزی ماهی"],
  },
  {
    title: "محصولات آردی و نشاسته اعلا",
    subtitle: "Specialty Flours & Starches",
    description: "آسیاب شده از مرغوب‌ترین غلات و حبوبات؛ مناسب برای انواع قنادی، شیرینی‌پزی و آشپزی حرفه‌ای.",
    icon: Wheat,
    color: "from-amber-700 to-yellow-600",
    bgPattern: "bg-yellow-500/10",
    accentBorder: "border-yellow-500/40",
    href: "/products?category_id=4",
    countText: "۶ محصول پایه",
    tags: ["آرد نخودچی", "آرد ذرت", "جوانه گندم", "نشاسته گندم", "آرد برنج"],
  },
  {
    title: "ادویه‌جات خالص و چاشنی‌ها",
    subtitle: "Pure Spices & Master Blends",
    description: "چاشنی‌های تخصصی برای مرینیت جوجه کباب، گوشت و خورش‌ها با ترکیب دقیق ادویه‌های درجه یک.",
    icon: Utensils,
    color: "from-red-600 to-rose-700",
    bgPattern: "bg-rose-500/10",
    accentBorder: "border-rose-500/40",
    href: "/products?category_id=3",
    countText: "۳۰+ چاشنی اعلا",
    tags: ["ادویه جوجه کباب", "زیره سیاه", "زردچوبه اعلا", "فلفل قرمز"],
  },
];

export default function SensoryCategoryWall({ categories }: Props) {
  return (
    <section className="w-full py-12 md:py-16 bg-white border-b border-zinc-200" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b-2 border-zinc-900 gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-black mb-1">
              <Sparkles className="size-4 text-amber-500" />
              <span>مجموعه تخصصی محصولات کارخانه خوش طعم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              کاوش بر اساس خانواده طعم
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-black text-zinc-900 hover:text-red-600 transition-colors self-start md:self-auto"
          >
            <span>مشاهده کاتالوگ جامع محصولات</span>
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        {/* 4 Architectural Sensory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sensoryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className="group relative rounded-3xl p-6 bg-[#faf7f2] border-2 border-zinc-200 hover:border-zinc-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Accent Top Dot */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="size-6" />
                  </div>
                  <span className="text-[11px] font-black text-zinc-900 bg-white border border-zinc-200 px-3 py-1 rounded-full shadow-sm">
                    {card.countText}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 block mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="text-lg font-black text-zinc-900 mb-2 group-hover:text-red-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Subcategory Pills */}
                <div className="pt-4 border-t border-zinc-200/80">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {card.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-black text-zinc-900 group-hover:text-red-600 transition-colors">
                    <span>مشاهده محصولات این خانواده</span>
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
