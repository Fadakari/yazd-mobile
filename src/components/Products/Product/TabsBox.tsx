"use client";

import { Tabs, Tab } from "@heroui/react";
import { FaFileAlt } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";
import Comments from "./Comments";
import parse, { DOMNode, Element } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";

export default function TabsBox({
  description_2,
  productId,
  comments,
}: {
  description_2: string;
  productId: number;
  comments: any;
}) {
  const sanitizedHtml = sanitizeHtml(description_2, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "class", "style"],
      a: ["href", "name", "target", "class"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            class:
              (attribs.class || "") +
              " text-amber-400 hover:text-amber-300 underline",
          },
        };
      },
    },
  });

  const transform = (node: DOMNode) => {
    if (node.type === "tag" && node.name === "img") {
      const { src, alt, width, height } = (node as Element).attribs;

      if (!src) return null;

      const fullSrc = src.startsWith("http")
        ? src
        : `${process.env.NEXT_PUBLIC_API_URL || "https://api.khooshtam.com"}${src.startsWith("/") ? src : `/${src}`}`;

      const widthNum = width ? parseInt(width) : 600;
      const heightNum = height ? parseInt(height) : 400;

      return (
        <Image
          src={fullSrc}
          alt={alt || ""}
          width={widthNum}
          height={heightNum}
          className="max-w-[500px] max-h-80 object-contain mx-auto rounded-xl my-4"
        />
      );
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        disableAnimation
        radius="none"
        aria-label="بخش‌های جزئیات محصول"
        variant="light"
        className="w-full p-0"
        classNames={{
          base: "bg-zinc-50 border-b border-zinc-200",
          tabList: "p-0 m-0",
          tab: "h-full px-6 py-4 text-zinc-600 data-[selected=true]:bg-white data-[selected=true]:text-red-700 font-black transition-colors",
        }}
      >
        <Tab
          key="description"
          title={
            <div className="flex items-center gap-2">
              <FaFileAlt className="size-4" />
              <span className="text-sm">توضیحات و مشخصات محصول</span>
            </div>
          }
          className="w-full h-full"
        >
          <div className="prose max-w-full p-6 text-zinc-700 leading-relaxed text-sm">
            {description_2 ? (
              <div>{parse(sanitizedHtml, { replace: transform })}</div>
            ) : (
              <p className="text-slate-500 text-center py-6">توضیحات تکمیلی برای این محصول ثبت نشده است.</p>
            )}
          </div>
        </Tab>
        <Tab
          key="comments"
          title={
            <div className="flex items-center gap-2">
              <HiChatAlt2 className="size-4" />
              <span className="text-sm">نظرات خریداران</span>
            </div>
          }
        >
          <div className="p-6">
            <Comments comments={comments} productId={productId} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
