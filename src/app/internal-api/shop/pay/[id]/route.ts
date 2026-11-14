import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import api from "@/services/api";

export async function POST(
    req: NextRequest,
    { params }: { params: any }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "لطفاً ابتدا وارد حساب کاربری خود شوید." }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const { id } = await params;
        console.log(`[PAYMENT] Requesting gateway link for order ID: ${id}`);
        
        const res = await api.post(`/payments/go-to-gateways/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log(`[PAYMENT] Gateway response for order ${id}:`, res.data);

        return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("[PAYMENT] Error requesting gateway:", error?.response?.data || error?.message);
        
        const statusCode = error?.response?.status || 500;
        const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.response?.data?.detail ||
            "خطا در ایجاد لینک پرداخت بانکی";

        return new Response(
            JSON.stringify({ success: false, message: errorMessage }),
            { status: statusCode, headers: { "Content-Type": "application/json" } }
        );
    }
}
