"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AiGallerySection({ apiData }: { apiData: any[] }) {
  // انتخاب 3 بخش اول که از نوع محصول هستند
  const productSections = apiData.filter(section => section.item_type === "product").slice(0, 5);
  const [activeTab, setActiveTab] = useState(productSections[0]?.title || "");

  const activeSection = productSections.find(s => s.title === activeTab) || productSections[0];

  return (
    <section className="w-full bg-[#12465a] py-16 px-4 dir-rtl rounded-4xl">
      <div className="container mx-auto max-w-6xl relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex flex-col gap-2 items-center md:items-start text-white">
            <h2 className="text-2xl md:text-3xl font-black">ساخته شده با پرامپت هوش مصنوعی</h2>
            <p className="opacity-70 font-medium">پرامپت‌های آماده هوش مصنوعی ...</p>
          </div>

          {/* Tabs Section */}
          <div className="flex items-center gap-6 relative">
             {/* Arrow Image */}
            <div className="hidden lg:block absolute -top-8 -left-32">
              <Image src="/assets/48448447.webp" alt="arrow" width={100} height={40} className="object-contain" />
            </div>

            <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/10">
              {productSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.title)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === section.title 
                      ? "bg-white text-[#12465a] shadow-lg" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Section (3 Columns as requested) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSection?.products?.slice(0, 3).map((product: any) => (
            <Link 
              key={product.id} 
              href={`/product/${product.slug}`}
              className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-[#0bb2c9] transition-all duration-500"
            >
              {/* Image with Gradient Shadow */}
              <div className="relative aspect-square">
                <Image 
                    src={product.cover_image || "/logo.png"} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                {/* Gradient Shadow for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
              </div>
              
              {/* Product Title overlay */}
              <div className="absolute bottom-0 w-full p-6">
                <h4 className="text-white font-bold text-lg truncate">{product.name}</h4>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Button */}
        <div className="mt-12 text-center">
          <Link href="/prompts" className="inline-block px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white hover:text-[#12465a] transition-all duration-300">
            رفتن به کتابخانه پرامپت
          </Link>
        </div>
      </div>
    </section>
  );
}