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
  const isMarketer = pathname.startsWith("/marketer");
  const isPayment = pathname.startsWith("/payment");
  const isHome = pathname === "/";

  if (isMarketer) return <>{children}</>;
  if (isPayment) return <div className="akhoondi-site min-h-screen bg-[#f7f5ef] text-[#252923]">{children}</div>;

  // Homepage owns its complete visual shell (header, navigation and footer).
  // Keep the store-wide shell untouched on every internal route.
  if (isHome) {
    return <div className="min-h-screen w-full flex-1 overflow-x-hidden pb-20 lg:pb-0">{children}<MobileBottomNav /></div>;
  }

  return (
    <div className="akhoondi-site min-h-screen w-full overflow-x-clip bg-[#f7f5ef] text-[#252923]">
      <FixedSocialLinks />
      {navbar}
      <main className="akhoondi-content mx-auto min-h-[55vh] w-full flex-1 px-3 pb-24 sm:px-5 lg:px-0">{children}</main>
      <MobileBottomNav />
      {footer}
    </div>
  );
}
