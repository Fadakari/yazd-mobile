import api from "@/services/api";
import { cookies } from "next/headers";

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const res = await api.delete(`/home/discounted-cart/clear/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error?.message || "خطا در پاک کردن سبد خرید تخفیف‌دار" }), {
            status: error?.response?.status || 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
