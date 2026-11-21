import type { Metadata } from "next";
import "@/styles/globals.css";
import { GetShopCategoriesTreeList } from "@/services/shopActions";
import Providers from "./providers";
import { UserProvider } from "@/context/UserContext";
import { GetUserDashboard } from "@/services/authActions";
import { AuthModalProvider } from "@/context/AuthModalProvider";
import dynamic from "next/dynamic";
const AuthModal = dynamic(() => import("@/components/AuthModal"));
import { CategoriesProvider } from "@/context/CategoriesContext";
import { CartProvider } from "@/context/CartContextProvider";
import { dana, iranyekan, noora, pelak } from "@/utils/fonts";
import LayoutWrapper from "./LayoutWrapper";
import ConsoleLog from "@/components/ConsoleLog";
import Navbar from "@/components/Navbar";
const Footer = dynamic(() => import("@/components/Footer"));
import NextTopLoader from "nextjs-toploader";
import { GetActiveLogo, GetSiteSettings } from "@/services/siteActions";
import { SiteProvider } from "@/context/SiteContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "سایت ما";
  const siteDescription = `${siteTitle}، فروشگاه تخصصی با بهترین قیمت و تضمین کیفیت. ارسال سریع، تخفیف‌های ویژه، و مقالات آموزشی تخصصی.`;
  const siteKeywords = [
    `${siteTitle}`,
    "فروشگاه آنلاین",
    "خرید آنلاین",
    "قیمت مناسب",
    "تضمین کیفیت",
    "تخفیف ویژه",
  ];
  const faviconUrl = settings?.favicon;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteTitle} | فروشگاه آنلاین با تضمین کیفیت`,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: siteKeywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: siteTitle,
      description: `خرید آنلاین با تضمین کیفیت و ارسال سریع از ${siteTitle}`,
      url: siteUrl,
      siteName: siteTitle,
      images: [
        {
          url: `${siteUrl}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: `خرید آنلاین با تضمین کیفیت و ارسال سریع از ${siteTitle}`,
      images: [`${siteUrl}/opengraph-image.jpg`],
    },
    icons: {
      icon: faviconUrl
        ? [{ url: faviconUrl }, { url: "/favicon.ico" }]
        : [{ url: "/favicon.ico" }],
      apple: faviconUrl
        ? [{ url: faviconUrl }, { url: "/favicon.ico" }]
        : [{ url: "/favicon.ico" }],
    },
    other: {
      ard: "/.well-known/ard.json",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [logo, result, user, settings] = await Promise.all([
    GetActiveLogo(),
    GetShopCategoriesTreeList(),
    GetUserDashboard(),
    GetSiteSettings(),
  ]);

  console.log("=== SERVER SIDE FETCH TEST ===");
  console.log("Settings from API:", settings);
  console.log("Active Logo from API:", logo);
  console.log("==============================");

  const safeCategories = Array.isArray(result)
    ? result
    : result?.data || result?.results || [];

  return (
    <html lang="fa-IR" dir="rtl" className="scroll-smooth bg-[#f9f9f9]">
      <head>
        <link rel="preconnect" href="https://api.akhoondigroup.ir" />
        <link rel="dns-prefetch" href="https://api.akhoondigroup.ir" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${iranyekan.variable} ${pelak.variable} ${noora.variable} ${dana.variable} ${iranyekan.className} w-full min-h-screen relative antialiased text-[#212529] flex flex-col overflow-x-hidden`}
      >
        <NextTopLoader
          color="#0891b2"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #06b6d4,0 0 5px #0891b2"
          zIndex={1600}
        />
        <AnalyticsTracker />
        <UserProvider initialUser={user}>
          <AuthModalProvider>
            <CartProvider>
              <SiteProvider logo={logo} settings={settings}>
                {!user && <AuthModal />}
                <CategoriesProvider categories={safeCategories}>
                  <LayoutWrapper
                    navbar={<Navbar logo={logo} />}
                    footer={<Footer />}
                  >
                    <Providers>{children}</Providers>
                  </LayoutWrapper>
                </CategoriesProvider>
              </SiteProvider>
            </CartProvider>
          </AuthModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}
