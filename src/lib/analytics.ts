"use client";

const ANALYTICS_ENDPOINT = "/analytics/track/";
const SESSION_STORAGE_KEY = "analytics_session_id";

export type AnalyticsPageContext = {
  page_type?: "product" | "page";
  product_id?: number;
  product_name?: string;
  product_slug?: string;
};

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()}`;
}

function getSessionId(): string {
  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const sessionId = createSessionId();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

function getAnalyticsUrl(): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!baseUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Analytics disabled: NEXT_PUBLIC_API_URL is not configured.");
    }
    return null;
  }

  return `${baseUrl.replace(/\/$/, "")}${ANALYTICS_ENDPOINT}`;
}

export function trackPageView(context: AnalyticsPageContext = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = getAnalyticsUrl();

  if (!url) {
    return;
  }

  const payload = {
    path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    title: document.title,
    referrer: document.referrer || "",
    session_id: getSessionId(),
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    ...context,
  };

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    // Analytics requests must never be satisfied from browser/framework caches.
    cache: "no-store",
    credentials: "include",
    keepalive: true,
  }).catch(() => {
    // Analytics must never affect navigation or page rendering.
  });
}
