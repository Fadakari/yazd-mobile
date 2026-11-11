"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";
import { formatShamsiDateString } from "@/utils/formatShamsiDateString";

const statusLabels: Record<string, { fa: string; color: string }> = {
  pending: { fa: "در انتظار پرداخت", color: "bg-amber-500/15 text-amber-400 border border-zinc-300" },
  delivered: { fa: "تحویل شده", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  cancelled: { fa: "لغو شده", color: "bg-red-500/15 text-red-400 border border-red-500/30" },
  shipped: { fa: "ارسال شده", color: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  paid: { fa: "پرداخت شده", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
};

export default function Order({ order }: { order: any }) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`order-${order.order_number}.pdf`);
  };

  const label = statusLabels[order.status] || {
    fa: order.status,
    color: "bg-slate-500/15 text-zinc-500 border border-slate-500/30",
  };

  return (
    <div className="space-y-6 text-zinc-900" dir="rtl">
      <Link
        href={"/profile/orders"}
        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-white transition-colors"
      >
        <FaChevronRight className="size-3" />
        <span>بازگشت به سفارش‌ها</span>
      </Link>

      <div className="flex flex-wrap justify-between items-center gap-4 print:hidden">
        <h1 className="text-xl sm:text-2xl font-black text-white">
          جزئیات سفارش: <span className="text-amber-400">{order.order_number}</span>
        </h1>
        <div className="flex gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20"
          >
            دانلود نسخه PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-zinc-200 transition-colors"
          >
            چاپ فاکتور
          </button>
        </div>
      </div>

      <div
        id="print-area"
        ref={pdfRef}
        className="bg-white border border-zinc-200/90 p-6 rounded-3xl shadow-xl space-y-6 text-zinc-900 print:bg-white print:text-black print:border-none print:shadow-none"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-zinc-50 p-4 rounded-2xl border border-zinc-200 print:bg-transparent print:border-none">
          <div><span className="text-zinc-500">شماره سفارش:</span> <strong className="text-white print:text-black">{order.order_number}</strong></div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">وضعیت:</span>
            <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold ${label.color}`}>
              {label.fa}
            </span>
          </div>
          <div><span className="text-zinc-500">تاریخ ثبت:</span> <span className="text-white print:text-black">{formatShamsiDateString(order.order_date)}</span></div>
          <div><span className="text-zinc-500">مبلغ کل:</span> <strong className="text-amber-400 print:text-black font-extrabold">{Number(order.total_amount || 0).toLocaleString("fa-IR")} تومان</strong></div>
          <div><span className="text-zinc-500">نام گیرنده:</span> <span className="text-white print:text-black">{order.receiver_name}</span></div>
          <div><span className="text-zinc-500">شماره تماس:</span> <span className="text-white print:text-black">{order.receiver_phone}</span></div>
          <div><span className="text-zinc-500">شهر مقصد:</span> <span className="text-white print:text-black">{order.receiver_city}</span></div>
          <div><span className="text-zinc-500">آدرس تحویل:</span> <span className="text-white print:text-black">{order.receiver_address}</span></div>
          {order.shipping_service && (
            <>
              <div><span className="text-zinc-500">شیوه ارسال:</span> <span className="text-white print:text-black">{order.shipping_service.name}</span></div>
              <div><span className="text-zinc-500">توضیح ارسال:</span> <span className="text-white print:text-black">{order.shipping_service.description}</span></div>
            </>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-amber-400 border-b border-zinc-200 pb-2 print:text-black">
            اقلام سفارش
          </h2>
          <div className="space-y-2.5">
            {order.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/40 print:bg-transparent print:border-gray-300"
              >
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-white print:text-black">{item.product_name}</div>
                  <div className="text-zinc-500">تعداد: <span className="text-white print:text-black font-bold">{item.quantity}</span></div>
                  {item.color_name && <div className="text-zinc-500">رنگ/طعم: {item.color_name}</div>}
                </div>
                <div className="text-left text-xs sm:text-sm">
                  <div className="text-zinc-500">قیمت واحد: {Number(item.unit_price || 0).toLocaleString("fa-IR")} تومان</div>
                  <div className="font-extrabold text-amber-400 print:text-black mt-0.5">
                    مجموع: {Number(item.total_price || 0).toLocaleString("fa-IR")} تومان
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
