import React from "react";

const fields = ["نام", "نام خانوادگی", "شماره تلفن", "آدرس", "کد پستی", "تاریخ تولد", "استان", "شهر", "کد معرف"];

function Loading() {
  return (
    <div className="relative flex flex-col">
      <div className="mt-4 grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((label) => (
          <div key={label} className="flex flex-col gap-3 rounded-2xl border-2 border-[#252923] bg-[#f7f5ef] p-4 shadow-[3px_4px_0_#252923]">
            <div className="h-3 w-24 rounded-full bg-[#c8b995]" />
            <div className="h-11 rounded-xl border border-[#d8d2c7] bg-[#e6e2d8]" />
          </div>
        ))}
        <div className="col-span-1 flex w-full justify-end sm:col-span-2">
          <div className="h-11 w-36 rounded-full bg-[#c8b995]" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
