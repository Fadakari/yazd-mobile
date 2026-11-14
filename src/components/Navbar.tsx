"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Icons
import {
  GoChevronLeft,
  GoChevronDown,
  GoChevronRight,
} from "react-icons/go";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";

// HeroUI Components
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  cn,
} from "@heroui/react";

// Contexts & Components
import { useUser } from "../context/UserContext";
import { useAuthModal } from "../context/AuthModalProvider";
import { useCategories } from "../context/CategoriesContext";
import { useCart } from "../context/CartContextProvider";
import CartDrawer from "./CartDrawer";
import { CategoryNode } from "@/types/categories";
import { User } from "@/types/user";

// Assets
import defaultLogo from "../../public/logo.png";

// ----------------------------------------------------------------------
// 1. Categories Mega Menu (Desktop)
// ----------------------------------------------------------------------
const CategoriesButton = ({ categories }: { categories: CategoryNode[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group h-full z-50 flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 text-gray-700 hover:text-[#00343d] hover:bg-[#41bccc55] font-bold"
      >
        <BiCategory className="text-xl" />
        <span className="text-[14px]">دسته‌بندی‌ها</span>
        <GoChevronDown
          className={`text-sm transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#0bb2c9]" : "text-gray-400"
          }`}
        />
      </button>

      {/* Mega Menu Dropdown */}
      <div
        className={`absolute top-[calc(100%+15px)] right-0 w-[380px] bg-white/95 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 rounded-[1.5rem] transition-all duration-300 origin-top-right transform ${
          isOpen
            ? "opacity-100 visible scale-100 translate-y-0"
            : "opacity-0 invisible scale-95 -translate-y-4 pointer-events-none"
        }`}
        style={{ zIndex: 2000 }}
      >
        <div className="p-4">
          <div className="text-xs text-gray-400 px-3 pb-3 font-bold border-b border-gray-100 mb-2">
            لیست دسته‌بندی محصولات
          </div>
          <ul className="flex flex-col max-h-[450px] overflow-y-auto scrollbar-hide">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.id} className="group/item relative">
                  <Link
                    href={`/products/?category_id=${cat.id}`}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 text-sm font-bold hover:text-[#0bb2c9] hover:bg-[#0bb2c955] rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-[#0bb2c9] group-hover/item:shadow-[0_0_8px_rgba(11,178,201,0.5)] transition-all" />
                      <span className="truncate max-w-[200px]">{cat.name}</span>
                    </div>
                    {cat.children && cat.children.length > 0 && (
                      <GoChevronLeft className="text-gray-400 text-sm flex-shrink-0 transition-transform group-hover/item:-translate-x-1" />
                    )}
                  </Link>

                  {/* Sub-categories */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-1 mb-2 mx-4 bg-gray-50/80 rounded-xl p-2 border border-gray-100 shadow-inner hidden group-hover/item:block">
                      <ul className="flex flex-col gap-1">
                        {cat.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/products/?category_id=${child.id}`}
                              className="block px-4 py-2.5 text-[13px] text-gray-600 font-medium hover:text-[#0bb2c9] hover:bg-white hover:shadow-sm rounded-lg transition-all before:content-[''] before:inline-block before:w-1 before:h-1 before:bg-gray-300 hover:before:bg-[#0bb2c9] before:rounded-full before:ml-2 before:mb-[2px]"
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
              <li className="px-5 py-4 text-sm text-gray-500 text-center">
                دسته‌بندی یافت نشد
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Search Modal (Desktop & Mobile)
// ----------------------------------------------------------------------
const SearchModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onOpenChange();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-[#12465a] hover:bg-gray-200 transition-colors"
      >
        <FiSearch className="size-5" />
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "mt-24 rounded-3xl pt-5",
        }}
      >
        <ModalContent>
          {() => (
            <ModalBody className="p-4">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-gray-50 rounded-2xl h-[55px] px-2 border border-[#0bb2c9]/30 focus-within:border-[#0bb2c9] transition-colors"
              >
                <button type="submit" className="px-3 text-[#0bb2c9]">
                  <FiSearch className="size-6" />
                </button>
                <input
                  type="text"
                  autoFocus
                  placeholder="جستجو در محصولات..."
                  className="w-full h-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

// ----------------------------------------------------------------------
// 3. User Dropdown Menu
// ----------------------------------------------------------------------
function UserDropdown({ user }: { user: User }) {
  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";
  const fullName =
    user?.identity?.first_name && user?.identity?.last_name
      ? `${user.identity.first_name} ${user.identity.last_name}`
      : "بدون نام";
  const avatarLetter =
    user?.identity?.first_name?.[0] || user?.identity?.phone_number?.[0] || "؟";
  const phoneNumber = user?.identity?.phone_number ?? "بدون شماره";

  const handleLogout = async () => {
    await fetch("/internal-api/auth/logout/", {
      method: "POST",
      credentials: "include",
    });
    location.reload();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          className="text-black hover:!bg-zinc-100 active:!bg-zinc-200 bg-white flex gap-2 items-center rounded-2xl px-3 py-1.5"
          aria-label="حساب کاربری"
        >
          <FiUser className="size-6" />
          <GoChevronDown className="size-3" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="منوی حساب کاربری" variant="faded" className="text-right">
        <DropdownSection>
          <DropdownItem
            key="user-info"
            isReadOnly
            className="flex flex-row cursor-default opacity-100"
          >
            <div className="flex flex-row gap-3">
              <div className="size-11 ring-4 ring-primary-100 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                {avatarLetter}
              </div>
              <div>
                <p className="font-semibold text-base">{fullName}</p>
                <p className="text-sm text-gray-500">{phoneNumber}</p>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          <DropdownItem
            key="profile"
            startContent={<FiUser className={iconClasses} />}
            as={Link}
            href="/profile"
          >
            حساب کاربری
          </DropdownItem>
          <DropdownItem
            key="orders"
            startContent={<FiPackage className={iconClasses} />}
            as={Link}
            href="/profile/orders"
          >
            سفارش‌های من
          </DropdownItem>
        </DropdownSection>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          startContent={<FiLogOut className={cn(iconClasses, "text-danger")} />}
          onClick={handleLogout}
        >
          خروج
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// ----------------------------------------------------------------------
// 4. Mobile Category List with Multi-Level Navigation
// ----------------------------------------------------------------------
function MobileCategoryList({
  categories,
  stack,
  setStack,
  setCurrent,
  current,
  setTitle,
  onClose,
  handleBack,
}: {
  categories: CategoryNode[];
  stack: any[];
  setStack: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrent: React.Dispatch<React.SetStateAction<any>>;
  current: any;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  handleBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {stack.length > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-100 text-gray-800 font-bold text-sm hover:bg-gray-100 transition-colors"
        >
          <GoChevronRight className="text-xl text-gray-500" />
          <span>بازگشت به قبل</span>
        </button>
      )}
      <ul className="flex flex-col px-3 py-3 gap-1">
        {(current || categories)?.map((item: any) => (
          <li key={item.id}>
            {item.children?.length ? (
              <button
                onClick={() => {
                  if (item.children?.length) {
                    setStack((prev) => [...prev, current ?? categories]);
                    setCurrent(item.children);
                    setTitle(item.name);
                  }
                }}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-white rounded-2xl text-gray-700 hover:bg-orange-50 active:scale-[0.98] transition-all border border-transparent hover:border-orange-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-gray-200" />
                  <span className="text-sm font-bold">{item.name}</span>
                </div>
                <GoChevronLeft className="text-gray-400" />
              </button>
            ) : (
              <Link
                href={`/products/?category_id=${item.id}`}
                onClick={onClose}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-white rounded-2xl text-gray-600 hover:text-[#ff5722] hover:bg-orange-50 active:scale-[0.98] border border-transparent hover:border-orange-100 shadow-sm text-sm font-medium transition-all"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. Mobile Drawer
// ----------------------------------------------------------------------
function MobileDrawer({
  categories,
  links,
  user,
  onAuthOpen,
}: {
  categories: CategoryNode[];
  links: { name: string; href: string }[];
  user: User | null;
  onAuthOpen: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stack, setStack] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [title, setTitle] = useState("دسته‌بندی‌ها");

  const handleBack = () => {
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setCurrent(prev ?? null);
    if (stack.length === 1) {
      setTitle("دسته‌بندی‌ها");
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"
      >
        <HiOutlineMenuAlt3 className="size-6" />
      </button>

      <Drawer
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) {
            setTimeout(() => {
              setStack([]);
              setCurrent(null);
              setTitle("دسته‌بندی‌ها");
            }, 300);
          }
        }}
        placement="right"
        classNames={{
          base: "max-w-[85%] sm:max-w-[340px] rounded-l-[2rem] overflow-hidden shadow-2xl",
          backdrop: "bg-black/40 backdrop-blur-sm",
        }}
      >
        <DrawerContent className="bg-gray-50/50">
          {(onClose) => (
            <>
              <DrawerHeader className="bg-white border-b border-gray-100 py-5 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <span className="text-lg font-black text-gray-800 tracking-tight">
                  {title}
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-100"
                >
                  <HiXMark className="size-5" />
                </button>
              </DrawerHeader>

              <DrawerBody className="p-0 overflow-y-auto scrollbar-hide">
                <MobileCategoryList
                  categories={categories}
                  stack={stack}
                  setStack={setStack}
                  current={current}
                  setCurrent={setCurrent}
                  setTitle={setTitle}
                  onClose={onClose}
                  handleBack={handleBack}
                />

                {!current && (
                  <div className="mt-4 px-5 pb-8">
                    <div className="text-xs font-black text-gray-400 mb-3 px-1">
                      دسترسی سریع
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className="bg-white border border-gray-100 shadow-sm text-gray-600 text-[13px] font-bold py-3.5 rounded-2xl text-center hover:bg-orange-50 hover:text-[#ff5722] hover:border-orange-100 transition-all"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </DrawerBody>

              <DrawerFooter className="bg-white border-t border-gray-100 p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                {user?.identity ? (
                  <div className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {user.identity.first_name?.[0] || <FiUser />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-gray-800">
                          {user.identity.first_name || "کاربر عزیز"}
                        </span>
                        <Link
                          href="/profile"
                          onClick={onClose}
                          className="text-[11px] font-bold text-gray-400 hover:text-[#ff5722] transition-colors"
                        >
                          مشاهده حساب کاربری
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onAuthOpen();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-[#2d3436] text-white py-4 rounded-2xl font-bold hover:bg-[#ff5722] transition-colors shadow-md"
                  >
                    <CiLogin className="size-6 stroke-[1px]" />
                    <span>ورود به حساب کاربری</span>
                  </button>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------
// 6. MAIN NAVBAR EXPORT
// ----------------------------------------------------------------------
export default function Navbar({ logo }: { logo: string }) {
  const { user } = useUser();
  const { cart } = useCart();
  const categories = useCategories();
  const { onOpen: onAuthOpen }: any = useAuthModal();

  const initialLogo = logo
    ? logo.startsWith("http")
      ? logo
      : `https://api.rejimfakhr.com${logo}`
    : defaultLogo;

  const [imgSrc, setImgSrc] = useState(initialLogo);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "خانه", href: "/" },
    { name: "دریافت برنامه رژیم", href: "/diet-plan" },
    { name: "فروشگاه", href: "/products" },
    { name: "وبلاگ", href: "/articles" },
    { name: "درباره‌ما", href: "/about-us" },
    { name: "تماس‌با‌ما", href: "/contact-info" },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out font-sans dir-rtl select-none left-0 ${
          isScrolled ? "top-0 lg:top-4" : "top-0 lg:top-6"
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block container mx-auto px-4">
          <div
            className={`mx-auto grid grid-cols-3 items-center transition-all duration-500 ease-in-out bg-white/95 backdrop-blur-xl border border-white/50 rounded-full ${
              isScrolled
                ? "h-[70px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] max-w-[1200px]"
                : "h-[76px] shadow-[0_8px_40px_rgba(0,0,0,0.03)] max-w-[1300px]"
            } px-6`}
          >
            {/* Nav Links */}
            <div className="flex items-center justify-start gap-4 xl:gap-6">
              <nav className="flex items-center gap-5 xl:gap-8 text-[14px] font-bold text-gray-600">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative group py-2 hover:text-[#0bb2c9] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Central Bulging Circular Logo */}
            <div className="flex justify-center items-center relative">
              <div
                className={`absolute flex items-center justify-center bg-white/95 backdrop-blur-xl border-x border-white/50 rounded-full z-10 transition-all duration-500 ease-in-out ${
                  isScrolled
                    ? "shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                    : "shadow-[0_8px_40px_rgba(0,0,0,0.03)]"
                }`}
                style={{
                  width: isScrolled ? "90px" : "100px",
                  height: isScrolled ? "90px" : "100px",
                }}
              >
                <Link
                  href="/"
                  className="relative flex items-center justify-center hover:scale-105 transition-transform duration-300 w-full h-full p-1.5"
                >
                  <Image
                    src={imgSrc}
                    alt="آموزش فخر"
                    width={280}
                    height={120}
                    className="w-full h-full object-contain rounded-full shadow-lg border border-[#00000015] bg-white"
                    priority
                    onError={() => {
                      setImgSrc(defaultLogo);
                    }}
                  />
                </Link>
              </div>
            </div>

            {/* Action Buttons: Categories, Search, Cart, Auth */}
            <div className="flex items-center justify-end gap-3">
              <CategoriesButton categories={categories} />
              <div className="w-[1px] h-6 bg-gray-200 mx-1" />
              <SearchModal />

              {/* Cart Drawer */}
              <div className="relative group">
                {cart && cart.items && cart.items.length > 0 ? (
                  <CartDrawer cart={cart} />
                ) : (
                  <Link
                    href="/profile/cart"
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 text-[#12465a] hover:bg-gray-200 transition-all duration-300 relative"
                  >
                    <FiShoppingCart className="size-5" />
                    {cart && cart.total_items > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#0bb2c9] text-white text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                        {cart.total_items}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* User Dropdown or Login Button */}
              {user?.identity ? (
                <UserDropdown user={user} />
              ) : (
                <button
                  type="button"
                  onClick={onAuthOpen}
                  className="flex items-center gap-2 bg-[#12465a] text-white px-5 py-2.5 rounded-full hover:bg-[#0bb2c9] transition-all duration-300 text-sm font-bold"
                >
                  <CiLogin className="size-5 stroke-[1px] rotate-180" />
                  <span>ورود</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div
          className={`lg:hidden flex flex-col w-full bg-white/95 backdrop-blur-xl transition-all duration-300 ${
            isScrolled
              ? "shadow-md border-b border-gray-100 py-2"
              : "shadow-sm border-b border-gray-50 py-3"
          }`}
        >
          <div className="container mx-auto px-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-nowrap items-center">
                <MobileDrawer
                  onAuthOpen={onAuthOpen}
                  user={user}
                  links={navLinks}
                  categories={categories}
                />
                <Link href="/" className="relative flex items-center justify-center">
                  <Image
                    src={imgSrc}
                    alt="Logo"
                    width={110}
                    height={40}
                    className="h-auto w-auto max-h-16 ms-5 object-contain rounded-full shadow-2xl border-1 border-[#0000006f]"
                    priority
                    onError={() => {
                      setImgSrc(defaultLogo);
                    }}
                  />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <SearchModal />
                {!user?.identity && (
                  <button
                    type="button"
                    onClick={onAuthOpen}
                    className="w-10 h-10 flex items-center justify-center text-white bg-[#12465a] rounded-full transition-colors"
                  >
                    <CiLogin className="size-5 rotate-180" />
                  </button>
                )}
                <Link
                  href="/profile/cart"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-[#12465a] relative hover:bg-gray-200 transition-colors"
                >
                  <FiShoppingCart className="size-5" />
                  {cart && cart.total_items > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0bb2c9] text-white text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full">
                      {cart.total_items}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content is not obscured behind fixed navbar */}
      <div className="w-full h-[80px] lg:h-[110px] shrink-0 pointer-events-none" />
    </>
  );
}
