import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ tc?: string; order_id?: string; message?: string }>;
}

export default async function FailedPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params?.order_id;
  const message = params?.message;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-gray-50 to-white dir-rtl">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full flex flex-col items-center border border-gray-100">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
          <FaCircleXmark className="text-rose-500 text-5xl drop-shadow" />
        </div>

        <h1 className="text-2xl font-black text-rose-600 mb-3">
          پرداخت ناموفق بود
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
          {message ||
            "متأسفانه عملیات پرداخت توسط بانک رد شد یا انجام نشد. چنانچه وجهی از حساب شما کسر گردیده، طبق قوانین بانکی حداکثر تا ۷۲ ساعت آینده به حسابتان بازمی‌گردد."}
        </p>

        {orderId && (
          <div className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl p-4 mb-6 text-sm flex justify-between items-center text-gray-700">
            <span className="font-medium text-gray-500">شماره سفارش:</span>
            <span className="font-bold text-[#12465a]">{orderId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/profile/orders"
            className="flex-1 bg-[#12465a] hover:bg-[#0bb2c9] text-white py-3 px-6 rounded-2xl font-bold transition shadow-md text-center"
          >
            تلاش مجدد برای پرداخت
          </Link>
          <Link
            href="/"
            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-2xl font-bold transition text-center"
          >
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
