"use client";

import { CartItem } from "@/types/cartItem";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { MdChevronLeft } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  NumberInput,
  Spinner,
} from "@heroui/react";
import { CiImageOff } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { useCart } from "../../../context/CartContextProvider";
import EmptyCart from "../../../components/EmptyCart";

export default function Page() {
  const { cart, loading } = useCart();

  return (
    <div className="grid md:grid-cols-5 items-start gap-6 w-full text-zinc-900">
      {loading ? (
        <div className="col-span-3 w-full h-64 flex items-center justify-center text-amber-400 text-sm">
          در حال به‌روزرسانی سبد خرید...
        </div>
      ) : cart.total_items > 0 ? (
        <ul className="col-span-3 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 bg-white border border-zinc-200/90 divide-y divide-white/10 shadow-xl">
          {cart.items.map((item: CartItem) => (
            <CartLi item={item} key={item.id} />
          ))}
        </ul>
      ) : (
        <div className="col-span-5 p-6 bg-white border border-zinc-200/90 rounded-2xl">
          <EmptyCart />
        </div>
      )}

      {cart.total_items > 0 && (
        <div className="col-span-3 md:col-span-2 bg-zinc-50 border border-zinc-200 shadow-2xl rounded-2xl p-6 space-y-4 sticky top-28">
          <h3 className="font-bold text-sm text-red-700 border-b border-zinc-200 pb-3">
            صورت‌حساب سفارش
          </h3>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-zinc-500">
              قیمت اقلام ({cart.items.length.toLocaleString("fa-IR")} ردیف کالا):
            </span>
            <span className="font-bold text-zinc-950">
              {cart.total_price.toLocaleString("fa-IR")}{" "}
              <span className="text-[11px] font-normal text-zinc-500">تومان</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-zinc-500">هزینه ارسال:</span>
            <div className="font-bold text-left">
              {cart.total_delivery > 0 ? (
                <span className="text-zinc-900">
                  {cart.total_delivery.toLocaleString("fa-IR")}{" "}
                  <span className="text-[11px] font-normal text-zinc-500">تومان</span>
                </span>
              ) : (
                <span className="text-xs text-amber-400/90">محاسبه در مرحله نهایی</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-sm">
            <span className="font-bold text-zinc-950">مبلغ نهایی پرداختی:</span>
            <span className="font-black text-lg text-red-700">
              {cart.final_price.toLocaleString("fa-IR")}{" "}
              <span className="text-xs font-normal text-zinc-500">تومان</span>
            </span>
          </div>

          <div className="pt-2 w-full">
            <Link
              href="/profile/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all text-center"
            >
              <span>ادامه فرایند خرید و ثبت سفارش</span>
              <IoCartOutline className="size-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function CartLi({ item }: { item: CartItem }) {
  const { removeFromCart, setQuantityToItem, loading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.quantity !== quantity) {
      setQuantityToItem(item.id, quantity);
    }
  }, [quantity, item.id, item.quantity, setQuantityToItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    };

    if (dropDownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropDownOpen]);

  return (
    <>
      <li className="flex flex-col sm:flex-row items-center justify-between py-4 first:pt-0 last:pb-0 gap-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-zinc-50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl cursor-wait">
            <Spinner size="md" color="warning" />
          </div>
        )}

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link
            href={`/product/${item.product.slug}`}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0"
          >
            {item.product.cover_image ? (
              <Image
                src={item.product.cover_image}
                alt={item.product.name}
                width={96}
                height={96}
                className="object-contain p-2"
              />
            ) : (
              <CiImageOff className="size-8 text-amber-400/40" />
            )}
          </Link>

          <div className="flex flex-col space-y-1">
            <Link
              href={`/product/${item.product.slug}`}
              className="font-bold text-sm text-zinc-950 hover:text-amber-400 transition-colors line-clamp-1"
            >
              {item.product.name}
            </Link>

            <div className="text-xs text-zinc-500 space-y-0.5">
              <p>
                <span>قیمت واحد: </span>
                <span className="text-zinc-900 font-semibold">
                  {item.unit_price.toLocaleString("fa-IR")} تومان
                </span>
              </p>
              <p>
                <span>قیمت کل: </span>
                <span className="text-red-700 font-black">
                  {item.total_price.toLocaleString("fa-IR")} تومان
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          {/* Quantity Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropDownOpen(!dropDownOpen)}
              className="py-1.5 px-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-950 flex items-center gap-2 hover:border-amber-400 transition-colors"
            >
              <span>{quantity.toLocaleString("fa-IR")} عدد</span>
              <MdChevronLeft className={`size-4 text-amber-400 transition-transform ${dropDownOpen ? "rotate-90" : "-rotate-90"}`} />
            </button>

            {dropDownOpen && (
              <div className="absolute right-0 top-10 bg-white w-36 z-30 border border-zinc-200 shadow-2xl rounded-xl overflow-hidden p-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`w-full py-1.5 px-3 text-right text-xs rounded-lg transition-colors ${
                      num === quantity
                        ? "bg-amber-400/20 text-amber-400 font-bold"
                        : "text-zinc-700 hover:bg-white/5"
                    }`}
                    onClick={() => {
                      setQuantity(num);
                      setDropDownOpen(false);
                    }}
                  >
                    {num.toLocaleString("fa-IR")} عدد
                  </button>
                ))}

                <button
                  onClick={() => {
                    onOpen();
                    setDropDownOpen(false);
                  }}
                  className="w-full py-1.5 px-3 text-right text-[11px] text-amber-400 hover:bg-amber-400/10 rounded-lg mt-1 border-t border-zinc-200"
                >
                  مقدار دلخواه...
                </button>
              </div>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            title="حذف از سبد خرید"
          >
            <FaRegTrashAlt className="size-4" />
          </button>
        </div>
      </li>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        hideCloseButton
        onOpenChange={onOpenChange}
        placement="center"
        classNames={{
          base: "bg-white border border-zinc-200 text-zinc-900 rounded-2xl p-4 max-w-sm",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newQuantity) return;
                setQuantity(newQuantity);
                onClose();
              }}
              dir="rtl"
            >
              <ModalHeader className="flex justify-between items-center pb-3 border-b border-zinc-200">
                <span className="text-xs font-bold text-amber-400">تعیین تعداد دلخواه</span>
                <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
                  <HiXMark className="size-5" />
                </button>
              </ModalHeader>
              <ModalBody className="py-4">
                <NumberInput
                  value={newQuantity || undefined}
                  onValueChange={(value: number) => setNewQuantity(value)}
                  hideStepper
                  minValue={1}
                  classNames={{
                    inputWrapper: "input !rounded-xl bg-zinc-50 border border-zinc-200",
                    input: "input text-zinc-900 text-sm",
                  }}
                  aria-label="مقدار سبد خرید"
                />
              </ModalBody>
              <ModalFooter className="pt-2 border-t border-zinc-200">
                <button
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                  type="submit"
                >
                  ثبت تعداد
                </button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
