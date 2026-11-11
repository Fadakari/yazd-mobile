import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div dir="rtl" className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f7f5ef]/90 px-6 backdrop-blur-xl">
      <div className="relative flex w-full max-w-xs flex-col items-center rounded-[2rem] border-2 border-[#252923] bg-[#f7f5ef] px-8 py-10 text-center shadow-[8px_9px_0_#252923]">
        <div className="absolute -left-5 -top-5 h-16 w-16 rounded-full border-[10px] border-[#c8b995]" />
        <div className="relative mb-6 grid h-24 w-24 place-items-center rounded-[1.7rem] border-2 border-[#252923] bg-[#e6e2d8] shadow-[4px_4px_0_#252923]">
          <span className="absolute inset-1 rounded-[1.3rem] border-2 border-transparent border-t-[#59634f] border-l-[#a65e43] animate-spin" />
          <Image src="/logo.png" alt="گروه آخوندی" width={62} height={62} className="relative z-10 object-contain" />
        </div>
        <p className="text-[10px] font-black tracking-[.22em] text-[#a65e43]">AKHOONDI / DESIGN GROUP</p>
        <h2 className="mt-3 text-xl font-black text-[#252923]">در حال آماده‌سازی فضا...</h2>
        <div className="mt-5 flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#59634f] [animation-delay:-.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#c8b995] [animation-delay:-.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#a65e43]" />
        </div>
      </div>
    </div>
  );
}
