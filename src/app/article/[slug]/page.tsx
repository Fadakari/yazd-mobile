import {
  GetBlogBySlug,
  GetBlogCategoriesMenuStructure,
  GetLatestBlogPosts,
} from "@/services/blogActions";
import Article from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaFolderOpen } from "react-icons/fa6";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import moment from "moment-jalaali";
import { Metadata } from "next";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { articleSchema, breadcrumbSchema } from "@/components/Schema";
import { imageSchema } from "@/components/Schema/imageSchema";
import Script from "next/script";
import { GetSiteSettings } from "@/services/siteActions";

export const revalidate = 3600;

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

const formatPersianDate = (jalaliDate?: string) => {
  if (!jalaliDate) return "نامشخص";
  return moment(jalaliDate, "jYYYY-jMM-jDD").format("jDD jMMMM jYYYY");
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const data = await GetBlogBySlug(decodedSlug);
    const settings = await GetSiteSettings();
    const siteTitle = settings?.site_title
    if (!data) {
      return {
        title: "مقاله یافت نشد",
      };
    }
    return {
      title: `${data.title} | ${siteTitle}`,
      description: data.introduction,
      keywords: [data.title, `مقاله ${siteTitle}`, `مقاله ${data.title}`],
      openGraph: {
        title: data.title,
        description: data.introduction,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${data.slug}`,
        siteName: `${siteTitle}`,
        locale: "fa_IR",
        type: "article",
        publishedTime: data.published_at || data.created_at,
        modifiedTime: data.updated_at,
        images: [
          {
            url: data.thumbnail || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://abajstore.ir'}/logo.png`,
            alt: data.title || "مقاله",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.introduction,
        images: [data.thumbnail],
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
      },
    };
  } catch (error: any) {
    const settings = await GetSiteSettings();
    const siteTitle = settings?.site_title
    console.error("Metadata Error:", error?.message);
    // اگر اینجا ارور بده، این تایتل رو نشون میده و سرور رو منفجر نمیکنه
    return { title: `خطای سرور (سئو) | ${siteTitle}` };
  }
}

async function page({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const data = await GetBlogBySlug(decodedSlug);
    if (!data) return notFound();
    const categories = await GetBlogCategoriesMenuStructure();
    const latestPosts = await GetLatestBlogPosts();

    const safeCategories = Array.isArray(categories) 
      ? categories 
      : (categories?.data || categories?.results || []);

    const safeLatestPosts = Array.isArray(latestPosts) 
      ? latestPosts 
      : (latestPosts?.data || latestPosts?.results || []);

    const filteredLatestPosts = safeLatestPosts.filter(
      (post: Article) => post.slug !== data.slug
    );

    const siteUrl = process.env.NEXT_PUBLIC_BACK_END || "https://abajstore.ir";

    const breadcrumbs = [
      { name: "خانه", url: `${siteUrl}/` },
      { name: "محصولات", url: `${siteUrl}/products` },
      data.category
        ? {
            name: data.category.title,
            url: `${siteUrl}/products?category_id=${data.category.id}`,
          }
        : { name: "مقالات" },
      { name: data.title, url: `${siteUrl}/article/${data.slug}` },
    ];

    const schema = [
      articleSchema(data),
      breadcrumbSchema(breadcrumbs),
      imageSchema(data.thumbnail, data.title),
    ];
    return (
      <>
        <Script
          id="article-jsonld"
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
        <ReadingProgressBar />

        <div
          id="article-content"
          className="flex flex-col md:flex-row gap-8 p-5 font-pelak container max-w-full md:max-w-[1140px] customSm:max-w-[566px]"
        >
          <div className="w-full md:w-3/4 bg-white py-6 px-5 md:py-10 md:px-20 shadow-xl rounded-2xl">
            <h1 className="text-2xl md:text-3xl font-semibold">{data.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-700 mt-3">
              <p className="flex items-center gap-1 text-sm md:text-base">
                <HiMiniCalendarDateRange className="size-5" />
                <span>{formatPersianDate(data.jalali_created)}</span>
              </p>
              {data.category && (
                <Link
                  href={`/articles?category_id=${data.category.id}`}
                  className="flex items-center gap-1 text-sm md:text-base"
                >
                  <FaFolderOpen className="size-5" />
                  <span>{data.category.title}</span>
                </Link>
              )}
            </div>
            <p className="text-zinc-600 mb-3 mt-5 text-sm md:text-base">
              {data.introduction}
            </p>
            <Image
              src={data.thumbnail || "/logo.png"}
              alt={data.title || "تصویر مقاله"}
              width={720}
              height={445}
              priority
              unoptimized={true}
              className="object-cover w-full h-auto aspect-video rounded-lg"
            />
            <div className="article-content !text-black mt-7">
              {parse(sanitizeHtml(data.content || "<p></p>"))}
            </div>
          </div>

          <aside className="w-full md:w-1/4 flex flex-col gap-5 sticky top-20">
            <div className="bg-white shadow md:shadow-2xl p-4 rounded-xl">
              <h2 className="text-2xl md:text-3xl py-4 font-pelak text-[#d55931] font-bold">
                دسته بندی ها
              </h2>
              <ul className="font-pelak text-sm md:text-base">
                {safeCategories?.map((cat: any, index: number) => (
                  <li key={cat.id || index} className="mb-2">
                    <Link href={`/articles?category_id=${cat.id}`} className="flex items-center gap-1 text-sm md:text-base hover:text-primary-600 transition-colors">
                      <FaFolderOpen className="size-5" />
                      <span>{cat.title || cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {filteredLatestPosts && filteredLatestPosts.length > 0 && (
              <div className="bg-white shadow md:shadow-2xl p-4 rounded-xl">
                <h2 className="text-2xl md:text-3xl py-4 mb-3 font-pelak text-[#d55931] font-bold">
                  آخرین مطالب
                </h2>
                <ul className="font-pelak space-y-5 text-sm md:text-base">
                  {filteredLatestPosts?.map((post: Article) => (
                    <li key={post.id} className="flex items-start gap-4">
                      <Link href={`/article/${post.slug}`}>
                        <Image
                          src={post.thumbnail ? (post.thumbnail.startsWith('http') ? post.thumbnail : `${process.env.NEXT_PUBLIC_API_URL}${post.thumbnail}`) : "/logo.png"}
                          alt={post.title || "مطلب جدید"}
                          width={100}
                          height={100}
                          unoptimized={true}
                          className="w-44 h-24 md:w-20 md:h-16 lg:w-32 lg:h-20 object-cover rounded-2xl"
                        />
                      </Link>
                      <div className="flex flex-col justify-start items-start">
                        <Link
                          href={`/article/${post.slug}`}
                          className="font-semibold text-xl md:text-base"
                        >
                          {post.title}
                        </Link>
                        <p className="p-1 bg-primary-100 text-primary-600 font-semibold text-xs md:text-sm mt-1">
                          {formatPersianDate(post.jalali_created)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </>
    );
  } catch (error: any) {
    // تله‌ی قطعی برای نمایش ارور
    return (
      <div style={{ margin: '40px', padding: '20px', backgroundColor: '#fee2e2', border: '2px solid #ef4444', borderRadius: '10px', direction: 'ltr', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#b91c1c', fontSize: '24px' }}>🚨 Server Crash Detected</h2>
        <p style={{ fontWeight: 'bold' }}>Error Message:</p>
        <pre style={{ backgroundColor: 'white', padding: '10px', color: '#dc2626', whiteSpace: 'pre-wrap' }}>
          {error?.message || "Unknown Error"}
        </pre>
        <p style={{ fontWeight: 'bold' }}>Stack Trace:</p>
        <pre style={{ backgroundColor: 'white', padding: '10px', fontSize: '12px', overflowX: 'auto' }}>
          {error?.stack || "No Stack Trace"}
        </pre>
      </div>
    );
  }
}

export default page;
