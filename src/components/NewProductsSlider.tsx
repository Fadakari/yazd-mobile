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

export default function NewProductsSlider({ title, highlightTitle, products, viewAllLink = "/products", categoryId, sort, sectionId, sectionType }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  const buildViewAllLink = () => {
    const params = new URLSearchParams();
    if (sectionType === "product" && sectionId) params.append("section_id", sectionId.toString());
    else if (categoryId) params.append("category_id", categoryId.toString());
    if (sort) params.append("sort", sort);
    const queryString = params.toString();
    return queryString ? `${viewAllLink}?${queryString}` : viewAllLink;
  };

  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (!products?.length) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-9 md:py-11 relative" dir="rtl">
      <div className="rounded-[24px] sm:rounded-[30px] bg-white border border-slate-200/90 shadow-[0_12px_38px_rgba(15,23,42,0.07)] overflow-hidden">
        <div className="px-4 sm:px-6 pt-5 sm:pt-6">
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-[0_7px_18px_rgba(29,78,216,0.25)]">
                <span className="absolute inset-1 rounded-xl border border-white/20" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M12 2 14.8 8.2 21.5 9l-5 4.5 1.5 6.7L12 16.7 6 20.2 7.5 13l-5-4 6.7-.8L12 2Z" /></svg>
              </span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 truncate">{title} <span className="text-blue-700">{highlightTitle}</span></h2>
                <p className="hidden sm:block text-xs text-slate-500 mt-1">انتخابی از محصولات محبوب فروشگاه</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={buildViewAllLink()} className="hidden sm:flex items-center gap-1 text-xs sm:text-sm font-extrabold text-blue-700 hover:text-blue-900 transition-colors">مشاهده همه <span>←</span></Link>
              <button onClick={() => scroll("right")} aria-label="محصولات بعدی" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scroll("left")} aria-label="محصولات قبلی" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto overflow-y-hidden pb-5 sm:pb-6 pt-1 px-0.5 scroll-smooth no-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {products.map((product) => (
              <article key={product.id} className="flex-shrink-0 w-[168px] sm:w-[205px] md:w-[220px] bg-white rounded-2xl p-2.5 sm:p-3 relative group border border-slate-200 hover:border-blue-200 shadow-[0_5px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)] flex flex-col justify-between overflow-hidden transition-all duration-300">
                <div className="relative w-full aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2.5 sm:mb-3 border border-slate-100">
                  {product.isSpecial && <span className="absolute top-2 right-2 z-20 bg-red-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-1 rounded-lg shadow-sm">ویژه</span>}
                  <Link href={`/product/${product.slug}`} className="block w-full h-full relative" aria-label={`مشاهده ${product.title}`}>
                    <Image src={product.image} alt={product.title} fill className="object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105" sizes="220px" />
                  </Link>
                </div>

                <div className="px-0.5 sm:px-1 pb-1 flex flex-col flex-1 min-w-0">
                  <h3 className="text-slate-900 font-bold text-[11px] sm:text-[13px] leading-5 sm:leading-6 line-clamp-2 mb-2 sm:mb-3 text-right">
                    <Link href={`/product/${product.slug}`} className="hover:text-blue-700 transition-colors">{product.title}</Link>
                  </h3>

                  <div className="mt-auto pt-2.5 border-t border-slate-100 flex flex-col items-end gap-1">
                    {product.oldPrice && product.discount ? (
                      <div className="flex items-center justify-between w-full gap-1">
                        <span className="bg-red-600 text-white text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-black">{product.discount}٪</span>
                        <span className="text-slate-400 text-[10px] sm:text-xs line-through truncate">{formatPrice(product.oldPrice)}</span>
                      </div>
                    ) : <div className="h-4 sm:h-5" />}
                    <div className="flex items-baseline gap-1 text-slate-950 mt-0.5">
                      <span className="text-sm sm:text-[17px] font-black tracking-tight">{formatPrice(product.price)}</span>
                      <span className="text-[9px] sm:text-[11px] font-bold text-slate-500">تومان</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link href={buildViewAllLink()} className="sm:hidden flex items-center justify-center gap-1.5 w-full mb-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-blue-700 active:bg-blue-50 transition-colors">مشاهده همه محصولات <span>←</span></Link>
        </div>
      </div>
    </section>
  );
}
