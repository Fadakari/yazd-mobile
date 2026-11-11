"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContextProvider";
import { addToast } from "@heroui/toast";
import { FaCheck, FaTruck, FaExclamationTriangle } from "react-icons/fa";

export interface ShippingService {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
  default_shipping_cost?: number;
  default_shipping_cost_display?: string;
}

interface ShippingMethodSelectorProps {
  selectedId?: number | null;
  onSelect?: (serviceId: number, service?: ShippingService) => void;
  hasError?: boolean;
}

const ShippingMethodSelector = ({
  selectedId: propSelectedId,
  onSelect,
  hasError = false,
}: ShippingMethodSelectorProps) => {
  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { refreshCart } = useCart();

  const selectedId = propSelectedId !== undefined ? propSelectedId : internalSelectedId;

  useEffect(() => {
    const fetchShippingServices = async () => {
      try {
        const res = await fetch("/internal-api/shop/shipping-services/");
        if (!res.ok) throw new Error("خطا در دریافت شیوه‌های ارسال");

        const data: ShippingService[] = await res.json();
        const activeServices = data.filter((s) => s.is_active);
        setShippingServices(activeServices);
        if (selectedId) {
          const found = activeServices.find((s) => s.id === selectedId);
          if (found && onSelect) {
            onSelect(selectedId, found);
          }
        }
      } catch (error: any) {
        console.error("Shipping Services Error:", error);
        addToast({
          title: "خطا",
          description: "مشکلی در دریافت شیوه‌های ارسال پیش آمد",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShippingServices();
  }, []);

  const setShippingService = async (serviceId: number) => {
    try {
      setUpdating(true);
      const res = await fetch("/internal-api/shop/cart/set-shipping-service/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping_service_id: serviceId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطا در تنظیم شیوه ارسال");
      }

      await refreshCart();
    } catch (error: any) {
      console.error("Set shipping error:", error);
      addToast({
        title: "خطا در ثبت شیوه ارسال",
        description: error.message || "لطفاً دوباره تلاش فرمایید",
        color: "danger",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectShippingMethod = async (serviceId: number) => {
    if (selectedId === serviceId) return;

    setInternalSelectedId(serviceId);
    const service = shippingServices.find((s) => s.id === serviceId);
    if (onSelect) {
      onSelect(serviceId, service);
    }
    await setShippingService(serviceId);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-zinc-200/90 animate-pulse space-y-4">
        <div className="h-6 bg-zinc-50 rounded-xl w-1/3"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-zinc-50 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-5 sm:p-6 bg-white rounded-3xl shadow-xl transition-all duration-300 space-y-4 border ${
        hasError
          ? "border-red-500 ring-2 ring-red-500/30 animate-shake"
          : selectedId
          ? "border-zinc-300"
          : "border-zinc-200/90"
      }`}
      dir="rtl"
    >
      {/* عنوان و وضعیت انتخاب */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${
              selectedId
                ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                : "bg-white/5 text-zinc-500 border border-zinc-200"
            }`}
          >
            <FaTruck />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-zinc-950">
                شیوه ارسال سفارش
              </h3>
              <span className="text-[10px] font-extrabold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                * انتخاب الزامی
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              لطفاً نحوه تحویل بسته را از بین گزینه‌های زیر مشخص فرمایید
            </p>
          </div>
        </div>

        {/* نشانگر وضعیت */}
        {selectedId ? (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <FaCheck className="text-[11px]" />
            انتخاب شده
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-zinc-300 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <FaExclamationTriangle className="text-[11px]" />
            نیاز به انتخاب شما
          </span>
        )}
      </div>

      {/* پیام راهنما */}
      {!selectedId && (
        <div className="p-3 bg-amber-500/10 border border-zinc-200 rounded-xl text-amber-300 text-xs flex items-center gap-2.5">
          <FaExclamationTriangle className="text-amber-400 text-sm shrink-0" />
          <span>
            جهت ارسال به‌موقع بسته، لطفاً یکی از شیوه‌های زیر را انتخاب نمایید.
          </span>
        </div>
      )}

      {/* شیوه‌های ارسال */}
      <div className="space-y-3">
        {shippingServices.length > 0 ? (
          shippingServices.map((service) => {
            const isSelected = selectedId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => handleSelectShippingMethod(service.id)}
                className={`
                  relative p-4 rounded-2xl border cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/10 shadow-lg ring-1 ring-amber-400/30"
                      : "border-zinc-200 bg-zinc-50 hover:border-amber-400/30 hover:bg-zinc-50"
                  }
                `}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`
                      mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0
                      ${
                        isSelected
                          ? "border-amber-400 bg-amber-400 text-slate-950 font-bold"
                          : "border-zinc-300 bg-white"
                      }
                    `}
                  >
                    {isSelected && <FaCheck className="text-slate-950 text-[10px]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="font-bold text-zinc-950 text-sm sm:text-base">
                        {service.name}
                      </h4>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                          گزینه انتخابی شما
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-xs text-zinc-700 mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-zinc-500 py-6 text-sm">
            هیچ شیوه ارسالی در حال حاضر در دسترس نیست.
          </p>
        )}
      </div>

      {updating && (
        <div className="flex items-center justify-center gap-2 p-2 bg-amber-400/10 rounded-xl text-xs font-bold text-amber-300 animate-pulse border border-amber-400/20">
          <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>در حال به‌روزرسانی هزینه ارسال...</span>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodSelector;
