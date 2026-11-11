import { ShoppingCart, ArrowUpLeft } from "lucide-react";
import Link from "next/link";

export default function EmptyCart({ onClose }: any) {
  return (
    <div className="flex size-full flex-col items-center justify-center px-5 py-16 text-center">
      <div className="relative mb-6 grid h-24 w-24 place-items-center rounded-[1.7rem] border-2 border-[#252923] bg-[#e6e2d8] shadow-[4px_5px_0_#252923]">
        <span className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-[#c8b995]" />
        <ShoppingCart className="relative z-10 h-11 w-11 text-[#59634f]" />
      </div>
      <p className="mb-2 text-[10px] font-black tracking-[.2em] text-[#a65e43]">YOUR CART / EMPTY</p>
      <h2 className="mb-2 text-2xl font-black text-[#252923]">سبد خریدت هنوز خالیه</h2>
      <p className="mb-7 max-w-xs text-sm font-medium leading-7 text-[#777568]">محصولی به سبد خرید اضافه نکرده‌ای. برای شروع، مجموعه‌ها را ببین.</p>
      <Link href="/products" onClick={onClose} className="inline-flex items-center gap-3 rounded-full border-2 border-[#252923] bg-[#c8b995] px-6 py-3 font-black text-[#252923] shadow-[4px_4px_0_#252923] transition-all hover:-translate-y-0.5 hover:bg-[#d9c6b4]">
        رفتن به فروشگاه <ArrowUpLeft size={18} />
      </Link>
    </div>
  );
}
