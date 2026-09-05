"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPageRef = useRef<string | null>(null);

  useEffect(() => {
    const pageKey = `${pathname}?${searchParams.toString()}`;

    if (lastTrackedPageRef.current === pageKey) {
      return;
    }

    lastTrackedPageRef.current = pageKey;

    const frame = window.requestAnimationFrame(() => {
      trackPageView();
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
