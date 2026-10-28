"use client";

import React, { useMemo } from "react";
import { Tabs, Tab } from "@heroui/react";
import {
  FaClipboardList,
  FaFileAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSnowflake,
  FaFlask,
} from "react-icons/fa";
import sanitizeHtml from "sanitize-html";
import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import type { NewProductDetails } from "@/types/product";

interface NewProductTabsProps {
  details: NewProductDetails;
}

export default function NewProductTabs({ details }: NewProductTabsProps) {
  const {
    specifications,
    additional_description,
    usage_method,
    consumption_warning,
    indications,
    storage_conditions,
    ingredients,
  } = details;

  // ۱. فیلتر و آماده‌سازی آیتم‌های بخش مشخصات
  const specItems = useMemo(() => {
    const rawList = [
      { label: "تاریخ انقضا", value: details.expiration_date },
      { label: "وزن", value: specifications.weight },
      { label: "ابعاد", value: specifications.dimensions },
      { label: "تعداد در بسته", value: specifications.package_count },
      { label: "سایز", value: specifications.size },
      { label: "سن مصرف", value: specifications.consumption_age },
      { label: "شرکت سازنده", value: specifications.manufacturer },
      { label: "کد بهداشتی (IRC)", value: specifications.health_code },
      { label: "کشور سازنده", value: specifications.country },
      { label: "مناسب برای", value: specifications.suitable_for },
      { label: "نوع محصول", value: specifications.product_type },
      { label: "نوع محفظه", value: specifications.container_type },
    ];

    return rawList.filter(
      (item) =>
        item.value !== undefined &&
        item.value !== null &&
        String(item.value).trim() !== ""
    );
  }, [specifications, details.expiration_date]);

  // ۲. تابع کمکی برای رندر امن محتوای ادیتور WYSIWYG
  const renderWysiwygHtml = (htmlContent?: string | null, emptyMessage = "توضیحاتی برای این بخش ثبت نشده است.") => {
    if (!htmlContent || !htmlContent.trim()) {
      return (
        <div className="text-center py-12 text-zinc-400 text-sm">
          {emptyMessage}
        </div>
      );
    }

    const sanitized = sanitizeHtml(htmlContent, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "span",
        "div",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "ul",
        "ol",
        "li",
        "p",
        "b",
        "strong",
        "i",
        "em",
        "br",
        "hr",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height", "class", "style"],
        a: ["href", "name", "target", "class", "rel"],
        "*": ["style", "class", "dir"],
      },
      transformTags: {
        a: (tagName, attribs) => ({
          tagName: "a",
          attribs: {
            ...attribs,
            class: (attribs.class || "") + " text-cyan-500 hover:underline",
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      },
    });

    const transform = (node: DOMNode) => {
      if (node.type === "tag" && node.name === "img") {
        const { src, alt, width, height } = (node as Element).attribs;
        if (!src) return null;

        const isAbsolute = src.startsWith("http");
        const fullSrc = isAbsolute
          ? src
          : `${process.env.NEXT_PUBLIC_API_URL || ""}${src.startsWith("/") ? src : `/${src}`}`;

        const widthNum = width ? parseInt(width) : 600;
        const heightNum = height ? parseInt(height) : 400;

        return (
          <Image
            src={fullSrc}
            alt={alt || "تصویر توضیحات"}
            width={widthNum}
            height={heightNum}
            className="max-w-full sm:max-w-[500px] max-h-80 object-contain mx-auto rounded-lg my-4"
          />
        );
      }
    };

    return (
      <div className="prose max-w-full p-4 sm:p-6 text-zinc-700 leading-8 text-justify font-sans">
        {parse(sanitized, { replace: transform })}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col font-sans">
      <Tabs
        disableAnimation
        radius="none"
        aria-label="اطلاعات تخصصی و مشخصات محصول"
        variant="light"
        className="w-full p-0 overflow-x-auto scrollbar-hide"
        classNames={{
          base: "bg-[#f8f8f8] !border-b !border-[#dfdfdf] overflow-x-auto scrollbar-hide",
          tabList: "p-0 m-0 !-mb-1 flex-nowrap min-w-max",
          tab: "h-full px-4 sm:px-6 py-4 text-zinc-600 data-[selected=true]:bg-white data-[selected=true]:text-primary font-bold text-sm transition-all",
        }}
      >
        {/* ۱. تب مشخصات */}
        <Tab
          key="specifications"
          title={
            <div className="flex items-center gap-2">
              <FaClipboardList className="text-base text-zinc-500" />
              <span>مشخصات</span>
            </div>
          }
          className="w-full h-full"
        >
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-bold text-zinc-800 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
              <FaClipboardList className="text-primary text-base" />
              <span>مشخصات فنی و شناسنامه کالا</span>
            </h3>

            {specItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specItems.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3.5 bg-zinc-50/80 border border-zinc-200/80 rounded-xl hover:bg-white hover:border-primary/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium text-zinc-500">
                      {spec.label}
                    </span>
                    <span dir="ltr" className="text-xs sm:text-sm font-bold text-zinc-800 font-dana text-left inline-block">
                      {String(spec.value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-sm">
                مشخصاتی برای این کالا ثبت نشده است.
              </div>
            )}
          </div>
        </Tab>

        {/* ۲. تب توضیحات تکمیلی */}
        <Tab
          key="additional_description"
          title={
            <div className="flex items-center gap-2">
              <FaFileAlt className="text-base text-zinc-500" />
              <span>توضیحات تکمیلی</span>
            </div>
          }
          className="w-full h-full"
        >
          {renderWysiwygHtml(additional_description, "توضیحات تکمیلی برای این محصول ثبت نشده است.")}
        </Tab>

        {/* ۳. تب روش مصرف */}
        <Tab
          key="usage_method"
          title={
            <div className="flex items-center gap-2">
              <FaClock className="text-base text-zinc-500" />
              <span>روش مصرف</span>
            </div>
          }
          className="w-full h-full"
        >
          <div className="p-2 sm:p-4">
            {renderWysiwygHtml(usage_method, "دستور و روش مصرف برای این محصول ثبت نشده است.")}
          </div>
        </Tab>

        {/* ۴. تب هشدار مصرف */}
        <Tab
          key="consumption_warning"
          title={
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-base text-amber-500" />
              <span>هشدار مصرف</span>
            </div>
          }
          className="w-full h-full"
        >
          <div className="p-4 sm:p-6">
            {consumption_warning && consumption_warning.trim() && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-center gap-2 font-bold">
                <FaExclamationTriangle className="text-rose-600 text-base shrink-0" />
                <span>لطفاً پیش از مصرف این محصول به نکات و هشدارهای زیر توجه فرمایید:</span>
              </div>
            )}
            {renderWysiwygHtml(consumption_warning, "هشدار مصرف خاصی برای این محصول ثبت نشده است.")}
          </div>
        </Tab>

        {/* ۵. تب موارد مصرف */}
        <Tab
          key="indications"
          title={
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-base text-emerald-500" />
              <span>موارد مصرف</span>
            </div>
          }
          className="w-full h-full"
        >
          {renderWysiwygHtml(indications, "موارد و کاربردهای مصرف برای این محصول ثبت نشده است.")}
        </Tab>

        {/* ۶. تب شرایط نگهداری */}
        <Tab
          key="storage_conditions"
          title={
            <div className="flex items-center gap-2">
              <FaSnowflake className="text-base text-cyan-500" />
              <span>شرایط نگهداری</span>
            </div>
          }
          className="w-full h-full"
        >
          <div className="p-4 sm:p-6">
            {storage_conditions && storage_conditions.trim() && (
              <div className="mb-4 p-3.5 bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-xl text-xs sm:text-sm flex items-center gap-2 font-medium">
                <FaSnowflake className="text-cyan-600 text-base shrink-0" />
                <span>دستورالعمل نگهداری صحیح کالا جهت حفظ کیفیت و اثرگذاری:</span>
              </div>
            )}
            {renderWysiwygHtml(storage_conditions, "شرایط نگهداری خاصی ثبت نشده است.")}
          </div>
        </Tab>

        {/* ۷. تب ترکیبات */}
        <Tab
          key="ingredients"
          title={
            <div className="flex items-center gap-2">
              <FaFlask className="text-base text-purple-500" />
              <span>ترکیبات</span>
            </div>
          }
          className="w-full h-full"
        >
          {renderWysiwygHtml(ingredients, "اطلاعات ترکیبات و فرمولاسیون برای این محصول ثبت نشده است.")}
        </Tab>
      </Tabs>
    </div>
  );
}
