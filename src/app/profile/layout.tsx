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
      <div className="ak-profile-panel min-w-0 h-full flex-1 rounded-[1.6rem] border-2 border-[#252923] bg-[#f7f5ef] p-4 shadow-[5px_6px_0_#252923] sm:p-6 md:p-7">
        <div className="mb-6 flex items-center justify-between border-b-2 border-[#d8d2c7] pb-4">
          <div><p className="text-[10px] font-black tracking-[.2em] text-[#a65e43]">YOUR SPACE / AKHOONDI</p><p className="mt-1 text-sm font-bold text-[#777568]">مدیریت حساب و پیگیری خریدها</p></div>
          <span className="rounded-full border border-[#252923] bg-[#c8b995] px-3 py-2 text-[10px] font-black">ACCOUNT</span>
        </div>
        {children}
      </div>
    </section>
  );
}

export default Layout;
