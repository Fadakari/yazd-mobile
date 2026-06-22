import { GetBlogCategoriesMenuStructure, GetBlogPosts } from "@/services/blogActions";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { BlogCategoryNode, CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import { MetadataRoute } from "next";
import jalaali from "jalaali-js";
import Article from "@/types/blog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

function convertJalaliToDate(jalaliStr: string): Date {
    const [jy, jm, jd] = jalaliStr.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).split("/").map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd);
}

async function getAllProducts(): Promise<ProductType[]> {
    let allProducts: ProductType[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const res = await GetProducts({}, page);
        allProducts = allProducts.concat(res.results);
        page++;
        hasMore = res.results.length > 0;
    }

    return allProducts;
}

async function getAllBlogPosts(): Promise<Article[]> {
    let allPosts: Article[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const res = await GetBlogPosts({}, page.toString());
        if (res && res.data) {
            allPosts = allPosts.concat(res.data);
            hasMore = res.data.length > 0;
        } else {
            hasMore = false;
        }
        page++;
    }

    return allPosts;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const rawCategories = await GetBlogCategoriesMenuStructure();
    const blogcategories: BlogCategoryNode[] = Array.isArray(rawCategories) ? rawCategories : [];
    const blogPosts = await getAllBlogPosts();
    const products = await getAllProducts();
    const categoriesData = await GetShopCategoriesTreeList();
    const categoryItems: CategoryNode[] = categoriesData?.data || [];

    const sitemap = [
        { url: `${baseUrl}/`, lastModified: new Date() },
        { url: `${baseUrl}/products`, lastModified: new Date() },
        { url: `${baseUrl}/articles`, lastModified: new Date() },
        { url: `${baseUrl}/gallery`, lastModified: new Date("2025-01-03") },
        { url: `${baseUrl}/about-us`, lastModified: new Date("2025-01-01") },
        { url: `${baseUrl}/contact-info`, lastModified: new Date("2025-01-02") },
    ];


    blogPosts.forEach((post: Article) => {
        sitemap.push({
            url: `${baseUrl}/articles/${post.slug}`,
            lastModified: convertJalaliToDate(post.jalali_created),
        });
    });

    blogcategories.forEach((blog) => {
        sitemap.push({ url: `${baseUrl}/articles?category=${blog.slug}`, lastModified: new Date() });
        blog.children?.forEach(blogChild => {
            sitemap.push({
                url: `${baseUrl}/articles?category=${blogChild.slug}`,
                lastModified: new Date(),
            });
        });
    });

    products.forEach((product: ProductType) => {
        sitemap.push({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(),
        });
    });

    categoryItems.forEach((category: CategoryNode) => {
        sitemap.push({ url: `${baseUrl}/products?category_id=${category.id}`, lastModified: new Date() });
        category.children?.forEach(childcategory => {
            sitemap.push({
                url: `${baseUrl}/products?category_id=${childcategory.id}`,
                lastModified: new Date(),
            });
        });
    });

    return sitemap;
}
