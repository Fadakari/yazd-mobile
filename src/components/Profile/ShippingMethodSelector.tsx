"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContextProvider";
import { addToast } from "@heroui/toast";
import { FaCheck, FaTruck } from "react-icons/fa";

interface ShippingService {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

const ShippingMethodSelector = () => {
  const [shippingServices, setShippingServices] = useState<ShippingService[]>(
    []
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { refreshCart } = useCart();

  // دریافت شیوه‌های ارسال
  useEffect(() => {
    const fetchShippingServices = async () => {
      try {
        const res = await fetch("/internal-api/shop/shipping-services/");
        if (!res.ok) throw new Error("خطا در دریافت شیوه‌های ارسال");

        const data: ShippingService[] = await res.json();
        const activeServices = data.filter((s) => s.is_active);
        setShippingServices(activeServices);

        // انتخاب پیش‌فرض (بدون ریکوست دوباره)
        const defaultService = activeServices.find((s) => s.is_default);
        if (defaultService) {
          setSelectedId(defaultService.id);
          await setShippingService(defaultService.id);
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

  // تنظیم یا لغو شیوه ارسال
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
      const isUnset = responseData.result?.includes("Unset");

      // اگر unset شد، selectedId را null کن
      if (isUnset) {
        setSelectedId(null);
      } else {
        setSelectedId(serviceId);
      }

      await refreshCart();

      addToast({
        title: "موفق",
        description: isUnset
          ? "شیوه ارسال لغو شد"
          : "شیوه ارسال به‌روز شد",
        color: "success",
      });
    } catch (error: any) {
      console.error("Set Shipping Service Error:", error);
      addToast({
        title: "خطا",
        description: error.message,
        color: "danger",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectShippingMethod = async (serviceId: number) => {
    await setShippingService(serviceId);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-100 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-zinc-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-zinc-100 space-y-4">
      {/* عنوان */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-200">
        <FaTruck className="text-primary text-xl" />
        <h3 className="text-lg font-semibold text-zinc-900">شیوه ارسال</h3>
      </div>

      {/* شیوه‌های ارسال */}
      <div className="space-y-3">
        {shippingServices.length > 0 ? (
          shippingServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleSelectShippingMethod(service.id)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  selectedId === service.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-zinc-200 bg-zinc-50 hover:border-primary/50 hover:bg-white"
                }
              `}
            >
              {/* چک‌بکس سفارشی */}
              <div className="flex items-start gap-4">
                <div className={`
                  mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                  ${
                    selectedId === service.id
                      ? "border-primary bg-primary"
                      : "border-zinc-300 bg-white"
                  }
                `}>
                  {selectedId === service.id && (
                    <FaCheck className="text-white text-sm" />
                  )}
                </div>

                {/* محتوا */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-zinc-900 text-base">
                    {service.name}
                  </h4>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* نشان پیش‌فرض */}
                {service.is_default && (
                  <div className="ml-auto">
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                      پیش‌فرض
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-zinc-500 py-8">
            هیچ شیوه ارسالی دردسترس نیست
          </p>
        )}
      </div>

      {/* حالت updating */}
      {updating && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>در حال به‌روز‌رسانی...</span>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodSelector;
