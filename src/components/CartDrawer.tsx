"use client";

import { CartFormat, useCart } from "@/context/CartContextProvider";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { FiShoppingCart } from "react-icons/fi";
import { HiXMark } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import EmptyCart from "./EmptyCart";
import { CiImageOff } from "react-icons/ci";

export default function CartDrawer({ cart }: { cart: CartFormat }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { removeFromCart, incrementQuantity, decrementQuantity, loading } =
    useCart();

  const totalItemsCount = cart.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || cart.items?.length || 0;

  return (
    <div className="relative inline-block">
      <button
        onClick={onOpen}
        aria-label="سبد خرید"
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-white text-xs transition-all backdrop-blur-md shadow-md shadow-amber-500/10"
      >
        <FiShoppingCart className="size-3.5 text-amber-400" />
        <span className="text-[11px] hidden sm:inline">سبد خرید</span>
        <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
          {totalItemsCount.toLocaleString("fa-IR")}
        </span>
      </button>

      <Drawer
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        classNames={{
          base: "bg-[#f8fafc] border-r border-zinc-200 text-zinc-950 max-w-[390px] w-full",
          backdrop: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <div className="flex flex-col h-full" dir="rtl">
              <DrawerHeader className="flex justify-between items-center bg-white text-zinc-950 px-5 py-4 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <FiShoppingCart className="size-5 text-red-600" />
                  <p className="text-base font-extrabold text-zinc-950">سبد خرید شما</p>
                  <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 font-bold">
                    {totalItemsCount.toLocaleString("fa-IR")} کالا
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                >
                  <HiXMark className="size-6" />
                </button>
              </DrawerHeader>

              <DrawerBody className="p-4 flex flex-col gap-3 overflow-y-auto relative flex-1">
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-zinc-200/90 rounded-2xl p-3 shadow-lg flex items-start gap-3 relative group"
                    >
                      {/* Image Box */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0 flex items-center justify-center">
                        {item.product.cover_image ? (
                          <Image
                            src={item.product.cover_image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <CiImageOff className="size-8 text-slate-500" />
                        )}
                      </div>

                      {/* Info & Actions */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-xs sm:text-sm text-zinc-950 line-clamp-1">
                            {item.product.name}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                            aria-label="حذف"
                          >
                            <HiXMark className="size-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="mt-1 text-xs text-zinc-700">
                          <span className="text-red-700 font-black">
                            {item.unit_price.toLocaleString("fa-IR")}
                          </span>
                          <span className="text-zinc-500 text-[10px] mr-1">تومان</span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200">
                          <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden text-xs">
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="px-2.5 py-1 text-zinc-700 hover:text-red-600 hover:bg-zinc-200 transition-colors"
                            >
                              +
                            </button>
                            <span className="px-3 font-bold text-zinc-950 text-xs">
                              {item.quantity.toLocaleString("fa-IR")}
                            </span>
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="px-2.5 py-1 text-zinc-700 hover:text-red-600 hover:bg-zinc-200 transition-colors"
                            >
                              -
                            </button>
                          </div>

                          <div className="text-xs text-zinc-500">
                            <span>مجموع: </span>
                            <span className="text-zinc-950 font-bold">
                              {item.total_price.toLocaleString("fa-IR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyCart onClose={onClose} />
                )}

                {loading && (
                  <div className="absolute inset-0 bg-zinc-50 backdrop-blur-xs flex justify-center items-center z-20">
                    <Spinner size="lg" color="warning" />
                  </div>
                )}
              </DrawerBody>

              {cart.items && cart.items.length > 0 && (
                <DrawerFooter className="flex flex-col gap-3 w-full p-4 bg-white border-t border-zinc-200">
                  <div className="flex items-center justify-between text-sm font-bold w-full">
                    <span className="text-zinc-500">مبلغ کل خرید:</span>
                    <div className="text-base text-red-700 font-black">
                      {cart.total_price.toLocaleString("fa-IR")}{" "}
                      <span className="text-xs font-normal text-zinc-500">تومان</span>
                    </div>
                  </div>

                  <Link
                    href="/profile/cart"
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm text-center shadow-lg shadow-red-500/25 active:scale-98 transition-all"
                  >
                    تکمیل خرید و پرداخت
                  </Link>
                </DrawerFooter>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
