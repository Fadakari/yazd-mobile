"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

function isProductPath(pathname: string | null): boolean {
  return Boolean(pathname && (pathname.startsWith("/product/") || pathname.startsWith("/products/")));
}

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPageRef = useRef<string | null>(null);

  useEffect(() => {
    // Product pages are tracked by ProductViewAnalytics so the same Page View
    // also carries the stable product identifier required for product reports.
    if (isProductPath(pathname)) {
      return;
    }

    const pageKey = `${pathname}?${searchParams.toString()}`;

    if (lastTrackedPageRef.current === pageKey) {
      return;
    }

    lastTrackedPageRef.current = pageKey;

    const frame = window.requestAnimationFrame(() => {
      trackPageView({ page_type: "page" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}
