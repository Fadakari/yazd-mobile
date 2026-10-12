"use client";

import React, { useState, useEffect } from "react";

export default function BackToTopButton({ mode = "inline" }: { mode?: "inline" | "floating" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mode !== "floating") return;
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (mode === "floating") {
    if (!visible) return null;
    return (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white shadow-[0_8px_25px_rgba(2,132,199,0.35)] hover:shadow-[0_12px_30px_rgba(2,132,199,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/30"
        aria-label="بازگشت به بالای صفحه"
        title="بازگشت به بالا"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={scrollToTop}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs sm:text-sm font-black transition-all duration-300 shadow-xs cursor-pointer border border-slate-200 hover:border-blue-600 active:scale-95"
      aria-label="بازگشت به بالای صفحه"
    >
      <span>بازگشت به بالا</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    </button>
  );
}
