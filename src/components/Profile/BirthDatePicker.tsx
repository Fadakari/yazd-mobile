"use client";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";

interface BirthDatePickerProps {
  value: string; // تاریخ میلادی ISO: "2000-05-01"
  onChange: (val: string) => void; // خروجی: ISO میلادی
  disabled?: boolean;
}

export default function BirthDatePicker({
  value,
  onChange,
  disabled = false,
}: BirthDatePickerProps) {
  let dateObject: DateObject | null = null;

  if (value) {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      dateObject = new DateObject({
        date: parsed,
        calendar: persian,
        locale: persian_fa,
      });
    }
  }

  return (
    <DatePicker
      value={dateObject}
      onChange={(date) => {
        if (!date || Array.isArray(date)) return;
        const gregDate = date.convert(gregorian);
        const isoString = gregDate.format("YYYY-MM-DD");
        onChange(isoString);
      }}
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD"
      disabled={disabled}
      inputClass="w-full rounded-xl px-3 py-2.5 placeholder:text-slate-500 bg-zinc-50 text-zinc-900 disabled:opacity-50 disabled:bg-[#f8fafc]/50 border border-zinc-200 focus:border-amber-400 outline-none text-right text-xs sm:text-sm"
      placeholder="تاریخ تولد را انتخاب کنید"
      calendarPosition="bottom-center"
      maxDate={new DateObject({ calendar: persian, locale: persian_fa })}
    />
  );
}
