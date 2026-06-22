import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { shipping_service_id } = await request.json();

    if (!shipping_service_id) {
      return NextResponse.json(
        { message: "shipping_service_id الزامی است" },
        { status: 400 }
      );
    }

    // دریافت توکن از cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    // ارسال درخواست به بک‌اند
    const response = await fetch(
      `${API_URL}/shop/cart/set-shipping-service/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ shipping_service_id }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Set Shipping Service Error:", error);
    return NextResponse.json(
      { message: error.message || "خطا در تنظیم شیوه ارسال" },
      { status: 500 }
    );
  }
}
