import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";

export default function Failed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#f8fafc] text-zinc-950" dir="rtl">
      <div className="max-w-md w-full bg-white border border-red-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-xl shadow-red-500/10">
          <FaCircleXmark className="size-10" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-zinc-950 mb-2">
          پرداخت ناموفق بود
        </h1>

        <p className="text-xs sm:text-sm text-zinc-700 mb-6 leading-relaxed">
          متأسفانه تراکنش انجام نشد یا از سوی بانک رد شد. در صورت کسر وجه از حساب، مبلغ ظرف ۷۲ ساعت توسط بانک بازگشت داده خواهد شد.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/profile/cart"
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-red-500/20 text-center"
          >
            تلاش مجدد در سبد خرید
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/15 text-zinc-900 border border-zinc-200 text-xs sm:text-sm font-bold transition-all text-center"
          >
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
