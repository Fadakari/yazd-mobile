"use client";
import ProductType from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import { ShoppingBasket } from "lucide-react";
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

  const hasDiscount = finalPrice < originalPrice;
  const { siteTitle } = useSite();

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  const isAvailable =
    item.is_available !== undefined
      ? item.is_available
      : item.isDiscounted || true;

  console.log({
    name: item.name,
    cover_image: item.cover_image,
  });

  return (
    <div
      key={item.id}
      title={item.name}
      className={`relative bg-[#fffefa] border border-[#ded9ce] rounded-[1.35rem] shadow-[0_8px_24px_rgba(37,41,35,.07)] p-3 sm:p-4 flex flex-col justify-between gap-3 h-full transition hover:shadow-xl ${className ?? ""}`}
    >
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#f0e4dd] text-[#a65e43] px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-xs md:text-sm font-bold">
            {discountPercent.toLocaleString("fa-IR")}% تخفیف
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="h-36 sm:h-48 md:h-56 flex justify-center items-center overflow-hidden rounded-xl">
          {!imgError && item.cover_image ? (
            <Image
              src={item.cover_image}
              alt={`${item.name} - ${siteTitle}`}
              width={400}
              height={300}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <CiImageOff className="size-12 sm:size-16 text-gray-400" />
          )}
        </div>

        <div className="text-center sm:text-start">
          <p className="font-bold text-base sm:text-lg text-[#252923] line-clamp-2">
            {item.name}
          </p>
          {item.category && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              {item.category}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#eeebe3] rounded-xl p-2 sm:p-3 mt-auto gap-2 sm:gap-0">
        <div className="text-center sm:text-start">
          {isAvailable ? (
            <>
              {hasDiscount ? (
                <>
                  <p className="line-through text-xs sm:text-sm text-zinc-500">
                    {originalPrice.toLocaleString("fa-IR")} تومان
                  </p>
                  <p className="font-bold text-lg sm:text-xl text-zinc-800">
                    {finalPrice.toLocaleString("fa-IR")} تومان
                  </p>
                </>
              ) : (
                <p className="font-bold text-lg sm:text-xl text-zinc-800">
                  {originalPrice.toLocaleString("fa-IR")} تومان
                </p>
              )}
            </>
          ) : (
            <p className="font-bold text-lg sm:text-xl text-zinc-800">
              ناموجود
            </p>
          )}
        </div>

        <Link
          href={href ? href : `/product/${item.slug}`}
          className={`btn flex justify-center items-center gap-2 py-2.5 sm:py-3.5 px-4 sm:px-5 rounded-full text-sm sm:text-md transition ${
            isAvailable
              ? "bg-[#59634f] hover:bg-[#41483b] text-white"
              : "!bg-[#9b9b8d] text-white"
          }`}
        >
          <ShoppingBasket className="size-5 sm:size-6" />
          {isAvailable ? "خرید محصول" : "مشاهده"}
        </Link>
      </div>
    </div>
  );
}
