"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiShoppingBag, FiShoppingCart, FiUser } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";
import { useCart } from "@/context/CartContextProvider";
import { useUser } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalProvider";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { user } = useUser();
  const { onOpen: onAuthOpen }: any = useAuthModal();

  const navItems = [
    {
      label: "خانه",
      href: "/",
      icon: <FiHome className="size-6" />,
      active: pathname === "/",
    },
    {
      label: "فروشگاه",
      href: "/products",
      icon: <FiShoppingBag className="size-6" />,
      active: pathname.startsWith("/products") || pathname.startsWith("/product/"),
    },
    {
      label: "سبد خرید",
      href: "/profile/cart",
      icon: (
        <div className="relative flex items-center justify-center">
          <FiShoppingCart className="size-6" />
          {cart && cart.total_items > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
              {cart.total_items}
            </span>
          )}
        </div>
      ),
      active: pathname === "/profile/cart",
    },
    {
      label: "مقالات",
      href: "/articles",
      icon: <FaRegFileLines className="size-[22px]" />,
      active: pathname.startsWith("/articles") || pathname.startsWith("/article/"),
    },
    {
      label: "پروفایل",
      href: "/profile",
      icon: <FiUser className="size-6" />,
      active: pathname.startsWith("/profile") && pathname !== "/profile/cart",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-2 left-2 right-2 z-50 rounded-2xl border border-[#d8d2c7] bg-[#f7f5ef]/90 shadow-[0_8px_32px_rgba(41,46,39,0.13)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] transition-all duration-500">
      <nav className="flex h-[62px] items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = item.active;
          const isProfile = item.href === "/profile";
          
          return (
            <Link
              key={item.label}
              href={isProfile && !user?.identity ? "#" : item.href}
              onClick={(e) => {
                if (isProfile && !user?.identity) {
                  e.preventDefault();
                  onAuthOpen();
                }
              }}
              className={`relative flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 active:scale-95 ${isActive ? "bg-[#e9e4da]" : "hover:bg-[#eeebe3]"}`}
            >
              {/* نشانگر فعال بودن (خط بالای آیکون) */}
              <div 
                className={`absolute top-0 w-6 h-1 rounded-full transition-all duration-300 ${
                  isActive ? "bg-[#a65e43] opacity-100" : "bg-transparent opacity-0"
                }`}
              />
              
              <div 
                className={`transition-all duration-300 transform ${
                  isActive ? "text-[#a65e43] -translate-y-0.5" : "text-[#777568]"
                }`}
              >
                {item.icon}
              </div>
              
              <span 
                className={`text-[10px] font-bold transition-all duration-300 ${
                  isActive ? "text-[#8d513d] opacity-100" : "text-[#777568] opacity-80"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
