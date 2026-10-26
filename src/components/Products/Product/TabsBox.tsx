"use client";
import { Tabs, Tab } from "@heroui/react";
import { FaFileAlt } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";
import Comments from "./Comments";
import parse, { DOMNode, Element } from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import NewProductTabs from "./NewProductTabs";
import { extractNewProductDetails } from "@/utils/productDetailsParser";

export default function TabsBox({
  description_2,
  productId,
  comments,
  product,
}: {
  description_2: string;
  productId: number;
  comments: any;
  product?: any;
}) {
  // بررسی اینکه آیا اطلاعات مدل جدید از بک‌اند آمده است یا خیر
  const newDetails = product ? extractNewProductDetails(product) : null;

  // اگر مدل جدید وجود داشت، بخش قبلی (توضیحات کالا و نظرات) پنهان شده و مدل جدید ۷ تب نمایش داده می‌شود
  if (newDetails) {
    return <NewProductTabs details={newDetails} />;
  }

  // در غیر این صورت، مدل فعلی و قبلی حفظ و نمایش داده می‌شود
  const sanitizedHtml = sanitizeHtml(description_2 || "", {
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
              " text-cyan-400 spoiler-link relative no-underline",
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
        : `https://mpttools.co${src}`;

      const widthNum = width ? parseInt(width) : 600;
      const heightNum = height ? parseInt(height) : 400;

      return (
        <Image
          src={fullSrc}
          alt={alt || ""}
          width={widthNum}
          height={heightNum}
          className="max-w-[500px] max-h-80 object-contain mx-auto"
        />
      );
    }
  };

  return (
    <div className="flex w-full flex-col ">
      <Tabs
        disableAnimation
        radius="none"
        aria-label="Options"
        variant="light"
        className="w-full p-0 "
        classNames={{
          base: "bg-[#f8f8f8] !border-b !border-[#dfdfdf] ",
          tabList: "p-0 m-0 !-mb-1",
          tab: "h-full w-full px-6 py-4 text-gray-600 data-[selected=true]:bg-white  data-[selected=true]:text-zinc-500 text-zinc-500",
        }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <FaFileAlt className="size-7 !text-zinc-500" />
              <i className="fad fa-comments-alt"></i>

              <span className="text-zinc-500 text-base">توضیحات کالا</span>
            </div>
          }
          className="w-full h-full"
        >
          <div className="prose p-5 w-full max-w-full">
            <div>{parse(sanitizedHtml, { replace: transform })}</div>
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <HiChatAlt2 className="size-7 !text-zinc-500" />
              <span className="text-zinc-500 text-base">نقد و نظرات</span>
            </div>
          }
        >
          <div className="p-5">
            <Comments comments={comments} productId={productId} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
