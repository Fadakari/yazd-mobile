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
  
  const hasDiscount =
    discountPrice !== null && discountPrice > 0 && discountPrice < basePrice && basePrice > 0;

  const discountPercent = hasDiscount
    ? Math.round(((basePrice - discountPrice!) / basePrice) * 100)
    : 0;

  return (
    <div className="text-center space-y-2 flex flex-col justify-center items-center">
      {hasDiscount && (
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className="text-sm line-through text-zinc-500">
            {oldTotal.toLocaleString("fa-IR")} تومان
          </p>

          <span className="text-xs text-white bg-gradient-to-r from-red-600 to-rose-600 px-2.5 py-0.5 rounded-full font-black shadow-md shadow-red-500/30">
            {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
          </span>
        </div>
      )}

      <p className="font-black text-2xl text-red-700 flex items-center justify-center gap-1.5">
        <span>{finalTotal.toLocaleString("fa-IR")}</span>
        <span className="font-normal text-sm text-zinc-700">تومان</span>
      </p>
    </div>
  );
}
