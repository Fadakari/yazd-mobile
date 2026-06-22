import { cookies } from "next/headers"
import api from "./api"

export const homeAboutUsList = async () => {
    try {
        const result = await api.get("/home/about-us/")
        return result
    } catch (error) {
        console.log(error)
    }
}
export const homeContactInfoList = async () => {
    try {
        const result = await api.get("/home/contact-info/")
        return result
    } catch (error) {
        console.log(error)
    }
}
export const homeGalleryList = async () => {
    try {
        const result = await api.get("/home/gallery/")
        return result.data
    } catch (error) {
        console.log(error)
    }
}
export const homeSliderList = async () => {
    try {
        const result = await api.get("/home/sliders/")
        return result.data
    } catch (error) {
        console.log(error)
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