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
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  metadataBase: new URL("https://yazd-mobile.ir"),
  title: "یزد موبایل | فروشگاه آنلاین با تضمین کیفیت",
  description:
    "یزد موبایل، فروشگاه تخصصی با بهترین قیمت و تضمین کیفیت. ارسال سریع، تخفیف‌های ویژه، و مقالات آموزشی تخصصی.",
  keywords: [
    "یزد موبایل",
    "فروشگاه آنلاین",
    "خرید آنلاین",
    "قیمت مناسب",
    "تضمین کیفیت",
    "تخفیف ویژه",
  ],
  openGraph: {
    title: "یزد موبایل",
    description: "خرید آنلاین با تضمین کیفیت و ارسال سریع از یزد موبایل",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    siteName: "یزد موبایل",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "یزد موبایل",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "یزد موبایل",
    description: "خرید آنلاین با تضمین کیفیت و ارسال سریع از یزد موبایل",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.jpg`],
  },
  icons: {
    icon: [
      { url: "/assets/icons/icon.png", type: "image/png", sizes: "16x16" },
      { url: "/assets/icons/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/icons/icon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [
      {
        url: "/assets/icons/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
      {
        url: "/assets/icons/apple-icon.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/assets/icons/apple-icon.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/assets/icons/apple-icon.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await GetShopCategoriesTreeList();
  const user = (await GetUserDashboard()) || undefined;
  
  // استخراج امن آرایه دسته‌بندی‌ها
  const safeCategories = Array.isArray(result) ? result : (result?.data || result?.results || []);
  return (
    <html lang="fa-IR" dir="rtl" className="scroll-smooth bg-[#f9f9f9]">
      <body
      suppressHydrationWarning={true}
        className={`${iranyekan.variable} ${pelak.variable} ${noora.variable} ${dana.variable} ${iranyekan.className} w-full min-h-screen relative antialiased text-[#212529] flex flex-col overflow-x-hidden`}
      >
        <NextTopLoader
          color="#ff5722"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} // اسپینر زشت پیش‌فرض را حذف کردم
          easing="ease"
          speed={200}
          shadow="0 0 10px #ff5722,0 0 5px #ff5722" // سایه نئونی نارنجی
          zIndex={1600}
        />
        <ConsoleLog />
        <UserProvider initialUser={user}>
          <AuthModalProvider>
            <CartProvider>
              {!user && <AuthModal />}
              <CategoriesProvider categories={safeCategories}>
                {/* تغییر مهم: پاس دادن نوبار و فوتر به عنوان پراپ */}
                <LayoutWrapper
                  navbar={<Navbar />}
                  footer={<Footer />}
                >
                  <Providers>{children}</Providers>
                </LayoutWrapper>
              </CategoriesProvider>
            </CartProvider>
          </AuthModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}
