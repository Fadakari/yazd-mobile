import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import api from "@/services/api";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "لطفاً ابتدا وارد حساب کاربری خود شوید." }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const body = await req.json();
        const res = await api.post(`/payments/verify-gateway/`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        const statusCode = error?.response?.status || 500;
        const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.detail ||
            "خطا در بررسی وضعیت پرداخت";

        return new Response(
            JSON.stringify({ success: false, message: errorMessage }),
            { status: statusCode, headers: { "Content-Type": "application/json" } }
        );
    }
}
