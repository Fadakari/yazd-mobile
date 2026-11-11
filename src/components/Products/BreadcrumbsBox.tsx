"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { FiChevronLeft, FiHome } from "react-icons/fi";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsBoxProps = {
  title?: string;
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
};

export default function BreadcrumbsBox({
  title,
  items,
  separator,
  className = "",
}: BreadcrumbsBoxProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="مسیر راهنما"
      className={`w-full bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl px-5 py-3 mb-6 shadow-lg shadow-zinc-900/5 ${className}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs sm:text-sm text-zinc-500 flex items-center gap-1.5 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-600 hover:text-red-600 transition-colors"
          >
            <FiHome className="size-3.5 text-red-600" />
            <span className="hidden sm:inline">خانه</span>
          </Link>

          {items.map((item, idx) => {
            if (idx === 0 && (item.href === "/" || item.label === "خانه")) return null;
            return (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="text-zinc-400">
                  {separator || <FiChevronLeft className="size-3" />}
                </span>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-red-600 text-zinc-700 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-red-700 font-bold">
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {title && (
          <span className="text-xs text-zinc-500 font-medium hidden md:inline truncate max-w-[280px]">
            {title}
          </span>
        )}
      </div>
    </nav>
  );
}
