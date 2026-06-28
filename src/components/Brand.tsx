"use client";

import Image from "next/image";

interface BrandProps {
  item: {
    image: string;
    name: string;
  };
}

export default function Brand({ item }: BrandProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src={item.image}
        alt={item.name}
        title={item.name}
        width={150}
        height={150}
        className="object-contain h-32 w-full"
        loading="lazy"
        fetchPriority="low"
      />
    </div>
  );
}
