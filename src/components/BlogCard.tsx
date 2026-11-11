"use client";

import Article from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { TfiArrowTopLeft } from "react-icons/tfi";
import { BiCategory } from "react-icons/bi";

export default function BlogCard({ item }: { item: Article }) {
  return (
    <article
      key={item.id}
      className="bg-white border border-zinc-200/90 hover:border-amber-400/50 rounded-3xl transition-all duration-300 group/card w-full h-full flex flex-col overflow-hidden shadow-xl"
    >
      <Link
        href={`/article/${item.slug}`}
        title={item.title}
        className="w-full flex relative overflow-hidden h-52 bg-[#f8fafc]"
      >
        {item.thumbnail ? (
          <Image
            width={360}
            height={220}
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-52 object-cover group-hover/card:scale-105 transition-all duration-700 filter brightness-90 contrast-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-52 bg-zinc-50 flex items-center justify-center">
            <CiImageOff className="size-12 text-amber-400/30" />
          </div>
        )}
        {item.created_at_relative && (
          <div className="absolute top-3 left-3 bg-white/95 text-red-700 text-xs px-3 py-1 rounded-full border border-zinc-200 shadow-sm font-bold">
            {item.created_at_relative}
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          <Link href={`/article/${item.slug}`}>
            <h3 className="text-base sm:text-lg font-black text-zinc-950 group-hover/card:text-red-600 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h3>
          </Link>
          <p className="w-full line-clamp-2 text-xs text-zinc-600 leading-relaxed font-normal">
            {item.introduction}
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-1.5 text-red-700">
            <BiCategory className="size-4 text-red-600" />
            <span>{item.category?.title || "آموزش و مقالات"}</span>
          </div>

          <Link
            href={`/article/${item.slug}`}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-black transition-colors"
          >
            <span>مطالعه مقاله</span>
            <TfiArrowTopLeft className="size-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xl animate-pulse flex flex-col justify-between">
      <div className="w-full h-52 bg-zinc-50 border-b border-zinc-200" />
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2.5">
          <div className="h-5 bg-zinc-50 rounded-full w-4/5" />
          <div className="h-3.5 bg-zinc-50/70 rounded-full w-full" />
          <div className="h-3.5 bg-zinc-50/50 rounded-full w-2/3" />
        </div>
        <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
          <div className="h-3 bg-zinc-50 rounded-full w-20" />
          <div className="h-3 bg-amber-400/20 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}
