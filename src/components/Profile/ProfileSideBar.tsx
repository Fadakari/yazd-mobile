"use client";

import { NavLink } from "@/app/profile/layout";
import { useUser } from "@/context/UserContext";
import { convertNumberToPersian } from "@/utils/converNumbers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { ArrowUpLeft } from "lucide-react";

function ProfileSideBar({ links }: { links: NavLink[] }) {
  const { user } = useUser();
  const pathname = usePathname();
  if (!user) return <>کاربر پیدا نشد</>;

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-[1.6rem] border-2 border-[#252923] bg-[#f7f5ef] shadow-[5px_6px_0_#252923] md:w-1/4">
      <div className="relative isolate overflow-hidden bg-[#41483b] px-5 py-7 text-[#f7f5ef] sm:px-6">
        <span className="absolute -left-10 -top-12 -z-0 h-40 w-40 rounded-full border-[22px] border-white/10" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-[#252923] bg-[#c8b995] text-[#252923] shadow-[3px_3px_0_#252923]">
            <FaUserCircle className="size-11" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-black">{user.identity?.first_name || "کاربر آخوندی"} {user.identity?.last_name}</p>
            <p className="mt-1 text-xs font-bold text-white/70" dir="ltr">{convertNumberToPersian(user.identity?.phone_number)}</p>
          </div>
        </div>
        <div className="relative mt-6 flex items-center justify-between border-t border-white/20 pt-4">
          <span className="text-[10px] font-black tracking-[.18em] text-[#c8b995]">MY AKHOONDI / ACCOUNT</span>
          <button onClick={async () => {
            await fetch("/internal-api/auth/logout/", { method: "POST", credentials: "include" });
            location.replace("/");
          }} className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-[11px] font-black text-white transition-colors hover:bg-[#a65e43]">
            <MdOutlineLogout className="size-4" /> خروج
          </button>
        </div>
      </div>

      <nav className="flex-1 bg-[#e6e2d8] p-3 sm:p-4">
        <p className="mb-3 px-3 text-[10px] font-black tracking-[.2em] text-[#777568]">حساب کاربری</p>
        <ul className="space-y-2">
          {links.map(link => {
            const isActive = pathname === link.href || (link.href === "/profile" && pathname === "/profile");
            return <li key={link.href}>
              <Link href={link.href} className={`group flex w-full items-center justify-between gap-2 rounded-xl border-2 px-3 py-3.5 text-sm font-black transition-all duration-300 ${isActive ? "border-[#252923] bg-[#c8b995] text-[#252923] shadow-[3px_3px_0_#252923]" : "border-transparent bg-[#f7f5ef] text-[#68685e] hover:border-[#252923] hover:bg-white"}`}>
                <span className="flex items-center gap-3">{link.icon}<span>{link.name}</span></span>
                <ArrowUpLeft size={16} className="opacity-50 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </li>;
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default ProfileSideBar;
