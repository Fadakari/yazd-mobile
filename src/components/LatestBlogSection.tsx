"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface BlogPostItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category?: string;
  readTime?: string;
  slug: string;
}

export default function LatestBlogSection({ posts }: { posts: BlogPostItem[] }) {
  const [prevEl, setPrevEl] = React.useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLElement | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="relative w-full py-8 sm:py-14 bg-transparent" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        {/* --- هدر بخش مقالات --- */}
        <div className="flex items-center justify-between mb-5 sm:mb-7 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 text-white shadow-[0_8px_22px_rgba(29,78,216,0.35)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c1.026 0 1.995.187 2.875.526a.75.75 0 0 0 .875-.707V4.319a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" /></svg>
            </span>
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                مجله تخصصی و مقالات روز
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                راهنمای خرید هوشمند، بررسی‌های کاربردی و دانستنی‌ها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link 
              href="/articles" 
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs sm:text-sm font-black transition-all shadow-xs group/link"
            >
              <span>مشاهده همه مقالات</span>
              <span className="transition-transform duration-300 group-hover/link:-translate-x-1">←</span>
            </Link>
            
            <button 
              ref={(node) => setNextEl(node)} 
              aria-label="مقاله بعدی" 
              className="w-10 h-10 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
            </button>
            <button 
              ref={(node) => setPrevEl(node)} 
              aria-label="مقاله قبلی" 
              className="w-10 h-10 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* --- اسلایدر کارت‌های ژورنالی و جذاب --- */}
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          spaceBetween={16}
          navigation={{ prevEl, nextEl }}
          breakpoints={{
            480: { slidesPerView: 1.5, spaceBetween: 16 },
            640: { slidesPerView: 2.1, spaceBetween: 18 },
            768: { slidesPerView: 2.7, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 22 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="!pt-4 sm:!pt-6 !pb-8 !px-2"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id} className="h-auto">
              <article className="group h-full bg-white rounded-3xl border-2 border-slate-200/90 hover:border-blue-600 overflow-hidden shadow-[0_6px_22px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)] transition-all duration-300 flex flex-col relative isolate hover:-translate-y-1 active:scale-[0.98]">
                
                {/* کاور تصویر ژورنالی */}
                <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-100">
                  {/* بج دسته‌بندی شناور */}
                  <div className="absolute top-3 right-3 z-20 bg-blue-600/95 backdrop-blur-md text-white font-black text-[11px] px-3 py-1 rounded-xl shadow-md">
                    {post.category || "مقالات"}
                  </div>

                  {/* بج زمان مطالعه برای افزایش کنجکاوی و کلیک */}
                  <div className="absolute top-3 left-3 z-20 bg-black/55 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{post.readTime || "۵ دقیقه مطالعه"}</span>
                  </div>

                  {/* بج تاریخ انتشار */}
                  {post.date && (
                    <div className="absolute bottom-3 right-3 z-20 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      <span>{post.date}</span>
                    </div>
                  )}
                  
                  <Link href={`/article/${post.slug}`} className="block w-full h-full relative" aria-label={post.title}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none" />
                  </Link>
                </div>

                {/* محتوای متنی مقاله */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <Link href={`/article/${post.slug}`}>
                      <h3 className="text-sm sm:text-base font-black text-slate-950 mb-2 leading-snug line-clamp-2 transition-colors group-hover:text-blue-600 min-h-[44px]">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4 text-justify font-medium">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* پاورقی کارت با دکمه جذاب اقدام */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">
                        {post.author ? post.author[0] : "✎"}
                      </span>
                      <span>{post.author || "تحریریه"}</span>
                    </div>

                    <Link 
                      href={`/article/${post.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs"
                    >
                      <span>خواندن مقاله</span>
                      <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
                    </Link>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <Link 
          href="/articles" 
          className="sm:hidden flex items-center justify-center gap-1.5 w-full mt-2 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-black text-blue-700 active:bg-blue-600 active:text-white transition-all"
        >
          مشاهده همه مقالات <span>←</span>
        </Link>
      </div>
    </section>
  );
}