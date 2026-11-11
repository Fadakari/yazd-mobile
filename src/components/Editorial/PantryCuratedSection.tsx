"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number;
  cover_image: string | null;
}

interface Props {
  flourProducts: Product[];
  herbProducts: Product[];
}

export default function PantryCuratedSection({ flourProducts, herbProducts }: Props) {
  const [tab, setTab] = useState<"flour" | "herb">("flour");
  const items = tab === "flour" ? flourProducts : herbProducts;

  return (
    <section id="pantry" className="w-full py-16 md:py-24 bg-[#f8fafc] text-zinc-900 border-b-2 border-zinc-200" dir="rtl">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header & Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-200 gap-5"
        >
          <div>
            <div className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>قفسه عطاری و آشپزی</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 leading-tight">
              آردهای تخصصی و{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                سبزیجات معطر
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTab("flour")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                tab === "flour"
                  ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/25"
                  : "bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-300 shadow-sm"
              }`}
            >
              آرد و نشاسته ({flourProducts.length.toLocaleString("fa-IR")})
            </button>
            <button
              onClick={() => setTab("herb")}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                tab === "herb"
                  ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-500/25"
                  : "bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-300 shadow-sm"
              }`}
            >
              سبزیجات خشک ({herbProducts.length.toLocaleString("fa-IR")})
            </button>
          </div>
        </motion.div>

        {/* Compact, Well-Proportioned High-Contrast Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item, idx) => {
            const hasDiscount = item.discount_price && item.discount_price > 0 && item.discount_price < item.price;
            const finalPrice = hasDiscount ? item.discount_price! : item.price;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-zinc-200/90 hover:border-red-400 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-full aspect-square bg-gradient-to-b from-zinc-50 to-amber-50/20 rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2.5 border border-zinc-100 group-hover:border-red-300 transition-colors"
                >
                  {item.cover_image ? (
                    <Image
                      src={item.cover_image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 filter brightness-100 contrast-105 transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : (
                    <span className="text-xs text-zinc-400 font-bold">خوش طعم</span>
                  )}
                </Link>

                {/* Name & Pricing */}
                <div className="space-y-1.5">
                  <Link href={`/product/${item.slug}`}>
                    <h4 className="text-sm font-black text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                  </Link>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200">
                    <span className="text-red-700 font-black text-sm">
                      {finalPrice.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[11px] text-zinc-600 font-bold">تومان</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/products?category_id=4"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-black text-red-600 hover:text-red-800 border-b-2 border-red-600 hover:border-red-800 pb-1 transition-colors"
          >
            <span>مشاهده همه محصولات عطاری و غلات</span>
            <ArrowLeft className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
