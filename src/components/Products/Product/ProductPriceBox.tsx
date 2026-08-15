"use client";

import { useProductOptions } from "@/context/ProductContext";
import ProductType from "@/types/product";

interface Props {
  product: ProductType;
}

export default function ProductPriceBox({ product }: Props) {
  const { selectedColor, selectedMaterial } = useProductOptions();

  if (!product.is_available || product.stock <= 0) return null;

  const basePrice = product.price ?? 0;

  let discountPrice =
    typeof product.discount_price === "number" ? product.discount_price : null;

  // اگر تخفیف 0 بود، برابر با قیمت اصلی بگذار (یعنی تخفیفی نیست)
  if (discountPrice === 0) {
    discountPrice = basePrice;
  }

  const finalPrice =
    typeof product.final_price === "number"
      ? product.final_price
      : discountPrice !== null
      ? discountPrice
      : basePrice;

  const colorPrice = selectedColor?.price ?? 0;
  const materialPrice = selectedMaterial?.price ?? 0;

  const oldTotal = basePrice + colorPrice + materialPrice;
  const finalTotal = finalPrice + colorPrice + materialPrice;
  
  // تخفیف فقط زمانی وجود دارد که:
  // 1. قیمت تخفیفی > 0 باشد (یعنی یک قیمت واقعی است)
  // 2. قیمت تخفیفی < قیمت اصلی باشد
  const hasDiscount =
    discountPrice !== null && discountPrice > 0 && discountPrice < basePrice && basePrice > 0;

  const discountPercent = hasDiscount
    ? Math.round(((basePrice - discountPrice!) / basePrice) * 100)
    : 0;

  return (
    <div className="px-5 pt-3 text-center space-y-2 rounded-md flex flex-col justify-center items-center">
      {hasDiscount && (
        <div className="flex items-center justify-start mb-2">
          <p className="text-base line-through text-zinc-500">
            {oldTotal.toLocaleString("fa-IR")} تومان
          </p>

          <div className="text-sm text-red-600 bg-red-200 px-2.5 py-1 rounded-full mr-2 pt-1.5 font-bold">
            <span>{discountPercent}%</span>
          </div>
        </div>
      )}

      <p className="font-dana font-bold text-2xl">
        {finalTotal.toLocaleString("fa-IR")}
        <span className="font-light text-base ml-1">تومان</span>
      </p>
    </div>
  );
}
