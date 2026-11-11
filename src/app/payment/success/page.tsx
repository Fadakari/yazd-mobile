// app/payment/success/page.tsx
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#f7f5ef]">
      <FaCircleCheck className="text-[#59634f] size-24 mb-6 drop-shadow-lg" />

      <h1 className="text-2xl font-semibold text-[#252923] mb-2">
        پرداخت با موفقیت انجام شد!
      </h1>

      <p className="text-[#777568] mb-6">
        سفارش شما با موفقیت ثبت شد. جزئیات سفارش برای شما ارسال شده است.
      </p>

      {/* اگر شماره سفارش دارید می‌تونید اینجا نمایش بدید */}
      {/* <p className="text-sm text-gray-500 mb-4">شماره سفارش: 123456</p> */}

      <div className="flex gap-4">
        <Link
          href="/profile/orders"
          className="bg-[#59634f] hover:bg-[#41483b] text-white px-6 py-2 rounded-full transition"
        >
          مشاهده سفارش
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
