import { cookies } from "next/headers"
import api from "./api"
import { unstable_cache } from "next/cache";

export const homeAboutUsList = unstable_cache(
    async () => {
        try {
            const result = await api.get("/home/about-us/");
            return result.data.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    ["home-about-us-list"],
    { revalidate: 3600 }
);
export const homeContactInfoList = unstable_cache(
    async () => {
        try {
            const result = await api.get("/home/contact-info/");
            return result.data.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    ["home-contact-info-list"],
    { revalidate: 3600 }
);
export const homeGalleryList = unstable_cache(
    async () => {
        try {
            const result = await api.get("/home/gallery/");
            return result.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    ["home-gallery-list"],
    { revalidate: 3600 }
);
export const homeSliderList = unstable_cache(
    async () => {
        try {
            const result = await api.get("/home/sliders/");
            return result.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    ["home-slider-list"],
    { revalidate: 600 }
);
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

