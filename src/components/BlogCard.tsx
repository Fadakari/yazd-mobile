"use client";

import Article from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { TfiArrowTopLeft } from "react-icons/tfi";
import { SiGoogleappsscript } from "react-icons/si";

function BlogCard({ item }: { item: Article }) {
  return (
    <Link href={`/article/${item.slug}`} title={item.title} className="group/article block h-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a65e43]">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.55rem] border-2 border-[#252923] bg-[#f7f5ef] text-[#252923] shadow-[5px_6px_0_#252923] transition-all duration-500 group-hover/article:-translate-y-1 group-hover/article:shadow-[8px_10px_0_#252923]">
        <div className="relative isolate h-56 overflow-hidden border-b-2 border-[#252923] bg-[#e6e2d8] sm:h-64">
          <span className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#d9c6b4]" />
          <span className="absolute -bottom-12 -right-8 h-36 w-36 rounded-full border-[18px] border-[#c8b995]/80" />
          {item.thumbnail ? <Image width={640} height={420} src={item.thumbnail} alt={item.title} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="relative z-[1] h-full w-full object-cover transition-transform duration-700 group-hover/article:scale-[1.06]" /> : <div className="relative z-[1] flex h-full items-center justify-center"><CiImageOff className="size-16 text-[#777568]" /></div>}
          <span className="absolute right-4 top-4 z-[2] rounded-full border-2 border-[#252923] bg-[#c8b995] px-3 py-2 text-[10px] font-black">AKHOONDI JOURNAL</span>
          <span className="absolute bottom-4 left-4 z-[2] rounded-full border border-white/70 bg-[#252923]/80 px-3 py-2 text-xs font-bold text-white backdrop-blur">{item.created_at_relative}</span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-[.12em] text-[#59634f]"><span className="h-[2px] w-7 bg-[#a65e43]" /> NOTES ON LIVING / DESIGN</div>
          <h3 className="line-clamp-2 text-xl font-black leading-8 sm:text-2xl">{item.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm font-medium leading-7 text-[#777568]">{item.introduction}</p>

          <div className="mt-auto">
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#d8d2c7] pt-4 text-xs font-bold text-[#777568]">
              <span className="flex items-center gap-2"><IoTimeOutline className="size-5 text-[#59634f]" />{item.reading_time}</span>
              <span className="flex items-center gap-2"><SiGoogleappsscript className="size-4 text-[#a65e43]" />{item.category?.title || "بدون دسته‌بندی"}</span>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-[#252923] bg-[#d9c6b4] px-4 py-3 text-sm font-black transition-colors group-hover/article:bg-[#c8b995]">
              <span>خواندن مقاله</span><TfiArrowTopLeft className="size-5 transition-transform duration-300 group-hover/article:-translate-x-1 group-hover/article:-translate-y-1" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.55rem] border-2 border-[#252923] bg-[#f7f5ef] p-3 shadow-[5px_6px_0_#252923]">
      <div className="h-56 animate-pulse rounded-[1.1rem] bg-[#e6e2d8] sm:h-64" />
      <div className="flex flex-1 flex-col gap-3 p-3 pt-5">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-[#d9c6b4]" />
        <div className="h-7 w-4/5 animate-pulse rounded-lg bg-[#e6e2d8]" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-[#e6e2d8]" />
        <div className="mt-auto h-12 animate-pulse rounded-xl bg-[#d9c6b4]" />
      </div>
    </article>
  );
}

export default BlogCard;
