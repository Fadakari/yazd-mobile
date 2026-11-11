import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeContactInfoList } from "@/services/homeActions";
import { Metadata } from "next";
import { Suspense } from "react";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiClock, FiMail, FiPhoneCall } from "react-icons/fi";
import { GetSiteSettings } from "@/services/siteActions";

interface Contact {
  id: number;
  phone_number: string | null;
  address: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "خوش طعم کماشدون";

  return {
    title: `ارتباط با ما | ${siteTitle}`,
    description: `راه‌های ارتباطی و تماس با دفتر مرکزی و کارخانه صنایع غذایی ${siteTitle}؛ آدرس، تلفن پشتیبانی و سفارشات عمده.`,
    keywords: [
      "تماس با خوش طعم",
      "آدرس کارخانه خوش طعم",
      "تلفن سفارشات خوش طعم",
      siteTitle,
    ],
    openGraph: {
      title: `ارتباط با ما | ${siteTitle}`,
      description: `راه‌های ارتباطی و تماس با دفتر مرکزی و کارخانه ${siteTitle}.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact-info`,
      siteName: siteTitle,
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `ارتباط با ما | ${siteTitle}`,
      description: `راه‌های تماس با صنایع غذایی خوش طعم.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page() {
  const contactInfo: Contact[] = await homeContactInfoList();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <BreadcrumbsBox
        title="ارتباط با ما"
        items={[{ label: "خانه", href: "/" }, { label: "ارتباط با کارخانه و فروشگاه" }]}
      />

      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="space-y-2 border-b border-zinc-200 pb-5">
          <span className="text-xs text-red-700 font-bold tracking-wider">
            صدای مشتری و پشتیبانی سراسری
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            راه‌های ارتباط با خوش‌طعم کماشدون
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={null}>
            {contactInfo && contactInfo.length > 0 ? (
              contactInfo.map((c) => (
                <div
                  key={c.id}
                  className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-5 shadow-sm"
                >
                  {c.address && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 shrink-0">
                        <FaMapMarkerAlt className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 font-medium">آدرس کارخانه و دفتر مرکزی:</p>
                        <p className="text-sm font-bold text-zinc-900 leading-relaxed">
                          {c.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {c.phone_number && (
                    <div className="flex items-center gap-4 pt-2 border-t border-zinc-200">
                      <div className="p-3 rounded-xl bg-red-600/10 text-red-600 border border-red-200 shrink-0">
                        <BsFillTelephonePlusFill className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500 font-medium">شماره تماس مستقیم:</p>
                        <a
                          href={`tel:${c.phone_number.replace(/\s+/g, "")}`}
                          className="text-base font-black text-red-700 hover:text-red-900 transition-colors"
                        >
                          {c.phone_number}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 shrink-0">
                    <FiPhoneCall className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">تلفن پشتیبانی و سفارشات:</p>
                    <p className="text-base font-black text-red-700">۰۳۵-۳۵۲۴۷۸۹۱</p>
                  </div>
                </div>
              </div>
            )}
          </Suspense>

          {/* Business Hours Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 text-red-700 font-bold text-sm">
              <FiClock className="size-5" />
              <span>ساعات پاسخگویی و ثبت سفارش</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
              شنبه تا پنج‌شنبه از ساعت ۸:۰۰ الی ۱۷:۰۰ در خدمت شما مشتریان و همکاران گرامی هستیم.
              سفارشات آنلاین در کلیه روزهای هفته به صورت ۲۴ ساعته ثبت و در اولین روز کاری پردازش و ارسال می‌گردند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
