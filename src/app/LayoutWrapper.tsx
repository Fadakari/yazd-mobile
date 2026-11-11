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
  const isHidden = pathname.startsWith("/marketer") || pathname.startsWith("/payment");
  const isHome = pathname === "/";

  if (isHidden) return <>{children}</>;

  // Homepage owns its complete visual shell (header, navigation and footer).
  // Keep the store-wide shell untouched on every internal route.
  if (isHome) {
    return <main className="min-h-screen w-full flex-1 overflow-x-hidden">{children}</main>;
  }

  return (
    <>
      <FixedSocialLinks />
      {navbar}
      <main className="flex-1 w-full mx-auto pb-20 px-2 lg:px-0 h-full">{children}</main>
      <MobileBottomNav />
      {footer}
    </>
  );
}
