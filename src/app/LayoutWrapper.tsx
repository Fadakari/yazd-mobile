"use client";

import FixedSocialLinks from "@/components/FixedSocialLinks";
import MobileBottomNav from "@/components/MobileBottomNav";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export default function LayoutWrapper({ children, navbar, footer }: Props) {
  const pathname = usePathname();

  // صفحاتی که نوبار و فوتر نباید داشته باشند
  const isHidden =
    pathname.startsWith("/marketer") || pathname.startsWith("/payment");

  if (isHidden) {
    return <>{children}</>;
  }

  const isHomePage = pathname === "/";

  return (
    <>
      <FixedSocialLinks />
      {navbar}
      <main
        className={`flex-1 w-full mx-auto pb-20 px-2 lg:px-0 h-full ${
          isHomePage ? "pt-0" : "pt-28 lg:pt-32"
        }`}
      >
        {children}
      </main>
      <MobileBottomNav />
      {footer}
    </>
  );
}
