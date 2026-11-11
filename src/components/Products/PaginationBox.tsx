"use client";

import type { PaginationItemRenderProps } from "@heroui/react";
import React from "react";
import { cn, Pagination, PaginationItemType } from "@heroui/react";
import { GoChevronLeft } from "react-icons/go";
import { useRouter } from "next/navigation";

export default function PaginationBox({
  page,
  count,
  searchParams,
  href,
  total,
}: {
  page?: number;
  count?: number;
  searchParams: any;
  isShow?: boolean;
  href?: string;
  total?: number;
}) {
  const router = useRouter();
  const itemsPerPage = 24;

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "hover:bg-zinc-100 text-zinc-700 rounded-xl min-w-8 w-8 h-8 flex items-center justify-center transition-colors"
          )}
          onClick={onNext}
          aria-label="صفحه بعد"
        >
          <GoChevronLeft className="size-4" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "hover:bg-zinc-100 text-zinc-700 rounded-xl min-w-8 w-8 h-8 flex items-center justify-center transition-colors"
          )}
          onClick={onPrevious}
          aria-label="صفحه قبل"
        >
          <GoChevronLeft className="size-4 rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button
          key={key}
          className={`${className} !text-sm text-zinc-400`}
        >
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          `${className} text-xs font-semibold rounded-xl min-w-8 h-8 transition-all`,
          isActive
            ? "text-white bg-gradient-to-r from-red-600 to-amber-600 font-bold shadow-md shadow-red-500/20"
            : "text-zinc-700 hover:bg-zinc-100 hover:text-red-600"
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  const calculatedTotal = total ? total : count ? Math.ceil(count / itemsPerPage) : 1;
  if (calculatedTotal <= 1) return null;

  return (
    <Pagination
      dir="rtl"
      disableCursorAnimation
      showControls
      className="gap-2"
      initialPage={page || 1}
      radius="full"
      renderItem={renderItem}
      total={calculatedTotal}
      boundaries={2}
      variant="light"
      onChange={(newPage) => {
        const params = total
          ? ""
          : new URLSearchParams(searchParams).toString();
        router.push(`/${href ? href : "products"}/page/${newPage}?${params}`);
      }}
    />
  );
}
