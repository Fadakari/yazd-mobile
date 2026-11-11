"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles, Check, ChefHat } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number;
  cover_image: string | null;
  category?: string;
}

interface Props {
  flourProducts: Product[];
  herbProducts: Product[];
  soyaProducts: Product[];
}

export default function CulinaryPantry({ flourProducts, herbProducts, soyaProducts }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "soya" | "flour" | "herb">("all");

  const collections = [
    { id: "all", label: "همه فرآورده‌های منتخب", count: soyaProducts.length + flourProducts.length + herbProducts.length },
    { id: "soya", label: "پودر سوخاری و فرآورده‌های سویا", count: soyaProducts.length },
    { id: "flour", label: "محصولات آردی و نشاسته", count: flourProducts.length },
    { id: "herb", label: "سبزیجات خشک معطر", count: herbProducts.length },
  ];

  let displayProducts: Product[] = [];
  if (activeTab === "all") {
    displayProducts = [...soyaProducts.slice(0, 4), ...flourProducts.slice(0, 4), ...herbProducts.slice(0, 4)];
  } else if (activeTab === "soya") {
    displayProducts = soyaProducts;
  } else if (activeTab === "flour") {
    displayProducts = flourProducts;
  } else if (activeTab === "herb") {
    displayProducts = herbProducts;
  }

  return (
    <section className="w-full py-12 md:py-16 bg-[#faf7f2] border-b border-zinc-200" dir="rtl">
      <div className="container mx-auto px-4">
        
        {/* Shelf Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b-2 border-zinc-900 gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-600 text-xs font-black mb-1">
              <ChefHat className="size-4 text-red-600" />
              <span>قفسه مواد اولیه و چاشنی‌های خوش طعم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              ویترین قفسه‌ای محصولات
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === col.id
                    ? "bg-zinc-900 text-white shadow-md"
                    : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                <span>{col.label}</span>
                <span className="mr-1.5 text-[10px] opacity-70">({col.count.toLocaleString("fa-IR")})</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Pantry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {displayProducts.map((p) => {
            const hasDiscount = p.discount_price && p.discount_price > 0 && p.discount_price < p.price;
            const finalPrice = hasDiscount ? p.discount_price! : p.price;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3 border-2 border-zinc-200 hover:border-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Stage */}
                <Link
                  href={`/product/${p.slug}`}
                  className="relative w-full aspect-square bg-[#f4f1ea] rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3 group-hover:bg-[#ebe6dc] transition-colors"
                >
                  {p.cover_image ? (
                    <Image
                      src={p.cover_image}
                      alt={p.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-xs text-zinc-400">خوش طعم</span>
                  )}

                  {hasDiscount && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                      تخفیف ویژه
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <Link href={`/product/${p.slug}`}>
                    <h3 className="text-xs sm:text-sm font-black text-zinc-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-2">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      {hasDiscount && (
                        <span className="text-[10px] text-zinc-400 line-through block">
                          {p.price.toLocaleString("fa-IR")}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-base font-black text-zinc-900">
                          {finalPrice > 0 ? finalPrice.toLocaleString("fa-IR") : "استعلام"}
                        </span>
                        {finalPrice > 0 && <span className="text-[10px] text-zinc-500">تومان</span>}
                      </div>
                    </div>

                    <Link
                      href={`/product/${p.slug}`}
                      className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 text-zinc-700 group-hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      title="مشاهده و خرید"
                    >
                      <ShoppingBag className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-900 hover:bg-black text-white text-sm font-black shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>ورود به فروشگاه و مشاهده تمام ۵۰+ محصول</span>
            <ArrowLeft className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
