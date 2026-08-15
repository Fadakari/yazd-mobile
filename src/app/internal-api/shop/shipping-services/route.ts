import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
cookies

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // دریافت توکن از cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    // ارسال درخواست به بک‌اند
    const response = await fetch(
      `${API_URL}/shop/shipping-services/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "خطا در دریافت شیوه‌های ارسال" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Shipping Services Error:", error);
    return NextResponse.json(
      { message: error.message || "خطا در دریافت شیوه‌های ارسال" },
      { status: 500 }
    );
  }
}
