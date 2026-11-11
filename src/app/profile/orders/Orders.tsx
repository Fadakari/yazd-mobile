"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { goToGateways } from "@/services/shopActions";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type OrderItem = {
  id: string;
  order_id: string;
  order_number: string;
  amount: number;
  amountFormatted: string;
  status: string;
  date: string; // ISO
  dateFormatted: string;
  detailsLink: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "در انتظار پرداخت", color: "bg-amber-500/15 text-amber-400 border border-zinc-300" },
  shipped: { label: "ارسال شده", color: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  cancelled: { label: "لغو شده", color: "bg-red-500/15 text-red-400 border border-red-500/30" },
  delivered: { label: "تحویل داده شد", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  paid: { label: "پرداخت شده", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
};

type SortKey = "order_number" | "amount" | "status" | "date" | null;
type SortDir = "asc" | "desc" | null;

export default function NiceOrdersTable({ items }: { items?: OrderItem[] }) {
  const data = items ?? [];

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) => {
      return (
        d.order_number.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q) ||
        d.amountFormatted.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  // Sorting
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let A: any = a[sortKey];
      let B: any = b[sortKey];
      if (sortKey === "amount") {
        A = Number(A);
        B = Number(B);
      } else if (sortKey === "date") {
        A = new Date(A).getTime();
        B = new Date(B).getTime();
      } else {
        A = String(A).toLowerCase();
        B = String(B).toLowerCase();
      }
      if (A < B) return -1 * dir;
      if (A > B) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // Helpers
  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      } else setSortDir("asc");
    }
    setPage(1);
  };

  return (
    <div className="w-full text-zinc-900" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="جستجوی شماره سفارش..."
            className="px-3.5 py-2 bg-zinc-50 border border-zinc-200 focus:border-amber-400 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-slate-500 outline-none w-56 sm:w-64 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <label>تعداد ردیف:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none cursor-pointer"
          >
            <option value={5}>۵</option>
            <option value={8}>۸</option>
            <option value={12}>۱۲</option>
            <option value={20}>۲۰</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-zinc-200 rounded-2xl bg-zinc-50 shadow-xl">
        <table className="min-w-[680px] w-full text-xs sm:text-sm text-right">
          <thead className="bg-zinc-100 text-zinc-950 font-bold border-b border-zinc-200">
            <tr>
              <th
                className="px-4 py-3.5 cursor-pointer select-none"
                onClick={() => toggleSort("order_number")}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <span>شماره سفارش</span>
                  <SortIndicator active={sortKey === "order_number"} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3.5 cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <span>مبلغ کل</span>
                  <SortIndicator active={sortKey === "amount"} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3.5 cursor-pointer select-none"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <span>وضعیت</span>
                  <SortIndicator active={sortKey === "status"} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3.5 cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center justify-start gap-1.5">
                  <span>تاریخ ثبت</span>
                  <SortIndicator active={sortKey === "date"} dir={sortDir} />
                </div>
              </th>
              <th className="px-4 py-3.5 text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                  سفارشی یافت نشد
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-100/70 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-zinc-950">{item.order_number}</td>
                  <td className="px-4 py-3.5 text-red-700 font-bold">{item.amountFormatted}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        STATUS_LABELS[item.status]?.color ?? "bg-slate-500/15 text-zinc-500 border border-slate-500/30"
                      }`}
                    >
                      {STATUS_LABELS[item.status]?.label ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500">{item.dateFormatted}</td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={item.detailsLink}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-amber-400/15 hover:text-amber-300 text-zinc-700 text-xs transition-colors"
                      >
                        جزئیات
                      </Link>
                      {item.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => goToGateways(item.order_id)}
                          className="px-3 py-1 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-500/20"
                        >
                          پرداخت
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <div>
          نمایش <span className="text-zinc-950 font-bold">{total === 0 ? 0 : (page - 1) * pageSize + 1}</span> تا{" "}
          <span className="text-zinc-950 font-bold">{Math.min(page * pageSize, total)}</span> از{" "}
          <span className="text-amber-400 font-bold">{total}</span> سفارش
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border border-zinc-200 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            قبلی
          </button>
          <span className="px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700">
            صفحه {page} از {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg border border-zinc-200 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active || !dir) return null;
  return dir === "asc" ? (
    <FaChevronUp className="size-2.5 text-amber-400" />
  ) : (
    <FaChevronDown className="size-2.5 text-amber-400" />
  );
}
