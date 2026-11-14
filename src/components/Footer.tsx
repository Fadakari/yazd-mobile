import Link from "next/link";
import React from "react";
import FooterLogo from "./FooterLogo";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaLink,
  FaEnvelope,
} from "react-icons/fa";


const enamadCode = `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=500870&Code=7TXBD3yalidhDPyX1cEXW4eFu0mTcRnx'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=500870&Code=7TXBD3yalidhDPyX1cEXW4eFu0mTcRnx' alt='' style='cursor:pointer' code='7TXBD3yalidhDPyX1cEXW4eFu0mTcRnx'></a>`;
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
  // استفاده قطعی از آدرس کامل برای جلوگیری از undefined شدن و فِیل شدن ریکوئست
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.rejimfakhr.com";
  
  try {
    const res = await fetch(`${apiUrl}/home/footer/`, {
      next: { revalidate: 60 }, // <--- دیتا کش می‌شود اما هر ۶۰ ثانیه (در صورت وجود درخواست) نسخه جدید را از بک‌اند می‌گیرد
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
  return <div className="bg-[#12465a] w-5 h-5 rounded-full" />;
};



const FooterSection = ({ title, items }: { title: string; items: FooterItem[] }) => {
  return (
    <div className={`p-4 rounded-lg w-full`}>
      <h4 className="text-2xl font-semibold text-[#424242] text-right flex items-center gap-2 mb-4">
        <div className="bg-[#12465a] w-3 h-6 rounded-full" />
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
                  <span className="text-[#12465a] text-3xl">
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
async function Footer({
    logo,
  }: {
    logo?: string;
  }) {
    const footerSections = await getFooterData();
    

  return (
    <footer className="w-full bg-white shadow-2xl block font-pelak font-medium py-10 shrink-0">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="max-w-screen-xl mx-auto px-6">

        <div className="flex justify-center">
          <div className="max-w-screen-xl w-full px-6">
          
            {footerSections.length > 0 ? (
              <>
                {/* ردیف اول: لوگو + اولین سکشن */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            
                  {/* لوگو */}
                  <div className="w-full lg:w-64 flex justify-center shrink-0">
                    <Link href="/">
                      <FooterLogo logo={logo} />
                    </Link>
                  </div>
            
                  {/* اولین سکشن */}
                  <div className="flex-1 w-full">
                    <FooterSection
                      title={footerSections[0].title}
                      items={footerSections[0].items}
                    />
                  </div>
            
                </div>
            
                {/* بقیه سکشن‌ها */}
                <div className="mt-8 flex flex-col gap-6">
                  {footerSections.slice(1).map((section) => (
                    <FooterSection
                      key={section.id}
                      title={section.title}
                      items={section.items}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center w-full text-gray-400 py-10">
                در حال بارگذاری فوتر...
              </div>
            )}
        
          </div>
        </div>
          
        </div>
      </div>

      <div className="flex flex-col justify-between text-center pt-10 mx-auto mt-5 px-10 items-center gap-4">

        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div dangerouslySetInnerHTML={{ __html: enamadCode }} className="[&_img]:h-20 [&_img]:w-auto" />
          <img src="/Behpardakht-Mellat-Logo.png" alt="Behpardakht Mellat" className="h-20" />
          <a 
            referrerPolicy="origin" 
            target="_blank" 
            href="https://maps.google.com/?q=W82X+W7V,Yazd,Yazd+Province,Iran"
            title="نشانی ما در گوگل مپ"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#12465a50] border border-[#12465a20] rounded-lg hover:bg-[#12465a10] transition-all"
          >
            <FaMapMarkerAlt className="text-[#12465a] text-xl" />
            <span className="text-sm font-bold text-[#12465a]">آدرس در نقشه</span>
          </a>
        </div>

        <p className="text-md text-gray-600 max-md:mb-12 lg:px-10" style={{ fontFamily: "pelak, tahoma, serif" }}>
          تمام حقوق این سایت نزد 
          <span className="text-[#12465a] font-extrabold mx-2">آموزش فخر</span>
           محفوظ است.
        </p>
        <p className="text-md text-gray-600 max-md:mb-12 lg:px-10" style={{ fontFamily: "pelak, tahoma, serif" }}>
          طراحی شده توسط گروه  
          <span className="text-[#12465a] font-extrabold mx-2">Pattern</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;