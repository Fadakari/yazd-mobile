// app/payment/cancelled/page.tsx
import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";

export default function Cancelled() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#f7f5ef]">
      <FaCircleXmark className="text-[#a65e43] size-24 mb-6 drop-shadow-lg" />

      <h1 className="text-2xl font-semibold text-[#252923] mb-2">
        پرداخت لغو شد
      </h1>

      <p className="text-[#777568] mb-6">
        پرداخت شما توسط کاربر یا بانک لغو شده است. در صورت نیاز می‌توانید دوباره
        پرداخت را انجام دهید.
      </p>

      <div className="flex gap-4">
        <Link
          href="/cart"
          className="bg-[#59634f] hover:bg-[#41483b] text-white px-6 py-2 rounded-full transition"
        >
          بازگشت به سبد خرید
        </Link>
        <Link
          href="/"
          className="border border-[#ded9ce] hover:bg-[#eeebe3] text-[#252923] px-6 py-2 rounded-lg transition"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
