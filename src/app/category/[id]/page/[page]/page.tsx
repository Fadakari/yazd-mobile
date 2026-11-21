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
  params: Promise<{ id: string; page: string }>;
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

export default async function CategoryPaginationPage(props: Props) {
  const { id, page } = await props.params;
  const search = await props.searchParams;

  const currentPage = Number(page) || 1;

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
    page: currentPage,
  };

  const [productsData, brands] = await Promise.all([
    GetProducts(queryParams, currentPage),
    GetBrands(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir";
  const categoryName = category?.name || "دسته‌بندی";

  const breadcrumbs = [
    { name: "خانه", url: `${siteUrl}/` },
    { name: "محصولات", url: `${siteUrl}/products` },
    { name: categoryName, url: `${siteUrl}/category/${category ? category.id : id}` },
    { name: `صفحه ${currentPage}`, url: `${siteUrl}/category/${category ? category.id : id}/page/${currentPage}` },
  ];

  const schema = [
    ...productsSchema(productsData.results || []),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <Script
        id="category-page-products-jsonld"
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
          page: currentPage,
        }}
        searchParams={queryParams}
        href={`category/${category ? category.id : id}`}
      />
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id, page } = await props.params;
  const currentPage = Number(page) || 1;

  const categoryRes = await GetShopCategoriesTreeList();
  const categories: CategoryNode[] = Array.isArray(categoryRes)
    ? categoryRes
    : categoryRes?.data || categoryRes?.results || [];

  const category = findCategoryByIdOrSlug(categories, id);
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "گروه تولیدی آخوندی";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir";

  const categoryTitle = category?.name || "دسته‌بندی محصولات";
  const title = `${categoryTitle} - صفحه ${currentPage} | خرید انواع ${categoryTitle} | ${siteTitle}`;
  const description = `صفحه ${currentPage} از لیست محصولات ${categoryTitle} در فروشگاه ${siteTitle}. مشاهده تنوع، مقایسه قیمت و سفارش آنلاین.`;
  const canonicalUrl = `${siteUrl}/category/${category ? category.id : id}/page/${currentPage}`;

  return {
    title,
    description,
    keywords: [
      categoryTitle,
      `خرید ${categoryTitle}`,
      `قیمت ${categoryTitle}`,
      `فروشگاه ${siteTitle}`,
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
    robots: {
      index: true,
      follow: true,
    },
  };
}
