export const revalidate = 30;

import LayoutShell from "@/components/Products/LayoutShell";
import { breadcrumbSchema, productsSchema } from "@/components/Schema";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { CategoryNode } from "@/types/categories";
import { Metadata } from "next";
import Script from "next/script";
import { cache } from "react";

const getProductList = cache(async (filters: any, page: any) => {
  return await GetProducts(filters, page);
});

const getCategories = cache(async () => {
  return await GetShopCategoriesTreeList();
});

// اصلاح بخش کامپوننت اصلی
export default async function ProductsPage(props: {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. ابتدا پارامترها را await می‌کنیم
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { page } = params;
  const search = searchParams;
  
  // اینجا قبلاً از params.page استفاده شده بود که ارور می‌داد. الان از page استفاده می‌کنیم
  const currentPage = Number(page) || 1; 
  const filters = { ...search, page: currentPage };
  
  const data = await getProductList(filters, page);
  const categoryRes = await getCategories();
  const categories = categoryRes?.data || [];
  
  const breadcrumbs = [
    { name: "خانه", url: "/" },
    { name: "محصولات", url: "/products" },
  ];
  
  const schema = [
    ...productsSchema(data.results || []),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <Script
        id="products-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <LayoutShell
        categories={categories}
        products={data.results || []}
        pagination={{ count: data?.count || 0, page: Number(page) || 1 }}
        searchParams={search}
      />
    </>
  );
}

// اصلاح بخش متادیتا
export async function generateMetadata(props: {
  params: Promise<any>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  // این بخش مهم است: searchParams باید await شود
  const searchParams = await props.searchParams;
  const categoryId = searchParams?.category_id;

  if (categoryId) {
    const categoryRes = await GetShopCategoriesTreeList();
    const categories = categoryRes?.data || [];
    // تبدیل categoryId به عدد با + چون از URL به صورت string می‌آید
    const category = categories.find(
      (cat: CategoryNode) => cat.id === Number(categoryId)
    );

    const categoryTitle = category?.name || "دسته‌بندی انتخاب‌شده";

    const title = `${categoryTitle} | خرید انواع ${categoryTitle} با بهترین قیمت | یزد موبایل`;
    const description = `خرید اینترنتی ${categoryTitle} از فروشگاه یزد موبایل با بهترین قیمت و ارسال سریع. بررسی و فیلتر محصولات ${categoryTitle}.`;

    return {
      title,
      description,
      keywords: [
        categoryTitle,
        "فروشگاه یزد موبایل",
        "خرید آنلاین",
        "قیمت مناسب",
      ],
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products?category_id=${categoryId}`,
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

  return {
    title: "خرید محصولات | فروشگاه یزد موبایل",
    description:
      "مشاهده و خرید جدیدترین محصولات با بهترین قیمت از فروشگاه یزد موبایل. فیلتر بر اساس قیمت، موجودی، ویژگی و ...",
    keywords: ["فروشگاه یزد موبایل", "خرید آنلاین", "محصولات", "قیمت مناسب"],
    openGraph: {
      title: "خرید محصولات | فروشگاه یزد موبایل",
      description:
        "فروشگاه یزد موبایل ارائه‌دهنده انواع محصولات با بهترین قیمت و تضمین کیفیت. خرید آنلاین آسان و سریع.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
      siteName: "یزد موبایل",
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "خرید محصولات | یزد موبایل",
      description:
        "محصولات متنوع با قیمت مناسب از فروشگاه اینترنتی یزد موبایل. خرید سریع، امن و مطمئن.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}