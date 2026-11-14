"use client";

import React, { useState } from "react";
import { GoPlus } from "react-icons/go";

const faqData = [
  {
    id: 1,
    question: "نحوه ارسال سفارشات و بسته‌بندی محصولات غذایی و رژیمی چگونه است؟",
    answer: "تمامی سفارشات در بسته‌بندی‌های بهداشتی، استاندارد و کاملاً ایمن آماده‌سازی می‌شوند تا تازگی، بافت و کیفیت مواد غذایی در طول مسیر به طور کامل حفظ شود. ارسال به سراسر کشور از طریق پست پیشتاز یا تیپاکس انجام شده و معمولاً بین ۲ تا ۴ روز کاری به دست شما می‌رسد.",
  },
  {
    id: 2,
    question: "آیا محصولات واقعاً بدون قند افزوده و مناسب افراد دیابتی یا رژیم‌های لاغری هستند؟",
    answer: "بله، تنوع وسیعی از محصولات ما نظیر شکلات‌ها، مرباها، کافی‌میکس‌ها و تنقلات با شیرین‌کننده‌های سالم و طبیعی مانند استویا تهیه شده‌اند یا کاملاً فاقد هرگونه شکر افزوده می‌باشند. همچنین جدول ارزش غذایی، کالری و ترکیبات دقیق هر محصول در صفحه اختصاصی آن برای آگاهی کامل شما درج شده است.",
  },
  {
    id: 3,
    question: "چگونه محصول متناسب با هدف خود (کاهش اشتها، افزایش وزن یا تناسب اندام) را انتخاب کنم؟",
    answer: "محصولات سایت بر اساس اهداف غذایی به دسته‌بندی‌های مشخص تفکیک شده‌اند؛ دسته‌بندی محصولات کاهش اشتها و میان‌وعده‌های کم‌کالری برای لاغری، گرانولا و کره‌های مغزیجات مقوی برای افزایش وزن و تأمین پروتئین، و محصولات ویژه صبحانه و ناهار رژیمی. در صورت نیاز به راهنمایی بیشتر، پشتیبانی ما آماده مشاوره رایگان به شماست.",
  },
  {
    id: 4,
    question: "آیا محصولات گیاهی (وگان) و غنی‌شده با پروتئین نیز در سایت موجود است؟",
    answer: "بله، گزینه‌های متعددی از جمله پاستاهای وگنو، پاستای پروتئینه، فرآورده‌های جو دوسر، سیس‌رایس، کره‌های هفت‌مغز و کره بادام‌زمینی طبیعی بدون نمک و شکر ویژه ورزشکاران، افراد گیاه‌خوار و وگان فراهم شده است.",
  },
  {
    id: 5,
    question: "شرایط ضمانت سلامت کالا، تاریخ انقضا و بازگرداندن سفارش به چه صورت است؟",
    answer: "کلیه محصولات با تاریخ انقضای معتبر و تضمین سلامت و اصالت ارسال می‌شوند. در صورت هرگونه مغایرت با مشخصات مندرج در سایت، ایراد در بسته‌بندی یا آسیب در حمل و نقل، تا ۷ روز امکان پیگیری و مرجوعی سفارش با هماهنگی پشتیبانی وجود دارد.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full py-20 bg-white dir-rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* --- سمت راست (توضیحات و عنوان) --- */}
          <div className="lg:col-span-5 w-full bg-gradient-to-br from-[#12465a] to-[#1a5b73] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl lg:sticky lg:top-28">
            {/* دوایر دکوراتیو پس‌زمینه */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#0bb2c9] rounded-full mix-blend-screen opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#0bb2c9] rounded-full mix-blend-screen opacity-20 blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                <span className="text-3xl font-black text-[#0bb2c9]">؟</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                سوالات متداول
              </h2>
              <p className="text-white/70 font-medium leading-loose text-sm md:text-base mt-2">
                پاسخ پرتکرارترین سوالات درباره رژیم‌های غذایی، ارزش غذایی، ترکیبات سالم محصولات و ارسال سفارشات را اینجا گردآوری کرده‌ایم. اگر پاسخ خود را نیافتید، پشتیبانی آموزش فخر همواره آماده پاسخگویی به شماست.
              </p>
              
              <div className="mt-6">
                <button className="px-6 py-3 bg-[#0bb2c9] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#12465a] transition-colors duration-300 shadow-[0_8px_20px_rgba(11,178,201,0.3)]">
                  تماس با پشتیبانی
                </button>
              </div>
            </div>
          </div>

          {/* --- سمت چپ (آکاردئون‌ها) --- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {faqData.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`group flex flex-col p-2 md:p-3 rounded-3xl transition-all duration-500 border ${
                    isOpen
                      ? "bg-white border-transparent shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                      : "bg-[#eef5f8]/50 border-gray-100 hover:bg-[#eef5f8] hover:border-[#0bb2c9]/20"
                  }`}
                >
                  {/* دکمه هدر آکاردئون */}
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="flex items-center justify-between w-full p-4 md:p-5 text-right outline-none cursor-pointer"
                  >
                    <span
                      className={`text-sm md:text-base font-black transition-colors duration-300 pr-2 ${
                        isOpen ? "text-[#0bb2c9]" : "text-[#12465a] group-hover:text-[#0bb2c9]"
                      }`}
                    >
                      {faq.question}
                    </span>
                    
                    {/* آیکون متحرک */}
                    <div
                      className={`flex-shrink-0 ml-1 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 transform ${
                        isOpen
                          ? "bg-[#0bb2c9] text-white rotate-[135deg] shadow-md"
                          : "bg-white text-[#12465a] shadow-sm group-hover:bg-[#12465a] group-hover:text-white"
                      }`}
                    >
                      <GoPlus className="text-xl" />
                    </div>
                  </button>

                  {/* محتوای آکاردئون */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 pt-1 text-sm text-gray-500 font-medium leading-loose">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
