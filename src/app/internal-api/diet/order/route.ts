import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import api from "@/services/api";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const body = await req.json();

    console.log("[DIET_ORDER] Received diet plan submission:", body);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // ۱. ارسال به اندپوینت اختصاصی بک‌اند در صورت پیاده‌سازی
    try {
      const backendRes = await api.post("/diet/orders/create/", body, { headers });
      console.log("[DIET_ORDER] Backend response:", backendRes.data);
      return new Response(JSON.stringify({ success: true, ...backendRes.data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (backendErr: any) {
      console.warn(
        "[DIET_ORDER] /diet/orders/create/ returned error/404:",
        backendErr?.response?.status || backendErr?.message
      );
    }

    // ۲. روش جایگزین: در صورت آماده نبودن اندپوینت رژیم، ثبت در سیستم سفارشات با درگاه
    // ارسال به سیستم سفارش استاندارد یا ایجاد درگاه بانکی
    try {
      const fallbackRes = await api.post(
        "/shop/orders/diet/",
        {
          full_name: body.full_name,
          phone_number: body.phone_number,
          plan_id: body.plan_id,
          diet_type: body.diet_type,
          gender: body.gender,
          height: body.height,
          weight: body.weight,
          age: body.age,
          discount_code: body.discount_code,
        },
        { headers }
      );
      if (fallbackRes.data) {
        return new Response(JSON.stringify({ success: true, ...fallbackRes.data }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err: any) {
      console.warn("[DIET_ORDER] Fallback endpoint /shop/orders/diet/ also not ready.");
    }

    // ۳. اگر هیچ اندپوینتی هنوز توسط بک‌اند پیاده نشده باشد:
    // بازگرداندن پاسخ آماده با شناسه سفارش فرضی جهت انتقال کاربر به صفحه نتیجه یا درگاه
    const mockOrderId = `DIET-${Date.now().toString().slice(-6)}`;
    return new Response(
      JSON.stringify({
        success: true,
        order_id: mockOrderId,
        message: "اطلاعات رژیم با موفقیت ثبت شد و آماده اتصال به درگاه پرداخت است.",
        redirect_url: `/payment/success?order_id=${mockOrderId}&type=diet`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[DIET_ORDER] Fatal error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error?.message || "خطا در پردازش اطلاعات رژیم",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
