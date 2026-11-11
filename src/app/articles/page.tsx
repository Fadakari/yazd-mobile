import BlogCard from "@/components/BlogCard";
import ErrorMessage from "@/components/ErrorMessage";
import PaginationBox from "@/components/Products/PaginationBox";
import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { articlesSchema, breadcrumbSchema } from "@/components/Schema";
import { GetBlogPosts } from "@/services/blogActions";
import { Metadata } from "next";
import Script from "next/script";
import { GetSiteSettings } from "@/services/siteActions";

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

const getCashedBlogPosts = async (searchParams: any) => {
  const search = await searchParams;
  return await GetBlogPosts(search);
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "خوش طعم کماشدون";
  const category = (await searchParams).category;

  let title = `مقالات و آموزش‌های آشپزی | ${siteTitle}`;
  let description = `آخرین مقالات، راهنماهای آشپزی و دستور پخت‌های تخصصی با محصولات ${siteTitle}.`;
  if (category) {
    title = `مقالات دسته‌بندی ${category} | ${siteTitle}`;
    description = `مقالات مرتبط با دسته‌بندی شماره ${category} در فروشگاه ${siteTitle}.`;
  }

  return {
    title,
    description,
    keywords: [
      "مقالات آشپزی",
      siteTitle,
      "دستور پخت سوخاری",
      "طرز تهیه کتلت سویا",
      ...(category ? [`دسته‌بندی ${category}`] : []),
    ],
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles${category ? `?category=${category}` : ""}`,
      siteName: siteTitle,
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

export default async function Page({ searchParams }: PageProps) {
  const search = await searchParams;
  const result = await getCashedBlogPosts(search);

  if (!result || !result.data) return <ErrorMessage />;
  const posts = result.data;

  const breadcrumbs = [
    { label: "خانه", href: "/" },
    { label: "مقالات و دانستنی‌های آشپزی" },
  ];

  const schema = [
    ...articlesSchema(posts),
    breadcrumbSchema([
      { name: "خانه", url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
      { name: "مقالات", url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles` },
    ]),
  ];

  return (
    <div className="space-y-6">
      <Script
        id="articles-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="space-y-1.5 mb-6">
        <span className="text-xs text-amber-400 font-bold tracking-wider">
          دانستنی‌ها، فوت‌وفن‌های تردی و دستورهای طبخ
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-950">
          مقالات و مجله آشپزی خوش‌طعم
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {posts.map((post: any) => (
          <BlogCard key={post.id} item={post} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <PaginationBox
          href={"articles"}
          searchParams={search}
          total={+result.total_pages || 1}
          page={1}
        />
      </div>
    </div>
  );
}
