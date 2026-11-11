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
    <>
      <BreadcrumbsBox
        title="مقالات"
        items={[{ label: "خانه", href: "/" }, { label: "مقالات" }]}
      />
      <div className="flex flex-col lg:flex-row gap-6 py-6 container max-w-[1440px]">
        <aside className="w-full min-w-0 lg:w-1/4 lg:pl-4">
          <h3 className="lg:flex hidden text-2xl font-semibold mb-4  gap-2 items-center">
            <FaFilter />
            دسته‌بندی‌ها
          </h3>
          <div className="hidden lg:flex">
            <CategoryTree categories={categories} />
          </div>
          <div className="lg:hidden flex">
            <CategoryTree categories={categories} isMobile />
          </div>
        </aside>
        <div className="w-full">
          <h1 className="mb-6 flex items-center gap-2 text-3xl font-extrabold text-[#252923] sm:text-4xl">
            مقالات
          </h1>
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
