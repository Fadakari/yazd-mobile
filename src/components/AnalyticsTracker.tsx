"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function generateSessionId() {
  if (typeof window !== "undefined") {
    let sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        "-" +
        Date.now().toString(36);
      sessionStorage.setItem("analytics_session_id", sessionId);
    }
    return sessionId;
  }
  return "";
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialLoad = useRef(false);
  const lastTrackedPath = useRef("");

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Wait a brief moment for document.title to be correctly updated by Next.js
    const timer = setTimeout(() => {
      const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

      // Prevent duplicate tracking if the path hasn't changed (strict mode safety)
      if (hasTrackedInitialLoad.current && lastTrackedPath.current === currentPath) {
        return;
      }

      hasTrackedInitialLoad.current = true;
      lastTrackedPath.current = currentPath;

      const sessionId = generateSessionId();
      const payload = {
        path: currentPath,
        title: document.title || "بدون عنوان",
        referrer: document.referrer || "",
        session_id: sessionId,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;

      const url = `${apiUrl.replace(/\/$/, "")}/analytics/track/`;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => console.error("Analytics fetch error:", err));
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
