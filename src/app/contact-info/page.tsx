import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeContactInfoList } from "@/services/homeActions";
import { Metadata } from "next";
import { Suspense } from "react";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GetSiteSettings } from "@/services/siteActions";

interface Contact {
  id: number;
  phone_number: string | null;
  address: string | null;
}
export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title

  return {
    title: `ارتباط با ما`,
    description:
      `راه‌های تماس با فروشگاه ${siteTitle}؛ آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.`,
    keywords: [
      "ارتباط با ما",
      `تماس با ${siteTitle}`,
      `فروشگاه ${siteTitle}`,
      `آدرس ${siteTitle}`,
      `شماره تلفن ${siteTitle}`,
    ],
    openGraph: {
      title: "ارتباط با ما",
      description:
        `راه‌های تماس با فروشگاه ${siteTitle} آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact-info`,
      siteName: "${siteTitle}",
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "ارتباط با ما",
      description:
        `راه‌های تماس با فروشگاه ${siteTitle} آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
};
async function page() {
  const result = await homeContactInfoList();
  const contactInfo: Contact[] = await homeContactInfoList();

  return (
    <div className="space-y-10">
      <BreadcrumbsBox
        title="ارتباط با ما"
        items={[{ label: "خانه", href: "/" }, { label: "ارتباط با ما" }]}
      />
      <div className="flex flex-col gap-5 bg-white p-5 shadow rounded container customSm:max-w-[566px]">
        <h1 className="pr-2 -mb-2 font-semibold text-lg">ارتباط با ما</h1>
        <div className="w-full gap-3 flex">
          <div className="bg-primary w-[7%] h-px" />
          <div className="h-px bg-zinc-400 w-full" />
        </div>
        <Suspense fallback={null}>
          {contactInfo.map((c) => (
            <ul key={c.id} className="bg-white space-y-5">
              <li className="flex items-center px-5">
                <div className="border-l border-zinc-300 pl-5">
                  <FaMapMarkerAlt className="text-primary fill-primary size-5 scale-x-[-1]" />
                </div>

                <p className="text-light font-dana text-sm pr-5">
                  <span>{c.address}</span>
                </p>
              </li>
              <li className="flex items-center px-5">
                <div className="border-l border-zinc-300 pl-5">
                  <BsFillTelephonePlusFill className="text-primary fill-primary size-5 scale-x-[-1]" />
                </div>

                <p className="text-light font-dana text-sm pr-5">
                  شماره تماس : <span>{c.phone_number}</span>
                </p>
              </li>
            </ul>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default page;
