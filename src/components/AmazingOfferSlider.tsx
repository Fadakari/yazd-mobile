"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface OfferProduct {
  id: number;
  title: string;
  image: string;
  price: string;
  link: string;
}

interface Props {
  offers: OfferProduct[];
  startDate?: string;
  dueDate?: string;
}

export default function AmazingOfferSlider({
  offers,
  startDate = "2025-08-20 17:35",
  dueDate = "2025-08-22 00:30",
}: Props) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [progressAngle, setProgressAngle] = useState(0);
  const [statusText, setStatusText] = useState("پیشنهادات امروز");
  const [isMounted, setIsMounted] = useState(false);
  const [isExpired, setIsExpired] = useState(false); // وضعیت جدید برای بررسی پایان زمان

  useEffect(() => {
    setIsMounted(true);
    const startTimestamp = new Date(startDate).getTime();
    const dueTimestamp = new Date(dueDate).getTime();

    const updateTimer = () => {
      const nowTimestamp = new Date().getTime();

      if (nowTimestamp < startTimestamp) {
        setStatusText("هنوز شروع نشده!");
        return;
      }
      if (nowTimestamp >= dueTimestamp) {
        setIsExpired(true); // پایان یافته است
        return;
      }

      const totalTime = Math.floor((dueTimestamp - startTimestamp) / 1000);
      const elapsedTime = Math.floor((nowTimestamp - startTimestamp) / 1000);
      const remainingTime = totalTime - elapsedTime;

      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = Math.floor(remainingTime % 60);

      setTimeLeft(
        `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`
      );

      const angle = (remainingTime / totalTime) * 360;
      setProgressAngle(angle);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startDate, dueDate]);


  return (
    // حذف border-black, rounded-2xl, و SVG پس‌زمینه
    <div className="relative w-full p-0 lg:p-0 h-[300px] md:h-[400px] lg:h-[300px]">
      <div className="relative z-10 flex flex-col h-full">
        {/* Header - حذف حاشیه و پس‌زمینه اضافی */}
        <div className="flex justify-between items-center px-4 py-2 shrink-0">
          <p className="font-bold text-gray-800 text-sm lg:text-base">
            {statusText === "هنوز شروع نشده!" ? statusText : "پیشنهادات امروز"}
          </p>

          <div className="flex items-center gap-2">
            <div className="text-sm font-mono font-bold text-[#ef394e] bg-red-50 border px-2 py-1 rounded-md">
              {timeLeft}
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#ef394e]"
              style={{
                background: `conic-gradient(#ef394e ${progressAngle}deg, rgb(239 57 78 / 20%) ${progressAngle}deg)`,
              }}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="rounded-full p-[1px]">
                 <path d="M5.4375 2.8125C5.4375 2.50078 5.68828 2.25 6 2.25C6.31172 2.25 6.5625 2.50078 6.5625 2.8125V5.7L8.56172 7.03125C8.81953 7.20469 8.88984 7.55391 8.69766 7.81172C8.54531 8.06953 8.19609 8.13984 7.93828 7.94766L5.68828 6.44766C5.53125 6.36328 5.4375 6.1875 5.4375 5.97891V2.8125ZM6 0C9.31406 0 12 2.68594 12 6C12 9.31406 9.31406 12 6 12C2.68594 12 0 9.31406 0 6C0 2.68594 2.68594 0 6 0ZM1.125 6C1.125 8.69297 3.30703 10.875 6 10.875C8.69297 10.875 10.875 8.69297 10.875 6C10.875 3.30703 8.69297 1.125 6 1.125C3.30703 1.125 1.125 3.30703 1.125 6Z"></path>
               </svg>
            </div>
          </div>
        </div>

        {/* Swiper Container */}
        <div className="w-full flex-1 min-h-0 relative">
          <Swiper
            direction="vertical"
            slidesPerView={1}
            spaceBetween={0}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true, el: ".dp-single-carousel-pagination" }}
            modules={[Autoplay, Pagination]}
            className="w-full h-full"
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.id}>
                <div className="flex flex-col items-center justify-between h-full w-full px-3 pt-2 pb-4">
                  
                  {/* Image */}
                  <div className="relative w-32 h-32 mb-1 shrink-0">
                    <Link href={offer.link} className="block w-full h-full relative">
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                  </div>

                  {/* Title */}
                  <div className="w-full text-center mb-1 overflow-hidden">
                    <Link 
                      href={offer.link} 
                      className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-blue-500 transition-colors h-10 leading-5 block"
                    >
                      {offer.title}
                    </Link>
                  </div>

                  {/* Action Bar - تغییر رنگ قیمت به نارنجی */}
                  <div className="flex justify-between items-center w-full px-1 shrink-0 mt-auto">
                     <button className="text-blue-500 bg-primary/10 p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="currentColor">
                           <path d="M0.000976562 0.84375C0.000976562 0.376172 0.372504 0 0.83431 0H2.41417C3.3482 0 4.15028 0.671484 4.32389 1.59961L5.60861 8.4375H15.9454C16.3239 8.4375 16.6538 8.18086 16.751 7.81172L18.3621 1.75078C18.4801 1.30078 18.9385 1.03359 19.3829 1.15664C19.8274 1.27969 20.0913 1.74023 19.9697 2.19023L18.3586 8.25117C18.0635 9.35508 17.0739 10.125 15.9454 10.125H5.92806L6.11556 11.127C6.19195 11.5242 6.5357 11.8125 6.935 11.8125H16.9454C17.4072 11.8125 17.7788 12.1887 17.7788 12.6562C17.7788 13.1238 17.4072 13.5 16.9454 13.5H6.935C5.73361 13.5 4.70237 12.6352 4.48014 11.4434L2.68848 1.91602C2.66417 1.78242 2.54959 1.6875 2.41417 1.6875H0.83431C0.372504 1.6875 0.000976562 1.31133 0.000976562 0.84375ZM4.44542 16.3125C4.44542 16.0909 4.48853 15.8715 4.57229 15.6667C4.65605 15.462 4.77881 15.276 4.93358 15.1193C5.08834 14.9626 5.27207 14.8383 5.47428 14.7535C5.67649 14.6686 5.89322 14.625 6.11209 14.625C6.33096 14.625 6.54768 14.6686 6.74989 14.7535C6.9521 14.8383 7.13583 14.9626 7.2906 15.1193C7.44536 15.276 7.56813 15.462 7.65189 15.6667C7.73564 15.8715 7.77875 16.0909 7.77875 16.3125C7.77875 16.5341 7.73564 16.7535 7.65189 16.9583C7.56813 17.163 7.44536 17.349 7.2906 17.5057C7.13583 17.6624 6.9521 17.7867 6.74989 17.8715C6.54768 17.9564 6.33096 18 6.11209 18C5.89322 18 5.67649 17.9564 5.47428 17.8715C5.27207 17.7867 5.08834 17.6624 4.93358 17.5057C4.77881 17.349 4.65605 17.163 4.57229 16.9583C4.48853 16.7535 4.44542 16.5341 4.44542 16.3125ZM16.1121 14.625C16.5541 14.625 16.978 14.8028 17.2906 15.1193C17.6032 15.4357 17.7788 15.8649 17.7788 16.3125C17.7788 16.7601 17.6032 17.1893 17.2906 17.5057C16.978 17.8222 16.5541 18 16.1121 18C15.6701 18 15.2461 17.8222 14.9336 17.5057C14.621 17.1893 14.4454 16.7601 14.4454 16.3125C14.4454 15.8649 14.621 15.4357 14.9336 15.1193C15.2461 14.8028 15.6701 14.625 16.1121 14.625ZM11.9454 1.6875V3.09375H13.3343C13.7961 3.09375 14.1676 3.46992 14.1676 3.9375C14.1676 4.40508 13.7961 4.78125 13.3343 4.78125H11.9454V6.1875C11.9454 6.65508 11.5739 7.03125 11.1121 7.03125C10.6503 7.03125 10.2788 6.65508 10.2788 6.1875V4.78125H8.88986C8.42806 4.78125 8.05653 4.40508 8.05653 3.9375C8.05653 3.46992 8.42806 3.09375 8.88986 3.09375H10.2788V1.6875C10.2788 1.21992 10.6503 0.84375 11.1121 0.84375C11.5739 0.84375 11.9454 1.21992 11.9454 1.6875Z"></path>
                        </svg>
                    </button>
                    <div className="text-left">
                      {/* تغییر رنگ قیمت به نارنجی (text-blue-500) */}
                      <p className="text-blue-500 font-bold text-base">{offer.price} <small className="text-xs text-gray-500">تومان</small></p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="dp-single-carousel-pagination flex flex-col justify-center gap-1 absolute right-0 top-1/2 z-10" style={{ right: '0' }}></div>
        </div>
      </div>
    </div>
  );
}