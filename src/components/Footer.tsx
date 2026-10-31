import Link from "next/link";
import React from "react";
import {
  FaPhoneAlt,
    FaInstagram,
  FaMapMarkerAlt,
  FaLink,
  FaEnvelope,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaCreditCard,
  FaAward,
} from "react-icons/fa";
import { GetSiteSettings, GetActiveLogo } from "@/services/siteActions";
import BackToTopButton from "./BackToTopButton";

// تعریف تایپ‌ها طبق خروجی جنگو
interface FooterItem {
  id: number;
  label: string;
  value: string;
  item_type: "text" | "phone" | "email" | "url" | "address";
  is_active: boolean;
}

interface FooterSectionData {
  id: number;
  title: string;
  items: FooterItem[];
  is_active: boolean;
}

// تابع دریافت دیتا از سرور
async function getFooterData(): Promise<FooterSectionData[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

  try {
    const res = await fetch(`${apiUrl}/home/footer/`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Footer fetch failed with status:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Footer API Error:", error);
    return [];
  }
}

const getItemStyle = (type: string, value: string) => {
  if (type === "phone") {
    return {
      icon: <FaPhoneAlt className="text-sm sm:text-base" />,
      badgeClass:
        "bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white",
    };
  }
  if (type === "address") {
    return {
      icon: <FaMapMarkerAlt className="text-base sm:text-lg" />,
      badgeClass:
        "bg-rose-50 text-rose-600 group-hover/item:bg-rose-600 group-hover/item:text-white",
    };
  }
  if (type === "email") {
    return {
      icon: <FaEnvelope className="text-sm sm:text-base" />,
      badgeClass:
        "bg-amber-50 text-amber-600 group-hover/item:bg-amber-600 group-hover/item:text-white",
    };
  }
  if (type === "url") {
    const val = (value || "").toLowerCase();
    if (val.includes("instagram") || val.includes("hafezimoghadam")) {
      return {
        icon: <FaInstagram className="text-base sm:text-lg" />,
        badgeClass:
          "bg-pink-50 text-pink-600 group-hover/item:bg-gradient-to-tr group-hover/item:from-amber-500 group-hover/item:via-rose-500 group-hover/item:to-purple-600 group-hover/item:text-white",
      };
    }
    return {
      icon: <FaLink className="text-sm sm:text-base" />,
      badgeClass:
        "bg-indigo-50 text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white",
    };
  }
  return {
    icon: <span className="w-2.5 h-2.5 rounded-full bg-current" />,
    badgeClass:
      "bg-slate-100 text-slate-600 group-hover/item:bg-blue-600 group-hover/item:text-white",
  };
};

const getHref = (item: FooterItem) => {
  if (item.item_type === "phone") return `tel:${item.value}`;
  if (item.item_type === "email") return `mailto:${item.value}`;
  if (item.item_type === "url") {
    if (
      item.value?.includes("hafezimoghadam") ||
      item.label?.includes("اینستاگرام") ||
      item.value?.toLowerCase().includes("instagram")
    ) {
      return "https://www.instagram.com/de.hafezimoghadam";
    }
    return item.value || "#";
  }
  return "#";
};

const FooterSection = ({
  title,
  items,
}: {
  title: string;
  items: FooterItem[];
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h4 className="text-base sm:text-lg font-black text-slate-900 text-right flex items-center gap-2.5 mb-4 pb-2.5 border-b-2 border-slate-100">
        <span className="w-1.5 h-4.5 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
        <span>{title}</span>
      </h4>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const href = getHref(item);
          const isClickable = item.item_type !== "address";
          const { icon, badgeClass } = getItemStyle(item.item_type, item.value);

          return (
            <li key={item.id} className="transition-all">
              {isClickable ? (
                <Link
                  href={href}
                  target={item.item_type === "url" && !href.startsWith("/") ? "_blank" : undefined}
                  rel={item.item_type === "url" && !href.startsWith("/") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100/90 transition-all group/item text-right"
                >
                  <span
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-2xs group-hover/item:scale-105 ${badgeClass}`}
                  >
                    {icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors truncate">
                      {item.label}
                    </span>
                    {item.value && item.label !== item.value && (
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 dir-ltr text-right truncate mt-0.5">
                        {item.value}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-right">
                  <span
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm mt-0.5 shadow-2xs ${badgeClass}`}
                  >
                    {icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-[15px] font-black text-slate-900">
                      {item.label}
                    </span>
                    {item.value && item.label !== item.value && (
                      <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 leading-relaxed">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return "/assets/logo-abaj.png";
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

// این کامپوننت به صورت Server Component اجرا می‌شود
async function Footer() {
  const footerSections = await getFooterData();
  const settings = await GetSiteSettings();
  const logo = await GetActiveLogo();
  const siteTitle = "حافظ دارو";
  const mapUrl = settings?.map_url;
  const enamadLink = settings?.enamad_link;
  const enamadImage = settings?.enamad_image;
  const gatewayImage = settings?.payment_gateway_image;
  const siteDescription =
    "داروخانه آنلاین حافظ دارو؛ مرجع تخصصی عرضه محصولات سلامت‌محور، دارویی، مکمل‌ها، اقلام آرایشی و بهداشتی اصل با ضمانت اصالت کالا و ارسال سریع به سراسر کشور.";

  // بخش‌های پیش‌فرض در صورت خالی بودن دیتای فوتر بک‌اند
  const defaultSections: FooterSectionData[] = [
    {
      id: 1,
      title: "دسترسی سریع",
      is_active: true,
      items: [
        { id: 101, label: "صفحه اصلی", value: "/", item_type: "url", is_active: true },
        { id: 102, label: "فهرست محصولات", value: "/products", item_type: "url", is_active: true },
        { id: 103, label: "مقالات و دانستنی‌ها", value: "/articles", item_type: "url", is_active: true },
        { id: 104, label: "درباره داروخانه", value: "/about-us", item_type: "url", is_active: true },
      ],
    },
    {
      id: 2,
      title: "ارتباط با ما",
      is_active: true,
      items: [
        { id: 201, label: "اینستاگرام حافظ دارو", value: "de.hafezimoghadam", item_type: "url", is_active: true },
        { id: 202, label: "پشتیبانی و مشاوره", value: "09387758146", item_type: "phone", is_active: true },
        { id: 203, label: "تماس و نشانی", value: "/contact-info", item_type: "url", is_active: true },
      ],
    },
    {
      id: 3,
      title: "رسیدگی به شکایات",
      is_active: true,
      items: [
        { id: 301, label: "سامانه ملی وزارت بهداشت", value: "190", item_type: "phone", is_active: true },
        { id: 302, label: "معاونت غذا و دارو یزد", value: "03531792020", item_type: "phone", is_active: true },
      ],
    },
    {
      id: 4,
      title: "خدمات مشتریان",
      is_active: true,
      items: [
        { id: 401, label: "قوانین و مقررات خرید", value: "/terms", item_type: "url", is_active: true },
        { id: 402, label: "پیگیری سفارشات", value: "/profile", item_type: "url", is_active: true },
        { id: 403, label: "سبد خرید", value: "/profile/cart", item_type: "url", is_active: true },
      ],
    },
  ];

  const sanitizeSections = (sections: FooterSectionData[]): FooterSectionData[] => {
    return sections.map((sec) => ({
      ...sec,
      items: (sec.items || [])
        .filter((item) => {
          const v = (item.value || "").toLowerCase();
          const l = (item.label || "").toLowerCase();
          const isOtherSocial =
            v.includes("whatsapp") ||
            l.includes("whatsapp") ||
            l.includes("واتساپ") ||
            v.includes("telegram") ||
            l.includes("تلگرام") ||
            v.includes("twitter") ||
            v.includes("x.com");
          return !isOtherSocial;
        })
        .map((item) => {
          const v = (item.value || "").toLowerCase();
          const l = (item.label || "").toLowerCase();
          if (v.includes("instagram") || l.includes("اینستاگرام")) {
            return {
              ...item,
              label: "اینستاگرام حافظ دارو",
              value: "de.hafezimoghadam",
            };
          }
          return item;
        }),
    })).filter((sec) => sec.items.length > 0);
  };

  const activeSections = sanitizeSections(
    footerSections && footerSections.length > 0 ? footerSections : defaultSections
  );

  return (
    <footer
      className="w-full bg-white border-t border-slate-200 font-pelak shrink-0 pt-10 sm:pt-14 pb-8 relative"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* ۱. نوار مزایا و ارزش‌های فروشگاه (اعتماد و تجربه خرید) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-8 sm:pb-10 border-b border-slate-100 mb-8 sm:mb-10">
          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-blue-600 text-blue-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaTruck />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-blue-900 transition-colors">
                ارسال سریع و مطمئن
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                تحویل اکسپرس به سراسر کشور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-emerald-600 text-emerald-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaAward />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-emerald-900 transition-colors">
                ضمانت اصالت دارو و کالا
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                محصولات اورجینال و دارای برچسب اصالت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-indigo-600 text-indigo-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaHeadset />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-indigo-900 transition-colors">
                مشاوره تخصصی دارویی
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                پاسخگویی سریع توسط کارشناسان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-amber-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-amber-600 text-amber-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaCreditCard />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-amber-900 transition-colors">
                پرداخت امن بانکی
              </h5>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                با درگاه‌های معتبر شاپرک
              </p>
            </div>
          </div>
        </div>

        {/* ۲. نوار هدر فوتر: برند، توضیحات فروشگاه و دکمه بازگشت به بالا */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-slate-100 gap-6 mb-8 sm:mb-10">
          <div className="flex items-center gap-4 text-center md:text-right flex-wrap">
            <div className="relative w-25 h-18 sm:w-16 m-auto sm:h-16 rounded-2xl bg-slate-50 border border-slate-200/80 p-1 pt-2 flex items-center justify-center shadow-xs shrink-0">
              <img
                src={getFullImageUrl(logo)}
                alt={siteTitle}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="m-auto">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {siteTitle}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-xl leading-relaxed">
                {siteDescription}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <BackToTopButton mode="inline" />
          </div>
        </div>

        {/* ۳. ستون‌های محتوایی و لینک‌های فوتر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 mb-10">
          {activeSections.map((section) => (
            <FooterSection
              key={section.id}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>

        {/* ۴. بخش نمادهای رسمی، نظارت سلامت و شماره رسیدگی به شکایات */}
        <div className="my-8 sm:my-10 p-6 sm:p-8 rounded-3xl bg-slate-50/90 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* متن توضیحی، ضمانت اصالت و باکس شماره رسیدگی به شکایات */}
            <div className="text-center lg:text-right max-w-xl w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-black mb-2.5">
                <FaShieldAlt className="text-blue-600 text-sm" />
                <span>نظارت رسمی و اصالت سلامت</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900">
                مجوزها و نظارت سازمان غذا و دارو
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
                فعالیت {siteTitle} تحت نظارت مستقیم معاونت غذا و داروی دانشگاه علوم پزشکی شهید صدوقی یزد و سازمان غذا و دارو جمهوری اسلامی ایران می‌باشد.
              </p>

              {/* باکس شماره رسیدگی به شکایات (بسیار خوانا، زیبا و تعاملی) */}
              <div className="mt-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-base shadow-2xs">
                    <FaHeadset />
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-slate-800 block">
                      شماره رسیدگی به شکایات
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      سامانه پاسخگویی و بازرسی امور دارویی
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-dana font-bold text-xs sm:text-sm dir-ltr">
                  <a
                    href="tel:190"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200/80 transition-all flex items-center gap-2 group shadow-2xs hover:shadow-xs"
                    title="تماس با سامانه ۱۹۰ رسیدگی به شکایات وزارت بهداشت"
                  >
                    <FaPhoneAlt className="text-xs text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="tracking-wider text-slate-800 group-hover:text-emerald-700">190</span>
                  </a>
                  <span className="text-slate-400 text-xs font-normal">و</span>
                  <a
                    href="tel:03531792020"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200/80 transition-all flex items-center gap-2 group shadow-2xs hover:shadow-xs"
                    title="تماس با شماره ۰۳۵۳۱۷۹۲۰۲۰ رسیدگی به شکایات"
                  >
                    <FaPhoneAlt className="text-xs text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="tracking-wider text-slate-800 group-hover:text-emerald-700">03531792020</span>
                  </a>
                </div>
              </div>
            </div>

            {/* کارت‌های شکیل و منظم لوگوهای رسمی */}
            <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap justify-center">
              {/* لوگوی دانشگاه علوم پزشکی شهید صدوقی یزد */}
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-w-[130px] sm:min-w-[145px] hover:-translate-y-1">
                <img
                  src="/assets/yazd-medical-university-logo.png"
                  alt="دانشگاه علوم پزشکی شهید صدوقی یزد"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
                <span className="text-xs font-black text-slate-800">
                  علوم پزشکی یزد
                </span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  نظارت دارویی
                </span>
              </div>

              {/* لوگوی سازمان غذا و دارو (سیب سلامت) */}
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-w-[130px] sm:min-w-[145px] hover:-translate-y-1">
                <img
                  src="/assets/food-and-drug-logo.png"
                  alt="سازمان غذا و دارو"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
                <span className="text-xs font-black text-slate-800">
                  سازمان غذا و دارو
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  سیب سلامت
                </span>
              </div>

              {/* اینماد در صورت وجود */}
              {enamadLink && enamadImage && (
                <a
                  referrerPolicy="origin"
                  target="_blank"
                  href={enamadLink}
                  title="مشاهده نماد اعتماد الکترونیکی"
                  className="group/enamad p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center hover:-translate-y-1 min-w-[130px] sm:min-w-[145px]"
                >
                  <img
                    referrerPolicy="origin"
                    src={enamadImage}
                    alt="نماد اعتماد الکترونیکی"
                    className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover/enamad:scale-105"
                  />
                  <span className="text-xs font-black text-slate-800 group-hover/enamad:text-blue-600 transition-colors">
                    اینماد الکترونیکی
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                    اعتماد کسب‌وکار
                  </span>
                </a>
              )}

              {/* درگاه پرداخت در صورت وجود */}
              {gatewayImage && (
                <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-w-[130px] sm:min-w-[145px]">
                  <img
                    src={gatewayImage}
                    alt="درگاه پرداخت امن شاپرک"
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                  <span className="text-xs font-black text-slate-800">
                    پرداخت امن بانکی
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    شبکه شاپرک
                  </span>
                </div>
              )}

              {/* نقشه در صورت وجود */}
              {mapUrl && (
                <a
                  referrerPolicy="origin"
                  target="_blank"
                  href={mapUrl}
                  title="موقعیت فروشگاه در گوگل مپ"
                  className="group/map p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:border-rose-400 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center hover:-translate-y-1 min-w-[130px] sm:min-w-[145px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl group-hover/map:bg-rose-600 group-hover/map:text-white transition-all shadow-xs">
                    <FaMapMarkerAlt />
                  </div>
                  <span className="text-xs font-black text-slate-800">
                    مسیریابی حضوری
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 group-hover/map:underline">
                    مشاهده روی نقشه
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ۵. پاورقی نهایی و متن کپی‌رایت */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 font-semibold text-center md:text-right">
          <p>
            تمامی حقوق این وب‌سایت متعلق به{" "}
            <span className="text-slate-900 font-black">{siteTitle}</span> است.
          </p>
          <p className="text-xs text-slate-400 font-medium">
            طراحی و توسعه توسط گروه{" "}
            <span className="font-bold text-blue-600">Pattern</span>
          </p>
        </div>
      </div>

      {/* دکمه شناور بازگشت به بالا هنگام اسکرول طولانی */}
      <BackToTopButton mode="floating" />
    </footer>
  );
}

export default Footer;
