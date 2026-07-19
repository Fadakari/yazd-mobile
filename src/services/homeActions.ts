import { cookies } from "next/headers"
import api from "./api"
import { unstable_cache } from "next/cache";

const defaultFetchOptions = {
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
    },
    // معادل withCredentials: true در Axios
    credentials: "include" as RequestCredentials, 
};

export async function homeAboutUsList() {
    try {
        const res = await fetch("https://api.yazd-mobile.ir/home/about-us/", {
            ...defaultFetchOptions,
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function homeContactInfoList() {
    try {
        const res = await fetch("https://api.yazd-mobile.ir/home/contact-info/", {
            ...defaultFetchOptions,
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function homeGalleryList() {
    try {
        const res = await fetch("https://api.yazd-mobile.ir/home/gallery/", {
            ...defaultFetchOptions,
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function homeSliderList() {
    try {
        const res = await fetch("https://api.yazd-mobile.ir/home/sliders/", {
            ...defaultFetchOptions,
            next: { revalidate: 600 } // آپدیت هر 10 دقیقه
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function GetDiscountedOrders() {
    "use server";
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return null;
    } try {
        const response = await api.get(`/home/discounted-orders/`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });

        return response.data;
    } catch (error) {
        console.error("GetOrders error:", error);
        return null;
    }
}
export async function getUserOrders() {
    "use server";
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return null;
    } try {
        const response = await api.get(`/users/orders`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },

        });
        return response.data;
    } catch (error) {
        console.error("GetOrders error:", error);
        return null;
    }
}

export async function GetDiscountedOrder(orderNumber: string) {
    "use server";
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return null;
    } try {
        const response = await api.get(`/home/discounted-orders/${orderNumber}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },

        });
        return response.data;
    } catch (error) {
        console.error("GetOrders error:", error);
        return null;
    }
}

