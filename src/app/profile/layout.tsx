import { ReactNode } from "react";
import { GetUserDashboard } from "@/services/authActions";
import { redirect } from "next/navigation";
import { CiShoppingCart, CiShoppingBasket, CiUser } from "react-icons/ci";
import ProfileSideBar from "@/components/Profile/ProfileSideBar";
import { headers } from "next/headers";
export type NavLink = {
  name: string;
  href: string;
  icon: ReactNode;
};
const links: NavLink[] = [
  {
    name: "خلاصه فعالیت ها",
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
    name: "سفارش  های من",
    href: "/profile/orders",
    icon: <CiShoppingCart className="size-5 stroke-1" />,
  },
];
async function Layout({ children }: { children: ReactNode }) {
  const user = await GetUserDashboard();
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "/profile";

  if (!user) {
    const redirectUrl = `/?authRequired=1&redirectTo=${encodeURIComponent(currentPath)}`;
    redirect(redirectUrl);
  }
  return (
    <section className="ak-profile-shell container mx-auto flex h-full max-w-[1440px] flex-col gap-5 py-6 md:flex-row">
      <ProfileSideBar links={links} />
      <div className="min-w-0 md:w-3/4 bg-[#fffefa] h-full p-4 sm:p-6 rounded-[1.4rem] shadow-[0_8px_24px_rgba(37,41,35,.06)] border border-[#ded9ce]">
        {children}
      </div>
    </section>
  );
}

export default Layout;
