import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FiPhoneCall, FiMapPin, FiMail } from "react-icons/fi";
import { GetSiteSettings, GetActiveLogo } from "@/services/siteActions";

export default async function Footer() {
  const settings = await GetSiteSettings();
  const logo = await GetActiveLogo();
  const enamadLink = settings?.enamad_link;
  const enamadImage = settings?.enamad_image;
  const gatewayImage = settings?.payment_gateway_image;

  const finalLogo =
    !logo ||
    logo.trim() === "" ||
    logo === "لوگو دریافت نشد" ||
    logo.includes("2026-08-09_11.45.47.jpg")
      ? "/logo.png"
      : logo.startsWith("http")
      ? logo
      : `${process.env.NEXT_PUBLIC_API_URL || "https://api.khooshtam.com"}${logo.startsWith("/") ? logo : `/${logo}`}`;

  return (
    <footer className="w-full bg-white text-zinc-600 border-t-2 border-zinc-200 shadow-[0_-4px_25px_rgba(0,0,0,0.03)]" dir="rtl">
      
      {/* Upper Footer: Brand & Quick Navigation */}
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex flex-col items-start gap-3 mb-5 group" aria-label="صفحه اصلی">
              <div className="relative h-18 sm:h-22 md:h-26 w-auto max-w-[320px] sm:max-w-[400px] flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
                <img
                  src={finalLogo}
                  alt="صنایع غذایی خوش طعم کماشدون"
                  className="h-16 sm:h-20 md:h-24 w-auto max-w-full object-contain filter drop-shadow-md"
                />
              </div>
              <span className="text-sm text-red-600 font-extrabold">
                چاشنی اصیل لحظه‌های ناب زندگی • تاسیس ۱۳۷۷
              </span>
            </Link>

            <p className="text-sm text-zinc-700 leading-relaxed max-w-md text-justify mb-4">
              تولیدکننده تخصصی انواع پودر سوخاری پولکی، پودر کتلت سویا، ادویه‌جات و سبزیجات خشک؛
              همراه شما در خلق طعم‌های ترد و لذیذ با نشان استاندارد ملی و سیب سلامت.
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-600 font-bold">تماس با ما:</span>
              <a href="tel:03535247891" className="text-zinc-950 hover:text-red-600 font-black">
                ۰۳۵-۳۵۲۴۷۸۹۱
              </a>
            </div>
          </div>

          {/* Links 1: Collections (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-black text-zinc-950 mb-3 pb-1 border-b-2 border-red-500 inline-block">
              دسته‌بندی‌های اصلی
            </h4>
            <ul className="flex flex-col gap-3 text-sm font-bold text-zinc-700">
              <li>
                <Link href="/products?category_id=2" className="hover:text-red-600 transition-colors">
                  پودر سوخاری پولکی و کتلت
                </Link>
              </li>
              <li>
                <Link href="/products?category_id=4" className="hover:text-red-600 transition-colors">
                  محصولات آردی و نشاسته
                </Link>
              </li>
              <li>
                <Link href="/products?category_id=1" className="hover:text-red-600 transition-colors">
                  سبزیجات خشک معطر
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-red-600 transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact-info" className="hover:text-red-600 transition-colors">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2: Trust (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-black text-zinc-950 mb-3 pb-1 border-b-2 border-red-500 inline-block">
              مجوزها و نمادهای اعتماد
            </h4>
            <p className="text-sm text-zinc-700 leading-relaxed mb-4">
              ارسال سریع و مطمئن سفارشات به سراسر کشور با بسته‌بندی بهداشتی و استاندارد.
            </p>

            {/* Badges */}
            <div className="flex items-center gap-3">
              {enamadLink && enamadImage && (
                <a href={enamadLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-red-400 shadow-sm transition-colors">
                  <img src={enamadImage} alt="اینماد" className="h-9 object-contain" />
                </a>
              )}
              {gatewayImage && (
                <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm">
                  <img src={gatewayImage} alt="پرداخت امن" className="h-9 object-contain" />
                </div>
              )}
              <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 shadow-sm">
                سیب سلامت و استاندارد
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Minimalist Strip */}
      <div className="border-t border-zinc-200 bg-zinc-50 py-4">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-medium">
          <p>© کلیه حقوق مادی و معنوی متعلق به صنایع غذایی خوش‌طعم کماشدون است.</p>
          <p className="text-red-700 font-bold">دارای پروانه بهداشتی و نشان استاندارد ملی</p>
        </div>
      </div>

    </footer>
  );
}
