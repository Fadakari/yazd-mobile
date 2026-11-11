import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCart({ onClose }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center size-full" dir="rtl">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
          <ShoppingBag className="w-10 h-10" />
        </div>
      </div>
      <h2 className="text-lg sm:text-xl font-extrabold text-zinc-950 mb-2">
        سبد خرید شما خالی است
      </h2>
      <p className="text-xs sm:text-sm text-zinc-500 mb-6 max-w-xs">
        هنوز محصولی به سبد خریدتان اضافه نکرده‌اید. طعم‌های ترد و برگزیده ما را کشف کنید!
      </p>
      <Link
        href="/products"
        onClick={onClose}
        className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-red-500/25 active:scale-95"
      >
        مشاهده و سفارش محصولات
      </Link>
    </div>
  );
}
