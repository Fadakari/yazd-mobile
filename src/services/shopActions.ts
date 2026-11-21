
import api from "./api";
import { unstable_cache } from "next/cache";
// Products ----
export const GetDiscountedProducts = unstable_cache(
  async () => {
    try {
      const result = await api.get("/home/discounted-products/");
      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  ["discounted-products"],
  { revalidate: 300 }
);

export const GetShopCategoriesTreeList = unstable_cache(
    async () => {
        try {
            const result = await api.get("/shop/categories/tree/");
            return result.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    ["shop-categories-tree"],
    { revalidate: 3600 }
);
interface GetProductsParams {
    category_id?: number;
    min_price?: number;
    max_price?: number;
    is_available?: boolean;
    is_featured?: boolean;
    search?: string;
    new_days?: number;
    sort?: string;
    page?: number;
}
export async function GetProducts(
    params?: GetProductsParams,
    page?: number,
    onlyDiscounted?: boolean
): Promise<any> {
    try {
        const searchParams = await params || {};
        const query = new URLSearchParams();

        if (searchParams?.category_id !== undefined) query.append("category_id", searchParams.category_id.toString());
        if (searchParams?.min_price !== undefined) query.append("min_price", searchParams.min_price.toString());
        if (searchParams?.max_price !== undefined) query.append("max_price", searchParams.max_price.toString());
        if (searchParams?.is_available !== undefined) query.append("is_available", String(searchParams.is_available));
        if (searchParams?.is_featured !== undefined) query.append("is_featured", String(searchParams.is_featured));
        if (searchParams?.search) query.append("search", searchParams.search);
        if (searchParams?.new_days !== undefined) query.append("new_days", searchParams.new_days.toString());
        if (searchParams?.sort) query.append("sort", searchParams.sort);
        if (page) query.append("page", String(page));

        if (onlyDiscounted) {
            const resDiscounted = await api.get(`/home/discounted-products/?${query.toString()}`);
            const discountedData = resDiscounted.data;
            return {
                ...discountedData,
                results: (discountedData.results || discountedData).map((p: any) => ({
                    ...p,
                    isDiscounted: true
                }))
            };
        }

        const [resNormal, discountedList] = await Promise.all([
            api.get(`/shop/products?${query.toString()}`),
            GetDiscountedProducts(),
        ]);
        
        const normalData = resNormal.data;
        const normalProducts = normalData.results || [];

        const discountedMap = new Map(
            discountedList.map((item: any) => [item.slug, item])
        );

        const merged = normalProducts.map((product: any) => {
            const discount: any = discountedMap.get(product.slug);
            if (discount) {
                return {
                    ...product,
                    isDiscounted: true,
                    discount_percentage: discount.discount_percentage,
                    final_price: discount.final_price
                };
            }
            return product;
        });
        return {
            ...normalData,
            results: merged
        };

    } catch (err) {
        console.log(err)
        return {
            count: 0,
            next: null,
            previous: null,
            results: []
        };
    }
}






export const GetLatestProducts = unstable_cache(
    async () => {

        try {
            const [resLatest, discountedList] = await Promise.all([
                api.get(`/shop/latest-products`),
                GetDiscountedProducts(),
            ]);

            const latestData = resLatest.data;
            const latestProducts = latestData.latest_products || [];
            const discountedMap = new Map(
                discountedList.map((item: any) => [item.slug, item])
            );

            const merged = latestProducts.map((product: any) => {
                const discount: any = discountedMap.get(product.slug);
                if (discount) {
                    return {
                        ...product,
                        isDiscounted: true,
                        discount_percentage: discount.discount_percentage,
                        final_price: discount.final_price
                    };
                }
                return product;
            });
            return {
                data: {
                    ...latestData,
                    results: merged
                }
            };
        } catch (error) {
            console.log(error);
            return {
                data: {
                    count: 0,
                    next: null,
                    previous: null,
                    results: []
                }
            };
        }
    },
  ["latest-products"],
  { revalidate: 300 }
);


export async function GetProductBySlug(slug: string): Promise<any> {
    try {
        const productRes = await api.get(`/shop/products/${slug}/`);
        const product = productRes.data;
        try {
            const discountRes = await api.get(`/home/discounted-products/${slug}/`);
            const discount = discountRes.data;
            if (discount) {
                return {
                    ...product,
                    isDiscounted: true,
                    final_price: discount.final_price,
                };
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
        }

        return product;
    } catch (error) {
        console.error('GetProductBySlug error:', error);
        return null;
    }
}


export const GetFeaturedProducts = unstable_cache(
  async () => {
    try {
      const result = await api.get("/shop/featured-products");
      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  ["featured-products"],
  { revalidate: 300 }
);

// CART
export async function GetShopCartList(): Promise<{
    total_items: number;
    total_quantity: number;
    total_price: number;
    total_delivery: number;
    final_price: number;
    original_total_price?: number;
    total_discount?: number;
    items: any[];
} | null> {
    try {
        const [normalRes, discountedRes] = await Promise.allSettled([
            fetch(`/internal-api/shop/cart`, { method: "GET" }),
            fetch(`/internal-api/shop/discounted-cart`, { method: "GET" }),
        ]);

        let normalData: any = null;
        let discountedData: any = null;

        if (normalRes.status === "fulfilled" && normalRes.value.ok) {
            normalData = await normalRes.value.json().catch(() => null);
        }
        if (discountedRes.status === "fulfilled" && discountedRes.value.ok) {
            discountedData = await discountedRes.value.json().catch(() => null);
        }

        if (!normalData && !discountedData) {
            return null;
        }

        const normalItems: any[] = Array.isArray(normalData?.items)
            ? normalData.items.map((i: any) => ({ ...i, is_discounted: false }))
            : [];
        const discountedItems: any[] = Array.isArray(discountedData?.items)
            ? discountedData.items.map((i: any) => ({ ...i, is_discounted: true }))
            : [];

        // ادغام اقلام سبد خرید
        const rawItems = [...normalItems, ...discountedItems];

        // محاسبه دقیق قیمت تخفیف خورده و قیمت اصلی برای هر کالا
        const normalizedItems = rawItems.map((item) => {
            const rawProduct = item.product || {};
            const originalUnitPrice = Number(rawProduct.price ?? item.unit_price ?? 0);

            // بررسی وجود قیمت تخفیفی
            let effectiveDiscountPrice: number | null = null;
            if (typeof item.final_price === "number" && item.final_price > 0 && item.final_price < originalUnitPrice) {
                effectiveDiscountPrice = item.final_price;
            } else if (typeof rawProduct.discount_price === "number" && rawProduct.discount_price > 0 && rawProduct.discount_price < originalUnitPrice) {
                effectiveDiscountPrice = rawProduct.discount_price;
            } else if (typeof rawProduct.final_price === "number" && rawProduct.final_price > 0 && rawProduct.final_price < originalUnitPrice) {
                effectiveDiscountPrice = rawProduct.final_price;
            } else if (item.is_discounted && typeof item.unit_price === "number" && item.unit_price > 0 && item.unit_price < originalUnitPrice) {
                effectiveDiscountPrice = item.unit_price;
            }

            const isDiscounted = Boolean(item.is_discounted || effectiveDiscountPrice !== null);
            const finalUnitPrice = effectiveDiscountPrice !== null ? effectiveDiscountPrice : (Number(item.unit_price) || originalUnitPrice);
            const quantity = Number(item.quantity || 1);
            const itemTotalPrice = finalUnitPrice * quantity;
            const originalTotalPrice = (originalUnitPrice > 0 ? originalUnitPrice : finalUnitPrice) * quantity;

            return {
                ...item,
                is_discounted: isDiscounted,
                original_unit_price: originalUnitPrice > 0 ? originalUnitPrice : finalUnitPrice,
                original_total_price: originalTotalPrice,
                final_price: finalUnitPrice,
                unit_price: finalUnitPrice,
                effective_unit_price: finalUnitPrice,
                effective_total_price: itemTotalPrice,
                total_price: itemTotalPrice,
            };
        });

        const totalQuantity = normalizedItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
        const totalItemsCount = normalizedItems.length;
        const totalOriginalPrice = normalizedItems.reduce((acc, it) => acc + (it.original_total_price || it.total_price), 0);
        const totalEffectivePrice = normalizedItems.reduce((acc, it) => acc + it.total_price, 0);
        const totalDelivery = (Number(normalData?.total_delivery) || 0) + (Number(discountedData?.total_delivery) || 0);

        return {
            total_items: totalItemsCount,
            total_quantity: totalQuantity,
            original_total_price: totalOriginalPrice,
            total_price: totalEffectivePrice,
            total_discount: Math.max(0, totalOriginalPrice - totalEffectivePrice),
            total_delivery: totalDelivery,
            final_price: totalEffectivePrice + totalDelivery,
            items: normalizedItems,
        };
    } catch (error) {
        console.log("GetShopCartList error:", error);
        return null;
    }
}

export async function PostShopCart(item: {
    product_id: number;
    quantity: number;
    is_discounted?: boolean;
    store_name_english?: string;
    color_id?: null | number;
    material_id?: null | number;
}) {
    const primaryUrl = item.is_discounted
        ? "/internal-api/shop/discounted-cart/"
        : "/internal-api/shop/cart/";
    const fallbackUrl = item.is_discounted
        ? "/internal-api/shop/cart/"
        : "/internal-api/shop/discounted-cart/";

    try {
        let res = await fetch(primaryUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });

        let data = await res.json().catch(() => ({}));
        if (!res.ok) {
            // تلاش فال‌بک در صورت بروز خطا در مسیر اول
            const fallbackRes = await fetch(fallbackUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            const fallbackData = await fallbackRes.json().catch(() => ({}));
            if (fallbackRes.ok) return fallbackData;

            return { error: data.error || fallbackData.error || "خطا در افزودن به سبد خرید" };
        }

        return data;
    } catch (error: any) {
        console.log(error);
        return { error: error.message || "خطا در ارتباط با سرور" };
    }
}

export async function PatchShopCart(id: number, data: { quantity: number; is_discounted?: boolean }) {
    const primaryUrl = data?.is_discounted
        ? "/internal-api/shop/discounted-cart/"
        : "/internal-api/shop/cart/";
    const fallbackUrl = data?.is_discounted
        ? "/internal-api/shop/cart/"
        : "/internal-api/shop/discounted-cart/";

    try {
        let res = await fetch(primaryUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                ...data,
            }),
        });

        let result = await res.json().catch(() => ({}));
        if (!res.ok) {
            const fallbackRes = await fetch(fallbackUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    ...data,
                }),
            });
            if (fallbackRes.ok) return await fallbackRes.json();

            if (res.status === 400 || res.status === 409) {
                return { error: result?.error || "خطا در بروزرسانی کالا" };
            }
            throw new Error(result?.error || "Failed to update cart item");
        }

        return result;
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function DeleteShopCart(id: string, is_discounted?: boolean) {
    const primaryUrl = is_discounted ? "/internal-api/shop/discounted-cart" : "/internal-api/shop/cart";
    const fallbackUrl = is_discounted ? "/internal-api/shop/cart" : "/internal-api/shop/discounted-cart";
    try {
        let res = await fetch(`${primaryUrl}?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const fallbackRes = await fetch(`${fallbackUrl}?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            if (fallbackRes.ok) return await fallbackRes.json();
            throw new Error(`Failed to delete item, status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("DeleteShopCart error:", error);
        return null;
    }
}
export async function ClearShopCart() {
    try {
        await Promise.allSettled([
            fetch(`/internal-api/shop/cart/clear`, { method: "DELETE" }),
            fetch(`/internal-api/shop/discounted-cart/clear`, { method: "DELETE" }),
        ]);

        return { success: true };
    } catch (error) {
        console.log("ClearShopCart error:", error);
        return null;
    }
}

export async function createDiscountedOrder(data: any) {
    try {
        const res = await fetch(`/internal-api/shop/order/discounted`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "خطا در ثبت سفارش تخفیف‌دار",
            };
        }

        return {
            success: true,
            data: json,
            message: json.message || "سفارش تخفیف‌دار با موفقیت ثبت شد",
        };
    } catch (error: any) {
        return { success: false, message: error.message || "خطای ناشناخته" };
    }
}

export async function createNormalOrder(data: any) {
    try {
        const res = await fetch(`/internal-api/shop/order/normal`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "خطا در ثبت سفارش عادی",
            };
        }

        return {
            success: true,
            data: json,
            message: json.message || "سفارش عادی با موفقیت ثبت شد",
        };
    } catch (error: any) {
        return { success: false, message: error.message || "خطای ناشناخته" };
    }
}
export async function marketing_create_order(data: any, store_name_english: string) {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/internal-api/marketing/store/${store_name_english}/order/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: json.message || "خطا در ثبت سفارش مارکتینگ",
            };
        }

        return {
            success: true,
            data: json,
            message: json.message || "سفارش مارکتینگ با موفقیت ثبت شد",
        };
    } catch (error: any) {
        return { success: false, message: error.message || "خطای ناشناخته" };
    }
}


export const GetShippingServices = unstable_cache(
  async () => {
    try {
      const result = await api.get("/shop/shipping-services");
      return result.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  ["shipping-services"],
  { revalidate: 86400 }
);
// Comments
export async function GetComments(product_id: number) {
    const response = await api.get(`/shop/products/${product_id}/comments/`);
    return response.data;
}


export async function PostComment(product_id: number, data: { text: string; parent?: number | null }) {
    const res = await fetch(`/internal-api/shop/comments/${String(product_id)}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "ارسال نظر با خطا مواجه شد");
    }

    return res.json();
}
export async function DeleteComment(commentId: number) {
    const res = await fetch(`/internal-api/shop/comments/delete/${commentId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در حذف نظر");
    }

    return true;
}


export async function goToGateways(id: number | string) {
    try {
        const res = await fetch(`/internal-api/shop/pay/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (!res.ok) {
            console.error("[DEBUG] Response not OK", res.status, result);
            const errorMessage = result.message || result.error || `خطا در دریافت درگاه پرداخت (${res.status})`;
            throw new Error(errorMessage);
        }

        // ذخیره کد پیگیری جهت استفاده‌های بعدی یا استعلام
        if (result.tc) {
            try {
                localStorage.setItem("tc", result.tc);
                localStorage.setItem("last_payment_tc", result.tc);
                localStorage.setItem(`order_tc_${id}`, result.tc);
            } catch (storageErr) {
                console.warn("[PAYMENT] Could not save tc to localStorage", storageErr);
            }
        }

        if (result.gateway_url) {
            // حالت استاندارد بک‌اند جدید: آدرس به صورت رشته مستقیم برمی‌گردد
            if (typeof result.gateway_url === "string") {
                window.location.href = result.gateway_url;
                return { success: true, gateway_url: result.gateway_url, tc: result.tc };
            }

            // سازگاری با فرمت قدیمی آبجکتی در صورت وجود
            if (typeof result.gateway_url === "object" && result.gateway_url.url) {
                const { url, params = {}, method = "GET" } = result.gateway_url;

                if (String(method).toUpperCase() === "GET") {
                    const queryString = new URLSearchParams(params).toString();
                    const targetUrl = queryString ? `${url}?${queryString}` : url;
                    window.location.href = targetUrl;
                    return { success: true, gateway_url: targetUrl, tc: result.tc };
                } else {
                    const form = document.createElement("form");
                    form.method = method;
                    form.action = url;

                    Object.entries(params).forEach(([key, value]) => {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = String(value);
                        form.appendChild(input);
                    });

                    document.body.appendChild(form);
                    form.submit();
                    return { success: true, gateway_url: url, tc: result.tc };
                }
            }
        }

        console.error("[DEBUG] Gateway URL missing in response", result);
        throw new Error(result.message || "آدرس درگاه پرداخت از سرور دریافت نشد.");
    } catch (err: any) {
        console.error("[DEBUG] Payment error caught:", err);
        throw err;
    }
}

export async function verifyGatewayPayment(tc: string) {
    try {
        const res = await fetch(`/internal-api/shop/pay/verify`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tc }),
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || "خطا در استعلام پرداخت");
        }
        return result;
    } catch (err: any) {
        console.error("[DEBUG] Verify gateway error:", err);
        throw err;
    }
}
