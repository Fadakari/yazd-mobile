"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GoChevronLeft } from "react-icons/go";

export interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  link: string;
}

interface Props {
  categories: CategoryItem[];
}

export default function CategorySection({ categories }: Props) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-20 bg-[#eef5f8] dir-rtl">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-black text-[#12465a] mb-4">دسته‌بندی محصولات</h2>
          {/* خط تزئینی زیر تیتر برای زیبایی بیشتر */}
          <div className="flex gap-2">
             <div className="w-12 h-1.5 bg-[#12465a] rounded-full"></div>
             <div className="w-4 h-1.5 bg-[#0bb2c9] rounded-full"></div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[100%] mx-auto">
          {categories.slice(0, 6).map((cat) => (
            <Link 
              key={cat.id}
              href={cat.link}
              className="group relative flex items-center p-5 bg-white rounded-3xl shadow-[0_5px_15px_rgba(0,0,0,0.2)] border border-transparent hover:border-[#0bb2c9]/30 hover:shadow-[0_20px_40px_rgba(11,178,201,0.12)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* افکت نوری محو در پس‌زمینه هنگام هاور */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#0bb2c9]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* باکس آیکون با کنتراست بالا */}
              <div className="relative z-10 w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-[1.25rem] bg-[#12465a] shadow-[0_8px_20px_rgba(18,70,90,0.25)] group-hover:bg-[#0bb2c9] group-hover:shadow-[0_10px_25px_rgba(11,178,201,0.4)] transition-all duration-500 group-hover:scale-105 group-hover:-rotate-6">
                <div className="relative w-8 h-8">
                   <Image
                    src={cat.icon}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* بخش متنی */}
              <div className="relative z-10 flex flex-col gap-1 pr-5">
                <h3 className="text-lg font-black text-[#12465a] group-hover:text-[#0bb2c9] transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                   مشاهده و بررسی
                </p>
              </div>

              {/* دکمه فلش‌دار متحرک (ورود از چپ به راست هنگام هاور) */}
              <div className="absolute left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100 group-hover:bg-[#12465a] group-hover:text-white group-hover:border-transparent transition-all duration-500 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                  <GoChevronLeft className="text-xl" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}