"use client";

import ProductType from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { CiImageOff } from "react-icons/ci";
import { useState } from "react";
import { useSite } from "@/context/SiteContext";

export default function Card({ item, href, className }: { item: ProductType; href?: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const originalPrice = item.unit_price ?? item.price ?? 0;
  const finalPrice = item.final_price ?? item.discount_price ?? originalPrice;
  const hasDiscount = finalPrice < originalPrice;
  const { siteTitle } = useSite();
  const discountPercent = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
  const isAvailable = item.is_available !== undefined ? item.is_available : item.isDiscounted || true;
  const productHref = href || `/product/${item.slug}`;

  return (
    <Link href={productHref} title={item.name} className={`group/product relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.55rem] border-2 border-[#252923] bg-[#f7f5ef] p-3 text-[#252923] shadow-[5px_6px_0_#252923] transition-all duration-500 hover:-translate-y-1 hover:shadow-[8px_10px_0_#252923] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a65e43] sm:p-4 ${className || ""}`}>
      <div className="relative isolate flex min-h-[190px] items-center justify-center overflow-hidden rounded-[1.2rem] border border-[#d8d2c7] bg-[#e6e2d8] sm:min-h-[235px] md:min-h-[255px]">
        <span className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-[#d9c6b4] transition-transform duration-700 group-hover/product:scale-150" />
        <span className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full border-[18px] border-[#c8b995]/80 transition-transform duration-700 group-hover/product:scale-110" />
        {!imgError && item.cover_image ? <Image src={item.cover_image} alt={`${item.name} - ${siteTitle}`} width={500} height={420} loading="lazy" onError={() => setImgError(true)} className="relative z-[1] h-full max-h-[255px] w-full object-contain p-4 transition-transform duration-700 group-hover/product:scale-[1.07]" /> : <CiImageOff className="relative z-[1] size-16 text-[#777568]" />}
        <span className="absolute right-3 top-3 z-[2] rounded-full border-2 border-[#252923] bg-[#c8b995] px-3 py-1 text-[10px] font-black tracking-wide">AKHOONDI / SELECT</span>
        {hasDiscount && <span className="absolute left-3 top-3 z-[2] -rotate-3 rounded-full bg-[#a65e43] px-3 py-1.5 text-[10px] font-black text-white">{discountPercent.toLocaleString("fa-IR")}٪ تخفیف</span>}
        <span className="absolute bottom-3 left-3 z-[2] grid h-10 w-10 translate-y-2 place-items-center rounded-full border-2 border-[#252923] bg-[#59634f] text-white opacity-0 shadow-[3px_3px_0_#252923] transition-all duration-300 group-hover/product:translate-y-0 group-hover/product:opacity-100"><ArrowUpLeft size={19} /></span>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-black leading-7 sm:text-lg">{item.name}</h3>
            {item.category && <p className="mt-1 line-clamp-1 text-xs font-bold text-[#777568]">{item.category}</p>}
          </div>
          <ArrowUpLeft size={19} className="mt-1 shrink-0 text-[#59634f] transition-transform duration-300 group-hover/product:-translate-x-1 group-hover/product:-translate-y-1" />
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#d8d2c7] pt-4">
          <div className="min-w-0">
            {isAvailable ? <>
              {hasDiscount && <p className="text-xs font-bold text-[#9a9487] line-through">{originalPrice.toLocaleString("fa-IR")} تومان</p>}
              <p className="text-sm font-black leading-6 sm:text-base">{(hasDiscount ? finalPrice : originalPrice).toLocaleString("fa-IR")} <span className="text-[10px] text-[#777568]">تومان</span></p>
            </> : <p className="text-sm font-black text-[#a65e43]">ناموجود</p>}
          </div>
          <span className="shrink-0 rounded-full border-2 border-[#252923] bg-[#c8b995] px-3 py-2 text-[10px] font-black transition-colors group-hover/product:bg-[#59634f] group-hover/product:text-white sm:text-xs">{isAvailable ? "مشاهده محصول" : "جزئیات"} <span aria-hidden="true">↖</span></span>
        </div>
      </div>
    </Link>
  );
}
