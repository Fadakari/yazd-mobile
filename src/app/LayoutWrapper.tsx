"use client";

import FixedSocialLinks from "@/components/FixedSocialLinks";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
  navbar: React.ReactNode; // نوبار را از بیرون می‌گیریم
  footer: React.ReactNode; // فوتر را از بیرون می‌گیریم
}

export default function LayoutWrapper({ children, navbar, footer }: Props) {
  const pathname = usePathname();

  // صفحاتی که نوبار و فوتر نباید داشته باشند
  const isHidden =
    pathname.startsWith("/marketer") || pathname.startsWith("/payment");

  if (isHidden) {
    return <>{children}</>;
  }

  return (
    <>
      <FixedSocialLinks />
      {navbar}
      <main className="flex-1 w-full mx-auto pb-20 px-2 lg:px-0 h-full">
        {children}
      </main>
      {footer}
    </>
  );
}
