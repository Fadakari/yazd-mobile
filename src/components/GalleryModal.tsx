"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useCallback } from "react";

function GalleryModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-md animate-fade"
      onClick={handleBackdropClick}
      dir="rtl"
    >
      <div className="relative w-full container max-h-[90vh] overflow-auto rounded-t-3xl bg-white border-t border-zinc-200 text-zinc-950 p-6 shadow-2xl animate-fade-up">
        <button
          onClick={handleClose}
          className="absolute top-4 left-5 text-2xl font-bold text-zinc-500 hover:text-amber-400 transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default GalleryModal;
