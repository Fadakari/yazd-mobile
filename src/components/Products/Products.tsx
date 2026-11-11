"use client";
import React from "react";
import Card from "./Card";
import PaginationBox from "./PaginationBox";
import ProductType from "@/types/product";
import { convertNumberToPersian } from "@/utils/converNumbers";

function Products({
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
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => <Card key={product.id} item={product} />)
        ) : (
          <div className="col-span-2 lg:col-span-4 text-zinc-500 bg-[#fffefa] border border-[#ded9ce] shadow rounded-xl p-5">
            <p className="px-4 py-2 rounded-xs bg-primary/20 w-full border border-primary/40 text-primary-800 text-base my-4">
              جستجو برای این ترکیب از فیلترها با هیچ کالایی هم‌خوانی نداشت.
            </p>
            <p>تلاش کنید</p>
            <p>- تعدادی از فیلتر ها را حذف کنید.</p>
            <p>- در جستجو از عبارت‌های متداول‌تر استفاده کنید.</p>
          </div>
        )}
      </div>

      <div
        className="bg-[#fffefa] border border-[#ded9ce] shadow-[0_8px_24px_rgba(37,41,35,.06)] p-3 rounded-xl flex flex-wrap gap-3 justify-between items-center"
        dir="rtl"
      >
        <PaginationBox
          href={href}
          searchParams={searchParams}
          count={pagination?.count}
          page={Number(pagination.page) || 1}
        />
        <div>
          <span>مجموع نتایج : </span>
          <span>{convertNumberToPersian(pagination.count)}</span>
        </div>
      </div>
    </>
  );
}

export default Products;
