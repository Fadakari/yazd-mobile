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

export const SLIDER_THEMES = [
  {
    // ۱. آبی رویال یاقوتی (Deep Royal Sapphire)
    bg: "bg-gradient-to-l from-[#001438] via-[#002b80] to-[#001438]",
    glow1: "bg-blue-500/25",
    glow2: "bg-sky-400/20",
    shadow: "shadow-[0_18px_50px_rgba(0,31,92,0.25)]",
    cardHoverBorder: "hover:border-blue-400",
    priceText: "text-blue-700 group-hover:text-blue-800",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
    badgeBg: "bg-white/10 border-white/20 text-white",
    highlightColor: "text-blue-300",
  },
  {
    // ۲. آبی روشن آسمانی و لاجوردی شفاف (Bright Sky Blue & Azure)
    bg: "bg-gradient-to-l from-[#0369a1] via-[#0284c7] to-[#0ea5e9]",
    glow1: "bg-sky-300/35",
    glow2: "bg-cyan-300/25",
    shadow: "shadow-[0_18px_50px_rgba(2,132,199,0.3)]",
    cardHoverBorder: "hover:border-sky-400",
    priceText: "text-sky-700 group-hover:text-sky-800",
    buttonBg: "bg-sky-600 hover:bg-sky-700 text-white",
    badgeBg: "bg-white/20 border-white/30 text-white",
    highlightColor: "text-sky-100 font-black",
  },
  {
    // ۳. آبی نفتی و اقیانوسی عمیق (Oceanic Petrol Blue)
    bg: "bg-gradient-to-l from-[#02182b] via-[#043353] to-[#02182b]",
    glow1: "bg-cyan-500/25",
    glow2: "bg-teal-400/20",
    shadow: "shadow-[0_18px_50px_rgba(4,51,83,0.25)]",
    cardHoverBorder: "hover:border-cyan-400",
    priceText: "text-cyan-800 group-hover:text-cyan-900",
    buttonBg: "bg-cyan-700 hover:bg-cyan-800 text-white",
    badgeBg: "bg-white/10 border-white/20 text-cyan-100",
    highlightColor: "text-cyan-300",
  },
  {
    // ۴. آبی کبالت درخشان و زنده (Electric Cobalt Horizon)
    bg: "bg-gradient-to-l from-[#08183a] via-[#103478] to-[#08183a]",
    glow1: "bg-sky-400/30",
    glow2: "bg-blue-600/25",
    shadow: "shadow-[0_18px_50px_rgba(16,52,120,0.25)]",
    cardHoverBorder: "hover:border-sky-400",
    priceText: "text-[#0052cc] group-hover:text-blue-800",
    buttonBg: "bg-[#0052cc] hover:bg-blue-700 text-white",
    badgeBg: "bg-white/10 border-white/20 text-sky-100",
    highlightColor: "text-sky-300",
  },
];

interface Props {
  title: string;
  highlightTitle?: string;
  products: NewProductItem[];
  viewAllLink?: string;
  categoryId?: number;
  sort?: string;
  sectionId?: number;
  sectionType?: "product" | "category";
  themeIndex?: number;
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
  themeIndex = 0
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentTheme = SLIDER_THEMES[Math.abs(themeIndex) % SLIDER_THEMES.length];

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
    <section className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative" dir="rtl">
      {/* کادر اصلی اسلایدر با تم و گرادیانت اختصاصی بر اساس themeIndex */}
      <div className={`rounded-[28px] sm:rounded-[36px] ${currentTheme.bg} ${currentTheme.shadow} p-4 sm:p-6 md:p-7 relative overflow-hidden transition-colors duration-500`}>
        
        {/* نورپردازی ملایم شیشه‌ای پس‌زمینه */}
        <div className={`absolute -top-24 -right-24 w-80 h-80 ${currentTheme.glow1} rounded-full blur-3xl pointer-events-none`} />
        <div className={`absolute -bottom-24 -left-24 w-80 h-80 ${currentTheme.glow2} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10">
          {/* هدر اسلایدر */}
          <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`relative flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-2xl ${currentTheme.badgeBg} shadow-md`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M12 2 14.8 8.2 21.5 9l-5 4.5 1.5 6.7L12 16.7 6 20.2 7.5 13l-5-4 6.7-.8L12 2Z" /></svg>
              </span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight truncate">
                  {title} {highlightTitle && <span className={currentTheme.highlightColor}>{highlightTitle}</span>}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={buildViewAllLink()} className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-slate-900 border border-white/25 text-xs sm:text-sm font-black transition-all duration-300 group/all shadow-xs">
                <span>مشاهده همه</span>
                <span className="transition-transform duration-300 group-hover/all:-translate-x-1">←</span>
              </Link>
              <button onClick={() => scroll("right")} aria-label="محصولات بعدی" className="w-10 h-10 rounded-xl bg-white/95 hover:bg-white text-slate-800 hover:text-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer border border-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scroll("left")} aria-label="محصولات قبلی" className="w-10 h-10 rounded-xl bg-white/95 hover:bg-white text-slate-800 hover:text-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer border border-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          {/* کانتینر اسکرول با پدینگ بالا برای جلوگیری کامل از هرگونه بریده شدن (Clipping) در هاور */}
          <div 
            ref={scrollRef} 
            className="flex flex-nowrap gap-3.5 sm:gap-4.5 overflow-x-auto pt-4 sm:pt-6 pb-6 sm:pb-8 px-1 scroll-smooth snap-x snap-mandatory no-scrollbar relative z-10" 
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <article 
                key={product.id} 
                className={`flex-shrink-0 snap-start w-[185px] sm:w-[225px] md:w-[245px] bg-white rounded-3xl p-3 sm:p-3.5 relative group border-2 border-white ${currentTheme.cardHoverBorder} shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.22)] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]`}
              >
                
                {/* بخش کارت تمام‌عکس: نمایش چشم‌گیر و بزرگ کالای بدون پس‌زمینه */}
                <div className="relative w-full h-[185px] sm:h-[215px] rounded-2xl overflow-hidden flex items-center justify-center mb-2.5 bg-gradient-to-b from-slate-50/90 to-slate-50/30">
                  {/* بج درصد تخفیف شناور */}
                  {product.oldPrice && product.discount ? (
                    <span className="absolute top-2.5 right-2.5 z-20 bg-[#ef394e] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                      {product.discount}٪
                    </span>
                  ) : null}

                  {/* بج ویژه شناور */}
                  {product.isSpecial && (
                    <span className="absolute top-2.5 left-2.5 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                      ویژه
                    </span>
                  )}

                  {/* تصویر شناور با جلوه دراپ‌شدو کف */}
                  <Link href={`/product/${product.slug}`} className="block w-full h-full relative" aria-label={`مشاهده ${product.title}`}>
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      fill 
                      className="object-contain p-2.5 drop-shadow-[0_12px_22px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out group-hover:scale-110" 
                      sizes="(max-width: 768px) 185px, 245px" 
                    />
                  </Link>
                </div>

                {/* پنل مشخصات و قیمت با کنتراست فوق‌العاده بالا و خوانایی کامل */}
                <div className="flex flex-col flex-1 justify-between min-w-0 z-10 pt-2 border-t border-slate-100">
                  <h3 className="text-slate-950 font-black text-xs sm:text-[13px] leading-snug line-clamp-2 mb-2 text-right group-hover:text-blue-700 transition-colors min-h-[36px] sm:min-h-[40px]">
                    <Link href={`/product/${product.slug}`}>{product.title}</Link>
                  </h3>

                  <div className="flex flex-col gap-1 mt-auto">
                    {product.oldPrice && product.discount ? (
                      <div className="flex items-center justify-end">
                        <del className="text-slate-400 text-xs font-bold line-through">
                          {formatPrice(product.oldPrice)}
                        </del>
                      </div>
                    ) : (
                      <div className="h-4" />
                    )}

                    <div className="flex items-center justify-between w-full mt-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-base sm:text-lg font-black tracking-tight ${currentTheme.priceText}`}>
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">تومان</span>
                      </div>
                      
                      <Link 
                        href={`/product/${product.slug}`} 
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${currentTheme.buttonBg} flex items-center justify-center transition-all shadow-md active:scale-90`}
                        aria-label="مشاهده"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link href={buildViewAllLink()} className="sm:hidden flex items-center justify-center gap-1.5 w-full mt-2 py-3 rounded-2xl bg-white/15 border border-white/25 text-xs font-black text-white active:bg-white active:text-slate-900 transition-all">مشاهده همه محصولات <span>←</span></Link>
        </div>
      </div>
    </section>
  );
}
