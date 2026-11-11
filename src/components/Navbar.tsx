"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpLeft, Menu, Search, ShoppingBag, UserRound, ChevronDown, Phone, Instagram, X, BookOpen, House, Tag } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalProvider";
import { useCategories } from "@/context/CategoriesContext";
import { useCart } from "@/context/CartContextProvider";
import CartDrawer from "./CartDrawer";
import UserDropdown from "./UserMenu";
import { CategoryNode } from "@/types/categories";

export default function Navbar({ logo }: { logo: string }) {
  const router = useRouter();
  const { user } = useUser();
  const { cart } = useCart();
  const categories = useCategories();
  const finalLogoUrl = (() => {
    if (!logo || !logo.trim() || logo === "لوگو دریافت نشد") return "/assets/logo-abaj.png";
    if (logo.startsWith("http")) return logo;
    if (logo === "/logo.png" || logo.startsWith("/assets/")) return logo;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.yazd-mobile.ir";
    return `${baseUrl}${logo.startsWith("/") ? logo : `/${logo}`}`;
  })();
  const { onOpen: onAuthOpen }: any = useAuthModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "خانه", icon: House },
    { href: "/products", label: "فروشگاه", icon: ShoppingBag },
    { href: "/articles", label: "مجله", icon: BookOpen },
    { href: "/about-us", label: "درباره ما", icon: null },
    { href: "/contact-info", label: "تماس با ما", icon: Phone },
  ];

  return (
    <header dir="rtl" className="sticky top-0 z-[100] w-full border-b border-[#d8d2c7] bg-[#f7f5ef]/95 shadow-[0_5px_22px_rgba(37,41,35,.07)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-3 px-3 py-2 sm:px-6 lg:min-h-[88px] lg:px-10">
        <Link href="/" aria-label="صفحه اصلی گروه آخوندی" className="flex shrink-0 items-center gap-3">
          <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border-2 border-[#252923] bg-[#c8b995] shadow-[3px_3px_0_#252923] sm:h-[62px] sm:w-[62px] lg:h-[68px] lg:w-[68px]">
            {<Image src={finalLogoUrl} alt="گروه آخوندی" fill sizes="68px" priority className="object-contain p-1.5" />}
          </span>
          <span className="hidden leading-tight sm:block">
            <b className="block text-base font-black tracking-wide text-[#252923] lg:text-lg">AKHOONDI</b>
            <small className="text-[9px] font-black tracking-[.2em] text-[#777568] lg:text-[10px]">DESIGN GROUP</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-[13px] font-black text-[#252923] xl:flex">
          {navLinks.map((item) => <Link key={item.href} href={item.href} className="group relative py-3 transition-colors hover:text-[#59634f]">
            {item.label}<span className="absolute bottom-1 right-0 h-[2px] w-0 rounded-full bg-[#a65e43] transition-all duration-300 group-hover:w-full" />
          </Link>)}
          <div className="relative" onMouseEnter={() => setCategoryOpen(true)} onMouseLeave={() => setCategoryOpen(false)}>
            <button onClick={() => setCategoryOpen(v => !v)} className="flex items-center gap-1 rounded-full border border-[#d8d2c7] bg-[#e6e2d8] px-4 py-2.5 transition-colors hover:bg-[#c8b995]">
              دسته‌بندی‌ها <ChevronDown size={15} className={categoryOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            {categoryOpen && <div className="absolute right-0 top-full z-[120] mt-2 max-h-[70vh] w-[330px] overflow-y-auto rounded-2xl border-2 border-[#252923] bg-[#f7f5ef] p-3 shadow-[6px_7px_0_#252923]">
              {(categories || []).map((cat: CategoryNode) => <div key={cat.id} className="mb-1">
                <Link href={`/products/?category_id=${cat.id}`} onClick={() => setCategoryOpen(false)} className="flex items-center justify-between rounded-xl bg-[#e6e2d8] px-4 py-3 text-sm font-black hover:bg-[#c8b995]">
                  {cat.name}<ArrowUpLeft size={16} />
                </Link>
                {!!cat.children?.length && <div className="mr-4 mt-1 grid grid-cols-2 gap-1">
                  {cat.children.map(child => <Link key={child.id} href={`/products/?category_id=${child.id}`} onClick={() => setCategoryOpen(false)} className="rounded-lg px-3 py-2 text-xs font-bold text-[#68685e] hover:bg-white hover:text-[#59634f]">{child.name}</Link>)}
                </div>}
              </div>)}
            </div>}
          </div>
        </nav>

        <form onSubmit={submitSearch} className="hidden max-w-[260px] flex-1 items-center gap-2 rounded-full border-2 border-[#252923] bg-white px-3 py-2 md:flex">
          <Search size={17} className="shrink-0 text-[#59634f]" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="دنبال چی می‌گردی؟" className="min-w-0 flex-1 bg-transparent text-xs font-bold text-[#252923] outline-none placeholder:text-[#aaa69d]" />
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden lg:block">
            {user?.identity ? <UserDropdown user={user} /> : <button onClick={onAuthOpen} className="flex items-center gap-2 rounded-full border-2 border-[#252923] bg-[#d9c6b4] px-4 py-3 text-xs font-black text-[#252923] shadow-[3px_3px_0_#252923] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#252923]"><UserRound size={17} /> ورود | ثبت‌نام</button>}
          </div>
          <div className="hidden lg:block">
            {cart?.items?.length ? <CartDrawer cart={cart} /> : <Link href="/profile/cart" aria-label="سبد خرید" className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-[#252923] bg-[#c8b995] text-[#252923] shadow-[3px_3px_0_#252923] transition-transform hover:-translate-y-0.5"><ShoppingBag size={19} />{cart?.total_items > 0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#a65e43] px-1 text-[10px] font-black text-white">{cart.total_items}</span>}</Link>}
          </div>
          <button onClick={() => user?.identity ? router.push("/profile") : onAuthOpen()} aria-label="حساب کاربری" className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#252923] bg-[#d9c6b4] text-[#252923] transition-transform hover:scale-105 lg:hidden"><UserRound size={18} /></button>
          <Link href="/profile/cart" aria-label="سبد خرید" className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-[#252923] bg-[#c8b995] text-[#252923] lg:hidden"><ShoppingBag size={18} />{cart?.total_items > 0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#a65e43] px-1 text-[10px] font-black text-white">{cart.total_items}</span>}</Link>
          <button onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#252923] bg-[#59634f] text-white xl:hidden">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>

      {menuOpen && <div className="border-t border-[#d8d2c7] bg-[#f7f5ef] px-4 pb-4 pt-3 shadow-lg xl:hidden">
        <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2 rounded-xl border-2 border-[#252923] bg-white px-3 py-3 md:hidden">
          <Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جست‌وجو در محصولات" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </form>
        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {navLinks.map(item => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl border border-[#d8d2c7] bg-[#e6e2d8] px-4 py-3 text-sm font-black text-[#252923]">{item.label}</Link>)}
          <Link href="/products/offers" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl border border-[#d8d2c7] bg-[#d9c6b4] px-4 py-3 text-sm font-black text-[#252923]"><Tag size={15} /> تخفیف‌ها</Link>
          {user?.identity && <Link href="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl border border-[#d8d2c7] bg-[#c8b995] px-4 py-3 text-sm font-black">حساب کاربری</Link>}
        </nav>
        {!!categories?.length && <div className="mt-4">
          <p className="mb-2 text-xs font-black tracking-wide text-[#777568]">دسته‌بندی محصولات</p>
          <div className="flex flex-wrap gap-2">{categories.map((cat: CategoryNode) => <Link key={cat.id} href={`/products/?category_id=${cat.id}`} onClick={() => setMenuOpen(false)} className="rounded-full border border-[#d8d2c7] bg-white px-3 py-2 text-xs font-bold">{cat.name}</Link>)}</div>
        </div>}
        <div className="mt-4 flex items-center justify-between border-t border-[#d8d2c7] pt-3 text-xs font-bold text-[#777568]">
          <a href="tel:03535247891" className="flex items-center gap-2"><Phone size={15} /> 035-35247891</a>
          <span className="flex items-center gap-2"><Instagram size={15} /> پشتیبانی ۷ روز هفته</span>
          <button onClick={() => setMenuOpen(false)} aria-label="بستن منو" className="rounded-full bg-[#252923] p-2 text-white"><X size={15} /></button>
        </div>
      </div>}
    </header>
  );
}
