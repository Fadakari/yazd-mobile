import type { Metadata } from "next";
import "@/styles/globals.css";
import { GetShopCategoriesTreeList } from "@/services/shopActions";
import Providers from "./providers";
import { UserProvider } from "@/context/UserContext";
import { GetUserDashboard } from "@/services/authActions";
import { AuthModalProvider } from "@/context/AuthModalProvider";
import AuthModal from "@/components/AuthModal";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { CartProvider } from "@/context/CartContextProvider";
import { dana, iranyekan, noora, pelak } from "@/utils/fonts";
import LayoutWrapper from "./LayoutWrapper";
import ConsoleLog from "@/components/ConsoleLog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { GetActiveLogo, GetSiteSettings } from "@/services/siteActions";
import { SiteProvider } from "@/context/SiteContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = "حافظ دارو";
  const siteDescription = `داروخانه آنلاین ${siteTitle}، مرجع تخصصی خرید آنلاین محصولات سلامت‌محور، دارویی، مکمل‌های تخصصی، اقلام آرایشی و بهداشتی اصل با بهترین قیمت و ضمانت اصالت.`;
  const siteKeywords = [
    siteTitle,
    "داروخانه آنلاین حافظ دارو",
    "داروخانه آنلاین",
    "خرید دارو و مکمل",
    "آرایشی و بهداشتی",
    "قیمت مناسب",
    "ضمانت اصالت",
  ];
  const faviconUrl = settings?.favicon;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hafezdaroo.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteTitle} | داروخانه آنلاین`,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: siteKeywords,
    openGraph: {
      title: siteTitle,
      description: `خرید آنلاین با تضمین کیفیت و ارسال سریع از ${siteTitle}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      siteName: siteTitle,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.jpg`,
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
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.jpg`],
    },
    icons: faviconUrl
      ? {
          icon: [{ url: faviconUrl }],
          apple: [{ url: faviconUrl }],
        }
      : {},
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
      <body
        suppressHydrationWarning={true}
        className={`${iranyekan.variable} ${pelak.variable} ${noora.variable} ${dana.variable} ${iranyekan.className} w-full min-h-screen relative antialiased text-[#212529] flex flex-col overflow-x-hidden`}
      >
        <NextTopLoader
          color="#0053c0"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0053c0,0 0 5px #0053c0"
          zIndex={1600}
        />
        <ConsoleLog />
        <AnalyticsTracker />
        <UserProvider initialUser={user}>
          <AuthModalProvider>
            <CartProvider>
              <SiteProvider logo={logo} siteTitle={settings?.site_title}>
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
