"use client";

import BreadcrumbsBox from "./BreadcrumbsBox";
import { CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import Products from "./Products";
import FilterBox from "./FilterBox";
import SortBox from "./SortBox";
import { useCategories } from "@/context/CategoriesContext";

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

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "فهرست محصولات", href: "/products" },
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <BreadcrumbsBox items={breadcrumbItems} />
      <section className="flex flex-col lg:flex-row gap-6 w-full h-full items-start">
        <aside className="w-full lg:w-72 shrink-0">
          <FilterBox selected={selected} brands={brands} />
        </aside>
        <div className="w-full flex-1 space-y-6">
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
