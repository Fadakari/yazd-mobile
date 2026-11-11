import { ReactNode } from "react";
import { GetUserDashboard } from "@/services/authActions";
import { redirect } from "next/navigation";
import { CiShoppingCart, CiShoppingBasket, CiUser } from "react-icons/ci";
import ProfileSideBar from "@/components/Profile/ProfileSideBar";
import { headers } from "next/headers";
import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";

export type NavLink = {
  name: string;
  href: string;
  icon: ReactNode;
};

const links: NavLink[] = [
  {
    name: "خلاصه فعالیت‌ها",
    href: "/profile",
    icon: <CiUser className="size-5 stroke-1" />,
  },
  {
    name: "اطلاعات حساب کاربری",
    href: "/profile/personal-info",
    icon: <CiUser className="size-5 stroke-1" />,
  },
  {
    name: "سبد خرید",
    href: "/profile/cart",
    icon: <CiShoppingBasket className="size-5 stroke-1" />,
  },
  {
    name: "سفارش‌های من",
    href: "/profile/orders",
    icon: <CiShoppingCart className="size-5 stroke-1" />,
  },
];

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await GetUserDashboard();
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "/profile";

  if (!user) {
    const redirectUrl = `/?authRequired=1&redirectTo=${encodeURIComponent(currentPath)}`;
    redirect(redirectUrl);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <BreadcrumbsBox
        title="پنل کاربری"
        items={[{ label: "خانه", href: "/" }, { label: "حساب کاربری من" }]}
      />

      <section className="flex flex-col md:flex-row gap-6 h-full items-start">
        <aside className="w-full md:w-80 shrink-0">
          <ProfileSideBar links={links} />
        </aside>
        <div className="w-full flex-1 bg-white border border-zinc-200/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl text-zinc-900">
          {children}
        </div>
      </section>
    </div>
  );
}
