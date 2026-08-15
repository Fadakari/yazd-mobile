export async function GetActiveLogo() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/home/active-logo/`,
            { cache: "no-store" } // <--- این خط برای جلوگیری کامل از کش شدن اضافه شود
        );

        if (!res.ok) return "لوگو دریافت نشد";

        const data = await res.json();

        const active = Array.isArray(data)
            ? data[0]
            : data;

        return active?.image;
    } catch {
        return "";
    }
}


export async function GetSiteSettings() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/home/site-settings/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
                },
                next: {
                    revalidate: 300,
                    tags: ["site-settings"],
                },
            }
        );

        if (!res.ok) return null;

        return await res.json();

    } catch (error) {

        console.error(error);

        return null;

    }
}