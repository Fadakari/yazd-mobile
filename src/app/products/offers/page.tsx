export const revalidate = 30;

import LayoutShell from "@/components/Products/LayoutShell";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { Metadata } from "next";
import { cache } from "react";

const getProductList = cache(
  async (filters: any, page: any, is_available: any) => {
    return await GetProducts(filters, page, is_available);
  }
);

const getCategories = cache(async () => {
  return await GetShopCategoriesTreeList();
});
export default async function ProductsPage({ searchParams }: any) {
  const search = await searchParams;
  const data = await getProductList(search, 1, true);
  console.log(data);

  const categoryRes = await getCategories();
  const categories = categoryRes?.data || [];
  return (
    <LayoutShell
      categories={categories}
      products={data.results || []}
      pagination={{ count: data.count, page: data?.page || 1 }}
      searchParams={search}
      href="products/offers"
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "تخفیف‌های شگفت‌انگیز | فروشگاه یزد موبایل";
  const description =
    "جدیدترین پیشنهادهای ویژه و تخفیف‌های شگفت‌انگیز فروشگاه یزد موبایل! خرید محصولات منتخب با قیمت باورنکردنی و ارسال سریع.";
  const keywords = [
    "تخفیف ویژه",
    "پیشنهاد شگفت‌انگیز",
    "حراج",
    "فروش ویژه",
    "قیمت باورنکردنی",
    "فروشگاه یزد موبایل",
    "خرید آنلاین ارزان",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/amazing-offers`,
      siteName: "یزد موبایل",
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
