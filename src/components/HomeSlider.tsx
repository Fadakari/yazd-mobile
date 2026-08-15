"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { Autoplay, Keyboard, Navigation } from "swiper/modules";
import Link from "next/link";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

function Slider({ images }: { images: any[] }) {
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goNext = useCallback(() => swiperRef.current?.slidePrev(), []);
  const goPrev = useCallback(() => swiperRef.current?.slideNext(), []);

  if (!isClient) return <SliderSkeleton />;
  return (
    <div className="relative w-full h-[200px] lg:h-[420px] group">
      <Swiper
        spaceBetween={4}
        slidesPerView={1.15}
        centeredSlides={true}
        navigation={false}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Keyboard, Autoplay, Navigation]}
        className="size-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 10 },
          1024: { slidesPerView: 1, spaceBetween: 10 },
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id} className="w-full h-full relative">
            <Link href={image.link || ""} className="block h-full w-full">
              <div className="relative w-full h-full">
                <Image
                  src={`${image.src}`}
                  alt={image.alt}
                  fill
                  priority={index < 3}
                  loading={index < 3 ? "eager" : "lazy"}
                  quality={90}
                  className="object-cover rounded-3xl sm:rounded-none"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <div className="flex absolute bottom-5 left-1/2 -translate-x-1/2 gap-2 z-20">
          {images.map((_, index) => (
            <SlideDot
              key={index}
              active={index === activeIndex}
              onClick={() => swiperRef.current?.slideToLoop(index)}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-5 right-0 flex gap-2 items-center px-4 lg:px-8 z-10">
          <button
            onClick={goNext}
            className="block  bg-white rounded-full p-2.5 border border-zinc-400 text-[#a4a4a4] z-20 drop-shadow-xl lg:hover:translate-x-2 ease-in-out opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="اسلاید قبلی"
          >
            <GoChevronRight className="size-8 sm:size-8 lg:size-10" />
          </button>
          <button
            onClick={goPrev}
            className="block  bg-white rounded-full p-2.5 border border-zinc-400 text-[#a4a4a4] z-20 drop-shadow-xl lg:hover:-translate-x-2 ease-in-out opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="اسلاید بعدی"
          >
            <GoChevronLeft className="size-8 sm:size-8 lg:size-10" />
          </button>
        </div>
      )}
    </div>
  );
}

type SlideDotProps = {
  active: boolean;
  onClick: () => void;
};

function SlideDot({ active, onClick }: SlideDotProps) {
  return (
    <div
      onClick={onClick}
      className={`w-2 h-2 rounded-full cursor-pointer shadow-sm transition-all duration-300 ${
        active ? "bg-primary w-5" : "bg-zinc-100"
      }`}
    />
  );
}

function SliderSkeleton() {
  return (
    <div className="relative w-full h-[300px] xl:h-[420px] animate-pulse overflow-hidden rounded-3xl bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="w-2 h-2 rounded-full bg-gray-400" />
        ))}
      </div>
    </div>
  );
}

export default Slider;
