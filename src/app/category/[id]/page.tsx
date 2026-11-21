export const revalidate = 30;

import LayoutShell from "@/components/Products/LayoutShell";
import { GetProducts, GetShopCategoriesTreeList, GetBrands } from "@/services/shopActions";
import { breadcrumbSchema, productsSchema } from "@/components/Schema";
import Script from "next/script";
import { Metadata } from "next";
import { CategoryNode } from "@/types/categories";
import { GetSiteSettings } from "@/services/siteActions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function findCategoryByIdOrSlug(nodes: CategoryNode[], target: string): CategoryNode | null {
  const targetNum = parseInt(target, 10);
  for (const node of nodes) {
    if (node.id === targetNum || node.slug === target || `${node.id}-${node.slug}` === target) {
      return node;
    }
    if (node.children?.length) {
      const found = findCategoryByIdOrSlug(node.children, target);
      if (found) return found;
    }
  }
  return null;
}

export default async function CategoryPage(props: Props) {
  const { id } = await props.params;
  const search = await props.searchParams;

  const categoryRes = await GetShopCategoriesTreeList();
  const categories: CategoryNode[] = Array.isArray(categoryRes)
    ? categoryRes
    : categoryRes?.data || categoryRes?.results || [];

  const category = findCategoryByIdOrSlug(categories, id);
  const catId = category ? category.id : parseInt(id, 10);

  if (!category && isNaN(catId)) {
    notFound();
  }

  const queryParams = {
    ...search,
    category_id: catId,
  };

  const [productsData, brands] = await Promise.all([
    GetProducts(queryParams, 1),
    GetBrands(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir";
  const categoryName = category?.name || "دسته‌بندی";

  const breadcrumbs = [
    { name: "خانه", url: `${siteUrl}/` },
    { name: "محصولات", url: `${siteUrl}/products` },
    { name: categoryName, url: `${siteUrl}/category/${category ? category.id : id}` },
  ];

  const schema = [
    ...productsSchema(productsData.results || []),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <Script
        id="category-products-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <LayoutShell
        brands={brands}
        categories={categories}
        products={productsData.results || []}
        pagination={{
          count: productsData.count || 0,
          page: 1,
        }}
        searchParams={queryParams}
        href={`category/${category ? category.id : id}`}
      />
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  const categoryRes = await GetShopCategoriesTreeList();
  const categories: CategoryNode[] = Array.isArray(categoryRes)
    ? categoryRes
    : categoryRes?.data || categoryRes?.results || [];

  const category = findCategoryByIdOrSlug(categories, id);
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "گروه تولیدی آخوندی";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir";

  const categoryTitle = category?.name || "دسته‌بندی محصولات";
  const title = `${categoryTitle} | خرید انواع ${categoryTitle} با بهترین قیمت | ${siteTitle}`;
  const description = `خرید اینترنتی انواع ${categoryTitle} از فروشگاه ${siteTitle} با بالاترین کیفیت، تنوع و بهترین قیمت. مشاهده، بررسی و ثبت سفارش آنلاین ${categoryTitle}.`;
  const canonicalUrl = `${siteUrl}/category/${category ? category.id : id}`;

  return {
    title,
    description,
    keywords: [
      categoryTitle,
      `خرید ${categoryTitle}`,
      `قیمت ${categoryTitle}`,
      `فروشگاه ${siteTitle}`,
      "خرید آنلاین",
      "تضمین کیفیت",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: `${siteTitle}`,
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
