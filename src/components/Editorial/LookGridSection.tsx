"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
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
  products: Product[];
}

export default function LookGridSection({ products }: Props) {
  const displayProducts = products.slice(0, 6);

  return (
    <section id="looks" className="w-full py-16 md:py-24 bg-[#f8fafc] text-zinc-900" dir="rtl">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading - High Contrast & Appetizing */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <div className="text-sm font-bold text-red-700 mb-2.5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>محصولات شاخص و پرطرفدار</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 leading-tight">
            کالکشن تخصصی{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
              سوخاری و کتلت
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-700 mt-3 leading-relaxed max-w-lg font-medium">
            دانه‌بندی دقیق پولکی، جذب حداقل روغن و ادویه‌های معطر؛
            خلق نهایت تردی و برشتگی طلایی در فیله، مرغ و کتلت خانگی.
          </p>
        </motion.div>

        {/* 3-Column Responsive Grid (High-Contrast Cards with Real Depth) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {displayProducts.map((p, idx) => {
            const hasDiscount = p.discount_price && p.discount_price > 0 && p.discount_price < p.price;
            const finalPrice = hasDiscount ? p.discount_price! : p.price;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-white rounded-3xl p-5 border border-zinc-200/90 hover:border-red-400 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_35px_-8px_rgba(220,38,38,0.14),0_10px_20px_-5px_rgba(217,119,6,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Appetizing Soft Ambient Glow Behind Product */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl group-hover:bg-amber-400/20 transition-all pointer-events-none" />

                {/* Badge Tag */}
                <div className="flex items-center justify-between z-10 mb-2">
                  <span className="text-[10px] font-bold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                    محصول {(idx + 1).toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[10px] font-bold text-red-700 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    <Sparkles className="size-2.5 text-amber-500" />
                    <span>ترد و طلایی</span>
                  </span>
                </div>

                {/* Product Image */}
                <Link
                  href={`/product/${p.slug}`}
                  className="relative w-full h-48 sm:h-52 my-2 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50 to-amber-50/20 p-3 border border-zinc-100"
                >
                  {p.cover_image ? (
                    <Image
                      src={p.cover_image}
                      alt={p.name}
                      fill
                      className="object-contain p-2 filter brightness-100 contrast-105 transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : (
                    <div className="text-zinc-400 text-xs font-bold">خوش طعم</div>
                  )}
                </Link>

                {/* Name & Pricing */}
                <div className="z-10 mt-3 pt-3 border-t border-zinc-200 space-y-3">
                  <Link href={`/product/${p.slug}`}>
                    <h3 className="text-sm sm:text-base font-black text-zinc-950 group-hover:text-red-600 transition-colors line-clamp-1 leading-snug">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div>
                      {hasDiscount && (
                        <span className="text-[11px] text-zinc-400 line-through block font-medium">
                          {p.price.toLocaleString("fa-IR")} تومان
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-base sm:text-lg font-black text-red-700">
                          {finalPrice.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-medium">تومان</span>
                      </div>
                    </div>

                    <Link
                      href={`/product/${p.slug}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-red-500/25 active:scale-95 transition-all"
                    >
                      <ShoppingBag className="size-3.5" />
                      <span>خرید</span>
                    </Link>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* View All Collection */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            href="/products?category_id=2"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-zinc-300 hover:border-red-600 bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <span>مشاهده همه محصولات سوخاری و کتلت</span>
            <ArrowLeft className="size-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
