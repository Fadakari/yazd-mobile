import { DietPlan, DietOrderFormData } from "@/types/diet";

/**
 * دریافت لیست پلن‌ها از بک‌اند به صورت کاملاً داینامیک
 * در صورتی که بک‌اند هنوز فعال نشده باشد، آرایه خالی بازمی‌گرداند (بدون دیتای فیک)
 */
export async function getDietPlans(): Promise<DietPlan[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.rejimfakhr.com";
  try {
    const res = await fetch(`${apiUrl}/diet/plans/`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.results || [];
      if (Array.isArray(list)) {
        return list.map((item: any) => ({
          id: item.id,
          title: item.title || item.name || "برنامه رژیمی",
          subtitle: item.subtitle || item.description || "",
          duration_months: Number(item.duration_months) || 1,
          price_rial: Number(item.price_rial) || (Number(item.price) ? Number(item.price) * 10 : 0),
          price_toman: Number(item.price_toman) || Number(item.price) || 0,
          badge: item.badge || (item.duration_months ? String(item.duration_months) : ""),
          is_vip: Boolean(item.is_vip),
          features: Array.isArray(item.features) ? item.features : [],
        }));
      }
    }
  } catch (error) {
    console.warn("Backend /diet/plans/ is not reachable yet:", error);
  }
  return [];
}

/**
 * ثبت سفارش رژیم غذایی و اتصال به درگاه پرداخت بک‌اند
 */
export async function submitDietOrder(payload: DietOrderFormData) {
  const res = await fetch("/internal-api/diet/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || "امکان ثبت سفارش رژیم در حال حاضر وجود ندارد.");
  }
  return result;
}

/**
 * اعتبارسنجی کد تخفیف از طریق سرور (بدون کدهای فیک)
 */
export async function checkDietDiscount(code: string, planPriceToman: number) {
  const res = await fetch(`/internal-api/shop/discount/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code.trim(), total_amount: planPriceToman }),
  });

  if (res.ok) {
    const data = await res.json();
    if (data && (data.valid || data.discount_amount || data.discount_percentage)) {
      return data;
    }
  }

  const errData = await res.json().catch(() => null);
  throw new Error(errData?.message || errData?.detail || "کد تخفیف وارد شده نامعتبر است.");
}
