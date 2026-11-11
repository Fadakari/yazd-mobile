"use client";

import React from "react";
import Card from "./Card";
import PaginationBox from "./PaginationBox";
import ProductType from "@/types/product";
import { convertNumberToPersian } from "@/utils/converNumbers";

export default function Products({
  searchParams,
  products,
  pagination = { count: 0, page: 1 },
  href,
}: {
  searchParams: any;
  products: ProductType[];
  pagination?: { count: number; page: number };
  href?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products && products.length > 0 ? (
          products.map((product) => <Card key={product.id} item={product} />)
        ) : (
          <div className="col-span-full bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl p-8 text-center space-y-4">
            <p className="text-base text-red-700 font-bold">
              متأسفانه برای این ترکیب از فیلترها کالایی یافت نشد.
            </p>
            <p className="text-xs text-zinc-500">
              پیشنهاد می‌کنیم فیلترهای انتخابی را تغییر دهید یا واژه عمومی‌تری جستجو کنید.
            </p>
          </div>
        )}
      </div>

      <div
        className="bg-white border border-zinc-200/90 backdrop-blur-md p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-xs shadow-lg shadow-zinc-900/5"
        dir="rtl"
      >
        <PaginationBox
          href={href}
          searchParams={searchParams}
          count={pagination?.count}
          page={Number(pagination.page) || 1}
        />
        <div className="text-zinc-700 font-medium">
          <span>مجموع محصولات: </span>
          <span className="text-red-700 font-black mr-1">
            {convertNumberToPersian(pagination.count)}
          </span>
          <span className="text-zinc-500 mr-1">عدد</span>
        </div>
      </div>
    </div>
  );
}
