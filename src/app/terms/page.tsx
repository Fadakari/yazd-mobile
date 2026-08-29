import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { getTerms } from "@/services/homeActions";
import parse, { DOMNode, Element } from "html-react-parser";
import { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { GetSiteSettings } from "@/services/siteActions";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "فروشگاه";
  return {
    title: `قوانین و مقررات | ${siteTitle}`,
    description: `متن کامل قوانین و مقررات فروشگاه ${siteTitle}.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

const transform = (node: DOMNode) => {
  if (node.type === "tag" && node.name === "a") {
    const attribs = (node as Element).attribs;
    return (
      <a {...attribs} className="text-cyan-500 underline underline-offset-4 mx-1">
        {(node as any).children?.[0]?.data}
      </a>
    );
  }
};

async function TermsPage() {
  const data = await getTerms();
  const currentTerms = data?.current;

  return (
    <div className="space-y-10">
      <BreadcrumbsBox
        title="قوانین و مقررات"
        items={[{ label: "خانه", href: "/" }, { label: "قوانین و مقررات" }]}
      />
      <div className="flex flex-col gap-5 bg-white p-5 shadow rounded container customSm:max-w-[566px] min-h-[50vh]">
        <h1 className="pr-2 -mb-2 font-semibold text-xl">
          {currentTerms?.title || "قوانین و مقررات"}
        </h1>
        <div className="w-full gap-3 flex">
          <div className="bg-primary w-[7%] h-px" />
          <div className="h-px bg-zinc-400 w-full" />
        </div>
        {currentTerms ? (
          <div className="flex flex-col gap-3">
            {currentTerms.short_description && (
              <p className="text-gray-500 text-sm mb-2">{currentTerms.short_description}</p>
            )}
            <div className="prose [&_a]:spoiler-link max-w-full text-justify leading-8 text-gray-700">
              {parse(
                sanitizeHtml(currentTerms.content ?? "", {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4", "h5", "h6"]),
                  allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ["src", "alt", "width", "height", "class", "style"],
                    a: ["href", "name", "target", "class"],
                  },
                }),
                { replace: transform }
              )}
            </div>
            <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
              نسخه قوانین: {currentTerms.version} <br />
              تاریخ بروزرسانی: {new Date(currentTerms.updated_at).toLocaleDateString('fa-IR')}
            </p>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            در حال حاضر قوانین و مقررات در دسترس نیست.
          </div>
        )}
      </div>
    </div>
  );
}

export default TermsPage;
