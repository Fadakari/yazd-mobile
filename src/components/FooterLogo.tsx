"use client";

import React, { useState } from "react";
import Image from "next/image";
import defaultLogo from "../../public/logo.png";

export default function FooterLogo({ logo }: { logo?: string }) {
  // بررسی و اصلاح آدرس عکس (مشابه نوبار)
  const initialLogo = logo 
    ? (logo.startsWith('http') ? logo : `${process.env.NEXT_PUBLIC_API_URL}${logo}`) 
    : defaultLogo;

  const [imgSrc, setImgSrc] = useState<string | import("next/image").StaticImageData>(initialLogo);

  return (
    <Image
      src={imgSrc}
      alt="آموزش فخر"
      width={220}
      height={80}
      className="w-auto h-auto max-h-24 object-contain"
      priority
      onError={() => {
        setImgSrc(defaultLogo);
      }}
    />
  );
}