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

  // کنترل استیت هم با پراپ ورودی و هم با استیت داخلی
  const selectedId = propSelectedId !== undefined ? propSelectedId : internalSelectedId;

  // دریافت شیوه‌های ارسال بدون انتخاب خودکار (اجباری کردن انتخاب کاربر)
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

        // نکته مهم: برای اینکه کاربر مجبور به انتخاب آگاهانه باشد، هیچ گزینه پیش‌فرضی به صورت اتوماتیک ست نمی‌شود
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

  // تنظیم شیوه ارسال
  const setShippingService = async (serviceId: number) => {
    setUpdating(true);
    try {
      const res = await fetch("/internal-api/shop/cart/set-shipping-service/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping_service_id: serviceId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "خطا در تنظیم شیوه ارسال");
      }

      const responseData = await res.json();
      console.log("SET SHIPPING RESPONSE:", responseData);

      const selectedService = shippingServices.find((s) => s.id === serviceId);

      // ثبت شناسه انتخاب‌شده
      setInternalSelectedId(serviceId);
      if (onSelect) {
        onSelect(serviceId, selectedService);
      }

      await refreshCart();

      addToast({
        title: "شیوه ارسال انتخاب شد",
        description: `شیوه ارسال «${selectedService?.name || ""}» با موفقیت برای سفارش شما ثبت شد.`,
        color: "success",
      });
    } catch (error: any) {
      console.error("Set Shipping Service Error:", error);
      addToast({
        title: "خطا در تنظیم شیوه ارسال",
        description: error.message,
        color: "danger",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectShippingMethod = async (serviceId: number) => {
    // اگر در حال پردازش است یا این گزینه قبلاً انتخاب شده، از تکرار یا غیرفعال شدن جلوگیری کن
    if (updating || selectedId === serviceId) {
      return;
    }
    await setShippingService(serviceId);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 animate-pulse space-y-4">
        <div className="h-6 bg-zinc-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-zinc-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-5 sm:p-6 bg-white rounded-2xl shadow-md transition-all duration-300 space-y-4 border-2 ${
        hasError
          ? "border-red-500 ring-4 ring-red-100 animate-shake"
          : selectedId
          ? "border-emerald-200 bg-white"
          : "border-orange-200 bg-orange-50/20"
      }`}
    >
      {/* عنوان و وضعیت انتخاب */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${
              selectedId
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <FaTruck />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                شیوه ارسال سفارش
              </h3>
              <span className="text-[11px] font-extrabold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
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
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <FaCheck className="text-[11px]" />
            انتخاب شده
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <FaExclamationTriangle className="text-[11px]" />
            نیاز به انتخاب شما
          </span>
        )}
      </div>

      {/* پیام راهنما در صورتی که گزینه‌ای انتخاب نشده باشد */}
      {!selectedId && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 leading-6">
          <FaExclamationTriangle className="text-amber-600 text-base shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">انتخاب شیوه ارسال الزامی است:</strong>
            <span className="text-amber-800 mr-1">
              جهت ارسال به‌موقع بسته، لطفاً قبل از ثبت نهایی یکی از روش‌های زیر را با کلیک روی آن انتخاب نمایید.
            </span>
          </div>
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
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20 scale-[1.01]"
                      : "border-zinc-200 bg-zinc-50/60 hover:border-primary/50 hover:bg-white hover:shadow-xs"
                  }
                `}
              >
                <div className="flex items-start gap-3.5">
                  {/* رادیوباتن سفارشی */}
                  <div
                    className={`
                      mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                      ${
                        isSelected
                          ? "border-primary bg-primary text-white shadow-xs"
                          : "border-zinc-300 bg-white"
                      }
                    `}
                  >
                    {isSelected ? (
                      <FaCheck className="text-white text-xs" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-transparent" />
                    )}
                  </div>

                  {/* توضیحات شیوه ارسال */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-zinc-900 text-base">
                          {service.name}
                        </h4>
                        {service.name.includes("پس کرایه") && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            پرداخت در مقصد
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          گزینه انتخابی شما
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 leading-relaxed">
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

      {/* وضعیت لودینگ */}
      {updating && (
        <div className="flex items-center justify-center gap-2 p-2 bg-primary/5 rounded-lg text-xs font-bold text-primary animate-pulse">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>در حال اعمال شیوه ارسال روی سبد خرید...</span>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodSelector;
