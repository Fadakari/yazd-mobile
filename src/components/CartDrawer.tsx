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
import "@/styles/font.css";
import "../styles/styles.css";
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
                  cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-2 rounded-lg"
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
                          className=" absolute -top-1 -right-2 bg-white border border-zinc-400 text-zinc-600 p-1 rounded-full"
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
                        <div className="flex flex-col w-full gap-2 pr-1">
                          <p className="font-semibold text-zinc-700 text-lg">
                            {item.product.name}
                          </p>
                          <div className="flex gap-2 items-center">
                            {item.color_variant && (
                              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-zinc-200 shadow-2xs cursor-default">
                                <div
                                  className="w-3 h-3 rounded-full border border-zinc-300 shadow-inner"
                                  style={{
                                    backgroundColor: `#${item.color_variant.color_code}`,
                                  }}
                                ></div>
                                <span className="text-sm text-zinc-800 font-medium">
                                  {item.color_variant.color_name}
                                </span>
                              </div>
                            )}

                            {item.material_variant && (
                              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-zinc-200 shadow-2xs cursor-default">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-500 border border-zinc-300 shadow-inner"></div>
                                <span className="text-sm text-zinc-800 font-medium">
                                  {item.material_variant.material_name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p>
                              <span className="text-zinc-600 text-sm">
                                قیمت واحد:
                              </span>{" "}
                              {item.unit_price.toLocaleString("fa-IR")} تومان
                            </p>
                            <p>
                              <span className="text-zinc-600 text-sm">
                                قیمت کل:
                              </span>{" "}
                              {item.total_price.toLocaleString("fa-IR")} تومان
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
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
                <DrawerFooter className="flex flex-col gap-4 w-full px-4 pb-4">
                  <div className="flex items-center justify-between text-xl font-semibold">
                    <p className="text-zinc-600">جمع کل:</p>
                    <p>{cart.total_price.toLocaleString("fa-IR")} تومان</p>
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
