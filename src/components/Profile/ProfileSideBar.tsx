"use client";

import { NavLink } from "@/app/profile/layout";
import { useUser } from "@/context/UserContext";
import { convertNumberToPersian } from "@/utils/converNumbers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

export default function ProfileSideBar({ links }: { links: NavLink[] }) {
  const { user } = useUser();
  const pathname = usePathname();
  if (!user) return <>کاربر پیدا نشد</>;

  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-white border border-zinc-200/90 backdrop-blur-xl shadow-xl w-full">
      {/* User Header */}
      <div className="bg-gradient-to-br from-red-600 via-rose-700 to-amber-600 text-white p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-full bg-slate-900/60 flex items-center justify-center p-0.5 border border-zinc-300 shrink-0">
            <FaUserCircle className="size-full text-zinc-950" />
          </div>
          <div className="flex flex-col truncate">
            <p className="font-bold text-base truncate">
              {user.identity?.first_name || "کاربر گرامی"} {user.identity?.last_name || ""}
            </p>
            <p className="text-xs text-amber-200">
              {convertNumberToPersian(user.identity?.phone_number)}
            </p>
          </div>
        </div>

        <button
          onClick={async () => {
            await fetch("/internal-api/auth/logout/", {
              method: "POST",
              credentials: "include",
            });
            location.replace("/");
          }}
          className="w-full bg-black/30 hover:bg-black/50 text-white text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all mt-2 border border-zinc-200"
        >
          <MdOutlineLogout className="size-4" />
          <span>خروج از حساب</span>
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="p-4 space-y-1 text-xs">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li className="w-full" key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-3 flex items-center gap-3 rounded-xl w-full transition-all font-medium ${
                  isActive
                    ? "bg-amber-400/15 text-amber-400 font-bold border border-amber-400/30"
                    : "text-zinc-700 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={isActive ? "text-amber-400" : "text-zinc-500"}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
