"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { BlogCategoryNode } from "@/types/categories";
import Link from "next/link";

interface CategoryTreeProps {
  categories: BlogCategoryNode[];
  isMobile?: boolean;
}

export default function CategoryTree({
  categories,
  isMobile = false,
}: CategoryTreeProps) {
  const [showModal, setShowModal] = useState(false);

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="w-full my-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs transition-all shadow-lg shadow-red-500/20"
        >
          نمایش دسته‌بندی‌های مقالات
        </button>

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />

              <motion.div
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 text-zinc-950 rounded-t-3xl p-5 z-50 max-h-[80vh] overflow-y-auto shadow-2xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                dir="rtl"
              >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-200">
                  <h2 className="text-base font-bold text-red-700">دسته‌بندی‌های مقالات</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-xs text-zinc-600 hover:text-zinc-950 px-2.5 py-1 rounded-lg bg-zinc-100 font-medium"
                  >
                    بستن
                  </button>
                </div>
                <div className="space-y-2 py-2">
                  {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="space-y-2" dir="rtl">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategoryItem({ category }: { category: BlogCategoryNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children.length > 0;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="border border-zinc-200 rounded-xl bg-zinc-50 overflow-hidden hover:border-red-400 transition-colors">
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-3.5 py-3 text-xs sm:text-sm text-zinc-800 font-medium hover:text-red-600 hover:bg-red-50/50 transition-colors"
        >
          <span>{category.title}</span>
          <ChevronLeft
            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
              isOpen ? "-rotate-90 text-red-600" : ""
            }`}
          />
        </button>
      ) : (
        <Link
          onClick={() => setIsOpen(false)}
          href={`/articles?category=${category.slug}`}
          className="block px-3.5 py-3 text-xs sm:text-sm text-zinc-800 font-medium hover:text-red-600 hover:bg-red-50/50 transition-colors"
        >
          {category.title}
        </Link>
      )}

      <motion.div
        animate={{ height }}
        transition={{ duration: 0.25, ease: "linear" }}
        style={{ overflow: "hidden" }}
      >
        <div ref={contentRef} className="px-3 py-2 border-t border-zinc-200 bg-[#f8fafc]/50">
          {hasChildren && (
            <div className="flex flex-col gap-2">
              {category.children.map((child) => (
                <CategoryItem key={child.id} category={child} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
