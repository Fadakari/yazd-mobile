
import api from "./api";
import { unstable_cache } from "next/cache";
// Products ----

export const GetShopCategoriesTreeList = unstable_cache(
  async () => {
    try {
      const res = await api.get('/shop/categories/tree/')
      return res.data
    } catch (error) {
      console.error(error)
      return null
    }
  },
  ["shop-categories-tree"], // کلید اختصاصی کش
  { revalidate: 600 } // مدت زمان کش به ثانیه (۱۰ دقیقه)
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

        const [resNormal, resDiscounted] = await Promise.all([
            api.get(`/shop/products?${query.toString()}`),
            api.get(`/home/discounted-products/`)
        ]);
        const normalData = resNormal.data;
        const normalProducts = normalData.results || [];
        const discountedList = resDiscounted.data || [];

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






export async function GetLatestProducts(): Promise<any> {
    try {
        const [resLatest, resDiscounted] = await Promise.all([
            api.get(`/shop/latest-products`),
            api.get(`/home/discounted-products/`)
        ]);

        const latestData = resLatest.data;
        const latestProducts = latestData.latest_products || [];
        const discountedList = resDiscounted.data || [];
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
}


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


export async function GetFeaturedProducts(): Promise<any> {
    try {
        const result = await api.get(`/shop/featured-products`);
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

// CART
export async function GetShopCartList(): Promise<{
    total_items: number;
    total_quantity: number;
    total_price: number;
    items: any[];
} | null> {
    try {
        const res = await fetch(`/internal-api/shop/cart`, {
            method: "GET",
            
        });

        if (!res.ok) {
            throw new Error("خطا در دریافت سبد خرید");
        }

        const data = await res.json();

        return data;
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
    color_id?: null | number
    material_id?: null | number
}) {
    const url = "/internal-api/shop/cart/";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),

        });

        const data = await res.json();
        if (!res.ok) return { error: data.error || "خطا در افزودن به سبد خرید" };

        return data;
    } catch (error: any) {
        console.log(error)
        return { error: error.message || "خطا در ارتباط با سرور" };
    }
}


export async function PatchShopCart(id: number, data: { quantity: number, is_discounted?: boolean },
) {
    const url = data?.is_discounted
        ? "/internal-api/shop/discounted-cart/"
        : "/internal-api/shop/cart/";

    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                ...data,
            }),
        });

        const result = await res.json();
        if (!res.ok) {
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
    const url = is_discounted ? "/internal-api/shop/discounted-cart" : "/internal-api/shop/cart";
    try {
        const res = await fetch(`${url}?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error(`Failed to delete item, status: ${res.status}`);

        return await res.json();
    } catch (error) {
        console.error("DeleteShopCart error:", error);
        return null;
    }
}
export async function ClearShopCart() {
    try {
        const res = await fetch(`/internal-api/shop/cart/clear`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete item");

        return await res.json();
    } catch (error) {
        console.log("DeleteShopCart error:", error);
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


export async function GetShippingServices() {
    try {
        const result = await api.get(`/shop/shipping-services `);
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
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
        });

        if (!res.ok) {
            console.error("[DEBUG] Response not OK", res.status);
            throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();

        if (result.tc) {
            localStorage.setItem("tc", result.tc);
        }

        if (result.gateway_url) {
            const { url, params, method } = result.gateway_url;

            if (method === "GET") {
                const queryString = new URLSearchParams(params).toString();
                window.location.href = `${url}?${queryString}`;
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
            }
        } else {
            console.error("[DEBUG] Gateway URL missing in response");
            alert("خطا در گرفتن لینک پرداخت");
        }
    } catch (err) {
        console.error("[DEBUG] Payment error caught:", err);
        alert("خطا در اتصال به درگاه پرداخت");
    }
}
