import Image from "next/image";
import Link from "next/link";

function NotFound({
  link,
  linkText,
  text,
}: {
  link?: string;
  linkText?: string;
  text?: string;
}) {
  return (
    <div className="w-full min-h-[60vh] flex flex-col gap-4 items-center justify-center text-center p-6 text-zinc-900" dir="rtl">
      <div className="relative w-28 h-28 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-4xl font-black mb-2 shadow-2xl shadow-amber-500/10">
        ۴۰۴
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-white">
        صفحه مورد نظر یافت نشد!
      </h2>
      <p className="text-xs sm:text-sm text-zinc-500 max-w-md leading-relaxed">
        {text ||
          "ممکن است نشانی را اشتباه وارد کرده باشید یا این صفحه به نشانی جدیدی منتقل شده باشد."}
      </p>
      <Link
        href={link || "/"}
        className="mt-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-red-500/25 active:scale-95"
      >
        {linkText || "بازگشت به صفحه اصلی"}
      </Link>
    </div>
  );
}

export default NotFound;
