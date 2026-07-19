import Article from "@/types/blog"
import api from "./api"
import { BlogCategoryNode } from "@/types/categories";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const defaultFetchOptions = {
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
    },
    // معادل withCredentials: true در Axios
    credentials: "include" as RequestCredentials, 
};

type BlogPostsResponse = {
    data: Article[];
    next_page: string | null;
    total_pages: number;
};
interface BlogPostsParams {
    category?: string;
}

export const GetBlogPosts = async (params?: BlogPostsParams, page?: string): Promise<BlogPostsResponse | undefined> => {
    try {
        const query = new URLSearchParams();

        if (params?.category) query.append("category", params.category);
        if (page) query.append("page", page);

        const url = `https://api.yazd-mobile.ir/blog/posts/?${query.toString()}`;

        const result = await fetch(url, { next: { revalidate: 60 } });
        if (!result.ok) return undefined;
        return await result.json();
    } catch (error) {
        console.error(error);
        return undefined;
    }
};
export async function GetLatestBlogPosts() {
    try {
        const res = await fetch("https://api.yazd-mobile.ir/blog/posts/latest", {
            ...defaultFetchOptions,
            next: { revalidate: 600 } // آپدیت هر 10 دقیقه
        });
        if (!res.ok) return undefined;
        return await res.json();
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function GetBlogCategoriesMenuStructure(): Promise<BlogCategoryNode[] | undefined> {
    try {
        const res = await fetch("https://api.yazd-mobile.ir/blog/categories/menu_structure/", {
            ...defaultFetchOptions,
            next: { revalidate: 3600 } // آپدیت هر 1 ساعت
        });
        if (!res.ok) return undefined;
        return await res.json();
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const GetBlogBySlug = cache(async (slug: string): Promise<any> => {
    try {
        const result = await fetch(`https://api.yazd-mobile.ir/blog/posts/${slug}/`, { 
            ...defaultFetchOptions,
            next: { revalidate: 60 } 
        });
        if (!result.ok) return null;
        return await result.json();
    } catch (error) {
        console.log(error);
        return null;
    }
});
interface Search {
    search?: string;
    sort?: string;
    page?: number;
    category_id?: number;
}
export async function SearchBlogs(params: Search): Promise<any> {
    const searchParams = await params || {};
    const query = new URLSearchParams();
    if (searchParams?.search) query.append("q", searchParams?.search);
    if (searchParams?.sort) query.append("sort", searchParams?.sort);
    if (searchParams?.page !== undefined) query.append("page", searchParams?.page.toString());
    if (searchParams?.category_id !== undefined) query.append("category", searchParams?.category_id.toString());

    try {
        // جایگزین api.get
        const result = await fetch(`https://api.yazd-mobile.ir/blog/posts/search?${query.toString()}`, {
            ...defaultFetchOptions,
            next: { revalidate: 60 }
        });
        if (!result.ok) return null;
        return await result.json();
    } catch (error) {
        console.log(error)
        return null
    }
}
export async function GetLatestArticles(): Promise<any> {
    try {
        const result = await api.get("/blog/posts/latest");
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}