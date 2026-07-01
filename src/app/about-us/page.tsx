import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeAboutUsList } from "@/services/homeActions";
import parse, { DOMNode, Element } from "html-react-parser";
import { Metadata } from "next";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
interface aboutT {
  description: string;
  id: number;

  image: string | null;
  order: number;

  title: string;
  video: string | null;
}

export const metadata: Metadata = {
  title: "درباره ما | یزد موبایل",
  description:
    "با یزد موبایل آشنا شوید؛ داستان ما، اهداف، و خدماتی که به شما ارائه می‌دهیم. فروشگاهی مطمئن با محصولات باکیفیت و پشتیبانی حرفه‌ای.",
  keywords: [
    "درباره ما",
    "یزد موبایل",
    "فروشگاه یزد موبایل",
    "داستان یزد موبایل",
    "خدمات یزد موبایل",
  ],
  openGraph: {
    title: "درباره ما | یزد موبایل",
    description:
      "با یزد موبایل آشنا شوید؛ داستان ما، اهداف، و خدماتی که به شما ارائه می‌دهیم. فروشگاهی مطمئن با محصولات باکیفیت و پشتیبانی حرفه‌ای.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
    siteName: "یزد موبایل",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "درباره ما | یزد موبایل",
    description:
      "با یزد موبایل آشنا شوید؛ داستان ما، اهداف و خدمات فروشگاه یزد موبایل.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
const transform = (node: DOMNode) => {
  if (node.type === "tag" && node.name === "img") {
    const { src, alt, width, height } = (node as Element).attribs;

    if (!src) return null;

    const fullSrc = src.startsWith("http") ? src : `https://mpttools.co${src}`;

    const widthNum = width ? parseInt(width) : 600;
    const heightNum = height ? parseInt(height) : 400;

    return (
      <Image
        src={fullSrc}
        alt={alt || ""}
        width={widthNum}
        height={heightNum}
        className="max-w-[500px] max-h-80 object-contain mx-auto"
      />
    );
  }
};
async function page() {
  const data = await homeAboutUsList();
  const aboutUs: aboutT[] = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-10">
      <BreadcrumbsBox
        title="درباره ما"
        items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
      />
      <div className="flex flex-col gap-5 bg-white p-5 shadow rounded container customSm:max-w-[566px]">
        <h1 className="pr-2 -mb-2 font-semibold text-lg">درباره ما</h1>
        <div className="w-full gap-3 flex">
          <div className="bg-primary w-[7%] h-px" />
          <div className="h-px bg-zinc-400 w-full" />
        </div>
        {[...aboutUs]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((about) => {
            const sanitizedHtml = sanitizeHtml(about.description ?? "", {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "width", "height", "class", "style"],
                a: ["href", "name", "target", "class"],
              },
              transformTags: {
                a: (tagName, attribs) => {
                  return {
                    tagName: "a",
                    attribs: {
                      ...attribs,
                      class:
                        (attribs.class || "") +
                        " text-cyan-400 spoiler-link relative no-underline",
                    },
                  };
                },
              },
            });
            return (
              <div key={about.id} className="flex flex-col gap-3">
                <h2 className="text-3xl font-semibold">{about.title}</h2>
                {about.image && (
                  <Image
                    width={1080}
                    height={1920}
                    src={about.image}
                    alt={about.title}
                    className="rounded-lg w-full aspect-auto max-h-full mx-auto"
                    loading="lazy"
                  />
                )}
                {about.video && (
                  <video
                    className="w-full aspect-video rounded-xl shadow-lg object-cover"
                    controls
                    preload="metadata"
                    aria-label="About section video"
                  >
                    <source src={about.video} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                  </video>
                )}
                <div className="prose [&_a]:spoiler-link max-w-full">
                  {parse(sanitizedHtml, { replace: transform })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default page;
