import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaLink,
  FaEnvelope,
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
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
      },
      next: { revalidate: 3600 } 
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

const getIconByType = (type: string, value: string) => {
  if (type === "phone") return <FaPhoneAlt className="text-blue-600" />;
  if (type === "address") return <FaMapMarkerAlt className="text-rose-600" />;
  if (type === "email") return <FaEnvelope className="text-amber-600" />;
  if (type === "url") {
    if (value.toLowerCase().includes("instagram")) return <FaInstagram className="text-pink-600" />;
    if (value.toLowerCase().includes("whatsapp")) return <FaWhatsapp className="text-emerald-600" />;
    return <FaLink className="text-blue-600" />;
  }
  return <div className="bg-blue-600 w-2.5 h-2.5 rounded-full" />;
};

const getHref = (item: FooterItem) => {
  if (item.item_type === "phone") return `tel:${item.value}`;
  if (item.item_type === "email") return `mailto:${item.value}`;
  if (item.item_type === "url") {
    const isWhatsapp = 
      item.value?.toLowerCase().includes("whatsapp") || 
      item.label?.toLowerCase().includes("whatsapp") || 
      item.label?.includes("واتساپ");
    if (isWhatsapp) return "https://wa.me/valiasrstore";
    return item.value || "#";
  }
  return "#";
};

const FooterSection = ({ title, items }: { title: string; items: FooterItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h4 className="text-base sm:text-lg font-black text-slate-900 text-right flex items-center gap-2.5 mb-4 pb-2 border-b-2 border-slate-100">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        {title}
      </h4>

      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const href = getHref(item);
          const isClickable = item.item_type !== 'address';

          return (
            <li key={item.id} className="transition-all">
              {isClickable ? (
                <Link
                  href={href}
                  target={item.item_type === "url" ? "_blank" : undefined}
                  rel={item.item_type === "url" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-all group/item text-right"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 group-hover/item:bg-white group-hover/item:shadow-sm flex items-center justify-center transition-all text-sm">
                    {getIconByType(item.item_type, item.value)}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors truncate">
                      {item.label}
                    </span>
                    {item.value && item.label !== item.value && (
                      <span className="text-[11px] font-semibold text-slate-400 dir-ltr text-right truncate mt-0.5">
                        {item.value}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-right">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-sm mt-0.5">
                    {getIconByType(item.item_type, item.value)}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {item.label}
                    </span>
                    {item.value && item.label !== item.value && (
                      <span className="text-xs font-medium text-slate-600 mt-0.5 leading-relaxed">
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
  const siteTitle = settings?.site_title || "فروشگاه آنلاین";
  const mapUrl = settings?.map_url;
  const enamadLink = settings?.enamad_link;
  const enamadImage = settings?.enamad_image;
  const gatewayImage = settings?.payment_gateway_image;

  return (
    <footer className="w-full bg-white border-t border-slate-200/90 font-pelak shrink-0 pt-10 sm:pt-14 pb-8 relative" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* ۱. نوار هدر فوتر: برند و دکمه بازگشت به بالا */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-slate-100 gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shadow-xs">
              <img 
                src={getFullImageUrl(logo)} 
                alt={siteTitle} 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{siteTitle}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">تجربه خریدی مطمئن، باکیفیت و با بهترین قیمت</p>
            </div>
          </div>

          <BackToTopButton mode="inline" />
        </div>

        {/* ۲. ستون‌های محتوایی و لینک‌های فوتر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {footerSections.length > 0 ? (
            footerSections.map((section) => (
              <FooterSection
                key={section.id}
                title={section.title}
                items={section.items}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-slate-400 py-6">در حال بارگذاری اطلاعات ارتباطی...</div>
          )}
        </div>

        {/* ۳. بخش نمادهای اعتماد و نقشه */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {enamadLink && enamadImage && (
              <a 
                referrerPolicy="origin" 
                target="_blank" 
                href={enamadLink}
                className="p-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex items-center justify-center"
              >
                <img 
                  referrerPolicy="origin" 
                  src={enamadImage} 
                  alt="اینماد" 
                  className="h-16 object-contain"
                />
              </a>
            )}

            {gatewayImage && (
              <div className="p-3 bg-white rounded-2xl border-2 border-slate-200/90 shadow-xs flex items-center justify-center">
                <img src={gatewayImage} alt="درگاه پرداخت مطمئن" className="h-16 object-contain" />
              </div>
            )}

            {mapUrl && (
              <a 
                referrerPolicy="origin" 
                target="_blank" 
                href={mapUrl}
                title="موقعیت ما در نقشه"
                className="inline-flex items-center gap-2.5 px-4 py-3 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-2xl border border-blue-200 hover:border-blue-600 transition-all text-xs font-black shadow-xs active:scale-95"
              >
                <FaMapMarkerAlt className="text-base" />
                <span>موقعیت فروشگاه در گوگل‌مپ</span>
              </a>
            )}
          </div>

          {/* متن کپی‌رایت */}
          <div className="text-center md:text-left flex flex-col gap-1 text-xs text-slate-500 font-semibold">
            <p>
              تمامی حقوق این وب‌سایت متعلق به <span className="text-slate-900 font-black">{siteTitle}</span> است.
            </p>
            <p className="text-[11px] text-slate-400">
              طراحی و توسعه توسط گروه <span className="font-bold text-blue-600">Pattern</span>
            </p>
          </div>
        </div>

      </div>

      {/* دکمه شناور بازگشت به بالا هنگام اسکرول طولانی */}
      <BackToTopButton mode="floating" />
    </footer>
  );
}

export default Footer;