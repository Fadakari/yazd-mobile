"use client";

import ProductType from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import { ShoppingBasket, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";

export default function Card({
  item,
  href,
  className,
}: {
  item: ProductType;
  href?: string;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const originalPrice = item.unit_price ?? item.price ?? 0;
  const finalPrice = item.final_price ?? item.discount_price ?? originalPrice;
  const hasDiscount = finalPrice > 0 && finalPrice < originalPrice;
  const { siteTitle } = useSite();

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  const isAvailable =
    item.is_available !== undefined
      ? item.is_available
      : item.isDiscounted || true;

  const productLink = href ? href : `/product/${item.slug}`;

  return (
    <div
      key={item.id}
      title={item.name}
      className={`relative bg-white border border-zinc-200/90 hover:border-red-400 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_30px_-6px_rgba(220,38,38,0.12),0_8px_16px_-4px_rgba(217,119,6,0.1)] rounded-2xl p-3 sm:p-4 flex flex-col justify-between gap-3 h-full transition-all duration-300 group ${className ?? ""}`}
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {hasDiscount ? (
          <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-md shadow-red-500/30">
            {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
          </span>
        ) : (
          <span />
        )}

        <span className="bg-zinc-100/95 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
          <Sparkles className="size-2.5 text-amber-500" />
          <span>خوش طعم</span>
        </span>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        {/* Product Image */}
        <Link
          href={productLink}
          className="h-44 sm:h-52 md:h-56 flex justify-center items-center overflow-hidden rounded-xl bg-gradient-to-b from-zinc-50 to-amber-50/20 border border-zinc-100 p-2 relative group-hover:border-red-300 transition-colors"
        >
          {!imgError && item.cover_image ? (
            <Image
              src={item.cover_image}
              alt={`${item.name} - ${siteTitle || "خوش طعم کماشدون"}`}
              width={400}
              height={300}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <CiImageOff className="size-14 text-zinc-300" />
          )}
        </Link>

        {/* Product Title & Category */}
        <div className="text-start mt-1">
          <Link href={productLink}>
            <p className="font-bold text-sm sm:text-base text-zinc-950 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
              {item.name}
            </p>
          </Link>
          {item.category && (
            <p className="text-xs text-red-700 font-semibold mt-1">
              {item.category}
            </p>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-zinc-50 rounded-xl p-2.5 sm:p-3 mt-auto gap-2 sm:gap-1 border border-zinc-200">
        <div className="text-start">
          {isAvailable ? (
            <>
              {hasDiscount ? (
                <>
                  <p className="line-through text-xs text-zinc-400 font-medium">
                    {originalPrice.toLocaleString("fa-IR")} تومان
                  </p>
                  <p className="font-black text-base sm:text-lg text-red-700">
                    {finalPrice.toLocaleString("fa-IR")}{" "}
                    <span className="text-[11px] font-normal text-zinc-500">تومان</span>
                  </p>
                </>
              ) : (
                <p className="font-black text-base sm:text-lg text-zinc-950">
                  {originalPrice > 0 ? (
                    <>
                      {originalPrice.toLocaleString("fa-IR")}{" "}
                      <span className="text-[11px] font-normal text-zinc-500">تومان</span>
                    </>
                  ) : (
                    <span className="text-red-700 text-sm font-bold">تماس جهت استعلام</span>
                  )}
                </p>
              )}
            </>
          ) : (
            <p className="font-bold text-sm text-zinc-400">ناموجود</p>
          )}
        </div>

        <Link
          href={productLink}
          className={`inline-flex justify-center items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
            isAvailable
              ? "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-500/20"
              : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
          }`}
        >
          <ShoppingBasket className="size-4" />
          <span>{isAvailable ? "خرید" : "مشاهده"}</span>
        </Link>
      </div>
    </div>
  );
}
