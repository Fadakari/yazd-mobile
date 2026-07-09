export const dynamic = "force-dynamic";

import BlogCard from "@/components/BlogCard";
import PaginationBox from "@/components/Products/PaginationBox";
import { articlesSchema, breadcrumbSchema } from "@/components/Schema";
import { GetBlogPosts } from "@/services/blogActions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { GetSiteSettings } from "@/services/siteActions";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ page?: string }>;
}

const getCashedBlogPosts = async (searchParams: any, page?: string) => {
  try {
    const search = await searchParams;
    return await GetBlogPosts(search, page);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return null;
  }
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title
  const category = (await searchParams).category;

  let title = `مقالات ${siteTitle}`;
  let description = `آخرین مقالات و اخبار مرتبط با ${siteTitle} را اینجا بخوانید.`;
  if (category) {
    title = `مقالات دسته‌بندی ${category} | ${siteTitle}`;
    description = `مقالات مرتبط با دسته‌بندی شماره ${category} در فروشگاه ${siteTitle}.`;
  }

  return {
    title,
    description,
    keywords: [
      "مقالات",
      `${siteTitle}`,
      `اخبار ${siteTitle}`,
      ...(category ? [`دسته‌بندی ${category}`] : []),
    ],
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles${category ? `?category=${category}` : ""}`,
      siteName: `${siteTitle}`,
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductsPage({ params, searchParams }: any) {
  const { page } = await params;
  const search = await searchParams;
  const result = await getCashedBlogPosts(search, page);

  if (!result) {
    return notFound();
  }

  if (!result.data || result.data.length === 0) {
    notFound();
  }

  const posts = result.data;
  const breadcrumbs = [
    { name: "خانه", url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    { name: "مقالات", url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles` },
  ];
  const schema = [articlesSchema(posts), breadcrumbSchema(breadcrumbs)];

  return (
    <>
      <Script
        id="articles-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <BlogCard key={post.id} item={post} />
        ))}
        <div className="mt-10">
          <PaginationBox
            href="articles"
            searchParams={search}
            total={+result.total_pages || 1}
            page={Number(page) || 1}
          />
        </div>
      </div>
    </>
  );
}
