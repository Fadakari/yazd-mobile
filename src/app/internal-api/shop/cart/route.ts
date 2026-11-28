import api from "@/services/api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const res = await api.get(`/shop/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        console.log("🔑 Token:", token);

        if (!token) {
            console.error("❌ No token found in cookies");
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        console.log("📦 Request Body:", body);

        const payload: any = {
            product_id: body.product_id,
            quantity: body.quantity,
            is_discounted: body.is_discounted ?? false,
            color_id: body.color_id ?? null,
            material_id: body.material_id ?? null,
        };

        const res = await api.post(`/shop/cart/add/`, payload, {
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
        console.error("❌ API Error:", error?.response?.data || error.message);

        const errData = error?.response?.data;
        let errorMessage = "خطا در افزودن به سبد خرید";
        if (typeof errData === "string") {
            errorMessage = errData;
        } else if (errData && typeof errData === "object") {
            errorMessage =
                errData.error ||
                errData.detail ||
                errData.message ||
                (Array.isArray(errData.non_field_errors) ? errData.non_field_errors[0] : null) ||
                JSON.stringify(errData);
        }
        const statusCode = error?.response?.status || 500;

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, quantity } = body;

        if (!id) return new Response("Missing item ID", { status: 400 });

        const res = await api.patch(`/shop/cart/update/${id}/`, { quantity }, {
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
        const errorMessage = error?.response?.data?.error || "خطای ناشناخته";
        const statusCode = error?.response?.status || 500;

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("Missing item ID", { status: 400 });

    const res = await api.delete(`/shop/cart/remove/${id}/`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
