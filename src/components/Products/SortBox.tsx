"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaSlidersH } from "react-icons/fa";
import { HiArrowsUpDown } from "react-icons/hi2";
import FilterBox from "./FilterBox";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { HiXMark } from "react-icons/hi2";

export default function SortBox() {
  const sortOptions = [
    { label: "جدیدترین", value: "newest" },
    { label: "محبوب‌ترین", value: "popularity" },
    { label: "ارزان‌ترین", value: "price_asc" },
    { label: "گران‌ترین", value: "price_desc" },
  ];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";

  return (
    <>
      {/* Desktop Sort Box */}
      <div className="hidden lg:flex items-center justify-between bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl px-5 py-3.5 shadow-lg shadow-zinc-900/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-red-700 font-bold select-none">
            <HiArrowsUpDown className="size-4" />
            <span>مرتب‌سازی بر اساس:</span>
          </div>
          <div className="flex items-center gap-2">
            {sortOptions.map((option, i) => (
              <button
                key={i}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-300 font-semibold ${
                  currentSort === option.value
                    ? "bg-gradient-to-r from-red-600 to-amber-600 text-white font-black shadow-md shadow-red-500/20"
                    : "text-zinc-700 hover:text-red-600 hover:bg-zinc-100"
                }`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter & Sort */}
      <div className="lg:hidden flex items-center gap-3">
        <button
          onClick={onOpen}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-500/25 active:scale-95 transition-all"
        >
          <FaSlidersH className="size-4" />
          <span>فیلتر و دسته‌بندی</span>
        </button>

        <div className="relative flex-1">
          <select
            name="sort"
            id="sort"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full bg-white border border-zinc-200 text-zinc-900 text-xs py-3 px-4 rounded-xl appearance-none outline-none focus:border-amber-400"
          >
            {sortOptions.map((opt, i) => (
              <option key={i} value={opt.value} className="bg-white text-zinc-900">
                مرتب‌سازی: {opt.label}
              </option>
            ))}
          </select>
          <HiArrowsUpDown className="size-4 absolute left-3 top-3.5 text-red-600 pointer-events-none" />
        </div>

        <Drawer
          hideCloseButton
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="right"
          classNames={{
            base: "max-w-[340px] bg-white text-zinc-900 border-l border-zinc-200",
            backdrop: "bg-black/50 backdrop-blur-md",
          }}
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="border-b border-zinc-200 px-5 py-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm text-red-700">فیلتر پیشرفته محصولات</span>
                    <button type="button" onClick={onClose} className="p-1 text-zinc-500 hover:text-white">
                      <HiXMark className="size-6" />
                    </button>
                  </div>
                </DrawerHeader>

                <DrawerBody className="p-4 overflow-y-auto">
                  <FilterBox isShow />
                </DrawerBody>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
