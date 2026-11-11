"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiSearch, FiUser } from "react-icons/fi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { Drawer, DrawerContent, useDisclosure, Modal, ModalContent } from "@heroui/react";
import { useUser } from "../context/UserContext";
import { useAuthModal } from "../context/AuthModalProvider";
import { useCart } from "../context/CartContextProvider";
import CartDrawer from "./CartDrawer";
import UserDropdown from "./UserMenu";

export default function Navbar({ logo }: { logo: string }) {
  const { user } = useUser();
  const { cart } = useCart();
  const { onOpen: onAuthOpen }: any = useAuthModal();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onOpenChange: onSearchOpenChange, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange } = useDisclosure();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      onSearchClose();
    }
  };

  const finalLogoUrl =
    !logo ||
    logo.trim() === "" ||
    logo === "لوگو دریافت نشد" ||
    logo.includes("2026-08-09_11.45.47.jpg")
      ? "/logo.png"
      : logo.startsWith("http")
      ? logo
      : `${process.env.NEXT_PUBLIC_API_URL || "https://api.khooshtam.com"}${logo.startsWith("/") ? logo : `/${logo}`}`;

  const navLinks = [
    { name: "صفحه اصلی", href: "/" },
    { name: "سوخاری و کتلت", href: "/products?category_id=2" },
    { name: "عطاری و آردها", href: "/products?category_id=4" },
    { name: "سبزیجات معطر", href: "/products?category_id=1" },
    { name: "درباره ما", href: "/about-us" },
    { name: "تماس با ما", href: "/contact-info" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[96px] sm:h-[105px] flex items-center justify-between px-4 sm:px-8 lg:px-12 transition-all duration-300 select-none ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-zinc-200/90 shadow-md"
            : "bg-white/95 backdrop-blur-md border-b border-zinc-200/70 shadow-sm"
        }`}
        dir="rtl"
      >
        {/* 1. Right: Wordmark Brand */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={onDrawerOpen}
            className="lg:hidden p-2 text-zinc-800 hover:text-red-600 transition-colors"
            aria-label="منو"
          >
            <HiBars3 className="size-7" />
          </button>

          <Link href="/" className="flex items-center group py-1" aria-label="صفحه اصلی">
            <div className="relative h-16 sm:h-20 md:h-22 w-auto max-w-[260px] sm:max-w-[340px] md:max-w-[400px] flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
              <img
                src={finalLogoUrl}
                alt="صنایع غذایی خوش طعم کماشدون"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
                className="h-14 sm:h-18 md:h-20 lg:h-22 w-auto max-w-full object-contain filter drop-shadow-md"
              />
            </div>
          </Link>
        </div>

        {/* 2. Center: Clean Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-bold text-zinc-900">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-1 hover:text-red-600 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 right-0 w-0 h-[2.5px] bg-gradient-to-l from-red-600 to-amber-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </nav>

        {/* 3. Left: Action Buttons (Search pill, Cart, User) */}
        <div className="flex items-center gap-3">
          {/* Search Pill */}
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50 hover:border-red-500 hover:bg-white text-zinc-800 text-sm font-semibold transition-all shadow-sm"
          >
            <FiSearch className="size-4 text-red-600" />
            <span className="hidden sm:inline text-xs font-semibold">جستجو</span>
          </button>

          {/* Cart Trigger Pill */}
          <div>
            {cart && cart.items && cart.items.length > 0 ? (
              <CartDrawer cart={cart} />
            ) : (
              <Link
                href="/profile/cart"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-white hover:border-red-500 text-zinc-900 text-sm font-semibold transition-all shadow-sm"
              >
                <FiShoppingCart className="size-4 text-red-600" />
                <span className="text-xs hidden sm:inline font-semibold">سبد خرید</span>
                {cart && cart.total_items > 0 && (
                  <span className="bg-red-600 text-white font-black text-[11px] px-1.5 py-0.2 rounded-full shadow-sm">
                    {cart.total_items.toLocaleString("fa-IR")}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* User Auth Pill */}
          <div>
            {user?.identity ? (
              <UserDropdown user={user} />
            ) : (
              <button
                onClick={onAuthOpen}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-black transition-all shadow-sm"
              >
                <FiUser className="size-4 text-red-600" />
                <span className="hidden sm:inline">ورود</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onOpenChange={onSearchOpenChange}
        placement="top"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "m-4 mt-20 max-w-xl rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 text-zinc-900",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div dir="rtl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
                <span className="text-xs font-bold text-red-600">
                  جستجوی سریع محصولات خوش‌طعم
                </span>
                <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
                  <HiXMark className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  autoFocus
                  type="text"
                  placeholder="جستجوی پودر سوخاری، کتلت، ادویه، سبزی خشک..."
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-red-500 rounded-xl h-12 px-4 pr-11 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3.5 text-red-600 p-1">
                  <FiSearch className="size-4" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                <span className="text-zinc-500 text-[11px]">پیشنهادها:</span>
                <Link
                  href="/products?search=پودر سوخاری"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-700 text-[11px] border border-zinc-200 font-medium transition-colors"
                >
                  پودر سوخاری پولکی
                </Link>
                <Link
                  href="/products?search=کتلت"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-700 text-[11px] border border-zinc-200 font-medium transition-colors"
                >
                  پودر کتلت سویا
                </Link>
                <Link
                  href="/products?search=قورمه"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-red-50 hover:text-red-700 text-zinc-700 text-[11px] border border-zinc-200 font-medium transition-colors"
                >
                  سبزی قورمه
                </Link>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={onDrawerOpenChange}
        placement="right"
        classNames={{
          base: "max-w-[280px] bg-white text-zinc-900 border-l border-zinc-200 shadow-2xl",
          backdrop: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <div className="p-6 flex flex-col justify-between h-full" dir="rtl">
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-zinc-200 mb-6">
                  <div className="relative h-16 w-auto max-w-[220px] flex items-center">
                    <img
                      src={finalLogoUrl}
                      alt="خوش طعم کماشدون"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                      className="h-14 w-auto max-w-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-900">
                    <HiXMark className="size-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-3 text-base font-bold">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="py-3 px-4 rounded-xl text-zinc-900 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-500 font-semibold text-center">
                صنایع غذایی خوش‌طعم کماشدون
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
