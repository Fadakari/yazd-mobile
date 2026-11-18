import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { homeContactInfoList } from "@/services/homeActions";
import { GetSiteSettings } from "@/services/siteActions";
import { Metadata } from "next";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaMapMarkerAlt,
  FaHeadset,
} from "react-icons/fa";
import { FiClock, FiMapPin, FiExternalLink, FiPhoneCall } from "react-icons/fi";

export const revalidate = 30; // کش ۳۰ ثانیه‌ای برای به‌روزرسانی لحظه‌ای و هماهنگ

interface Contact {
  id: number;
  phone_number: string | null;
  address: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await GetSiteSettings();
  const siteTitle = settings?.site_title || "گروه تولیدی آخوندی";

  return {
    title: `ارتباط با ما | ${siteTitle}`,
    description: `راه‌های ارتباط مستقیم، مشاوره خرید و پشتیبانی ${siteTitle}؛ شماره تماس و مشاوره ۰۹۱۲۳۶۶۹۸۳۹، پیام‌رسان‌های ایتا، تلگرام و واتساپ ۰۹۱۳۸۵۹۱۸۳۸ و آدرس کارخانه.`,
    keywords: [
      "ارتباط با ما",
      "تماس با گروه تولیدی آخوندی",
      "شماره تماس آخوندی",
      "مشاوره خرید مبلمان اداری",
      "آدرس گروه تولیدی آخوندی",
      siteTitle,
    ],
    openGraph: {
      title: `ارتباط با ما | ${siteTitle}`,
      description: `راه‌های تماس با ${siteTitle}؛ شماره مشاوره ۰۹۱۲۳۶۶۹۸۳۹، پیام‌رسان‌های مجازی ۰۹۱۳۸۵۹۱۸۳۸ و آدرس کارخانه.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://akhoondigroup.ir"}/contact-info`,
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

export default async function ContactInfoPage() {
  const [contactData, settings] = await Promise.all([
    homeContactInfoList(),
    GetSiteSettings(),
  ]);

  const rawList: Contact[] = Array.isArray(contactData)
    ? contactData
    : (contactData?.results || []);

  const firstContact = rawList[0];
  const backendAddress =
    firstContact?.address ||
    "میدان کشاورز، بلوار صابریزدی غربی، کوچه ۲۷، گروه تولیدی آخوندی";
  const mapUrl =
    settings?.map_url ||
    "https://maps.google.com/maps?q=31.924649,54.367142&ll=31.924649,54.367142&z=16";

  // شماره‌های مصوب
  const callPhone = "09123669839"; // فقط برای تماس و مشاوره
  const messengerPhone = "09138591838"; // فقط برای ایتا، تلگرام و واتساپ
  const instagramId = "tolidiakhoondi";

  return (
    <div className="space-y-8 pb-16">
      <BreadcrumbsBox
        title="ارتباط با ما"
        items={[{ label: "خانه", href: "/" }, { label: "ارتباط با ما" }]}
      />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-10">
          
          {/* هدر بخش با المان فیروزه‌ای */}
          <div className="border-b border-cyan-100 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-cyan-800">
                  راه‌های ارتباط با گروه تولیدی آخوندی
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-cyan-600/85 mt-1">
                  پاسخگویی سریع، مشاوره تخصصی تجهیز دکوراسیون و مبلمان اداری
                </p>
              </div>
            </div>
          </div>

          {/* ۱. کارت اصلی و ویژه: تماس تلفنی و مشاوره مستقیم (با طراحی کاملاً متوازن و تمیز) */}
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-sky-600 text-white shadow-xl shadow-cyan-600/20 relative overflow-hidden">
            <div className="absolute -left-12 -bottom-12 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* ستون متن و توضیحات */}
              <div className="lg:col-span-7 space-y-3.5 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white shadow-xs">
                  <FaHeadset className="size-4 text-cyan-100" />
                  <span>واحد فروش و مشاوره مستقیم</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  شماره مستقیم تماس و مشاوره تلفنی
                </h2>
                <p className="text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                  جهت استعلام قیمت، دریافت مشخصات فنی، هماهنگی بازدید و سفارش عمده مبلمان اداری، مستقیماً با کارشناس تماس حاصل فرمایید.
                </p>
              </div>

              {/* ستون باکس شماره و دکمه تماس (کاملاً متوازن و در مرکز با فاصله کافی از کناره‌ها) */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="w-full max-w-xs sm:max-w-sm bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 sm:p-7 flex flex-col items-center gap-4 text-center shadow-lg mx-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-cyan-100 flex items-center justify-center gap-1.5">
                      <FiPhoneCall className="size-3.5" />
                      <span>شماره مستقیم کارشناس</span>
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white dir-ltr block drop-shadow-sm pt-1">
                      {callPhone}
                    </span>
                  </div>

                  <a
                    href={`tel:${callPhone}`}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-cyan-700 font-black text-sm sm:text-base hover:bg-cyan-50 hover:shadow-lg transition-all duration-300 shadow-md active:scale-95"
                  >
                    <FaPhoneAlt className="size-4 text-cyan-600" />
                    <span>برقراری تماس تلفنی</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ۲. بخش پیام‌رسان‌های مجازی (فقط شماره 09138591838) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  ارتباط از طریق پیام‌رسان‌ها (چت و استعلام آنلاین)
                </h3>
              </div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200/60">
                شماره اختصاصی پیام‌رسان‌ها: {messengerPhone}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ایتا با لوگوی برداری کاملاً رسمی و معتبر */}
              <a
                href={`https://eitaa.com/${instagramId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border-2 border-orange-100 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 flex items-center justify-between gap-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-white border border-orange-200 flex items-center justify-center shadow-md shadow-orange-500/10 shrink-0 p-2.5">
                    <img
                      src="/eitaa.svg"
                      alt="پیام‌رسان ایتا"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      پیام‌رسان ایتا
                    </h4>
                    <p className="text-xs font-mono font-bold text-slate-500 mt-1 dir-ltr text-right">
                      {messengerPhone}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-orange-600 bg-white px-3 py-1.5 rounded-xl border border-orange-200 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  ارسال پیام
                </span>
              </a>

              {/* تلگرام */}
              <a
                href={`https://t.me/+98${messengerPhone.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border-2 border-sky-100 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 flex items-center justify-between gap-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
                    <FaTelegramPlane className="size-7" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                      تلگرام
                    </h4>
                    <p className="text-xs font-mono font-bold text-slate-500 mt-1 dir-ltr text-right">
                      {messengerPhone}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-sky-600 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-all">
                  ارسال پیام
                </span>
              </a>

              {/* واتساپ */}
              <a
                href={`https://wa.me/98${messengerPhone.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 flex items-center justify-between gap-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                    <FaWhatsapp className="size-7" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                      واتساپ
                    </h4>
                    <p className="text-xs font-mono font-bold text-slate-500 mt-1 dir-ltr text-right">
                      {messengerPhone}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  ارسال پیام
                </span>
              </a>
            </div>
          </div>

          {/* ۳. شبکه‌های اجتماعی (اینستاگرام رسمی) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                صفحه رسمی اینستاگرام
              </h3>
            </div>

            <a
              href={`https://www.instagram.com/${instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 sm:p-6 rounded-2xl border-2 border-pink-100 bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-white hover:border-pink-300 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4 text-center sm:text-right">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-2xl shadow-md shadow-rose-500/25 shrink-0">
                  <FaInstagram className="size-8" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    اینستاگرام گروه تولیدی آخوندی
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    مشاهده ویدیوهای خط تولید، نمونه‌کارهای اجرا شده و محصولات جدید
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono font-bold text-sm text-slate-800 dir-ltr bg-white px-3.5 py-1.5 rounded-xl border border-pink-200">
                  @{instagramId}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-black shadow-xs group-hover:shadow-md transition-all">
                  <span>مشاهده پیج</span>
                  <FiExternalLink className="size-3.5" />
                </span>
              </div>
            </a>
          </div>

          {/* ۴. نشانی کارخانه و نقشه جغرافیایی */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                نشانی کارخانه و دفتر مرکزی
              </h3>
            </div>

            <div className="p-6 rounded-2xl border-2 border-cyan-100 bg-cyan-50/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-600/20 mt-1">
                  <FaMapMarkerAlt className="size-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-black text-cyan-900">
                    آدرس کارخانه و شو‌روم
                  </h4>
                  <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed max-w-2xl">
                    {backendAddress}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-700">
                    <FiClock className="size-4" />
                    <span>ساعات کاری: شنبه تا چهارشنبه ۸:۰۰ الی ۱۸:۰۰ | پنجشنبه‌ها ۸:۰۰ الی ۱۴:۰۰</span>
                  </div>
                </div>
              </div>

              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-600 text-white text-sm font-black hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/20 active:scale-95 shrink-0"
                >
                  <FiMapPin className="size-4" />
                  <span>مسیریابی روی نقشه</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
