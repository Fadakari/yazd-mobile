import Link from "next/link";
import React from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaLink,
  FaEnvelope,
} from "react-icons/fa";
import { GetSiteSettings, GetActiveLogo } from "@/services/siteActions";

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
      // چون فوتر دیر به دیر عوض میشه، کش ۱ ساعته (۳۶۰۰ ثانیه) براش عالی و بهینه‌ست
      // اگر می‌خوای الان برای تست سریع‌تر آپدیت بشه، موقتاً بذارش روی 60
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
  if (type === "phone") return <FaPhoneAlt />;
  if (type === "address") return <FaMapMarkerAlt />;
  if (type === "email") return <FaEnvelope />;
  if (type === "url") {
    if (value.includes("instagram")) return <FaInstagram />;
    if (value.includes("whatsapp")) return <FaWhatsapp />;
    return <FaLink />;
  }
  return <div className="bg-blue-400 w-5 h-5 rounded-full" />;
};

const FooterSection = ({ title, items }: { title: string; items: FooterItem[] }) => {
  return (
    <div className={`p-4 rounded-lg w-full`}>
  <h4 className="text-2xl font-semibold text-[#424242] text-right flex items-center gap-2 mb-4">
    <div className="bg-blue-400 w-3 h-6 rounded-full" />
    {title}
  </h4>

  {items.length > 0 && (
    <ul className="flex flex-row flex-wrap items-center justify-between w-full">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-center border-b border-zinc-100 px-4 py-3 hover:bg-gray-50 transition rounded-md flex-1 min-w-[100%] md:min-w-[45%] lg:min-w-[25%]"
        >
          <Link
            href={
              item.item_type === "phone" ? `tel:${item.value}` :
                item.item_type === "email" ? `mailto:${item.value}` :
                  item.item_type === "url" ? item.value : "#"
            }
            className={`text-zinc-700 flex items-center justify-between w-full ${item.item_type === 'address' ? 'cursor-default pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-3xl">
                {getIconByType(item.item_type, item.value)}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-semibold">{item.label}</span>
                {item.value && item.label !== item.value && (
                  <span className="text-sm text-zinc-600 mt-1">{item.value}</span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )}
</div>
  );
};
const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return "/logo.png";
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}`;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};
// این کامپوننت به صورت Server Component اجرا می‌شود
async function Footer() {
  const footerSections = await getFooterData();
  const settings = await GetSiteSettings();
  const logo = await GetActiveLogo();
  const siteTitle = settings?.site_title || "سایت ما";
  const mapUrl = settings?.map_url; // لینک نقشه
  const enamadLink = settings?.enamad_link;
  const enamadImage = settings?.enamad_image;
  const gatewayImage = settings?.payment_gateway_image;

  return (
    <footer className="w-full bg-white shadow-2xl block font-pelak font-medium py-10 shrink-0">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="flex flex-wrap flex-col sm:flex-row justify-center md:justify-between max-w-screen-xl w-full">
          {footerSections.length > 0 ? (
            footerSections.map((section) => (
              <FooterSection
                key={section.id}
                title={section.title}
                items={section.items}
              />
            ))
          ) : (
            <div className="text-center w-full text-gray-400">در حال بارگذاری فوتر...</div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between text-center pt-10 mx-auto mt-5 px-10 items-center gap-4">

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* ۱. نمایش داینامیک اینماد (فقط وقتی لینک و عکس وجود داشته باشه) */}
          {logo && (
            <img 
              src={getFullImageUrl(logo)} 
              alt={`لوگوی ${siteTitle}`} 
              className="h-20 object-contain drop-shadow-sm" 
            />
          )}
          {enamadLink && enamadImage && (
            <a referrerPolicy="origin" target="_blank" href={enamadLink}>
              <img 
                referrerPolicy="origin" 
                src={enamadImage} 
                alt="Enamad" 
                style={{ cursor: 'pointer' }} 
                className="max-h-20"
              />
            </a>
          )}

          {/* ۲. نمایش داینامیک لوگوی درگاه بانکی */}
          {gatewayImage && (
            <img src={gatewayImage} alt="درگاه بانکی" className="h-20" />
          )}

          {/* ۳. نمایش داینامیک دکمه نقشه */}
          {mapUrl && (
            <a 
              referrerPolicy="origin" 
              target="_blank" 
              href={mapUrl}
              title="نشانی ما در گوگل مپ"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
            >
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
              <span className="text-sm font-bold text-blue-600">آدرس در نقشه</span>
            </a>
          )}
        </div>

        <p className="text-md text-gray-600 max-md:mb-12 lg:px-10" style={{ fontFamily: "pelak, tahoma, serif" }}>
          تمام حقوق این سایت نزد 
          <span className="text-blue-800 font-extrabold mx-2">{siteTitle}</span>
           محفوظ است.
        </p>
        <p className="text-md text-gray-600 max-md:mb-12 lg:px-10" style={{ fontFamily: "pelak, tahoma, serif" }}>
          طراحی شده توسط گروه  
          <span className="text-blue-800 font-extrabold mx-2">Pattern</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;