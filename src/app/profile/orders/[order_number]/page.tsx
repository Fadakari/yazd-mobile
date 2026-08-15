import Order from "@/components/Order";
import { GetUserDashboard } from "@/services/authActions";
import { notFound } from "next/navigation";

async function Page({ params }: any) {
  const data = await GetUserDashboard();
  const order_number = (await params).order_number;
  const foundOrder = data.orders.find(
    (order: any) => order.order_number == order_number
  );
  if (!foundOrder) return notFound();
  console.log(foundOrder)
  return (
    <div>
      <Order order={foundOrder} />
    </div>
  );
}

export default Page;
