import React from "react";

const fields = [
  "نام",
  "نام خانوادگی",
  "شماره تلفن",
  "آدرس",
  "کد پستی",
  "تاریخ تولد",
  "استان",
  "شهر",
  "کد معرف",
];

export default function Loading() {
  return (
    <div className="relative flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 animate-pulse">
        {fields.map((_, index) => (
          <div
            key={index}
            className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex flex-col gap-2"
          >
            <div className="h-3 w-20 bg-slate-800 rounded"></div>
            <div className="h-9 bg-slate-800/80 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
