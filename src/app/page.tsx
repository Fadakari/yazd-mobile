import { Metadata } from "next";
import HeroEditorialChapter from "@/components/Editorial/HeroEditorialChapter";
import LookGridSection from "@/components/Editorial/LookGridSection";
import EditorialSplitSection from "@/components/Editorial/EditorialSplitSection";
import PantryCuratedSection from "@/components/Editorial/PantryCuratedSection";
import StudioCraftsmanshipSection from "@/components/Editorial/StudioCraftsmanshipSection";
import ClosingEditorialSection from "@/components/Editorial/ClosingEditorialSection";

export const revalidate = 30;

// --- اینترفیس‌های API ---
interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number;
  cover_image: string | null;
  is_available: boolean;
  is_featured: boolean;
}

interface ApiBanner {
  id: number;
  banner_image: string;
  alt: string;
  link: string;
}

interface ApiCategoryInternal {
  id: number;
  name: string;
  products?: ApiProduct[];
}

interface ApiSection {
  id: number;
  title: string;
  item_type: "category" | "product" | "banner" | "static_banner";
  filter_choice?: string;
  products: ApiProduct[];
  banner_image: ApiBanner[];
  categories: ApiCategoryInternal[];
}

// --- توابع دریافت دیتا ---
async function getHomeData(): Promise<ApiSection[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/home/sliders-index/`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch home data");
    return res.json();
  } catch (error) {
    console.error("Home Data Error:", error);
    return [];
  }
}

export default async function Home() {
  const apiData = await getHomeData();

  // استخراج تمام بنرها از API (اسلایدر اصلی + بنرهای ایستا)
  const allBanners: { id: number; image: string; link?: string; title?: string }[] = [];

  apiData.forEach((section) => {
    if (section.banner_image && section.banner_image.length > 0) {
      section.banner_image.forEach((b) => {
        if (b.banner_image) {
          allBanners.push({
            id: b.id,
            image: b.banner_image,
            link: b.link || "/products",
            title: b.alt,
          });
        }
      });
    }
  });

  // بنر اصلی در صورت خالی بودن دیتابیس
  if (allBanners.length === 0) {
    allBanners.push({
      id: 999,
      image: "/images/brand/hero-banner.webp",
      link: "/products",
      title: "صنایع غذایی خوش طعم کماشدون",
    });
  }

  // تفکیک دسته‌ها
  const flourSection = apiData.find((s) => s.title?.includes("آرد") || s.id === 5);
  const soyaSection = apiData.find((s) => s.title?.includes("سویا") || s.id === 3);
  const herbSection = apiData.find((s) => s.title?.includes("سبزی") || s.id === 2);

  const flourProducts: ApiProduct[] =
    flourSection?.categories?.flatMap((c) => c.products || []) || [];
  const soyaProducts: ApiProduct[] =
    soyaSection?.categories?.flatMap((c) => c.products || []) || [];
  const herbProducts: ApiProduct[] =
    herbSection?.categories?.flatMap((c) => c.products || []) || [];

  return (
    <main className="w-full bg-[#f8fafc] text-[#09090b] min-h-screen selection:bg-[#dc2626] selection:text-white">
      
      {/* فصل اول: استیج سینمایی هیرو (سازگار با هر اندازه بنر با افکت حل شدن در فضا) */}
      <HeroEditorialChapter banners={allBanners} />

      {/* فصل دوم: گالری لوک‌بوک محصولات (چیدمان نامتقارن و استگر ۲ ستونه با زوم نرم) */}
      <LookGridSection products={soyaProducts} />

      {/* فصل سوم: اسپلیت اسکرین فرمول تردی و مانیفست سوخاری */}
      <EditorialSplitSection />

      {/* فصل چهارم: قفسه عطاری و آردهای تخصصی بوتیک */}
      <PantryCuratedSection
        flourProducts={flourProducts}
        herbProducts={herbProducts}
      />

      {/* فصل پنجم: تالار اصالت، دانش تولید و استانداردها */}
      <StudioCraftsmanshipSection />

      {/* فصل ششم: پایان‌بندی سینمایی و دعوت به همکاری */}
      <ClosingEditorialSection />

    </main>
  );
}
