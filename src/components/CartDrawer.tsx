import { CartFormat, useCart } from "@/context/CartContextProvider";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Spinner,
  useDisclosure,
  Badge,
} from "@heroui/react";
import ProductButton from "./ProtectButton";
import { FaBasketShopping } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import EmptyCart from "./EmptyCart";
import { CiImageOff } from "react-icons/ci";

export default function CartDrawer({ cart }: { cart: CartFormat }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { removeFromCart, incrementQuantity, decrementQuantity, loading } =
    useCart();
  console.log(cart)
  return (
    <div className="relative inline-block group mt-1">
      <Badge
        color="warning"
        content={cart.items.length.toLocaleString("fa-IR")}
        placement="bottom-right"
        classNames={{ badge: "font-dana text-white bg-primary pt-1" }}
      >
        <ProductButton
          aria-label="cart"
          title="سبد خرید"
          onClick={onOpen}
          className="group-hover:bg-primary/50 group-active:bg-primary/50 p-2 rounded-lg"
        >
          <FaBasketShopping className="size-8 text-zinc-700" />
        </ProductButton>
      </Badge>

      <Drawer
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="none"
      >
        <DrawerContent className="bg-zinc-100">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between bg-primary-600 text-white px-6 py-3 border-b border-zinc-300">
                <p className="text-2xl font-bold">سبد خرید</p>
                <button onClick={onClose}>
                  <HiXMark className="size-8" />
                </button>
              </DrawerHeader>

              <DrawerBody className="px-2 flex flex-col gap-4 overflow-auto relative">
                {cart.items.length > 0 ? (
                  cart.items.map((item) => {
                    const unitPrice = Number(item.unit_price ?? item.final_price ?? 0);
                    const originalPrice = Number(item.original_unit_price ?? item.product?.price ?? unitPrice);
                    const hasDiscount = (originalPrice > unitPrice && unitPrice > 0) || Boolean(item.is_discounted && originalPrice > unitPrice);
                    const discountPercent = hasDiscount ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) : 0;
                    const totalPrice = Number(item.total_price ?? (unitPrice * item.quantity));

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2 rounded-lg border-b border-zinc-100 last:border-b-0"
                      >
                        <div className="relative bg-white rounded-xl shadow-md">
                          {item.product.cover_image ? (
                            <Image
                              src={item.product.cover_image}
                              alt={item.product.name}
                              width={100}
                              height={100}
                              className="w-40 h-24 object-contain rounded-lg overflow-hidden"
                            />
                          ) : (
                            <div className="w-full h-24 bg-zinc-200 rounded-md flex items-center justify-center">
                              <CiImageOff className="size-14" />
                            </div>
                          )}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute -top-1 -right-2 bg-white border border-zinc-400 text-zinc-600 p-1 rounded-full hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <HiXMark className="size-4" />
                          </button>
                          <div className="flex items-center gap-2 font-pelak text-sm">
                            <div className="flex items-center rounded-b-xl overflow-hidden bg-white">
                              <button
                                onClick={() => incrementQuantity(item.id)}
                                className="px-3 py-2 border-l border-zinc-300 
                   transition-all duration-200 ease-in-out
                   hover:bg-zinc-50 active:bg-zinc-100
                   focus:outline-none focus:ring-1 focus:ring-zinc-300"
                              >
                                +
                              </button>

                              <span className="px-4">{item.quantity}</span>

                              <button
                                onClick={() => decrementQuantity(item.id)}
                                className="px-3 py-2 border-r border-zinc-300
                   transition-all duration-200 ease-in-out
                   hover:bg-zinc-50 active:bg-zinc-100
                   focus:outline-none focus:ring-1 focus:ring-zinc-300"
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col w-full gap-2 pr-1">
                          <p className="font-semibold text-zinc-700 text-base line-clamp-1">
                            {item.product.name}
                          </p>
                          <div className="flex gap-2 items-center flex-wrap">
                            {item.color_variant && (
                              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 border border-zinc-200 text-xs">
                                <div
                                  className="w-2.5 h-2.5 rounded-full border border-zinc-300 shadow-inner"
                                  style={{
                                    backgroundColor: `#${item.color_variant.color_code}`,
                                  }}
                                ></div>
                                <span className="text-zinc-800 font-medium">
                                  {item.color_variant.color_name}
                                </span>
                              </div>
                            )}

                            {item.material_variant && (
                              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 border border-zinc-200 text-xs">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-500 border border-zinc-300 shadow-inner"></div>
                                <span className="text-zinc-800 font-medium">
                                  {item.material_variant.material_name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            {hasDiscount && (
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs line-through text-zinc-400">
                                  {originalPrice.toLocaleString("fa-IR")}
                                </span>
                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                                  {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
                                </span>
                              </div>
                            )}
                            <p className="text-xs text-zinc-600">
                              <span>قیمت واحد:</span>{" "}
                              <span className={hasDiscount ? "font-bold text-red-600" : "font-medium"}>
                                {unitPrice.toLocaleString("fa-IR")} تومان
                              </span>
                            </p>
                            <p className="text-xs text-zinc-600">
                              <span>قیمت کل:</span>{" "}
                              <span className="font-bold text-zinc-800">
                                {totalPrice.toLocaleString("fa-IR")} تومان
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyCart onClose={onClose} />
                )}

                {loading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-zinc-100/80 flex justify-center items-center">
                    <Spinner size="lg" />
                  </div>
                )}
              </DrawerBody>

              {cart.items.length > 0 && (
                <DrawerFooter className="flex flex-col gap-3 w-full px-4 pb-4">
                  {cart.total_discount && cart.total_discount > 0 ? (
                    <div className="flex items-center justify-between text-sm text-green-700 font-medium">
                      <p>سود شما از خرید:</p>
                      <p className="font-bold">{cart.total_discount.toLocaleString("fa-IR")} تومان</p>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <p className="text-zinc-600">جمع کل:</p>
                    <p>{(cart.final_price || cart.total_price).toLocaleString("fa-IR")} تومان</p>
                  </div>

                  <Link
                    href="/profile/cart"
                    onClick={onClose}
                    className="btn-primary w-full rounded-xl text-center font-semibold py-3"
                  >
                    مشاهده سبد خرید
                  </Link>
                </DrawerFooter>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
