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
      <div className="flex flex-col lg:flex-row gap-2 py-10 container customSm:max-w-[566px]">
        <aside className="w-full lg:w-1/3  pl-4">
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
          <h1 className="text-4xl font-semibold mb-4 flex gap-2 items-center">
            مقالات
          </h1>
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
