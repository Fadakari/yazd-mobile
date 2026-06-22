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
  category?: string; // اضافه شده برای جزئیات بیشتر
  readTime?: string; // اضافه شده برای جزئیات بیشتر
  slug: string;
}

interface Props {
  posts: BlogPostItem[];
  title?: string;
}

export default function LatestBlogSection({ posts, title = "مجله خبری یزد موبایل" }: Props) {
  
  if (!posts || posts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center bg-white/50 border border-gray-100 rounded-[30px] p-10 shadow-sm backdrop-blur-sm relative overflow-hidden group">
           
           {/* بک‌گراند متحرک خفیف */}
           <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 via-orange-50/30 to-orange-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s]"></div>

           {/* آیکون انیمیشنی */}
           <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-400 mb-4 animate-bounce shadow-orange-100 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
           </div>

           <h3 className="text-xl font-bold text-gray-700 mb-2">هنوز مقاله‌ای منتشر نشده است!</h3>
           <p className="text-gray-400 text-sm max-w-md leading-relaxed">
             تیم محتوای ما به زودی جدیدترین اخبار و مقالات آموزشی را در اینجا قرار خواهد داد. منتظر باشید.
           </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50/50" dir="rtl">
      
      {/* --- پس‌زمینه دکوراتیو (Decoration Background) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <svg className="absolute top-[-10%] right-[-5%] text-orange-500/5 w-[500px] h-[500px] animate-pulse" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,32.3C59,43.1,47.1,51.8,35,59.2C22.9,66.6,10.6,72.7,-1.2,74.8C-13,76.9,-27.6,75,-40.4,68.2C-53.2,61.4,-64.2,49.7,-71.6,36.5C-79,23.3,-82.8,8.6,-80.6,-5C-78.4,-18.6,-70.2,-31.1,-60.5,-41.4C-50.8,-51.7,-39.6,-59.8,-27.6,-68.3C-15.6,-76.8,-2.8,-85.7,8.6,-82.8C20,-79.9,30.5,-73.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border-[20px] border-gray-100 opacity-60"></div>
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-orange-400 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- هدر بخش --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
             <span className="text-orange-500 font-bold text-sm tracking-wider flex items-center gap-2">
                <span className="w-8 h-[2px] bg-orange-500 inline-block"></span>
                وبلاگ و دانستنی‌ها
             </span>
             <h2 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight">
               {title}
             </h2>
          </div>
          <Link href="/articles" className="group flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-600 font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-orange-500/30">
             مشاهده آرشیو مقالات
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1">
               <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
             </svg>
          </Link>
        </div>

        {/* --- اسلایدر --- */}
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 10 },
              1024: { slidesPerView: 4, spaceBetween: 10 },
          }}
          className="!pb-12 !px-2"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id} className="h-auto">
              {/* --- کارت بلاگ --- */}
              <article className="group h-full bg-white rounded-[12px] border border-gray-100 overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col relative isolate">
                
                {/* بخش تصویر */}
                <div className="relative w-full h-60 overflow-hidden">
                   {/* تگ دسته بندی */}
                   <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                      {post.category || "تکنولوژی"}
                   </div>
                   
                   {/* تصویر */}
                   <Link href={`/article/${post.slug}`} className="block w-full h-full">
                     <Image
                       src={post.image}
                       alt={post.title}
                       fill
                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     {/* Overlay Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                   </Link>

                   {/* تاریخ (روی عکس) */}
                   <div className="absolute bottom-4 right-4 z-20 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      📅 {post.date}
                   </div>
                </div>

                {/* بخش محتوا */}
                <div className="p-6 flex flex-col flex-1 relative">
                   {/* آیکون پس‌زمینه محو */}
                   <svg className="absolute -left-4 -top-4 w-24 h-24 text-gray-50 rotate-12 -z-10 group-hover:text-orange-50 transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.00012 13.1707 11.0083 11.0186 12.9818 10.1983C13.562 9.95721 14.017 9.42998 14.017 8.80004V4.94164C14.017 4.14856 13.2359 3.58557 12.4901 3.82914C6.96349 5.6346 3 10.7431 3 16C3 18.7614 5.23858 21 8.00004 21H14.017ZM19.017 21L19.017 18C19.017 16.8954 18.1216 16 17.017 16H15C15 12.4697 16.2526 10.0381 17.9818 9.19833C18.562 8.95721 19.017 8.42998 19.017 7.80004V4.94164C19.017 4.14856 18.2359 3.58557 17.4901 3.82914C12.8715 5.33777 9.77889 8.93128 9.13322 13.064C9.55837 12.3789 10.2974 12 11.517 12H12.017C14.2261 12 16.017 13.7909 16.017 16V19C16.017 20.1046 16.9124 21 18.017 21H19.017Z"></path></svg>

                   <Link href={`/article/${post.slug}`}>
                      <h3 className="text-xl font-black text-gray-800 mb-3 leading-snug line-clamp-2 transition-colors group-hover:text-orange-600">
                         {post.title}
                      </h3>
                   </Link>
                   
                   <p className="text-gray-500 text-sm leading-7 line-clamp-3 mb-6 text-justify">
                      {post.excerpt}
                   </p>

                   {/* فوتر کارت */}
                   <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                      {/* نویسنده */}
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden relative">
                             {/* آواتار پلیس‌هولدر */}
                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} fill unoptimized />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400">نویسنده</span>
                            <span className="text-xs font-bold text-gray-700">{post.author}</span>
                         </div>
                      </div>

                      {/* زمان مطالعه */}
                      <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2 py-1 rounded-md text-[11px] font-bold">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                         </svg>
                         {post.readTime || "5 دقیقه"}
                      </div>
                   </div>
                </div>

                {/* نوار پایین رنگی */}
                <div className="h-1 w-0 bg-orange-500 transition-all duration-500 group-hover:w-full ease-in-out"></div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}