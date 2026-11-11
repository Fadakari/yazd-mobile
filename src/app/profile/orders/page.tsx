import { getUserOrders } from "@/services/homeActions";
import { formatToPersianTimeAgo } from "@/utils/formatToPersianTimeAgo";
import { MdShoppingCartCheckout } from "react-icons/md";
import Orders from "./Orders";

export default async function Page() {
  const data = await getUserOrders();

  const shopOrders = Array.isArray(data?.shop_orders) ? data.shop_orders : [];
  const discountedOrders = Array.isArray(data?.discounted_orders)
    ? data.discounted_orders
    : [];

  const mapOrders = (data: any[], type: "regular" | "discounted") =>
    data.map((order) => ({
      id: `${order?.id || "0"}-${type}`,
      order_id: order?.id,
      order_number: order?.order_number || "-",
      amount: order?.total_amount || order?.discounted_amount || 0,
      amountFormatted:
        (order?.total_amount || order?.discounted_amount)?.toLocaleString(
          "fa-IR"
        ) || "۰",
      status: order?.status || "نامشخص",
      date: order?.order_date || new Date().toISOString(),
      dateFormatted: order?.order_date
        ? formatToPersianTimeAgo(order.order_date)
        : "نامشخص",
      detailsLink:
        type === "discounted"
          ? `/profile/dis-orders/${order?.order_number || "0"}`
          : `/profile/orders/${order?.order_number || "0"}`,
    }));

  const items = [
    ...mapOrders(shopOrders, "regular"),
    ...mapOrders(discountedOrders, "discounted"),
  ];

  return (
    <div className="ak-orders-page">
      <h1 className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-[#252923] bg-[#e6e2d8] px-5 py-4 text-xl font-black shadow-[3px_4px_0_#252923]">
        <MdShoppingCartCheckout className="size-8 text-primary" />
        <span className="pt-1">سفارشات</span>
      </h1>
      <Orders items={items} />
    </div>
  );
}
