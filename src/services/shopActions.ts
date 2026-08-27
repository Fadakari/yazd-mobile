
import api from "./api";
import { unstable_cache } from "next/cache";


const getFetchOptions = () => {
    const isClient = typeof window !== 'undefined';
    return {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        credentials: "include" as RequestCredentials,
        ...(isClient ? { cache: "no-store" as RequestCache } : {})
    };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Products ----
export async function GetDiscountedProducts() {
  try {
    const res = await fetch(`${API_URL}/home/discounted-products/`, {
        ...getFetchOptions(),
      next: { revalidate: 30 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function GetShopCategoriesTreeList() {
    try {
        // استفاده از fetch نیتیو به جای api.get و unstable_cache
        const res = await fetch(`${API_URL}/shop/categories/tree/`, {
            ...getFetchOptions(),
            next: { revalidate: 30 } // <--- دیتا کش می‌شود اما هر 30 ثانیه در صورت نیاز آپدیت می‌شود
        });

        if (!res.ok) {
            console.error("Failed to fetch categories");
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
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
            // جایگزین api.get با fetch نیتیو
            const resDiscounted = await fetch(`${API_URL}/home/discounted-products/?${query.toString()}`, {
                ...getFetchOptions(),
                next: { revalidate: 30 } 
            });
            if (!resDiscounted.ok) throw new Error("Failed to fetch discounted products");
            const discountedData = await resDiscounted.json();
            
            return {
                ...discountedData,
                results: (discountedData.results || discountedData).map((p: any) => ({
                    ...p,
                    isDiscounted: true
                }))
            };
        }

        // جایگزین api.get با fetch نیتیو
        const [resNormal, discountedList] = await Promise.all([
            fetch(`${API_URL}/shop/products/?${query.toString()}`, {
                ...getFetchOptions(),
                next: { revalidate: 30 }
            }),
            GetDiscountedProducts(),
        ]);
        
        const normalData = resNormal.ok ? await resNormal.json() : { results: [] };
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






export async function GetLatestProducts() {
    try {
        const [resLatest, discountedList] = await Promise.all([
            fetch(`${API_URL}/shop/latest-products/`, {
                ...getFetchOptions(),
                next: { revalidate: 30 }
            }),
            GetDiscountedProducts(),
        ]);

        const latestData = resLatest.ok ? await resLatest.json() : { latest_products: [] };
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
            data: { count: 0, next: null, previous: null, results: [] }
        };
    }
}


export async function GetProductBySlug(slug: string): Promise<any> {
    try {

        const [productRes, discountRes] = await Promise.allSettled([

            fetch(`${API_URL}/shop/products/${encodeURIComponent(slug)}/`, {
                ...getFetchOptions(),
                next: {
                    revalidate: 30,
                    tags: [`product-${slug}`],
                },
            }),

            fetch(`${API_URL}/home/discounted-products/${encodeURIComponent(slug)}/`, {
                ...getFetchOptions(),
                next: {
                    revalidate: 30,
                    tags: [`product-discount-${slug}`],
                },
            })

        ]);

        if (productRes.status !== "fulfilled")
            return null;

        if (!productRes.value.ok)
            return null;

        const product = await productRes.value.json();

        if (
            discountRes.status === "fulfilled" &&
            discountRes.value.ok
        ) {

            const discount = await discountRes.value.json();

            return {
                ...product,
                isDiscounted: true,
                discount_percentage: discount.discount_percentage,
                final_price: discount.final_price,
            };

        }

        return product;

    } catch (error) {

        console.error("GetProductBySlug:", error);

        return null;

    }
}

export async function GetFeaturedProducts() {
  try {
    const res = await fetch(`${API_URL}/shop/featured-products/`, {
        ...getFetchOptions(),
      next: { revalidate: 30 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
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
    const res = await fetch(`${API_URL}/shop/shipping-services/`, {
        ...getFetchOptions(),
      next: { revalidate: 86400 } // آپدیت هر 24 ساعت
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
// Comments
export async function GetComments(product_id: number) {

    try {

        const res = await fetch(
            `${API_URL}/shop/products/${product_id}/comments/`,
            {
                ...getFetchOptions(),
                next: {
                    revalidate: 300,
                    tags: [`comments-${product_id}`],
                },
            }
        );

        if (!res.ok)
            return [];

        return await res.json();

    } catch (e) {

        console.error(e);

        return [];

    }

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
