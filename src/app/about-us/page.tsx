import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeAboutUsList } from "@/services/homeActions";
import parse, { DOMNode, Element } from "html-react-parser";
import { Metadata } from "next";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { GetSiteSettings } from "@/services/siteActions";

interface aboutT {
  description: string;
  id: number;
  image: string | null;
  order: number;
  title: string;
  video: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "خوش طعم کماشدون";
  return {
    title: `درباره ما | ${siteTitle}`,
    description: `داستان و تاریخچه فعالیت ${siteTitle}؛ تعهد ما به کیفیت، نوآوری در ساخت چاشنی‌ها و خدمات برتر به مشتریان.`,
    keywords: [
      "درباره ما",
      siteTitle,
      "داستان برند خوش طعم",
      "صنایع غذایی کماشدون",
    ],
    openGraph: {
      title: `درباره ما | ${siteTitle}`,
      description: `داستان و تاریخچه فعالیت ${siteTitle}؛ تعهد ما به کیفیت و نوآوری.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
      siteName: siteTitle,
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `درباره ما | ${siteTitle}`,
      description: `داستان و تاریخچه فعالیت صنایع غذایی خوش طعم.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const transform = (node: DOMNode) => {
  if (node.type === "tag" && node.name === "img") {
    const { src, alt, width, height } = (node as Element).attribs;

    if (!src) return null;

    const fullSrc = src.startsWith("http")
      ? src
      : `${process.env.NEXT_PUBLIC_API_URL || "https://api.khooshtam.com"}${src.startsWith("/") ? src : `/${src}`}`;

    const widthNum = width ? parseInt(width) : 600;
    const heightNum = height ? parseInt(height) : 400;

    return (
      <img
        src={fullSrc}
        alt={alt || "درباره خوش طعم"}
        width={widthNum}
        height={heightNum}
        className="max-w-[500px] max-h-80 object-contain mx-auto rounded-2xl my-4 border border-zinc-200"
        referrerPolicy="no-referrer"
      />
    );
  }
};

export default async function Page() {
  const data = await homeAboutUsList();
  const aboutUs: aboutT[] = Array.isArray(data) ? data : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <BreadcrumbsBox
        title="درباره ما"
        items={[{ label: "خانه", href: "/" }, { label: "داستان اصالت ما" }]}
      />

      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="space-y-3 border-b border-zinc-200 pb-6">
          <span className="text-xs text-red-700 font-bold tracking-wider">
            صنایع غذایی خوش طعم کماشدون • از سال ۱۳۷۷
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            داستان اصالت، تخصص و همراهی
          </h1>
        </div>

        {[...aboutUs]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((about) => {
            const sanitizedHtml = sanitizeHtml(about.description ?? "", {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "br", "p", "strong", "span"]),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "width", "height", "class", "style"],
                a: ["href", "name", "target", "class"],
              },
            });

            return (
              <article key={about.id} className="space-y-6 pt-4 border-b border-zinc-200 last:border-b-0 pb-8">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                  {about.title}
                </h2>

                {about.image && (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-md max-w-2xl mx-auto my-6">
                    <img
                      src={about.image}
                      alt={about.title}
                      className="w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {about.video && (
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-md max-w-2xl mx-auto my-6">
                    <video
                      className="w-full aspect-video object-cover"
                      controls
                      preload="metadata"
                      aria-label="ویدیو درباره ما"
                    >
                      <source src={about.video} type="video/mp4" />
                      <p>مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.</p>
                    </video>
                  </div>
                )}

                <div className="prose max-w-none text-zinc-700 leading-relaxed text-sm sm:text-base space-y-4">
                  {parse(sanitizedHtml, { replace: transform })}
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
}
