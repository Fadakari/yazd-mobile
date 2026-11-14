// src/components/CourseCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";

export interface CourseCardProps {
  item: any;
}

export default function CourseCard({ item }: { item: any }) {
  // این توضیحات ثابت جایگزین دیتای API شدند
  const staticDescription = "اینجا بخشی است که توضیح کوتاه مربوط به این دوره را نمایش می‌دهد.";

  return (
    <Link
      href={`/product/${item.slug}`}
      className="group flex flex-col p-5 bg-white rounded-[2rem] border-2 border-dashed border-[#0bb2c9]/40 transition-all duration-500 hover:bg-[#12465a] hover:border-[#12465a] hover:scale-[1.02] hover:shadow-2xl"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
        <Image src={item.image} alt={item.title} fill className="object-cover" />
      </div>

      {/* Info Row (Star + Student count) */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3 group-hover:text-white/70">
        <div className="flex items-center gap-1">
          <FiStar className="text-yellow-400" />
          <span>4.8</span>
        </div>
        <span>تعداد دانشجویان: 1250</span>
      </div>

      {/* Title */}
      <h3 className="text-sm md:text-base font-black text-[#12465a] group-hover:text-white mb-2 line-clamp-1 transition-colors">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 group-hover:text-white/80 leading-relaxed mb-4 flex-1">
        {staticDescription}
      </p>

      {/* Footer (Button + Price) */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-sm font-bold text-[#0bb2c9] group-hover:text-white transition-colors">
          {item.price.toLocaleString("fa-IR")} تومان
        </span>
        <button className="px-4 py-2 bg-[#0bb2c9] text-white text-xs font-bold rounded-lg group-hover:bg-white group-hover:text-[#12465a] transition-all">
          مشاهده دوره
        </button>
      </div>
    </Link>
  );
}