import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import api from "@/services/api";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // ارسال مستقیم به اندپوینت بک‌اند
    const backendRes = await api.post("/diet/orders/create/", body, { headers });
    return new Response(JSON.stringify({ success: true, ...backendRes.data }), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    const statusCode = error?.response?.status || 503;
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.response?.data?.error ||
      "سرویس ثبت رژیم و پرداخت آنلاین در حال حاضر در حال راه‌اندازی توسط سرور است. لطفاً به زودی مجدداً مراجعه فرمایید.";

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
