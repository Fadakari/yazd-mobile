import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ tc?: string; order_id?: string }>;
}

export default async function CancelledPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params?.order_id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-gray-50 to-white dir-rtl">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full flex flex-col items-center border border-gray-100">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
          <FaCircleXmark className="text-amber-500 text-5xl drop-shadow" />
        </div>

        <h1 className="text-2xl font-black text-amber-600 mb-3">
          پرداخت لغو شد
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
          عملیات پرداخت توسط شما در صفحه بانک لغو گردید. سفارش شما همچنان در حالت در انتظار پرداخت ذخیره شده است.
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
            مشاهده سفارش‌ها و پرداخت
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
