"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  cn,
} from "@heroui/react";
import { FiUser, FiLogOut, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { convertNumberToPersian } from "@/utils/converNumbers";

export default function UserDropdown({ user }: { user: any }) {
  const iconClasses = "text-lg text-amber-400 pointer-events-none shrink-0";

  const name =
    user?.identity?.first_name && user?.identity?.last_name
      ? `${user.identity.first_name} ${user.identity.last_name}`
      : "کاربر خوش‌طعم";
  const firstLetter =
    user?.identity?.first_name?.[0] || user?.identity?.phone_number?.[0] || "خ";
  const phone = user?.identity?.phone_number ?? "بدون شماره";
  const onLogout = async () => {
    await fetch("/internal-api/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    location.reload();
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-bold transition-all shadow-sm"
          aria-label="حساب کاربری"
        >
          <FiUser className="size-4 text-red-600" />
          <span className="hidden sm:inline text-[11px] font-bold">{name.split(" ")[0]}</span>
          <FaChevronDown className="size-2.5 text-zinc-500" />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="منوی حساب کاربری"
        variant="faded"
        className="text-right bg-white border border-zinc-200 text-zinc-900 rounded-2xl p-2 shadow-2xl min-w-[220px]"
      >
        <DropdownSection showDivider className="border-b border-zinc-200 pb-2 mb-2">
          <DropdownItem
            isReadOnly
            key="user-info"
            className="flex flex-row cursor-default opacity-100 hover:!bg-transparent"
          >
            <div className="flex flex-row items-center gap-3">
              <div className="size-10 ring-2 ring-amber-400/40 flex items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white font-bold text-sm shrink-0">
                {firstLetter}
              </div>
              <div className="flex flex-col text-right">
                <p className="font-bold text-sm text-zinc-950">{name}</p>
                <p className="text-xs text-zinc-500">
                  {convertNumberToPersian(phone)}
                </p>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection showDivider className="border-b border-zinc-200 pb-2 mb-2">
          <DropdownItem
            key="profile"
            startContent={<FiUser className={iconClasses} />}
            as={Link}
            href="/profile"
            className="hover:!bg-amber-400/15 hover:!text-amber-300 text-zinc-900 rounded-xl"
          >
            حساب کاربری
          </DropdownItem>
          <DropdownItem
            key="orders"
            startContent={<FiShoppingBag className={iconClasses} />}
            as={Link}
            href="/profile/orders"
            className="hover:!bg-amber-400/15 hover:!text-amber-300 text-zinc-900 rounded-xl"
          >
            سفارش‌های من
          </DropdownItem>
        </DropdownSection>

        <DropdownItem
          key="logout"
          className="text-red-400 hover:!bg-red-500/20 hover:!text-red-300 rounded-xl"
          color="danger"
          startContent={<FiLogOut className={cn(iconClasses, "text-red-400")} />}
          onClick={onLogout}
        >
          خروج از حساب
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
