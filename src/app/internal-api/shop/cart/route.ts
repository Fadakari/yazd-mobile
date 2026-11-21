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
        };
        if (body.color_id !== undefined && body.color_id !== null) payload.color_id = body.color_id;
        if (body.material_id !== undefined && body.material_id !== null) payload.material_id = body.material_id;

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

        const errorMessage = error?.response?.data?.error || "خطای ناشناخته";
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
