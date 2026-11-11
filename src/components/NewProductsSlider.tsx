"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";

export interface NewProductItem {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  slug: string;
  isSpecial?: boolean;
}

interface Props {
  title: string;
  highlightTitle?: string;
  products: NewProductItem[];
  viewAllLink?: string;
  categoryId?: number;
  sort?: string;
  sectionId?: number;
  sectionType?: "product" | "category";
}

export default function NewProductsSlider({
  title,
  highlightTitle,
  products,
  viewAllLink = "/products",
  categoryId,
  sort,
  sectionId,
  sectionType,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const buildViewAllLink = () => {
    let link = viewAllLink;
    const params = new URLSearchParams();

    if (sectionType === "product" && sectionId) {
      params.append("section_id", sectionId.toString());
    } else if (categoryId) {
      params.append("category_id", categoryId.toString());
    }

    if (sort) {
      params.append("sort", sort);
    }

    const queryString = params.toString();
    return queryString ? `${link}?${queryString}` : link;
  };

  const finalViewAllLink = buildViewAllLink();

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR");
  };

  if (!products || products.length === 0) return null;

  const shouldCenter = products.length <= 5;

  return (
    <section className="container mx-auto px-4 py-8 mb-8 relative group/section" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 order-2 md:order-1 ml-auto relative">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
          </span>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight pr-1">
            {title}{" "}
            {highlightTitle && (
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-600 to-amber-500">
                {highlightTitle}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto justify-end">
          <Link
            href={finalViewAllLink}
            className="hidden md:flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-red-200/60 hover:shadow-sm"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="size-4" />
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("right")}
              aria-label="بعدی"
              className="w-10 h-10 flex items-center justify-center border border-amber-200/80 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-l hover:from-red-600 hover:to-amber-500 bg-white transition-all shadow-sm"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => scroll("left")}
              aria-label="قبلی"
              className="w-10 h-10 flex items-center justify-center border border-amber-200/80 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-l hover:from-red-600 hover:to-amber-500 bg-white transition-all shadow-sm"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        className={`flex flex-nowrap gap-4 md:gap-5 overflow-x-auto overflow-y-hidden pb-6 pt-2 px-1 scroll-smooth no-scrollbar ${
          shouldCenter ? "justify-center" : "justify-start"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[210px] sm:w-[230px] bg-white rounded-2xl p-3 relative group transition-all duration-300 hover:-translate-y-2 border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Image & Badges */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-amber-50/40 to-white rounded-xl overflow-hidden mb-3 isolate p-2">
              {product.isSpecial && (
                <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  ویژه خوش طعم
                </div>
              )}

              <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108"
                />
              </Link>
            </div>

            {/* Content */}
            <div className="px-1 pb-2 flex flex-col flex-1">
              <h3 className="text-gray-900 font-extrabold text-sm leading-snug line-clamp-2 mb-2 text-right transition-colors group-hover:text-red-600">
                <Link href={`/product/${product.slug}`}>{product.title}</Link>
              </h3>

              {/* Pricing */}
              <div className="mt-auto pt-3 border-t border-amber-100/60 flex flex-col items-end gap-0.5">
                {product.oldPrice && product.discount ? (
                  <div className="flex items-center gap-1.5">
                    <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-md font-black">
                      {product.discount.toLocaleString("fa-IR")}٪
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </div>
                ) : (
                  <div className="h-4"></div>
                )}

                <div className="flex items-center gap-1 text-gray-900">
                  {product.price > 0 ? (
                    <>
                      <span className="text-lg font-black tracking-tight text-red-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[11px] font-normal text-gray-500 mb-0.5">تومان</span>
                    </>
                  ) : (
                    <span className="text-amber-700 text-xs font-bold">تماس با پشتیبانی</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/product/${product.slug}`}
              className="w-full h-9 rounded-xl bg-gradient-to-l from-amber-50 to-red-50 text-red-600 flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-300 hover:from-red-600 hover:to-amber-500 hover:text-white border border-amber-200/60 hover:border-transparent mt-2 shadow-sm"
            >
              <ShoppingBag className="size-3.5" />
              <span>خرید آنلاین</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
