import BlogCard from "@/components/BlogCard";
import ErrorMessage from "@/components/ErrorMessage";
import PaginationBox from "@/components/Products/PaginationBox";
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

async function page({ searchParams }: PageProps) {
  const search = await searchParams;

  const result = await getCashedBlogPosts(search);

  if (!result || !result.data) return <ErrorMessage />;
  const posts = result.data;
  const breadcrumbs = [
    { name: "خانه", url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    { name: "مقالات", url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles` },
  ];
  const schema = [...articlesSchema(posts), breadcrumbSchema(breadcrumbs)];

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
      </div>
      <div className="mt-10">
        <PaginationBox
          href={"articles"}
          searchParams={search}
          total={+result.total_pages || 1}
          page={1}
        />{" "}
      </div>
    </>
  );
}

export default page;
