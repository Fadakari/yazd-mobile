import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "@/services/api";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    try {
        const res = await api.post("/users/terms/accept/", body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return NextResponse.json(res.data);
    } catch (error: any) {
        console.log("Error accepting terms:", error?.response?.data || error);
        return NextResponse.json(
            {
                error: error?.response?.data?.message || "خطا در پذیرش قوانین",
            },
            { status: error?.response?.status || 500 }
        );
    }
}
