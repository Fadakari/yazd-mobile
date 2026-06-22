"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// Icons
import { GoChevronLeft, GoChevronDown, GoChevronRight } from "react-icons/go";
import { HiOutlineMenuAlt3 } from "react-icons/hi"; // این آیکون در نسخه 1 است
import { HiXMark } from "react-icons/hi2"; // این آیکون در نسخه 2 است
import { FiPhoneCall, FiShoppingCart, FiSearch, FiHeart, FiUser } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";

// Components & Contexts
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure } from "@heroui/react";
import { useUser } from "../context/UserContext";
import { useAuthModal } from "../context/AuthModalProvider";
import { useCategories } from "../context/CategoriesContext";
import { useCart } from "../context/CartContextProvider";
import CartDrawer from "./CartDrawer";
import UserDropdown from "./UserMenu";
import { CategoryNode } from "@/types/categories";
import { User } from "@/types/user";

// Assets
import defaultLogo from "../../public/logo.png";

const CategoriesButton = ({ categories }: { categories: CategoryNode[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group h-full z-50 flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`
        flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300
        ${isOpen
                ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                : "bg-amber-600 text-white"
              }
      `}>

        <BiCategory className="text-xl" />
        <span className="font-bold text-xl">دسته بندی محصولات</span>
        <GoChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* This is a dropdown list of categories */}
      <div
        className={`absolute top-[calc(100%+10px)] right-0 w-[360px] bg-white/95 backdrop-blur-[12px] shadow-lg border border-gray-100 rounded-2xl transition-all duration-250 origin-top-right transform ${isOpen ? "opacity-100 visible scale-100 translate-y-0" : "opacity-0 invisible scale-95 -translate-y-2"
          }`}
        style={{ zIndex: 2000 }}
      >
        <div className="py-3 px-2">
          <div className="text-xs text-gray-500 px-3 pb-2 font-medium">دسته‌بندی‌ها</div>
          <ul className="flex flex-col divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.id} className="group/item relative">
                  <Link
                    href={`/products/?category_id=${cat.id}`}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 text-sm font-medium hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-gray-300 group-hover/item:bg-orange-400 transition-colors" />
                      <span className="truncate max-w-[200px]">{cat.name}</span>
                    </div>
                    {cat.children && cat.children.length > 0 && (
                      <GoChevronLeft className="text-gray-400 text-sm flex-shrink-0" />
                    )}
                  </Link>

                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-1 ml-4 mr-4 bg-gray-50 rounded-lg p-2 border border-gray-100 shadow-sm hidden group-hover/item:block max-h-[280px] overflow-y-auto">
                      <ul className="flex flex-col gap-1">
                        {cat.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/products/?category_id=${child.id}`}
                              className="block px-3 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-white hover:border-l-2 hover:border-l-orange-400 rounded-md transition-colors"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="px-5 py-4 text-sm text-gray-500 text-center">دسته بندی یافت نشد</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- کامپوننت جستجو (Search Box) ---
const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const currentSearch = searchParams.get("search");
    if (currentSearch) setQuery(currentSearch);
  }, [searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`
                flex-1 w-full relative flex items-center transition-all duration-300 rounded-full h-[46px]
                ${isFocused ? "bg-white shadow-[0_4px_20px_rgba(255,87,34,0.15)] border border-[#ff5722]/30" : "bg-gray-100 border border-transparent hover:bg-gray-50"}
            `}
    >
      <button type="submit" className="pl-3 pr-4 text-gray-400 hover:text-[#ff5722] transition-colors">
        <FiSearch className="size-5" />
      </button>
      <input
        type="text"
        placeholder="جستجو در هزاران محصول..."
        className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-700 px-2 placeholder:text-gray-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {/* دکمه سرچ مخفی در موبایل برای ظاهر بهتر */}
      <div className="hidden md:block pl-1.5">
        <button type="submit" className="bg-[#ff5722] text-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform">
          <GoChevronLeft />
        </button>
      </div>
    </form>
  );
};

export default function Navbar() {
  const { user } = useUser();
  const { cart } = useCart();
  const categories = useCategories();
  const { onOpen: onAuthOpen }: any = useAuthModal();

  const [siteLogo, setSiteLogo] = useState<string | any>(defaultLogo);
  const [isSticky, setIsSticky] = useState(false);

  const topLinks = [
    { href: "/contact-info", label: "تماس با ما" },
    { href: "/about-us", label: "درباره ما" },
  ];

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.yazd-mobile.ir"}/home/active-logo/`);
        if (res.ok) {
          const data = await res.json();
          const active = Array.isArray(data) ? data[0] : data;
          if (active?.image) setSiteLogo(active.image);
        }
      } catch (error) {
        console.error("Logo fetch error:", error);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full font-sans dir-rtl select-none z-50">

      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-100/50 text-gray-500 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-6">
            {topLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[#ff5722] transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-[#ff5722] transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:03535247891" className="flex items-center gap-1.5 hover:text-[#ff5722] transition-colors">
              <FiPhoneCall />
              <span className="dir-ltr font-mono font-bold tracking-wider">035-35247891</span>
            </a>
            <span className="w-[1px] h-3 bg-gray-300"></span>
            <span>پشتیبانی ۷ روز هفته</span>
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER (Middle) --- */}
      <div className="bg-white py-4 lg:py-6 relative z-30 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 lg:gap-8">

            {/* Mobile: Hamburger & Logo */}
            <div className="lg:hidden flex items-center gap-3">
              <MobileDrawer onAuthOpen={onAuthOpen} user={user} links={topLinks} categories={categories} />
              <Link href="/" className="relative w-30 h-20">
                <Image src={siteLogo} alt="Logo" fill className="object-contain" priority />
              </Link>
            </div>

            {/* Desktop: Logo */}
            <Link href="/" className="hidden lg:block shrink-0">
              <Image
                src={siteLogo}
                alt="Logo"
                width={200}
                height={80}
                className="h-auto w-auto max-h-14"
                priority
              />
            </Link>

            {/* Desktop: Search */}
            <div className="hidden lg:block flex-1 max-w-[600px] mx-auto">
              <SearchForm />
            </div>

            {/* Desktop: Actions (User, Cart, etc) */}
            <div className="hidden lg:flex items-center justify-end gap-3">
              {/* دکمه ورود / پنل */}


              <span className="w-[1px] h-8 bg-gray-100 mx-1"></span>

              {/* دکمه علاقه مندی (اختیاری) */}
              <Link href="/profile/favorites" className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all">
                <FiHeart className="size-6" />
              </Link>

              {/* سبد خرید */}
              <div className="relative group">
                <div className="relative z-10">
                  {cart && cart.items && cart.items.length > 0 ? (
                    <CartDrawer cart={cart} />
                  ) : (
                    <Link href="/profile/cart" className="w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 text-[#ff5722] border border-orange-100 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-0.5 transition-all duration-300 relative">
                      <FiShoppingCart className="size-5" />
                      {cart && cart.total_items > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                          {cart.total_items}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: Cart & Login Icon */}
            <div className="lg:hidden flex items-center gap-2">
              {!user?.identity && (
                <button onClick={onAuthOpen} className="p-2 text-gray-700">
                  <CiLogin className="size-7" />
                </button>
              )}
              <div className="relative">
                {/* نسخه ساده‌تر سبد خرید برای موبایل */}
                <Link href="/profile/cart" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 relative">
                  <FiShoppingCart className="size-5" />
                  {cart && cart.total_items > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-white">
                      {cart.total_items}
                    </span>
                  )}
                </Link>
              </div>
            </div>

          </div>

          {/* Mobile: Search Bar (Below Header) */}
          <div className="mt-4 lg:hidden w-full px-1">
            <SearchForm />
          </div>
        </div>
      </div>

      {/* --- STICKY BOTTOM BAR (Desktop Navigation) --- */}
      <div
        className={`hidden lg:block transition-all duration-500 ease-in-out ${isSticky
            ? "fixed top-4 left-6 right-6 z-40 bg-white/60 backdrop-blur-md shadow-lg py-2 animate-slideDown rounded-2xl border border-white/10"
            : "relative bg-white py-0 border-t border-gray-100"
          }`}
        style={{ transitionProperty: 'top, left, right, transform, background-color, box-shadow' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[56px]">

            <div className="flex items-center gap-8 h-full">

              {/* دسته‌بندی */}
              <CategoriesButton categories={categories} />

              {/* لینک‌های اصلی */}
              <nav className="flex items-center gap-8 text-[14px] font-medium text-gray-600 mr-[3rem]">
                {[
                  { name: "صفحه اصلی", href: "/" },
                  { name: "فروشگاه", href: "/products" },
                  { name: "وبلاگ آموزشی", href: "/articles" },
                  { name: "تخفیف‌های ویژه", href: "/offers", special: true },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                                relative py-4 transition-colors hover:text-[#ff5722]
                                ${item.special ? "text-red-500 font-bold" : ""}
                             `}
                  >
                    {item.name}
                    {/* هاور افکت زیرخط */}
                    <span className="absolute bottom-2 right-0 w-0 h-[2px] bg-[#ff5722] rounded-full transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>


            </div>
            <div className="flex">
              <div className="relative ml-[1rem]">
                {user?.identity ? (
                  <UserDropdown user={user} />
                ) : (
                  <button
                    onClick={onAuthOpen}
                    className="flex items-center gap-2 border border-gray-200 text-gray-700 bg-white px-4 py-2.5 rounded-xl hover:border-[#ff5722] hover:text-[#ff5722] hover:bg-orange-50 transition-all duration-300 text-sm font-bold shadow-sm"
                  >
                    <FiUser className="size-5" />
                    <span>ورود | ثبت نام</span>
                  </button>
                )}
              </div>
              {/* اگر اسکرول شده باشد، لوگوی کوچک و سبد خرید نمایش داده شود */}
              <div className={`flex items-center gap-4 transition-all duration-300 ${isSticky ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 pointer-events-none"}`}>
                <div className="h-6 w-[1px] bg-gray-300"></div>
                <Link href="/profile/cart" className="flex items-center gap-2 text-gray-700 hover:text-[#ff5722] transition-colors relative">
                  <span className="text-sm font-bold">سبد خرید</span>
                  <div className="relative">
                    <FiShoppingCart className="size-5" />
                    {cart && cart.total_items > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                        {cart.total_items}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </header>
  );
}


// ----------------------------------------------------------------------
// --- MOBILE DRAWER (بهبود یافته) ---
// ----------------------------------------------------------------------

type MobileCategoryProps = {
  categories: CategoryNode[];
  handleBack: () => void;
  setStack: any; stack: any; setCurrent: any; setTitle: any; onClose: any; current: any;
};

function MobileCategoryList({
  categories,
  stack,
  setStack,
  setCurrent,
  current,
  setTitle,
  onClose,
  handleBack
}: MobileCategoryProps) {
  const handleEnter = (category: CategoryNode) => {
    if (category.children?.length) {
      setStack((prev: any) => [...prev, current ?? categories]);
      setCurrent(category.children);
      setTitle(category.name);
    }
  };

  const listToRender = current || categories;

  return (
    <div className="flex flex-col h-full">
      {stack.length > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 p-4 bg-orange-50 text-[#ff5722] font-bold text-sm"
        >
          <GoChevronRight className="text-xl" />
          بازگشت
        </button>
      )}

      <ul className="flex flex-col px-2 py-2">
        {listToRender?.map((cat: CategoryNode) => (
          <li key={cat.id} className="mb-1">
            {cat.children?.length ? (
              <button
                onClick={() => handleEnter(cat)}
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-orange-200"></span>
                  <span className="text-sm font-bold">{cat.name}</span>
                </div>
                <GoChevronLeft className="text-gray-400" />
              </button>
            ) : (
              <Link
                href={`/products/?category_id=${cat.id}`}
                onClick={onClose}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-600 hover:text-[#ff5722] hover:bg-orange-50 rounded-xl text-sm transition-all"
              >
                {cat.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MobileDrawer({ categories, links, user, onAuthOpen }: { categories: CategoryNode[]; links: any; user: User | null; onAuthOpen: () => void; }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stack, setStack] = useState<CategoryNode[][]>([]);
  const [current, setCurrent] = useState<CategoryNode[] | null>(null);
  const [title, setTitle] = useState("دسته بندی محصولات");

  const handleBack = () => {
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    setStack((prevStack) => prevStack.slice(0, -1));
    setCurrent(prev ?? null);
    if (stack.length === 1) setTitle("دسته بندی محصولات");
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setStack([]);
        setCurrent(null);
        setTitle("دسته بندی محصولات");
      }, 300);
    }
  }

  return (
    <>
      <button onClick={onOpen} className="lg:hidden p-2 -mr-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
        <HiOutlineMenuAlt3 className="size-7" />
      </button>

      <Drawer
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        placement="right"
        classNames={{
          base: "max-w-[85%] sm:max-w-[320px] rounded-l-3xl overflow-hidden", // گوشه‌های گرد برای دراور
          backdrop: "bg-black/20 backdrop-blur-sm"
        }}
      >
        <DrawerContent className="bg-white">
          {(onClose) => (
            <>
              <DrawerHeader className="border-b border-gray-100 bg-white py-5 px-5 flex items-center justify-between sticky top-0 z-10">
                <span className="text-lg font-black text-gray-800 tracking-tight">{title}</span>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <HiXMark className="size-5" />
                </button>
              </DrawerHeader>

              <DrawerBody className="p-0 overflow-y-auto scrollbar-hide">
                <MobileCategoryList
                  categories={categories}
                  stack={stack} setStack={setStack}
                  current={current} setCurrent={setCurrent}
                  setTitle={setTitle} onClose={onClose}
                  handleBack={handleBack}
                />

                {!current && (
                  <div className="mt-4 px-4 pb-8">
                    <div className="text-xs font-bold text-gray-400 mb-3 px-2">دسترسی سریع</div>
                    <div className="grid grid-cols-2 gap-2">
                      {links.map((link: any) => (
                        <Link key={link.href} href={link.href} onClick={onClose} className="bg-gray-50 text-gray-600 text-xs font-bold py-3 rounded-xl text-center hover:bg-orange-50 hover:text-[#ff5722] transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </DrawerBody>

              <DrawerFooter className="border-t border-gray-100 bg-white p-5">
                {!user?.identity ? (
                  <button onClick={() => { onAuthOpen(); onClose(); }} className="w-full flex items-center justify-center gap-3 bg-[#ff5722] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95">
                    <CiLogin className="size-6 stroke-[1px]" />
                    ورود یا ثبت نام
                  </button>
                ) : (
                  <div className="w-full bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-[#ff5722] text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {user.identity.first_name?.[0] || <FiUser />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{user.identity.first_name || "کاربر عزیز"}</span>
                        <Link href="/profile" onClick={onClose} className="text-[11px] text-[#ff5722] font-medium hover:underline">
                          مشاهده حساب کاربری
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}