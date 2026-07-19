import type { MetadataRoute } from "next";
import { GetSiteSettings, GetActiveLogo } from "@/services/siteActions";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const settings = await GetSiteSettings();

    const siteTitle =
        settings?.site_title?.trim() || "فروشگاه من";

    const description =
        settings?.site_description?.trim() ||
        "فروشگاه اینترنتی";

    const themeColor =
        settings?.theme_color || "#2e2e73";

    const backgroundColor =
        settings?.background_color || "#ffffff";

    const icon192 =
        settings?.pwa_icon_192 ||
        "/web-app-manifest-192x192.png";

    const icon512 =
        settings?.pwa_icon_512 ||
        "/web-app-manifest-512x512.png";

    return {
        name: siteTitle,
        short_name: siteTitle,

        description,

        start_url: "/",

        scope: "/",

        display: "standalone",

        orientation: "portrait",

        background_color: backgroundColor,

        theme_color: themeColor,

        lang: "fa",

        icons: [
            {
                src: icon192,
                sizes: "192x192",
                type: "image/png",
                purpose: "any maskable",
            },
            {
                src: icon512,
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
    };
}