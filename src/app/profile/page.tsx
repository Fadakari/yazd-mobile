import { GetUserDashboard } from "@/services/authActions";
import { getUserOrders } from "@/services/homeActions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaTruck,
  FaClipboardList,
  FaReceipt,
} from "react-icons/fa";
import { IoIosMore } from "react-icons/io";

export default async function UserDashboard() {
  const dashboardRes = await GetUserDashboard();
  const dashboardData = dashboardRes?.data || dashboardRes || {};

  const ordersData = await getUserOrders();

  const shopOrders = Array.isArray(ordersData?.shop_orders)
    ? ordersData.shop_orders
    : [];
  const discountedOrders = Array.isArray(ordersData?.discounted_orders)
    ? ordersData.discounted_orders
    : [];

  const allOrders = [...shopOrders, ...discountedOrders];

  const deliveredCount = allOrders.filter(
    (o: { status?: string }) => o.status === "delivered"
  ).length;

  const lastOrders = allOrders.slice(0, 3);
  const totalOrders = allOrders.length;

  const preInvoices = Array.isArray(dashboardData.pre_invoices)
    ? dashboardData.pre_invoices
    : Array.isArray(dashboardData.pre_invoices?.data)
      ? dashboardData.pre_invoices.data
      : [];

  const lastPreInvoices = preInvoices.slice(0, 3);
  const totalPreInvoices = preInvoices.length;

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "shipped":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "pending":
        return "bg-amber-500/15 text-amber-400 border border-zinc-300";
      case "cancelled":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
      case "processed":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      default:
        return "bg-slate-500/15 text-zinc-500 border border-slate-500/30";
    }
  };

  return (
    <div className="space-y-8 text-zinc-900" dir="rtl">
      {/* 1. Dashboard Overview Stats */}
      <section className="w-full">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-5 text-white">
          خلاصه فعالیت‌ها
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
          <Link
            href={"/profile/orders"}
            className="flex items-center gap-4 bg-zinc-50 border border-zinc-200/90 w-full rounded-2xl shadow-xl hover:border-amber-400/40 hover:bg-zinc-50 transition-all p-5 group"
          >
            <div className="bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-xl p-3.5 text-2xl group-hover:scale-105 transition-transform">
              <FaClipboardList />
            </div>
            <div>
              <div className="text-zinc-500 text-xs">کل سفارش‌ها</div>
              <div className="text-white font-extrabold text-lg mt-0.5">
                {totalOrders.toLocaleString("fa-IR")}
              </div>
            </div>
          </Link>

          <Link
            href={"/profile/pre-invoices"}
            className="flex items-center gap-4 bg-zinc-50 border border-zinc-200/90 w-full rounded-2xl shadow-xl hover:border-amber-400/40 hover:bg-zinc-50 transition-all p-5 group"
          >
            <div className="bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-xl p-3.5 text-2xl group-hover:scale-105 transition-transform">
              <FaReceipt />
            </div>
            <div>
              <div className="text-zinc-500 text-xs">پیش‌فاکتورها</div>
              <div className="text-white font-extrabold text-lg mt-0.5">
                {totalPreInvoices.toLocaleString("fa-IR")}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-200/90 w-full rounded-2xl shadow-xl p-5">
            <div className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-xl p-3.5 text-2xl">
              <FaCheckCircle />
            </div>
            <div>
              <div className="text-zinc-500 text-xs">تحویل داده شده</div>
              <div className="text-white font-extrabold text-lg mt-0.5">
                {deliveredCount.toLocaleString("fa-IR")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Latest Orders */}
      <section className="space-y-6 pt-4 border-t border-zinc-200">
        <div>
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-white">
              <FaTruck className="text-amber-400" />
              <span>آخرین سفارشات</span>
            </h3>
            <Link
              href={"/profile/orders"}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-white transition-colors"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>

          {lastOrders.length === 0 ? (
            <div className="bg-zinc-50/50 border border-zinc-200 rounded-2xl text-zinc-500 text-center py-10 text-sm">
              هنوز سفارشی ثبت نشده است.
            </div>
          ) : (
            <ul className="divide-y divide-white/10 bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden">
              {lastOrders.map((order: any) => (
                <li
                  key={order.id}
                  className="hover:bg-white/5 transition-colors p-4 sm:p-5"
                >
                  <Link
                    href={`/profile/orders/${order.order_number}`}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-zinc-950 text-base">
                        شماره سفارش: {order.order_number}
                      </div>
                      <div className="text-zinc-500 text-xs">
                        تحویل‌گیرنده: {order.receiver_name} - {order.receiver_city}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status === "delivered"
                          ? "تحویل شده"
                          : order.status === "shipped"
                            ? "در حال ارسال"
                            : order.status === "pending"
                              ? "در انتظار پرداخت"
                              : order.status === "cancelled"
                                ? "لغو شده"
                                : order.status === "processed"
                                  ? "پردازش شده"
                                  : "نامشخص"}
                      </span>
                      <div className="text-zinc-700 text-xs sm:text-sm">
                        مجموع:{" "}
                        <span className="text-amber-400 font-extrabold mr-1">
                          {Number(order.total_amount || 0).toLocaleString("fa-IR")}
                        </span>{" "}
                        تومان
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
