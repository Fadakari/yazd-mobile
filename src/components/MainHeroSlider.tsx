"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface SliderItem {
  id: number;
  image: string;
  mobileImage?: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
}

interface Props {
  slides: SliderItem[];
}

export default function MainHeroSlider({ slides }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  return (
    <div className="relative w-full group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".dp-slider-pagination" }}
        navigation={{
          prevEl,
          nextEl,
        }}
        className="w-full h-full rounded-[2rem] overflow-hidden dp-carousel-slider1st"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[300px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-contain hidden md:block"
                priority
                sizes="100vw" // اضافه شده برای رفع وارنینگ
              />
              <Image
                src={slide.mobileImage || slide.image}
                alt={slide.title}
                fill
                className="object-contain block md:hidden"
                priority
                sizes="100vw" // اضافه شده برای رفع وارنینگ
              />

              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-transparent to-black/30 p-8 flex flex-col justify-center items-start text-white dp-carousel-slider-text-content">
                <h1 className="text-3xl md:text-5xl font-bold mb-2 fade-in-up">
                  {slide.title}
                </h1>
                <h5 className="text-lg md:text-xl font-light mb-1 fade-in-up delay-100">
                  {slide.subtitle}
                </h5>
                <h4 className="text-xl md:text-2xl font-medium mb-6 fade-in-up delay-200">
                  {slide.description}
                </h4>

                {/*  */}
                {/* <Link
                  href={slide.link}
                  className="dp-cs-link text-black px-8 py-3 bg-amber-600/40 backdrop-blur-[15px] rounded-full font-bold hover:bg-orange-500/80 hover:text-white transition-all duration-300 fade-in-up delay-300 shadow-lg"
                >
                  مشاهده
                </Link> */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        ref={(node) => setNextEl(node)}
        className="dp-slider-next absolute top-1/2 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="currentColor"
        >
          <path d="M12.6542 15.0209L6.50534 8.68754C6.2819 8.49587 6.18737 8.24587 6.18737 8.00004C6.18737 7.75421 6.28139 7.50504 6.46933 7.31254L12.6542 0.979206C13.0495 0.577956 13.7026 0.561289 14.1151 0.940039C14.5319 1.32046 14.5448 1.95587 14.1538 2.35421L8.64089 8.00004L14.1581 13.6459C14.5488 14.0443 14.5341 14.6771 14.1178 15.06C13.7026 15.4375 13.0495 15.4209 12.6542 15.0209Z"></path>
        </svg>
      </div>

      <div
        ref={(node) => setPrevEl(node)}
        className="dp-slider-prev absolute top-1/2 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 -translate-y-1/2 opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="currentColor"
        >
          <path d="M9.34534 0.979128L15.4942 7.31246C15.7176 7.50413 15.8121 7.75413 15.8121 7.99996C15.8121 8.24579 15.7181 8.49496 15.5302 8.68746L9.34534 15.0208C8.95003 15.422 8.2969 15.4387 7.8844 15.06C7.46761 14.6795 7.45472 14.0441 7.84573 13.6458L13.3586 7.99996L7.84144 2.35413C7.45068 1.95571 7.46546 1.32288 7.88172 0.939961C8.2969 0.562461 8.95003 0.579128 9.34534 0.979128Z"></path>
        </svg>
      </div>

      <div className="dp-slider-pagination flex justify-center gap-2 absolute bottom-4 left-0 right-0 z-10"></div>
    </div>
  );
}