import { GetBlogCategoriesMenuStructure, GetBlogPosts } from "@/services/blogActions";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { BlogCategoryNode, CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import { MetadataRoute } from "next";
import jalaali from "jalaali-js";
import Article from "@/types/blog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir";

function convertJalaliToDate(jalaliStr: string): Date {
    try {
        const [jy, jm, jd] = jalaliStr.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).split("/").map(Number);
        const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
        return new Date(gy, gm - 1, gd);
    } catch {
        return new Date();
    }
}

async function getAllProducts(): Promise<ProductType[]> {
    let allProducts: ProductType[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore && page <= 50) {
            const res = await GetProducts({}, page);
            if (res && Array.isArray(res.results) && res.results.length > 0) {
                allProducts = allProducts.concat(res.results);
                page++;
                hasMore = Boolean(res.next);
            } else {
                hasMore = false;
            }
        }
    } catch (error) {
        console.error("Sitemap getAllProducts error:", error);
    }

    return allProducts;
}

async function getAllBlogPosts(): Promise<Article[]> {
    let allPosts: Article[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore && page <= 50) {
            const res = await GetBlogPosts({}, page.toString());
            const posts = Array.isArray(res) ? res : (res?.data || res?.results || []);
            if (posts.length > 0) {
                allPosts = allPosts.concat(posts);
                page++;
                hasMore = posts.length >= 10;
            } else {
                hasMore = false;
            }
        }
    } catch (error) {
        console.error("Sitemap getAllBlogPosts error:", error);
    }

    return allPosts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const rawCategories = await GetBlogCategoriesMenuStructure();
    const blogcategories: BlogCategoryNode[] = Array.isArray(rawCategories) ? rawCategories : [];
    const blogPosts = await getAllBlogPosts();
    const products = await getAllProducts();
    const categoriesData = await GetShopCategoriesTreeList();
    const categoryItems: CategoryNode[] = Array.isArray(categoriesData) 
        ? categoriesData 
        : (categoriesData?.data || categoriesData?.results || []);

    const sitemapList: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/articles`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date("2025-01-01"),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact-info`,
            lastModified: new Date("2025-01-02"),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date("2025-01-01"),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // مقالات وبلاگ با روت یکتای /article/[slug]
    blogPosts.forEach((post: Article) => {
        if (post.slug) {
            sitemapList.push({
                url: `${baseUrl}/article/${encodeURIComponent(post.slug)}`,
                lastModified: post.jalali_created ? convertJalaliToDate(post.jalali_created) : new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
            });
        }
    });

    // دسته‌بندی‌های وبلاگ
    blogcategories.forEach((blog) => {
        if (blog.slug) {
            sitemapList.push({
                url: `${baseUrl}/articles?category=${encodeURIComponent(blog.slug)}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.6,
            });
            blog.children?.forEach(blogChild => {
                if (blogChild.slug) {
                    sitemapList.push({
                        url: `${baseUrl}/articles?category=${encodeURIComponent(blogChild.slug)}`,
                        lastModified: new Date(),
                        changeFrequency: "weekly",
                        priority: 0.6,
                    });
                }
            });
        }
    });

    // محصولات فروشگاه با روت /product/[slug]
    products.forEach((product: ProductType) => {
        if (product.slug) {
            sitemapList.push({
                url: `${baseUrl}/product/${encodeURIComponent(product.slug)}`,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: 0.8,
            });
        }
    });

    // دسته‌بندی‌های فروشگاه بدون کوئری و قابل ایندکس مستقیم: /category/[id]
    categoryItems.forEach((category: CategoryNode) => {
        sitemapList.push({
            url: `${baseUrl}/category/${category.id}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.85,
        });
        category.children?.forEach((childcategory) => {
            sitemapList.push({
                url: `${baseUrl}/category/${childcategory.id}`,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: 0.8,
            });
        });
    });

    return sitemapList;
}
