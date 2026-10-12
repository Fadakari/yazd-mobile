import React from "react";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaRegCheckCircle } from "react-icons/fa";

export default function TrustBadgesBar() {
  const features = [
    {
      id: 1,
      title: "ارسال سریع و مطمئن",
      desc: "تحویل در سریع‌ترین زمان ممکن",
      icon: <FaShippingFast className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-100/80 text-blue-600",
    },
    {
      id: 2,
      title: "ضمانت ۱۰۰٪ اصالت کالا",
      desc: "تضمین اصالت تمامی کالاها",
      icon: <FaShieldAlt className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100",
      iconBg: "bg-emerald-100/80 text-emerald-600",
    },
    {
      id: 3,
      title: "مشاوره و پشتیبانی",
      desc: "پاسخگویی و راهنمایی خرید",
      icon: <FaHeadset className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50 border-amber-100",
      iconBg: "bg-amber-100/80 text-amber-600",
    },
    {
      id: 4,
      title: "تضمین بهترین قیمت",
      desc: "خرید با مناسب‌ترین قیمت بازار",
      icon: <FaRegCheckCircle className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-100",
      iconBg: "bg-indigo-100/80 text-indigo-600",
    },
  ];

  return (
    <section className="container mx-auto px-3 sm:px-4 py-3 sm:py-5" dir="rtl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.05)] hover:border-blue-500 hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all duration-300 group`}
          >
            <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
