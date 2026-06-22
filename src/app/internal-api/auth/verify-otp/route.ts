import { NextRequest, NextResponse } from "next/server";
import api from "@/services/api";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { phone_number, code, referral_code } = body;

    try {
        const res = await api.post("/users/otp/verify/", {
            phone_number,
            code,
            referral_code: referral_code || "",
        });

        const { access, message } = res.data;

        const response = NextResponse.json({ message });

        response.cookies.set("access_token", access, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
        });


        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.error || "کد تأیید نامعتبر است" },
            { status: error?.response?.status || 500 }
        );
    }
}
