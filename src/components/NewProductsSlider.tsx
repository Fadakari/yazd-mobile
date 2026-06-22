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
    let link = viewAllLink;
    const params = new URLSearchParams();
    
    // اگر از بخش product است و sectionId داریم، آن را پاس می‌دهیم
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

  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12 mb-8 relative group/section" dir="rtl">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 order-2 md:order-1 ml-auto relative">
          {/* Decorative Dot */}
          <span className="absolute -right-3 top-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight pr-2">
            {title} <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-600 to-orange-400">{highlightTitle}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto justify-end">
          <Link
            href={finalViewAllLink}
            className="hidden md:flex items-center gap-2 text-orange-600 bg-orange-50/50 hover:bg-orange-100 px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-orange-100 hover:shadow-sm"
          >
            مشاهده همه
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:text-white hover:bg-orange-500 hover:border-orange-500 bg-white transition-all shadow-sm hover:shadow-orange-500/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-full text-gray-500 hover:text-white hover:bg-orange-500 hover:border-orange-500 bg-white transition-all shadow-sm hover:shadow-orange-500/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- SLIDER --- */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-8 pt-4 px-2 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[200px] bg-white rounded-[12px] p-3 relative group transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange-400 shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] flex flex-col justify-between overflow-hidden"
          >
            {/* --- TOP SECTION (Image & Badges) --- */}
            <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-[20px] overflow-hidden mb-4 isolate">
              
              {/* Special Badge */}
              {product.isSpecial && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/30">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  فروش ویژه
                </div>
              )}

              {/* Wishlist Button (Visual Only) */}
              <button className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 hover:text-red-500 hover:bg-white shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Image */}
              <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/0 to-orange-50/0 group-hover:to-orange-50/50 transition-colors duration-500 z-10"></div>
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply"
                />
              </Link>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="px-2 pb-2 flex flex-col flex-1">
              
              {/* Title */}
              <h3 className="text-gray-700 font-bold text-[15px] leading-6 line-clamp-2 mb-2 text-right transition-colors group-hover:text-orange-600">
                <Link href={`/product/${product.slug}`}>
                  {product.title}
                </Link>
              </h3>

              {/* Pricing */}
              <div className="mt-auto pt-4 border-t border-dashed border-gray-100 flex flex-col items-end gap-0.5">
                {product.oldPrice && product.discount ? (
                  <div className="flex items-center gap-1.5">
                     <span className="flex items-center gap-0.5 bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
                      {product.discount}٪
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.036.044.11.127.19.238A5.25 5.25 0 0013.6 5.125a.55.55 0 00-.1-.187zM11.25 7a4.5 4.5 0 11-5.25 4.908.55.55 0 00-.573.19l-2.008 2.008a.75.75 0 001.06 1.06l1.203-1.202c.866.425 1.854.664 2.898.664a5.25 5.25 0 004.22-8.15l.626-.626a.75.75 0 00-1.06-1.06l-1.118 1.118z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-400 text-xs line-through decoration-rose-400/50 decoration-1">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </div>
                ) : (
                   <div className="h-6"></div>
                )}
                
                <div className="flex items-center gap-1 text-gray-800">
                  <span className="text-[19px] font-black tracking-tight">{formatPrice(product.price)}</span>
                  <span className="text-[11px] font-medium text-gray-500 mb-1">تومان</span>
                </div>
              </div>
            </div>

            {/* Action Button - Full Width Bottom */}
            <Link 
                href={`/product/${product.slug}`}
                className="group/btn relative overflow-hidden w-full h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center transition-all duration-300 hover:bg-orange-500 hover:text-white"
            >
                 <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-0 opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/btn:opacity-100 whitespace-nowrap text-[13px] font-bold transition-all duration-300">
                    خرید کنید
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                 </div>
            </Link>
            
          </div>
        ))}
      </div>
    </section>
  );
}