"use client";

import BreadcrumbsBox from "./BreadcrumbsBox";
import { CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import Products from "./Products";
import FilterBox from "./FilterBox";
import SortBox from "./SortBox";
import { useCategories } from "@/context/CategoriesContext";
import { usePathname } from "next/navigation";
type LayoutShellProps = {
  products: ProductType[];
  searchParams: any;
  pagination?: { count: number; page: number };
  categories: CategoryNode[];
  brands?: any[];
  href?: string;
};
export default function LayoutShell({
  searchParams,
  products,
  pagination,
  brands = [],
  href,
}: LayoutShellProps) {
  const categories = useCategories();
  const pathname = usePathname();
  const categoryId = searchParams.category_id;
  const selected =
    Object.keys(searchParams).length > 0 && !("sort" in searchParams);

  const findCategoryPath = (
    nodes: typeof categories,
    id: string | undefined,
    path: { id: number; name: string }[] = []
  ): { id: number; name: string }[] | null => {
    if (!id) return null;

    if (!nodes || !Array.isArray(nodes)) return null;

    for (const node of nodes) {
      const newPath = [...path, { id: Number(node.id), name: node.name }];

      if (node.id.toString() === id) return newPath;

      if (node.children?.length) {
        const childPath = findCategoryPath(node.children, id, newPath);
        if (childPath) return childPath;
      }
    }

    return null;
  };

  const categoryPath =
    typeof categoryId === "string"
      ? findCategoryPath(categories, categoryId)
      : null;

  const listingTitle = categoryPath?.[categoryPath.length - 1]?.name || (pathname.includes("/offers") ? "پیشنهادهای ویژه" : searchParams.search ? "نتایج جستجو" : "فروشگاه محصولات");
  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "محصولات", href: "/products" },
    ...(categoryPath
      ? categoryPath.map((cat, index) => ({
          label: cat.name,
          href:
            index === categoryPath.length - 1
              ? undefined
              : `/products?category_id=${cat.id}`,
        }))
      : []),
  ];
  return (
    <div className={"akhoondi-listing space-y-6 container max-w-[1440px]"}>
      <BreadcrumbsBox items={breadcrumbItems} />
      <section className="relative overflow-hidden rounded-[1.5rem] border border-[#ded9ce] bg-[#41483b] px-5 py-7 text-[#f7f5ef] shadow-[0_12px_32px_rgba(37,41,35,.10)] sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -left-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" />
        <div className="relative">
          <p className="text-[10px] font-bold tracking-[.22em] text-[#d4c6a7] sm:text-xs">AKHOONDI / COLLECTION</p>
          <h1 className="mt-3 text-2xl font-black leading-tight sm:text-4xl">{listingTitle}</h1>
          <p className="mt-2 max-w-2xl text-xs leading-7 text-white/70 sm:text-sm">انتخاب‌های دقیق و خوش‌ساخت برای فضایی با شخصیت متفاوت</p>
        </div>
      </section>
      <section className="flex w-full h-full flex-col gap-5 lg:flex-row">
        <FilterBox selected={selected} brands={brands} />
        <div className="min-w-0 size-full space-y-5">
          <SortBox />
          <Products
            href={href}
            pagination={pagination}
            products={products}
            searchParams={searchParams}
          />
        </div>
      </section>
    </div>
  );
}
