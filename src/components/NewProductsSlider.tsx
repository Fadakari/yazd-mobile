"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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

  // ساخت لینک "مشاهده همه" با پارامترهای query
  const buildViewAllLink = () => {
    const link = viewAllLink;
    const params = new URLSearchParams();

    // اگر از بخش product است و sectionId داریم
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
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (!products || products.length === 0) {
    return null;
  }

  const shouldCenter = products.length <= 5;

  return (
    <section
      className="container mx-auto px-4 py-12 mb-8 relative group/section"
      dir="rtl"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 order-2 md:order-1 ml-auto relative">
          {/* Decorative Dot */}
          <span className="absolute -right-3 top-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>

            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight pr-2">
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-blue-400">
              {highlightTitle}
            </span>
          </h2>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto justify-end">
          <Link
            href={finalViewAllLink}
            className="hidden md:flex items-center gap-1 text-primary text-sm font-bold transition-all"
          >
            مشاهده همه

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:text-white hover:bg-primary hover:border-primary bg-white transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:text-white hover:bg-primary hover:border-primary bg-white transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        ref={scrollRef}
        className={`flex flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pb-6 pt-2 px-2 scroll-smooth no-scrollbar ${
          shouldCenter ? "justify-center" : "justify-start"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[220px] bg-white rounded-xl p-3 relative group border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-300"
          >
            <div className="relative w-full aspect-[4/4] bg-white rounded-lg overflow-hidden mb-3 isolate">
              {product.isSpecial && (
                <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                  ویژه
                </div>
              )}

              <Link
                href={`/product/${product.slug}`}
                className="block w-full h-full relative"
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            <div className="px-1 pb-1 flex flex-col flex-1">
              <h3 className="text-gray-800 font-medium text-[13px] leading-6 line-clamp-2 mb-3 text-right">
                <Link
                  href={`/product/${product.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.title}
                </Link>
              </h3>

              <div className="mt-auto pt-3 border-t border-gray-50 flex flex-col items-end gap-1">
                {product.oldPrice && product.discount ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="bg-red-600 text-white text-[12px] px-1.5 py-0.5 rounded font-bold">
                      {product.discount}٪
                    </span>

                    <span className="text-gray-400 text-xs line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </div>
                ) : (
                  <div className="h-5"></div>
                )}

                <div className="flex items-center gap-1 text-gray-900 mt-1">
                  <span className="text-[17px] font-bold tracking-tight">
                    {formatPrice(product.price)}
                  </span>

                  <span className="text-[11px] font-medium text-gray-500">
                    تومان
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
