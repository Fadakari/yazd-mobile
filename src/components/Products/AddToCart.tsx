"use client";
import { addToast, NumberInput, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { HiXMark } from "react-icons/hi2";
import { IoIosNotifications } from "react-icons/io";
import { useCart } from "@/context/CartContextProvider";
import ProductType from "@/types/product";
import ProductButton from "../ProtectButton";
import { useProductOptions } from "@/context/ProductContext";

function AddToCart({
  product,
  is_available,
}: {
  product: ProductType;
  is_available: boolean;
  store_name_english?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customQuantities, setCustomQuantities] = useState<number[]>([]);
  const { loading, addToCart, cart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedColor, selectedMaterial } = useProductOptions();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    };

    if (dropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropDownOpen]);
  const handleAddToCart = async () => {
    const existingItem = cart?.items?.find((item) => {
      const sameProduct = item.product.id === product.id;
      const sameColor =
        (!selectedColor && !item.color_variant) ||
        (selectedColor && item.color_variant?.id === selectedColor.id);

      const sameMaterial =
        (!selectedMaterial && !item.material_variant) ||
        (selectedMaterial && item.material_variant?.id === selectedMaterial.id);

      return sameProduct && sameColor && sameMaterial;
    });

    const stock =
      selectedColor?.stock ||
      selectedMaterial?.stock ||
      product.stock ||
      product.quantity ||
      0;

    const currentInCart = existingItem ? existingItem.quantity : 0;

    const totalAfterAdd = currentInCart + quantity;

    if (totalAfterAdd > stock) {
      const allowed = stock - currentInCart;

      addToast({
        title: "موجودی کافی نیست",
        description:
          allowed > 0
            ? `شما اکنون ${currentInCart} عدد از این محصول در سبد دارید. حداکثر ${allowed} عدد دیگر قابل افزودن است.`
            : `شما قبلاً حداکثر مقدار قابل مجاز را در سبد دارید. حداکثر تعداد (${product.stock})`,
        color: "danger",
      });

      return;
    }

    try {
      const payload: any = {
        product_id: product.id,
        quantity: quantity,
        isDiscounted: product.isDiscounted,
        color: selectedColor
          ? { id: selectedColor.id, name: selectedColor.color_name }
          : null,
        material: selectedMaterial
          ? { id: selectedMaterial.id, name: selectedMaterial.material_name }
          : null,
      };

      addToCart(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const maxStock = product.stock;
  const handleQuantityChange = (value: number) => {
    if (isNaN(value) || value <= 0) return;

    if (value > maxStock) {
      addToast({
        title: "موجودی کافی نیست",
        description: `حداکثر تعداد قابل انتخاب ${maxStock} عدد است.`,
        color: "danger",
      });

      setQuantity(maxStock);
      return;
    }

    setQuantity(value);

    setCustomQuantities((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
  };

  return is_available ? (
    <div className="flex bg-white border border-zinc-200 rounded-sm flex-1">
      <div className="relative w-2/3" ref={dropdownRef}>
        <button
          onClick={() => setDropDownOpen(!dropDownOpen)}
          className={`w-full p-3 flex items-center justify-between font-bold border border-zinc-300 z-20 font-dana`}
        >
          {quantity} عدد
          <span>
            <MdChevronLeft className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${dropDownOpen ? "rotate-90" : "-rotate-90"}`} />
          </span>
        </button>
        {dropDownOpen && (
          <>
            {/* لایه شفاف پس‌زمینه برای بستن سریع با کلیک بیرون در موبایل */}
            <div
              className="sm:hidden fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
              onClick={() => setDropDownOpen(false)}
            />
            <div className="animate-fade-up animate-duration-200 bottom-full mb-2 sm:bottom-auto sm:top-11 sm:mb-0 right-0 absolute bg-white min-w-[170px] w-full z-50 border border-zinc-200 text-zinc-700 shadow-2xl rounded-2xl sm:rounded-xl overflow-hidden transition-all">
              <div className="sm:hidden flex items-center justify-between p-3 border-b border-zinc-100 bg-zinc-50">
                <p className="font-bold text-xs text-zinc-700">انتخاب تعداد</p>
                <button
                  type="button"
                  onClick={() => setDropDownOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1"
                >
                  <HiXMark className="size-5" />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100">
                {[1, 2, 3, ...customQuantities.filter((q) => q > 3)].map((num) => (
                  <button
                    key={num}
                    className={`w-full p-3 flex items-center justify-between font-bold hover:bg-primary-50 text-sm font-dana transition-colors ${
                      num === quantity
                        ? "bg-primary-100 text-primary-700 font-black"
                        : "text-zinc-700"
                    }`}
                    onClick={() => {
                      setQuantity(num);
                      setDropDownOpen(false);
                    }}
                  >
                    <span>{num} عدد</span>
                    {num === quantity && (
                      <span className="text-primary-600 text-xs">✓</span>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => {
                    onOpen();
                    setDropDownOpen(false);
                  }}
                  className="w-full p-3 flex items-center justify-between font-bold text-sm text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <span>وارد کردن مقدار دلخواه</span>
                  <span className="text-xs">←</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <ProductButton
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-danger text-sm sm:text-base font-semibold px-4 py-2 text-zinc-100 hover:bg-danger/95 transition-colors duration-300 ease-in-out w-full flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-wait"
      >
        افزودن به سبد خرید
        {loading ? (
          <Spinner variant="default" size="sm" color="default" />
        ) : (
          <svg
            className="size-5 text-zinc-400 !stroke-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <use href="#a" />
          </svg>
        )}
      </ProductButton>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        hideCloseButton
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        classNames={{
          wrapper: "z-[99999]",
          backdrop: "z-[99998]",
          base: "max-w-[92vw] sm:max-w-md mx-auto my-auto rounded-2xl shadow-2xl overflow-hidden",
        }}
      >
        <ModalContent className="text-sm rounded-2xl">
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newQuantity) {
                  handleQuantityChange(newQuantity);
                  onClose();
                }
              }}
            >
              <ModalHeader className="flex items-center justify-between gap-1 p-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDropDownOpen(true);
                      onClose();
                    }}
                    className="flex sm:hidden text-zinc-500 hover:text-zinc-700"
                  >
                    <MdChevronRight className="size-6" />
                  </button>
                  <p className="font-bold text-base text-zinc-800">وارد کردن مقدار دلخواه</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
                >
                  <HiXMark className="size-6" />
                </button>
              </ModalHeader>
              <ModalBody className="p-5 space-y-3">
                <p className="font-semibold text-zinc-700 text-sm">
                  لطفا مقدار مورد نیاز را وارد کنید
                </p>
                <div className="relative">
                  <NumberInput
                    value={newQuantity || undefined}
                    onValueChange={(value: number) => setNewQuantity(value)}
                    hideStepper
                    size="sm"
                    classNames={{
                      inputWrapper: "input !rounded-xl border border-zinc-300 focus-within:border-primary",
                      input: "input font-dana border-none text-base",
                    }}
                    minValue={1}
                    aria-label="مقدار سبد خرید"
                    id="quantity"
                    inputMode="numeric"
                  />
                  <label
                    htmlFor="quantity"
                    className="absolute top-3.5 left-4 text-zinc-500 font-medium text-sm"
                  >
                    عدد
                  </label>
                </div>
                <p className="text-xs text-zinc-400">*واحد شمارش بر اساس عدد است.</p>
              </ModalBody>
              <ModalFooter className="p-4 border-t border-zinc-100">
                <button className="w-full btn-primary py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all" type="submit">
                  اعمال مقدار
                </button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  ) : (
    <div className="flex flex-col  sm:flex-row lg:flex-col items-center">
      <div className="hidden lg:inline-flex items-center justify-center w-full relative text-zinc-400 text-base lg:mt-10">
        <hr className="w-full h-px  my-0 bg-zinc-400 border-0 rounded-sm" />
        <p className="absolute px-2 pb-0.5 -translate-x-1/2 bg-zinc-100 left-1/2 text-ellipsis text-nowrap font-semibold ">
          در حال حاضر موجود نیست{" "}
        </p>
      </div>
      <p className="text-sm text-right text-zinc-600 sm:text-base font-light pb-4 lg:pt-5 text-nowrap sm:ml-20 lg:ml-0 w-full">
        متاسفانه این کالا در حال حاضر موجود نیست
      </p>
      <button className="btn-primary w-full relative font-semibold">
        موجود شد به من اطلاع بده{" "}
        <IoIosNotifications className="absolute left-4 top-2.5 size-6" />
      </button>
    </div>
  );
}

export default AddToCart;
