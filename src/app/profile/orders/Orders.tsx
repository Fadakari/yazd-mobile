"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { goToGateways } from "@/services/shopActions";

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
  pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
  shipped: { label: "ارسال شده", color: "bg-slate-100 text-slate-800" },
  cancelled: { label: "لغو شده", color: "bg-red-100 text-red-800" },
  delivered: { label: "تحویل داده شد", color: "bg-green-100 text-green-800" },
  paid: { label: "پرداخت شده", color: "bg-green-100 text-green-800" },
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">جستجو</label>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="شماره سفارش یا وضعیت..."
            className="px-3 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div> */}

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">ردیف در صفحه</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border rounded-md text-sm"
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => toggleSort("order_number")}
                aria-sort={
                  sortKey === "order_number" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                }
              >
                <div className="flex items-center justify-end gap-2">
                  <span>شماره سفارش</span>
                  <SortIndicator active={sortKey === "order_number"} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
                aria-sort={sortKey === "amount" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>مبلغ کل</span>
                  <SortIndicator active={sortKey === "amount"} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => toggleSort("status")}
                aria-sort={sortKey === "status" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>وضعیت</span>
                  <SortIndicator active={sortKey === "status"} dir={sortDir} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() => toggleSort("date")}
                aria-sort={sortKey === "date" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>تاریخ</span>
                  <SortIndicator active={sortKey === "date"} dir={sortDir} />
                </div>
              </th>
              <th className="px-4 py-3 text-right">جزئیات</th>
            </tr>
          </thead>

          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  موردی یافت نشد
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 text-right">{item.order_number}</td>
                  <td className="px-4 py-3 text-right">{item.amountFormatted}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        STATUS_LABELS[item.status]?.color ?? "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_LABELS[item.status]?.label ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{item.dateFormatted}</td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <Link href={item.detailsLink} className="text-blue-600 underline">
                      جزییات سفارش
                    </Link>
                    {item.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => goToGateways(item.order_id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700"
                      >
                        پرداخت
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          نمایش <span className="font-medium">{(page - 1) * pageSize + 1}</span> تا{" "}
          <span className="font-medium">{Math.min(page * pageSize, total)}</span> از{" "}
          <span className="font-medium">{total}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            قبلی
          </button>
          <div className="px-3 py-1 border rounded text-sm">
            صفحه {page} از {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}

// کوچک و ساده: نشانگر مرتب‌سازی
function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="w-4 h-4 inline-flex items-center justify-center text-slate-400">
      {active ? (dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇅") : "⇅"}
    </span>
  );
}
