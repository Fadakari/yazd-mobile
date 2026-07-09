export async function GetActiveLogo() {
    try {
        const res = await fetch(
            "https://api.abajstore.ir/home/active-logo/",
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
            `${process.env.NEXT_PUBLIC_API_URL || 'https://api.abajstore.ir'}/home/site-settings/`,
            {
                // استفاده از no-store برای تنظیمات ادمین تا تغییرات آنی باشد
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("GetSiteSettings error:", error);
        return null;
    }
}