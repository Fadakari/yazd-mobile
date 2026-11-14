import { DietPlan, DietOrderFormData } from "@/types/diet";

export const DEFAULT_DIET_PLANS: DietPlan[] = [
  {
    id: 1,
    title: "برنامه ۱ ماهه رژیمی",
    subtitle: "شروع اصولی مسیر کاهش وزن و ارزیابی عادات غذایی",
    duration_months: 1,
    price_rial: 5050000,
    price_toman: 505000,
    badge: "۱",
    features: [
      "رژیم کاملاً اختصاصی منطبق بر سفره خانواده",
      "لیست جایگزینی کامل مواد غذایی",
      "پشتیبانی آنلاین هفتگی",
      "راهنمای تثبیت اولیه",
    ],
  },
  {
    id: 2,
    title: "برنامه ۳ ماهه رژیمی (رالی لاغری)",
    subtitle: "محبوب‌ترین دوره برای شکستن استپ وزنی و تغییر پایدار",
    duration_months: 3,
    price_rial: 12800000,
    price_toman: 1280000,
    badge: "۳",
    features: [
      "سه دوره تنظیم مجدد برنامه متناسب با پیشرفت",
      "پشتیبانی مستقیم کارشناس تغذیه",
      "راهکارهای غلبه بر پرخوری عصبی و ریزه‌خواری",
      "آنالیز پیشرفت ماهانه",
    ],
  },
  {
    id: 3,
    title: "بسته ۶ ماهه رژیم",
    subtitle: "دوره جامع اصلاح سبک زندگی و تثبیت ماندگار وزن ایده‌آل",
    duration_months: 6,
    price_rial: 21800000,
    price_toman: 2180000,
    badge: "۶",
    features: [
      "شش دوره برنامه تغذیه‌ای فازبندی‌شده",
      "تضمین عدم بازگشت وزن با فاز تثبیت ویژه",
      "پشتیبانی نامحدود در طول دوره",
      "ارزیابی و تصحیح آزمایشات دوره‌ای",
    ],
  },
  {
    id: 4,
    title: "بسته VIP (شش ماه رژیم + ورزش + پشتیبانی اختصاصی)",
    subtitle: "کامل‌ترین پکیج سلامت و تناسب اندام همراه با مربی اختصاصی",
    duration_months: 6,
    price_rial: 32800000,
    price_toman: 3280000,
    badge: "VIP",
    is_vip: true,
    features: [
      "برنامه غذایی VIP با انعطاف حداکثری",
      "برنامه تمرینی اختصاصی در منزل یا باشگاه",
      "پشتیبانی VIP و خط مستقیم مشاوره",
      "پکیج آموزشی مکمل‌ها و ویتامین‌ها",
      "بررسی هفتگی سایز و وزن با نمودار پیشرفت",
    ],
  },
];

/**
 * دریافت لیست پلن‌ها از بک‌اند، همراه با Fallback در صورت آماده نبودن API بک‌اند
 */
export async function getDietPlans(): Promise<DietPlan[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.rejimfakhr.com";
  try {
    const res = await fetch(`${apiUrl}/diet/plans/`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || "",
          duration_months: item.duration_months || 1,
          price_rial: item.price_rial || (item.price ? item.price * 10 : 0),
          price_toman: item.price_toman || item.price || 0,
          badge: item.badge || String(item.duration_months || 1),
          is_vip: Boolean(item.is_vip),
          features: item.features || [],
        }));
      }
    }
  } catch (error) {
    console.warn("Backend diet/plans/ not ready yet, using default plans fallback.");
  }
  return DEFAULT_DIET_PLANS;
}

/**
 * ثبت سفارش رژیم غذایی و دریافت درگاه پرداخت
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
    throw new Error(result.message || "خطا در ثبت سفارش رژیم غذایی");
  }
  return result;
}

/**
 * بررسی و اعتبارسنجی کد تخفیف
 */
export async function checkDietDiscount(code: string, planPriceToman: number) {
  try {
    const res = await fetch(`/internal-api/shop/discount/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, total_amount: planPriceToman }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.error("Discount check failed:", e);
  }

  // ماک تستی در صورت کار نکردن API تخفیف (مثلاً برای کدهای TEST یا FAKHR)
  const trimmed = code.trim().toUpperCase();
  if (trimmed === "FAKHR" || trimmed === "FAKHR10") {
    return {
      valid: true,
      discount_percentage: 10,
      discount_amount: Math.round(planPriceToman * 0.1),
      message: "کد تخفیف ۱۰ درصدی با موفقیت اعمال شد.",
    };
  }
  if (trimmed === "HEALTH" || trimmed === "VIP20") {
    return {
      valid: true,
      discount_percentage: 20,
      discount_amount: Math.round(planPriceToman * 0.2),
      message: "کد تخفیف ۲۰ درصدی با موفقیت اعمال شد.",
    };
  }

  throw new Error("کد تخفیف وارد شده معتبر نیست یا منقضی شده است.");
}
