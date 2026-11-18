import React from "react";
import Image from "next/image";


export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md transition-all">
      <div className="relative flex flex-col items-center justify-center gap-8">
        
        {/* --- انیمیشن حلقه‌های چرخان --- */}
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* حلقه بیرونی */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-r-cyan-500/20 border-t-cyan-500/20 animate-spin duration-[3s]"></div>
          
          {/* حلقه میانی (اصلی) */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-600 border-l-cyan-600 animate-spin"></div>
          
        </div>

        {/* --- متن لودینگ --- */}
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-cyan-700">در حال بارگذاری</span>
                <span className="flex gap-0.5 pt-1">
                    <span className="w-1 h-1 bg-cyan-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-cyan-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-cyan-600 rounded-full animate-bounce"></span>
                </span>
            </div>
        </div>

      </div>
    </div>
  );
}