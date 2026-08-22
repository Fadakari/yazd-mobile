// components/Schema/index.tsx

import Article from "@/types/blog";
import ProductType from "@/types/product";
import stripHtml from "@/utils/stripHtml";
import { GetSiteSettings } from "@/services/siteActions";

export type BreadcrumbItem = { name: string; url?: string };

/**
 * JSON-LD برای یک مقاله
 */

export const articleSchema = (article: Article, siteTitle: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

  const toISO = (dateStr?: string | null) => {
    if (!dateStr) return new Date().toISOString();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  const datePublishedISO = toISO(article.created_at_relative);
  const dateModifiedISO = toISO(
    article.jalali_created || article.created_at_relative
  );

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    datePublished: datePublishedISO,
    dateModified: dateModifiedISO,
    author: {
      "@type": "Organization",
      name: `${siteTitle || "سایت ما"}`,
    },
    description: article.introduction || article.title,
    image: article.thumbnail,
    url: `${siteUrl}/articles/${article.slug}`,
  };
};

/**
 * JSON-LD برای یک محصول تکی
 */
export const productSchema = (product: ProductType, siteTitle: string) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.cover_image],
    description: stripHtml(
      product.description_1 || product.description_2 || product.name
    ),
    sku: product.slug,
    brand: `${siteTitle || "سایت ما"}`,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: "IRR",
      price: product.final_price || product.price || 0,
      availability: product.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
};

/**
 * JSON-LD برای لیست محصولات
 */
export const productsSchema = (products: ProductType[], siteTitle: string) => {
  return products.map(p => productSchema(p, siteTitle));
};
/**
 * JSON-LD برای لیست مقالات
 */
export const articlesSchema = (articles: Article[], siteTitle: string) => {
  return articles.map(p => articleSchema(p, siteTitle));
};

/**
 * JSON-LD برای Breadcrumb
 */
export const breadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs
      .filter((b) => b.url)
      .map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
  };
};
