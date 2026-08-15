"use server";

import { cookies } from "next/headers";
import api from "./api";

export const GetUserDashboard = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return null;
    }
    try {
        const result = await api.get("/users/dashboard/", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        return result.data;

    } catch (error: any) {
        const originalError = error?.response?.data || error?.message;
        console.log("Auth Error:", originalError);
        return null;
    }
};
