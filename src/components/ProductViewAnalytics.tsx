"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    trackPageView({
      page_type: "product",
      product_id: productId,
      product_name: productName,
      product_slug: productSlug,
    });
  }, [productId, productName, productSlug]);

  return null;
}
