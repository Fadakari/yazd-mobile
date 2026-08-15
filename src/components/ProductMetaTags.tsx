"use client";

import Script from "next/script";
import ProductType from "@/types/product";

interface ProductMetaTagsProps {
  product: ProductType;
}

export default function ProductMetaTags({ product }: ProductMetaTagsProps) {
  const metaTagsScript = `
    (function() {
      // افزودن یا بروزرسانی متاتگ‌های محصول
      const metaTags = [
        { name: 'product_id', content: '${product.id}' },
        { name: 'product_name', content: '${product.name.replace(/'/g, "\\'")}' },
        { name: 'product_price', content: '${product.final_price || product.price || 0}' },
        { name: 'availability', content: '${product.is_available && product.stock > 0 ? 'instock' : 'outofstock'}' },
      ];

      metaTags.forEach(tag => {
        let meta = document.querySelector(\`meta[name="\${tag.name}"]\`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', tag.name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
      });

      // افزودن یا بروزرسانی og:image
      ${
        product.cover_image
          ? `
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', '${product.cover_image}');
      `
          : ''
      }
    })();
  `;

  return (
    <Script
      id="product-meta-tags"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: metaTagsScript }}
    />
  );
}
