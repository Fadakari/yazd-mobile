import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeAboutUsList } from "@/services/homeActions";
import parse, { DOMNode, Element } from "html-react-parser";
import { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { GetSiteSettings } from "@/services/siteActions";
import { FiAward, FiShield, FiCheckCircle, FiUsers, FiClock } from "react-icons/fi";
import Link from "next/link";

export const revalidate = 30; // کش ۳۰ ثانیه‌ای برای به‌روزرسانی سریع و هماهنگ

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
  const siteTitle = settings?.site_title || "گروه تولیدی آخوندی";

  return {
    title: `درباره ما | ${siteTitle}`,
    description: `آشنایی با ${siteTitle}؛ تولیدکننده مستقیم مبلمان اداری با بیش از دو دهه تجربه، سیستم‌های مدیریتی استاندارد بین‌المللی و تضمین کیفیت برتر.`,
    keywords: [
      "درباره ما",
      siteTitle,
      "گروه تولیدی آخوندی",
      "مبلمان اداری آخوندی",
      "تولید مبلمان اداری",
      "استانداردهای بین‌المللی مبلمان",
    ],
    openGraph: {
      title: `درباره ما | ${siteTitle}`,
      description: `آشنایی با تاریخچه و اهداف ${siteTitle}، تولیدکننده مستقیم مبلمان اداری با استانداردهای ایزو.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir"}/about-us`,
      siteName: siteTitle,
      locale: "fa_IR",
      type: "website",
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.akhoondigroup.ir";
    const fullSrc = src.startsWith("http") ? src : `${apiUrl}${src}`;
    const widthNum = width ? parseInt(width) : 700;
    const heightNum = height ? parseInt(height) : 450;

    return (
      <img
        src={fullSrc}
        alt={alt || "گروه تولیدی آخوندی"}
        width={widthNum}
        height={heightNum}
        className="max-w-full h-auto rounded-2xl mx-auto my-6 shadow-md border border-cyan-100 object-cover"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }
};

const defaultAboutFallback: aboutT[] = [
  {
    id: 1,
    title: "گروه تولیدی آخوندی",
    order: 1,
    image: null,
    video: null,
    description:
      "<p>«با بیش از دو دهه تجربه در تولید مبلمان اداری، گروه تولیدی آخوندی به عنوان یک تولیدکننده مستقیم، همواره کیفیت، ایمنی و رضایت مشتریان را در اولویت قرار داده است. ما با بهره‌گیری از سیستم‌های مدیریتی مبتنی بر استانداردهای بین‌المللی، شامل ISO 9001 در حوزه مدیریت کیفیت، ISO 45001 در زمینه ایمنی و بهداشت شغلی، ISO 10004 به عنوان راهنمای پایش و سنجش رضایت مشتریان، و ISO 14001 در مدیریت زیست‌محیطی، و با استقرار سیستم مدیریت یکپارچه، در مسیر ارتقای مستمر کیفیت محصولات، حفظ ایمنی نیروی انسانی، صیانت از محیط زیست و افزایش رضایت مشتریان گام برداشته‌ایم. سابقه فعالیت گروه تولیدی آخوندی حدود دو دهه در زمینه تولید مبلمان اداری است و این تجربه، پشتوانه‌ای از تخصص، نوآوری و شناخت دقیق نیازهای محیط‌های کاری مختلف محسوب می‌شود. ما همچنان با تکیه بر همین تجربه و با نگاه به آینده، در مسیر رشد پایدار، توسعه محصولات و خدمت‌رسانی حرفه‌ای به مشتریان گام برمی‌داریم.</p>",
  },
];

export default async function AboutUsPage() {
  const data = await homeAboutUsList();
  const rawList = Array.isArray(data) ? data : (data?.results || []);
  const aboutUs: aboutT[] = rawList.length > 0 ? rawList : defaultAboutFallback;

  return (
    <div className="space-y-8 pb-16">
      <BreadcrumbsBox
        title="درباره ما"
        items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
      />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-8">
          
          {/* هدر صفحه و نشان هویت بصری فیروزه‌ای */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-cyan-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-cyan-800">
                    درباره گروه تولیدی آخوندی
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-cyan-600/80 mt-1">
                    تولیدکننده مستقیم مبلمان اداری و تجهیزات مدرن محیط کار
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 text-xs font-bold">
                <FiClock className="size-4 text-cyan-600" />
                <span>بیش از دو دهه تجربه و تخصص</span>
              </div>
            </div>
          </div>

          {/* کارت‌های شاخص افتخارات و استانداردهای بین‌المللی */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-cyan-50/80 to-sky-50/50 p-4 rounded-2xl border border-cyan-200/70 text-right space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                <FiAward className="size-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-cyan-900">ISO 9001</h4>
              <p className="text-[11px] text-slate-600 font-medium">مدیریت کیفیت استاندارد</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50/80 to-sky-50/50 p-4 rounded-2xl border border-cyan-200/70 text-right space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                <FiShield className="size-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-cyan-900">ISO 45001</h4>
              <p className="text-[11px] text-slate-600 font-medium">ایمنی و بهداشت شغلی</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50/80 to-sky-50/50 p-4 rounded-2xl border border-cyan-200/70 text-right space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                <FiCheckCircle className="size-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-cyan-900">ISO 10004</h4>
              <p className="text-[11px] text-slate-600 font-medium">پایش رضایت مشتریان</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50/80 to-sky-50/50 p-4 rounded-2xl border border-cyan-200/70 text-right space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                <FiUsers className="size-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-cyan-900">ISO 14001</h4>
              <p className="text-[11px] text-slate-600 font-medium">مدیریت زیست‌محیطی</p>
            </div>
          </div>

          {/* بدنه محتوا دریافتی از بک‌اند با استایل فیروزه‌ای منظم */}
          <div className="space-y-10">
            {[...aboutUs]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((about) => {
                const sanitizedHtml = sanitizeHtml(about.description ?? "", {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    "img",
                    "figure",
                    "figcaption",
                    "span",
                    "div",
                    "h2",
                    "h3",
                    "h4",
                  ]),
                  allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ["src", "alt", "width", "height", "class", "style"],
                    span: ["class", "style"],
                    p: ["class", "style"],
                    div: ["class", "style"],
                    a: ["href", "name", "target", "class"],
                  },
                  transformTags: {
                    a: (tagName, attribs) => ({
                      tagName: "a",
                      attribs: {
                        ...attribs,
                        class:
                          (attribs.class || "") +
                          " text-cyan-600 font-bold underline hover:text-cyan-700 transition-colors",
                      },
                    }),
                  },
                });

                return (
                  <article key={about.id} className="space-y-5">
                    {about.title && about.title !== "درباره ما" && (
                      <h2 className="text-xl sm:text-2xl font-black text-cyan-800 border-r-4 border-cyan-500 pr-3">
                        {about.title}
                      </h2>
                    )}

                    {about.image && (
                      <div className="overflow-hidden rounded-2xl border border-cyan-100 shadow-sm my-6">
                        <img
                          width={1200}
                          height={800}
                          src={
                            about.image.startsWith("http")
                              ? about.image
                              : `${process.env.NEXT_PUBLIC_API_URL || "https://api.akhoondigroup.ir"}${about.image}`
                          }
                          alt={about.title || "درباره ما"}
                          className="w-full h-auto max-h-[500px] object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {about.video && (
                      <div className="overflow-hidden rounded-2xl border border-cyan-100 shadow-md my-6">
                        <video
                          className="w-full aspect-video object-cover"
                          controls
                          preload="metadata"
                          aria-label="ویدیو معرفی گروه تولیدی آخوندی"
                        >
                          <source src={about.video} type="video/mp4" />
                          <p>مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.</p>
                        </video>
                      </div>
                    )}

                    <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-loose text-justify font-medium">
                      {parse(sanitizedHtml, { replace: transform })}
                    </div>
                  </article>
                );
              })}
          </div>

          {/* بنر پایانی دعوت به ارتباط و مشاوره */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-600 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-cyan-600/15">
            <div className="space-y-1 text-center sm:text-right">
              <h3 className="text-base sm:text-lg font-black">
                نیاز به مشاوره جهت تجهیز و خرید مبلمان اداری دارید؟
              </h3>
              <p className="text-xs sm:text-sm text-cyan-100 font-medium">
                کارشناسان گروه تولیدی آخوندی آماده پاسخگویی و ارائه مشاوره تخصصی به شما هستند.
              </p>
            </div>
            <Link
              href="/contact-info"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-cyan-700 font-black text-sm hover:bg-cyan-50 transition-all shadow-md shrink-0 active:scale-95"
            >
              ارتباط با کارشناسان
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
