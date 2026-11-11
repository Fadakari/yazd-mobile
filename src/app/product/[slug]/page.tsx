export const revalidate = 30;

import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GetComments,
  GetProductBySlug,
  GetShopCategoriesTreeList,
} from "@/services/shopActions";
import { CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import TabsBox from "@/components/Products/Product/TabsBox";
import { Metadata } from "next";
import { breadcrumbSchema, productSchema } from "@/components/Schema";
import { imageSchema } from "@/components/Schema/imageSchema";
import Script from "next/script";
import ProductSlider from "@/components/Products/Product/ProductSlider";
import AddToCart from "@/components/Products/AddToCart";
import ProductDescription from "@/components/Products/Product/showMore";
import ProductOptions from "@/components/Products/Product/ProductOptions";
import { ProductProvider } from "@/context/ProductContext";
import ProductPriceBox from "@/components/Products/Product/ProductPriceBox";
import ProductMetaTags from "@/components/ProductMetaTags";
import { GetSiteSettings } from "@/services/siteActions";
import { FiTruck, FiShield, FiCheckCircle } from "react-icons/fi";

async function getShippingServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/shipping-services/`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching shipping services:", error);
    return [];
  }
}

function findCategory(
  categories: CategoryNode[],
  targetName: string
): CategoryNode | undefined {
  for (const category of categories) {
    if (category.name === targetName) {
      return category;
    }
    if (category.children) {
      const foundInChildren = findCategory(category.children, targetName);
      if (foundInChildren) return foundInChildren;
    }
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product: ProductType = await GetProductBySlug(decodedSlug);
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "خوش طعم کماشدون";

  if (!product) {
    return {
      title: "محصول یافت نشد",
      description: "محصول مورد نظر شما یافت نشد.",
    };
  }

  const metaTitle = `${product.name} | ${siteTitle}`;
  const metaDescription =
    product.description_1?.slice(0, 160) ||
    `خرید آنلاین ${product.name} با بهترین کیفیت و تضمین اصالت از فروشگاه ${siteTitle}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      product.name,
      product.category,
      siteTitle,
      "خرید آنلاین",
      "پودر سوخاری",
      "چاشنی کتلت",
    ],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      siteName: siteTitle,
      images: product.cover_image
        ? [
            {
              url: product.cover_image,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ]
        : [],
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: product.cover_image ? [product.cover_image] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  if (!slug || typeof slug !== "string") return notFound();

  const res = await GetProductBySlug(decodedSlug);
  if (!res) return notFound();

  const data: ProductType = res;
  const categories: CategoryNode[] = (await GetShopCategoriesTreeList()) || [];
  const shippingMethods = await getShippingServices();

  const categoryFind = findCategory(categories, data.category);
  const comments = await GetComments(data.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://api.khooshtam.com";

  const breadcrumbs = [
    { label: "خانه", href: "/" },
    { label: "محصولات", href: "/products" },
    ...(categoryFind
      ? [{ label: categoryFind.name, href: `/products?category_id=${categoryFind.id}` }]
      : [{ label: data.category, href: `/products` }]),
    { label: data.name },
  ];

  const schema = [
    productSchema(data),
    breadcrumbSchema(
      breadcrumbs.map((b) => ({
        name: b.label,
        url: b.href ? `${siteUrl}${b.href}` : `${siteUrl}/products`,
      }))
    ),
    imageSchema(data.cover_image, data.name),
  ];

  const images =
    data.images && data.images.length > 0
      ? data.images
          .sort((a, b) => a.order - b.order)
          .map((img) => img.image)
          .filter(Boolean)
      : data.cover_image
      ? [data.cover_image]
      : [];

  const activeShippingMethods = shippingMethods.filter((m: any) => m.is_active);

  return (
    <>
      <ProductMetaTags product={data} />

      <Script
        id="product-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <BreadcrumbsBox title={data.name} items={breadcrumbs} />

        <ProductProvider product={data}>
          {/* Main Product Showcase Card */}
          <div className="bg-white border border-zinc-200/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product Gallery Slider */}
              <div className="lg:col-span-5 w-full">
                <div className="bg-gradient-to-b from-zinc-50 to-amber-50/20 border border-zinc-200 rounded-2xl p-4 shadow-sm">
                  <ProductSlider images={images} alt={data.name} />
                </div>
              </div>

              {/* Product Info & Options */}
              <div className="lg:col-span-4 flex flex-col space-y-5">
                <div className="space-y-2">
                  <span className="text-xs text-red-700 font-bold tracking-wide">
                    {data.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-950 leading-relaxed">
                    {data.name}
                  </h1>
                </div>

                {/* Features & Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-700 py-2 border-y border-zinc-200">
                  <div className="flex items-center gap-1.5">
                    <FiCheckCircle className="size-4 text-red-600 shrink-0" />
                    <span>تولید صنعتی با فرمولاسیون اصیل</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiShield className="size-4 text-red-600 shrink-0" />
                    <span>سیب سلامت و پروانه استاندارد</span>
                  </div>
                </div>

                <ProductOptions product={data} />

                {data.description_1 && (
                  <div className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                    <ProductDescription description={data.description_1} />
                  </div>
                )}
              </div>

              {/* Pricing & Purchase Box (Desktop) */}
              <div className="lg:col-span-3 w-full space-y-4">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-md space-y-5">
                  <ProductPriceBox product={data} />

                  {data.stock <= 5 && data.stock > 0 && (
                    <p className="text-center font-bold text-xs text-red-700 bg-red-50 py-1.5 px-3 rounded-lg border border-red-200">
                      تنها {data.stock === 1 ? "یک" : data.stock.toLocaleString("fa-IR") + " عدد"} در انبار باقی مانده
                    </p>
                  )}

                  <AddToCart
                    is_available={data.is_available && data.stock > 0}
                    product={data}
                  />
                </div>

                {/* Shipping Services info */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-red-700 border-b border-zinc-200 pb-2">
                    <FiTruck className="size-4" />
                    <span>روش‌های ارسال سراسری:</span>
                  </div>
                  <div className="space-y-2">
                    {activeShippingMethods.length > 0 ? (
                      activeShippingMethods.map((method: any) => (
                        <div
                          key={method.id}
                          className="bg-white/5 border border-zinc-200 rounded-xl p-2.5 space-y-1"
                        >
                          <p className="font-semibold text-zinc-900">{method.name}</p>
                          {method.description && (
                            <p className="text-[11px] text-zinc-500">{method.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-zinc-500 text-center">
                        ارسال سریع با پست پیشتاز و باربری
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Floating Mobile Bottom Action Bar */}
          <div className="fixed bottom-[74px] z-40 right-0 left-0 bg-white/95 backdrop-blur-2xl border-t border-zinc-200 p-3 flex items-center justify-between gap-3 shadow-2xl lg:hidden">
            <div className="text-right">
              <ProductPriceBox product={data} />
            </div>
            <div className="w-1/2">
              <AddToCart
                is_available={data.is_available && data.stock > 0}
                product={data}
              />
            </div>
          </div>

          {/* Tabs Section: Description & Comments */}
          <div className="bg-white border border-zinc-200/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <TabsBox
              comments={comments}
              productId={data.id}
              description_2={data.description_2}
            />
          </div>
        </ProductProvider>
      </div>
    </>
  );
}
