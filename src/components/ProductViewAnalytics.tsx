"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/analytics";

type ProductViewAnalyticsProps = {
  productId: number;
  productName: string;
  productSlug: string;
};

export default function ProductViewAnalytics({
  productId,
  productName,
  productSlug,
}: ProductViewAnalyticsProps) {
  const trackedProductRef = useRef<number | null>(null);

  useEffect(() => {
    if (trackedProductRef.current === productId) {
      return;
    }

    trackedProductRef.current = productId;

    trackPageView({
      page_type: "product",
      product_id: productId,
      product_name: productName,
      product_slug: productSlug,
    });
  }, [productId, productName, productSlug]);

  return null;
}
