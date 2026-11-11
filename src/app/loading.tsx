"use client";

import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden select-none transition-all"
      dir="rtl"
    >
      {/* 1. Atmospheric Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-400/15 via-red-500/10 to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-7 z-10 px-6">
        
        {/* 2. Responsive Wide Brand Emblem Showcase */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Subtle Warm Halo */}
          <div className="absolute w-72 sm:w-96 h-28 rounded-full bg-gradient-to-r from-red-600/15 via-amber-400/15 to-transparent blur-2xl animate-pulse pointer-events-none" />

          <div className="relative h-28 sm:h-36 md:h-44 w-auto max-w-[360px] sm:max-w-[460px] md:max-w-[540px] flex items-center justify-center">
            <img
              src="/logo.png"
              alt="صنایع غذایی خوش طعم کماشدون"
              className="h-24 sm:h-32 md:h-38 w-auto max-w-full object-contain animate-pulse [animation-duration:2.4s] filter drop-shadow-md"
            />
          </div>
        </div>

        {/* 3. Persian Animated Progress Shimmer Bar & Typography */}
        <div className="flex flex-col items-center gap-3.5 text-center">
          <div className="w-64 sm:w-80 h-2 bg-zinc-200 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 w-32 bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-full animate-shimmer" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-base sm:text-lg font-black text-red-700">
              در حال آماده‌سازی طعم‌های اصیل
            </span>
            <span className="flex gap-1.5 pt-0.5">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
            </span>
          </div>

          <span className="text-xs sm:text-sm text-zinc-700 font-bold">
            تولیدکننده تخصصی پودر سوخاری، کتلت و چاشنی‌های غذایی
          </span>
        </div>

      </div>
    </div>
  );
}
