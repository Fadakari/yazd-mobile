import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaTelegramPlane,
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

// ۴ ستون پیش‌فرض و کامل برای فروشگاه گروه تولیدی آخوندی
const DEFAULT_SECTIONS: FooterSectionData[] = [
  {
    id: 1,
    title: "اطلاعات تماس کارخانه",
    is_active: true,
    items: [
      {
        id: 101,
        label: "شماره مستقیم تماس و مشاوره",
        value: "09123669839",
        item_type: "phone",
        is_active: true,
      },
      {
        id: 102,
        label: "تلفن کارخانه و دفتر",
        value: "035-35254545",
        item_type: "phone",
        is_active: true,
      },
      {
        id: 103,
        label: "نشانی کارخانه و شو‌روم",
        value: "میدان کشاورز، بلوار صابریزدی غربی، کوچه ۲۷، گروه تولیدی آخوندی",
        item_type: "address",
        is_active: true,
      },
    ],
  },
  {
    id: 2,
    title: "پیام‌رسان‌ها و ارتباط آنلاین",
    is_active: true,
    items: [
      {
        id: 201,
        label: "پیام‌رسان ایتا",
        value: "۰۹۱۳۸۵۹۱۸۳۸",
        item_type: "url",
        is_active: true,
      },
      {
        id: 202,
        label: "پشتیبانی در تلگرام",
        value: "۰۹۱۳۸۵۹۱۸۳۸",
        item_type: "url",
        is_active: true,
      },
      {
        id: 203,
        label: "ارتباط در واتساپ",
        value: "۰۹۱۳۸۵۹۱۸۳۸",
        item_type: "url",
        is_active: true,
      },
      {
        id: 204,
        label: "اینستاگرام رسمی",
        value: "tolidiakhoondi@",
        item_type: "url",
        is_active: true,
      },
    ],
  },
  {
    id: 3,
    title: "دسترسی سریع",
    is_active: true,
    items: [
      {
        id: 301,
        label: "صفحه اصلی فروشگاه",
        value: "/",
        item_type: "url",
        is_active: true,
      },
      {
        id: 302,
        label: "کاتالوگ و لیست محصولات",
        value: "/product",
        item_type: "url",
        is_active: true,
      },
      {
        id: 303,
        label: "درباره گروه تولیدی آخوندی",
        value: "/about-us",
        item_type: "url",
        is_active: true,
      },
      {
        id: 304,
        label: "تماس و ارتباط با ما",
        value: "/contact-info",
        item_type: "url",
        is_active: true,
      },
      {
        id: 305,
        label: "مقالات و وبلاگ آموزشی",
        value: "/blog",
        item_type: "url",
        is_active: true,
      },
    ],
  },
  {
    id: 4,
    title: "خدمات و پشتیبانی",
    is_active: true,
    items: [
      {
        id: 401,
        label: "مشاوره تخصصی خرید مبلمان اداری",
        value: "09123669839",
        item_type: "phone",
        is_active: true,
      },
      {
        id: 402,
        label: "پیگیری وضعیت سفارش‌ها",
        value: "/profile/orders",
        item_type: "url",
        is_active: true,
      },
      {
        id: 403,
        label: "ساعات کاری کارخانه",
        value: "شنبه تا چهارشنبه ۸ الی ۱۸ | پنجشنبه ۸ الی ۱۴",
        item_type: "text",
        is_active: true,
      },
      {
        id: 404,
        label: "ضمانت کیفیت و خدمات پس از فروش",
        value: "ضمانت ۱۰۰٪ اصالت و کیفیت",
        item_type: "text",
        is_active: true,
      },
    ],
  },
];

// تابع دریافت دیتا از سرور با کش کوتاه ۳۰ ثانیه‌ای
async function getFooterData(): Promise<FooterSectionData[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;

  try {
    const res = await fetch(`${apiUrl}/home/footer/`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
      },
      next: { revalidate: 30, tags: ["footer"] },
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

const getItemStyle = (type: string, value: string, label: string = "") => {
  const val = (value || "").toLowerCase();
  const lbl = (label || "").toLowerCase();

  // پیام‌رسان ایتا (استفاده از آیکون برداری رسمی ایتا)
  if (val.includes("eitaa") || lbl.includes("ایتا")) {
    return {
      icon: (
        <img
          src="/eitaa.svg"
          alt="ایتا"
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
          className="w-5 h-5 object-contain"
        />
      ),
      badgeClass:
        "bg-orange-50 border border-orange-200 text-orange-600 group-hover/item:bg-orange-500 group-hover/item:text-white",
    };
  }

  // اینستاگرام
  if (val.includes("instagram") || lbl.includes("اینستاگرام")) {
    return {
      icon: <FaInstagram className="text-base sm:text-lg" />,
      badgeClass:
        "bg-pink-50 text-pink-600 group-hover/item:bg-gradient-to-tr group-hover/item:from-amber-500 group-hover/item:via-rose-500 group-hover/item:to-purple-600 group-hover/item:text-white",
    };
  }

  // واتساپ
  if (val.includes("whatsapp") || lbl.includes("واتساپ")) {
    return {
      icon: <FaWhatsapp className="text-base sm:text-lg" />,
      badgeClass:
        "bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-600 group-hover/item:text-white",
    };
  }

  // تلگرام
  if (val.includes("telegram") || val.includes("تلگرام") || val.includes("t.me")) {
    return {
      icon: <FaTelegramPlane className="text-base sm:text-lg" />,
      badgeClass:
        "bg-sky-50 text-sky-600 group-hover/item:bg-sky-600 group-hover/item:text-white",
    };
  }

  // تلفن و تماس
  if (type === "phone" || lbl.includes("تماس") || lbl.includes("تلفن") || lbl.includes("موبایل")) {
    return {
      icon: <FaPhoneAlt className="text-sm sm:text-base" />,
      badgeClass:
        "bg-cyan-50 text-cyan-600 group-hover/item:bg-cyan-600 group-hover/item:text-white",
    };
  }

  // آدرس و موقعیت مکانی
  if (type === "address" || lbl.includes("آدرس") || lbl.includes("نشانی")) {
    return {
      icon: <FaMapMarkerAlt className="text-base sm:text-lg" />,
      badgeClass:
        "bg-rose-50 text-rose-600 group-hover/item:bg-rose-600 group-hover/item:text-white",
    };
  }

  // ایمیل
  if (type === "email" || lbl.includes("ایمیل")) {
    return {
      icon: <FaEnvelope className="text-sm sm:text-base" />,
      badgeClass:
        "bg-amber-50 text-amber-600 group-hover/item:bg-amber-600 group-hover/item:text-white",
    };
  }

  // لینک‌های داخلی و خارجی
  if (val.startsWith("/") || val.startsWith("http")) {
    return {
      icon: <FaLink className="text-sm sm:text-base" />,
      badgeClass:
        "bg-cyan-50 text-cyan-600 group-hover/item:bg-cyan-600 group-hover/item:text-white",
    };
  }

  return {
    icon: <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />,
    badgeClass:
      "bg-slate-100 text-slate-600 group-hover/item:bg-cyan-600 group-hover/item:text-white",
  };
};

const getHref = (item: FooterItem) => {
  if (item.item_type === "phone") return `tel:${item.value}`;
  if (item.item_type === "email") return `mailto:${item.value}`;

  const val = (item.value || "").toLowerCase();
  const lbl = (item.label || "").toLowerCase();

  if (val.includes("whatsapp") || lbl.includes("واتساپ")) return "https://wa.me/989138591838";
  if (val.includes("telegram") || val.includes("t.me") || lbl.includes("تلگرام")) return "https://t.me/+989138591838";
  if (val.includes("eitaa") || lbl.includes("ایتا")) return "https://eitaa.com/tolidiakhoondi";
  if (val.includes("instagram") || lbl.includes("اینستاگرام")) return "https://www.instagram.com/tolidiakhoondi";

  if (item.value && (item.value.startsWith("/") || item.value.startsWith("http"))) {
    return item.value;
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
      <h3 className="text-base sm:text-lg font-black text-slate-900 text-right flex items-center gap-2.5 mb-4 pb-2.5 border-b-2 border-slate-100">
        <span className="w-1.5 h-4.5 rounded-full bg-gradient-to-b from-cyan-500 to-sky-600" />
        <span>{title}</span>
      </h3>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const href = getHref(item);
          const isClickable = item.item_type !== "address" && href !== "#";
          const { icon, badgeClass } = getItemStyle(
            item.item_type,
            item.value,
            item.label
          );

          return (
            <li key={item.id} className="transition-all">
              {isClickable ? (
                <Link
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100/90 transition-all group/item text-right"
                >
                  <span
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-2xs group-hover/item:scale-105 ${badgeClass}`}
                  >
                    {icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-[15px] font-bold text-slate-800 group-hover/item:text-cyan-600 transition-colors truncate">
                      {item.label}
                    </span>
                    {item.value &&
                      item.label !== item.value &&
                      !item.value.startsWith("/") && (
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
  const [backendSections, settings, logo] = await Promise.all([
    getFooterData(),
    GetSiteSettings(),
    GetActiveLogo(),
  ]);

  // ترکیب هوشمند بخش‌های سرور با بخش‌های پیش‌فرض تا هر ۴ ستون همیشه پر، دقیق و متوازن باشند
  let footerSections: FooterSectionData[] = [...DEFAULT_SECTIONS];
  if (Array.isArray(backendSections) && backendSections.length > 0) {
    const contactBackend = backendSections.find(
      (s) => s.title.includes("تماس") || s.id === 1
    );
    if (contactBackend && contactBackend.items?.length > 0) {
      footerSections[0] = {
        ...footerSections[0],
        title: contactBackend.title || footerSections[0].title,
        items: contactBackend.items,
      };
    }
    // اضافه کردن هرگونه ستون سفارشی دیگر از بک‌اند در صورت وجود
    const extraSections = backendSections.filter(
      (s) => !s.title.includes("تماس") && s.id !== 1
    );
    if (extraSections.length > 0) {
      footerSections = [...footerSections, ...extraSections];
    }
  }

  const siteTitle = settings?.site_title || "گروه تولیدی آخوندی";
  const mapUrl = settings?.map_url;
  const enamadLink = settings?.enamad_link;
  const enamadImage = settings?.enamad_image;
  const gatewayImage = settings?.payment_gateway_image;
  const siteDescription =
    settings?.site_description ||
    "گروه تولیدی آخوندی، تولیدکننده برتر مبلمان اداری، میز و صندلی‌های ارگونومیک با بالاترین استاندارد کیفی و ارسال سراسری به سراسر کشور";

  return (
    <footer
      className="w-full bg-white border-t border-slate-200 font-pelak shrink-0 pt-10 sm:pt-14 pb-8 relative"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* ۱. نوار مزایا و ارزش‌های فروشگاه (اعتماد و تجربه خرید) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-8 sm:pb-10 border-b border-slate-100 mb-8 sm:mb-10">
          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-cyan-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-cyan-600 text-cyan-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaTruck />
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-cyan-900 transition-colors">
                ارسال سریع و مطمئن
              </span>
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
              <span className="block text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-emerald-900 transition-colors">
                ضمانت اصالت کالا
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                تضمین کیفیت ۱۰۰٪ محصولات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-sky-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-sky-600 text-sky-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaHeadset />
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-sky-900 transition-colors">
                پشتیبانی و مشاوره
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">
                پاسخگویی سریع و حرفه‌ای
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-amber-200/70 hover:bg-white transition-all group/feat shadow-2xs hover:shadow-xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white group-hover/feat:bg-amber-600 text-amber-600 group-hover/feat:text-white flex items-center justify-center text-lg sm:text-xl shadow-xs transition-all shrink-0">
              <FaCreditCard />
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-black text-slate-800 group-hover/feat:text-amber-900 transition-colors">
                پرداخت امن بانکی
              </span>
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
              <Image
                src={getFullImageUrl(logo)}
                alt={siteTitle}
                width={64}
                height={64}
                sizes="64px"
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="m-auto">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {siteTitle}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-xl leading-relaxed">
                {siteDescription}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <BackToTopButton mode="inline" />
          </div>
        </div>

        {/* ۳. ستون‌های محتوایی و لینک‌های فوتر (۴ ستون کامل و متوازن) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 mb-10">
          {footerSections.map((section) => (
            <FooterSection
              key={section.id}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>

        {/* ۴. بخش نمادهای اعتماد و مجوزهای رسمی */}
        {(enamadImage || gatewayImage || mapUrl) && (
          <div className="my-10 p-6 sm:p-8 rounded-3xl bg-slate-50/90 border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              {/* متن توضیحی و تضمین امنیت */}
              <div className="text-center lg:text-right max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 text-cyan-800 text-xs font-black mb-2.5">
                  <FaShieldAlt className="text-cyan-600 text-sm" />
                  <span>تضمین امنیت و اصالت خرید</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  مجوزها و نمادهای اعتماد الکترونیکی
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  {siteTitle} دارای کلیه مجوزهای رسمی، درگاه پرداخت امن شاپرک و نماد اعتماد الکترونیکی جهت خریدی مطمئن، امن و با آسودگی خاطر می‌باشد.
                </p>
              </div>

              {/* کارت‌های درشت و منظم نمادها */}
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                {enamadLink && enamadImage && (
                  <a
                    referrerPolicy="origin"
                    target="_blank"
                    href={enamadLink}
                    title="مشاهده نماد اعتماد الکترونیکی"
                    className="group/enamad p-4 bg-white rounded-2xl border-2 border-slate-200/90 hover:border-cyan-500 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2.5 text-center hover:-translate-y-1 min-w-[125px] sm:min-w-[135px]"
                  >
                    <img
                      referrerPolicy="origin"
                      src={enamadImage}
                      alt="نماد اعتماد الکترونیکی"
                      width={96}
                      height={96}
                      className="h-20 sm:h-24 w-auto object-contain transition-transform group-hover/enamad:scale-105"
                      loading="lazy"
                    />
                    <span className="text-xs font-black text-slate-800 group-hover/enamad:text-cyan-600 transition-colors">
                      اینماد الکترونیکی
                    </span>
                  </a>
                )}

                {gatewayImage && (
                  <div className="p-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2.5 text-center min-w-[125px] sm:min-w-[135px]">
                    <img
                      src={gatewayImage}
                      alt="درگاه پرداخت امن شاپرک"
                      width={96}
                      height={96}
                      className="h-20 sm:h-24 w-auto object-contain"
                      loading="lazy"
                    />
                    <span className="text-xs font-black text-slate-800">
                      پرداخت امن بانکی
                    </span>
                  </div>
                )}

                {mapUrl && (
                  <a
                    referrerPolicy="origin"
                    target="_blank"
                    href={mapUrl}
                    title="موقعیت فروشگاه در گوگل مپ"
                    className="group/map p-4 bg-white rounded-2xl border-2 border-slate-200/90 hover:border-rose-400 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2.5 text-center hover:-translate-y-1 min-w-[125px] sm:min-w-[135px]"
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
        )}

        {/* ۵. پاورقی نهایی و متن کپی‌رایت */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 font-semibold text-center md:text-right">
          <p>
            تمامی حقوق این وب‌سایت متعلق به{" "}
            <span className="text-slate-900 font-black">{siteTitle}</span> است.
          </p>
          <p className="text-xs text-slate-600 font-medium">
            طراحی و توسعه توسط گروه{" "}
            <span className="font-black text-cyan-800">Pattern</span>
          </p>
        </div>
      </div>

      {/* دکمه شناور بازگشت به بالا هنگام اسکرول طولانی */}
      <BackToTopButton mode="floating" />
    </footer>
  );
}

export default Footer;
