import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#f8fafc] text-zinc-950" dir="rtl">
      <div className="max-w-md w-full bg-white border border-emerald-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10">
          <FaCircleCheck className="size-10" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-zinc-950 mb-2">
          پرداخت با موفقیت انجام شد!
        </h1>

        <p className="text-xs sm:text-sm text-zinc-700 mb-6 leading-relaxed">
          سفارش شما با موفقیت ثبت شد و به زودی جهت ارسال آماده خواهد شد. از همراهی شما با خوش‌طعم کماشدون سپاسگزاریم.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/profile/orders"
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-red-500/20 text-center"
          >
            مشاهده سفارش
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/15 text-zinc-900 border border-zinc-200 text-xs sm:text-sm font-bold transition-all text-center"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
