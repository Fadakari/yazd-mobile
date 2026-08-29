import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "@/services/api";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const res = await api.post("/users/check-user-status/", body);
        return NextResponse.json(res.data);
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.response?.data?.message || "خطا در بررسی وضعیت کاربر",
            },
            { status: error?.response?.status || 500 }
        );
    }
}
