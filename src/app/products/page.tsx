export const revalidate = 30;

import LayoutShell from "@/components/Products/LayoutShell";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { breadcrumbSchema, productsSchema } from "@/components/Schema";
import Script from "next/script";
import { cache } from "react";
import { Metadata } from "next";
import { CategoryNode } from "@/types/categories";

const getProductList = cache(async (params: any) => {
  return await GetProducts(params);
});

const getCategories = cache(async () => {
  return await GetShopCategoriesTreeList();
});

// دریافت داده‌های بخش‌های اسلایدر
const getSliderSections = cache(async () => {
  try {
    const res = await fetch("https://api.yazd-mobile.ir/home/sliders-index/", {
      
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Slider Sections Error:", error);
    return [];
  }
});

export default async function ProductsPage({ searchParams }: any) {
  const search = await searchParams;
  const sectionId = search?.section_id ? parseInt(search.section_id) : null;

  let data: any;
  
  // اگر sectionId وجود داشته باشد، محصولات فقط از آن بخش را نمایش بده
  if (sectionId) {
    const sliderSections = await getSliderSections();
    const selectedSection = sliderSections.find((section: any) => section.id === sectionId);
    
    if (selectedSection && selectedSection.item_type === "product") {
      // محصولات این بخش را به‌صورت مستقیم استفاده کن
      data = {
        results: selectedSection.products || [],
        count: selectedSection.products?.length || 0,
        page: 1,
        next: null,
        previous: null,
      };
    } else if (selectedSection && selectedSection.item_type === "category") {
      // محصولات تمام دسته‌بندی‌های این بخش را دریافت کن
      const allProducts = (selectedSection.categories || []).flatMap((cat: any) => cat.products || []);
      data = {
        results: allProducts,
        count: allProducts.length,
        page: 1,
        next: null,
        previous: null,
      };
    } else {
      // اگر بخش یافت نشود، یک صفحه خالی نمایش بده
      data = {
        results: [],
        count: 0,
        page: 1,
        next: null,
        previous: null,
      };
    }
  } else {
    // اگر sectionId نیست، طبق حالت عادی دریافت کن
    data = await getProductList(search);
  }

  const categoryRes = await getCategories();
  const categories = Array.isArray(categoryRes) ? categoryRes : (categoryRes?.data || categoryRes?.results || []);

  const breadcrumbs = [
    { name: "خانه", url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    { name: "محصولات", url: `${process.env.NEXT_PUBLIC_SITE_URL}/products` },
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
        pagination={{
          count: data.count,
          page: data.page || 1,
        }}
        searchParams={search}
      />
    </>
  );
}
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: any;
}): Promise<Metadata> {
  const search = await searchParams;
  const categoryId = search?.category_id;

  if (categoryId) {
    const categoryRes = await GetShopCategoriesTreeList();
    const categories = Array.isArray(categoryRes) ? categoryRes : (categoryRes?.data || categoryRes?.results || []);
    const category = categories.find(
      (cat: CategoryNode) => cat.id === +categoryId
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
    title: "خرید محصولات | یزد موبایل",
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
