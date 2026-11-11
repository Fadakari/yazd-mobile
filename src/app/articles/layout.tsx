import CategoryTree from "@/components/CategoryTree";
import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { GetBlogCategoriesMenuStructure } from "@/services/blogActions";
import { BlogCategoryNode } from "@/types/categories";
import { ReactNode } from "react";
import { FaFilter } from "react-icons/fa";

async function layout({ children }: { children: ReactNode }) {
  const rawCategories = await GetBlogCategoriesMenuStructure();
  const categories: BlogCategoryNode[] = Array.isArray(rawCategories)
    ? rawCategories
    : [];
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <BreadcrumbsBox
        title="مقالات"
        items={[{ label: "خانه", href: "/" }, { label: "مقالات و دانستنی‌های آشپزی" }]}
      />
      <div className="flex flex-col lg:flex-row gap-8 py-4 text-zinc-900">
        <aside className="w-full lg:w-1/4 shrink-0">
          <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-lg">
            <h3 className="lg:flex hidden text-base sm:text-lg font-black mb-4 gap-2 items-center text-red-700 border-b border-zinc-200 pb-3">
              <FaFilter className="size-4" />
              <span>دسته‌بندی‌ها</span>
            </h3>
            <div className="hidden lg:flex flex-col">
              <CategoryTree categories={categories} />
            </div>
            <div className="lg:hidden flex flex-col">
              <CategoryTree categories={categories} isMobile />
            </div>
          </div>
        </aside>
        <div className="w-full lg:w-3/4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;
