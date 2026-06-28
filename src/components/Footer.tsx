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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    // اتصال به آدرس دقیق بک‌اند شما
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/footer/`, {
      
    });
    if (!res.ok) return [];
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
  return <div className="bg-orange-400 w-5 h-5 rounded-full" />;
};

const FooterSection = ({ title, items }: { title: string; items: FooterItem[] }) => {
  return (
    <div className={`p-4 rounded-lg w-full`}>
  <h4 className="text-2xl font-semibold text-[#424242] text-right flex items-center gap-2 mb-4">
    <div className="bg-orange-400 w-3 h-6 rounded-full" />
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
              <span className="text-orange-500 text-3xl">
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

// این کامپوننت به صورت Server Component اجرا می‌شود
async function Footer() {
  const footerSections = await getFooterData();

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
          <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=60812&Code=XCwQtIQBzPJU6zedVSIYz6MbH9E5dqEY">
            <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=60812&Code=XCwQtIQBzPJU6zedVSIYz6MbH9E5dqEY" alt="Enamad" style={{ cursor: 'pointer' }} />
          </a>
          <img src="/Behpardakht-Mellat-Logo.png" alt="Behpardakht Mellat" className="h-20" />
          <a 
            referrerPolicy="origin" 
            target="_blank" 
            href="https://maps.google.com/?q=W82X+W7V,Yazd,Yazd+Province,Iran"
            title="نشانی ما در گوگل مپ"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all"
          >
            <FaMapMarkerAlt className="text-orange-600 text-xl" />
            <span className="text-sm font-bold text-orange-600">آدرس در نقشه</span>
          </a>
        </div>

        <p className="text-md text-gray-600 max-md:mb-12 lg:px-10" style={{ fontFamily: "pelak, tahoma, serif" }}>
          تمام حقوق این سایت نزد 
          <span className="text-primary font-extrabold mx-2">یزد موبایل</span>
           محفوظ است.
        </p>
        <p className="text-md text-gray-600 max-md:mb-12 lg:px-10" style={{ fontFamily: "pelak, tahoma, serif" }}>
          طراحی شده توسط گروه  
          <span className="text-primary font-extrabold mx-2">Pattern</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;