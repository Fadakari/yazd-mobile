"use client";
import { NavLink } from "@/app/profile/layout";
import { useUser } from "@/context/UserContext";
import { convertNumberToPersian } from "@/utils/converNumbers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

function ProfileSideBar({ links }: { links: NavLink[] }) {
  const { user } = useUser();
  const pathname = usePathname();
  if (!user) return <>کاربر پیدا نشد</>;

  return (
    <div className="flex flex-col rounded-[1.4rem] border border-[#ded9ce] md:w-1/4 h-full overflow-hidden shadow-[0_8px_24px_rgba(37,41,35,.06)]">
      <div className="bg-[#41483b] text-[#f7f5ef] py-8 px-6 space-y-2">
        <div className="flex gap-2">
          <div className="size-20 rounded-full bg-[#59634f]">
            <FaUserCircle className="size-20 text-white rounded-full" />
          </div>
          <div className="flex flex-col font-medium">
            <p className="font-semibold text-lg">
              {user.identity?.first_name || "بدون نام"} {user.identity?.last_name}
            </p>
            <p>{convertNumberToPersian(user.identity?.phone_number)}</p>
            <button
              onClick={async () => {
                await fetch("/internal-api/auth/logout/", {
                  method: "POST",
                  credentials: "include",
                });
                location.replace("/");
              }}
              className="bg-[#f7f5ef] px-3 mt-2 py-2 rounded-full text-[#a65e43] flex items-center gap-0.5 active:scale-90"
            >
              <MdOutlineLogout className="size-5" />
              خروج از حساب
            </button>
          </div>
        </div>
      </div>

      <ul className="bg-[#fffefa] border-t border-[#ded9ce] py-6 px-4 w-full font-semibold space-y-0.5">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li className="w-full" key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-3.5 flex items-center gap-2 justify-start rounded-2xl w-full transition-all 
                  ${isActive ? "bg-[#e9e8df] text-[#41483b]" : "text-zinc-700 hover:bg-[#eeebe3] "}
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProfileSideBar;
