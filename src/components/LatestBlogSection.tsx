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
  if (!posts || posts.length === 0) return null;

  return (
    <section className="relative w-full py-16 bg-gray-50 border-t border-gray-100" dir="rtl">
      <div className="container mx-auto px-4 relative z-10">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex flex-col gap-2">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
               جدیدترین مقالات و اخبار
             </h2>
          </div>
          <Link href="/articles" className="group flex items-center gap-1 text-primary text-sm font-bold transition-all">
             مشاهده همه مقالات
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1">
               <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
             </svg>
          </Link>
        </div>

        {/* --- Slider --- */}
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
          }}
          className="!pb-8 !px-1"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id} className="h-auto">
              <article className="group h-full bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative isolate">
                
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                   {/* Category Badge */}
                   <div className="absolute top-3 right-3 z-20 bg-white/95 px-2 py-1 rounded text-[11px] font-bold text-primary shadow-sm">
                      {post.category || "مقالات"}
                   </div>
                   
                   <Link href={`/article/${post.slug}`} className="block w-full h-full">
                     <Image
                       src={post.image}
                       alt={post.title}
                       fill
                       className="object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                   </Link>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                   <Link href={`/article/${post.slug}`}>
                      <h3 className="text-sm font-bold text-gray-800 mb-2 leading-6 line-clamp-2 transition-colors hover:text-primary">
                         {post.title}
                      </h3>
                   </Link>
                   
                   <p className="text-gray-500 text-xs leading-6 line-clamp-2 mb-4 text-justify">
                      {post.excerpt}
                   </p>

                   {/* Footer */}
                   <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-gray-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                         <span className="font-medium text-gray-600">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <span>{post.date}</span>
                      </div>
                   </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}