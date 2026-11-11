"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft, ArrowUpLeft, Search, ShoppingBag, UserRound, Menu, X,
  MoveUpLeft, Plus, Phone, ChevronLeft, Sparkles, Instagram,
} from "lucide-react";
import { useCart } from "@/context/CartContextProvider";
import { useUser } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalProvider";

type Product = { id: number; title: string; slug: string; image: string; price?: number; oldPrice?: number; discount?: number; isFeatured?: boolean };
type Category = { id: number; name: string; image: string; link: string };
type Banner = { id: number; image: string; alt: string; link: string };
type Blog = { id: number; title: string; excerpt: string; image: string; date: string; slug: string };
type ProductSection = { id: number; title: string; type: string; products: Product[] };

const money = (value?: number) => typeof value === "number" && value > 0
  ? new Intl.NumberFormat("fa-IR").format(value) : null;

function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right";
}) {
  const reduced = useReducedMotion();
  const offset = direction === "left" ? { x: 38 } : direction === "right" ? { x: -38 } : { y: 34 };
  return (
    <motion.div className={className} initial={reduced ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: .12 }}
      transition={{ duration: reduced ? 0 : .72, delay, ease: [.22, 1, .36, 1] }}>
      {children}
    </motion.div>
  );
}

function Ticker({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="overflow-hidden border-y border-[#d7d0c5] bg-[#e9e4da] py-3 text-[#55584b]">
      <motion.div className="flex w-max items-center gap-9 whitespace-nowrap text-[10px] font-semibold tracking-[.28em] sm:text-xs"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center gap-9">AKHOONDI DESIGN HOUSE <span className="text-[#a65e43]">✳</span> FORM FOLLOWS FEELING <span className="text-[#a65e43]">✳</span> جزئیات، تفاوت را می‌سازند</span>
        ))}
      </motion.div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.article initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }}
      transition={{ duration: .65, delay: (index % 4) * .07, ease: [.22, 1, .36, 1] }}
      className="group min-w-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[.88/1] overflow-hidden rounded-[1.25rem] bg-[#eee9e0] sm:rounded-[1.6rem]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,rgba(151,133,104,.15),transparent_60%)]" />
          {product.image && <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 23vw" className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.055] sm:p-6" />}
          <span className="absolute right-3 top-3 text-[10px] font-medium tracking-widest text-[#777568]">0{index + 1}</span>
          {product.discount ? <span className="absolute left-3 top-3 rounded-full bg-[#a65e43] px-2.5 py-1 text-[10px] font-semibold text-white">{product.discount}٪ تخفیف</span> : null}
          <span className="absolute bottom-3 left-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-[#33392f] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpLeft size={17} /></span>
        </div>
        <div className="flex items-start justify-between gap-2 px-0.5 pt-4">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-7 text-[#292b25] transition-colors group-hover:text-[#a65e43] sm:text-base">{product.title}</h3>
            {money(product.price) && <p className="mt-1.5 text-xs font-medium text-[#777568]">{money(product.price)} <span className="text-[10px]">تومان</span></p>}
          </div>
          <MoveUpLeft size={17} className="mt-1 shrink-0 text-[#a65e43] opacity-0 transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
        </div>
      </Link>
    </motion.article>
  );
}

export default function AkhoondiHomeExperience({
  logo, banners, categories, sections, blogs,
}: { logo: string; banners: Banner[]; categories: Category[]; sections: ProductSection[]; blogs: Blog[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart?.total_items ?? 0;
  const { user } = useUser();
  const { onOpen: onAuthOpen }: any = useAuthModal();
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 65]);
  const hero = banners[0];
  const secondaryBanners = banners.slice(1);
  const allProducts = useMemo(() => sections.flatMap(s => s.products).filter((p, i, all) => all.findIndex(x => x.id === p.id) === i), [sections]);
  const firstSection = sections.find(s => s.products.length > 0);
  const remainingSections = sections.filter(s => s.products.length > 0 && s.id !== firstSection?.id);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <main dir="rtl" className="relative isolate -mx-2 overflow-hidden bg-[#f7f5ef] text-[#292b25] selection:bg-[#b7bba6] selection:text-[#292b25]">
      <div className="pointer-events-none absolute inset-x-0 top-[1000px] -z-0 h-[1500px] opacity-[.22]" style={{ backgroundImage: "radial-gradient(#8b8d7d .7px, transparent .7px)", backgroundSize: "19px 19px" }} />

      <header className="relative z-50 px-3 pt-3 sm:px-6 sm:pt-5 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 border-b border-[#d8d2c7] px-1 pb-3 sm:pb-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#e9e4da] sm:h-12 sm:w-12">
              {logo && <Image src={logo} alt="گروه آخوندی" fill className="object-contain p-1.5" />}
            </span>
            <span className="leading-tight"><b className="block text-[13px] font-semibold tracking-[.12em] sm:text-sm">AKHOONDI</b><small className="mt-1 block text-[8px] font-medium tracking-[.22em] text-[#777568] sm:text-[9px]">DESIGN HOUSE</small></span>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#515348] lg:flex">
            <Link href="/products" className="transition-colors hover:text-[#a65e43]">فروشگاه</Link>
            <Link href="/about-us" className="transition-colors hover:text-[#a65e43]">درباره ما</Link>
            <Link href="/articles" className="transition-colors hover:text-[#a65e43]">مجله طراحی</Link>
            <Link href="/contact-info" className="transition-colors hover:text-[#a65e43]">تماس با ما</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={submitSearch} className="hidden w-[190px] items-center gap-2 border-b border-[#c9c2b6] py-2 xl:flex">
              <Search size={15} className="text-[#777568]" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جست‌وجوی محصولات" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#aaa496]" />
            </form>
            <button onClick={() => user?.identity ? router.push("/profile") : onAuthOpen()} aria-label="حساب کاربری" className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[#e9e4da]"><UserRound size={18} strokeWidth={1.6} /></button>
            <Link href="/profile/cart" aria-label="سبد خرید" className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[#e9e4da]"><ShoppingBag size={18} strokeWidth={1.6} />{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#a65e43] px-1 text-[9px] font-semibold text-white">{cartCount}</span>}</Link>
            <button onClick={() => setMenuOpen(v => !v)} aria-label="باز کردن منو" className="grid h-9 w-9 place-items-center rounded-full bg-[#33392f] text-white lg:hidden">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
        {menuOpen && <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-2 grid max-w-[1440px] grid-cols-2 gap-x-5 gap-y-1 border-b border-[#d8d2c7] bg-[#f7f5ef] px-2 py-4 text-sm font-medium lg:hidden">
          {[["فروشگاه","/products"],["درباره ما","/about-us"],["مجله طراحی","/articles"],["تماس با ما","/contact-info"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="border-b border-[#e5e0d7] py-3">{label}<ArrowLeft className="mr-2 inline" size={13} /></Link>)}
          <form onSubmit={submitSearch} className="col-span-2 mt-3 flex items-center gap-2 border-b border-[#c9c2b6] py-2"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جست‌وجو در محصولات" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></form>
        </motion.nav>}
      </header>

      {/* Compact first-screen hero: header + hero are designed as one viewport composition. */}
      <section ref={heroRef} className="relative mx-auto mt-3 min-h-[min(590px,calc(100svh-92px))] max-w-[1600px] px-3 sm:mt-5 sm:min-h-[min(640px,calc(100svh-112px))] sm:px-6 lg:px-10">
        <div className="absolute inset-0 overflow-hidden rounded-[1.35rem] bg-[#42483b] sm:rounded-[1.8rem]">
          {hero?.image ? <motion.div style={{ y: heroY }} className="absolute inset-0"><Image src={hero.image} alt={hero.alt || "گروه آخوندی"} fill priority sizes="100vw" className="object-cover object-center" /></motion.div> : <div className="absolute inset-0 bg-[linear-gradient(115deg,#343a31_0%,#777b67_52%,#c3b7a3_100%)]" />}
          <div className="absolute inset-0 bg-gradient-to-l from-[#20251f]/85 via-[#20251f]/55 to-[#20251f]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#20251f]/40 to-transparent" />
          <div className="absolute bottom-8 left-8 hidden h-36 w-36 rounded-full border border-white/30 lg:block" />
        </div>
        <div className="relative flex min-h-[min(590px,calc(100svh-92px))] flex-col justify-between px-5 py-6 text-white sm:min-h-[min(640px,calc(100svh-112px))] sm:px-10 sm:py-8 lg:px-16 lg:py-10">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] font-medium tracking-[.24em] text-white/80 sm:text-[10px]">FURNITURE · OBJECTS · INTERIORS</span>
            <span className="flex items-center gap-2 text-[10px] font-medium text-white/80"><span className="h-px w-7 bg-[#c9a989]" /> طراحی برای ماندن</span>
          </div>
          <div className="max-w-[690px] py-8 sm:py-10">
            <Reveal direction="right">
              <p className="mb-4 text-xs font-medium tracking-wide text-[#d7c1a7] sm:text-sm">فرم، متریال و احساسی که در فضا می‌ماند</p>
              <h1 className="text-[clamp(2.75rem,6.5vw,6.2rem)] font-semibold leading-[1.2] tracking-[-.045em]">زیبایی، در<br /><span className="font-normal italic text-[#d7c1a7]">جزئیات</span> شکل می‌گیرد.</h1>
              <p className="mt-5 max-w-md text-xs font-normal leading-7 text-white/80 sm:mt-6 sm:text-sm sm:leading-8">انتخابی دقیق از میز و صندلی؛ برای فضاهایی با هویت، کیفیت و سلیقه‌ای متمایز.</p>
              <div className="mt-6 flex flex-wrap items-center gap-5 sm:mt-8">
                <Link href="/products" className="group inline-flex items-center gap-5 border border-[#d7c1a7] bg-[#d7c1a7] px-5 py-3 text-xs font-semibold text-[#292b25] transition-colors hover:bg-transparent hover:text-white sm:px-6 sm:py-3.5 sm:text-sm">مشاهده مجموعه <ArrowUpLeft size={17} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></Link>
                <span className="text-[10px] font-medium tracking-wider text-white/65 sm:text-xs">A MORE CONSIDERED WAY TO LIVE</span>
              </div>
            </Reveal>
          </div>
          <div className="flex items-end justify-between border-t border-white/25 pt-3 text-[9px] font-medium tracking-[.2em] text-white/65 sm:pt-4 sm:text-[10px]">
            <span>AKHOONDI DESIGN HOUSE</span><span className="flex items-center gap-2 tracking-normal">کشف مجموعه <span className="animate-bounce">↓</span></span><span>01 / 04</span>
          </div>
        </div>
      </section>

      <div className="relative z-10 mt-8 sm:mt-12"><Ticker /></div>

      <section className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-7 sm:gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <Reveal direction="right">
            <span className="text-[10px] font-semibold tracking-[.25em] text-[#a65e43]">THE AKHOONDI APPROACH</span>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.5] tracking-tight sm:text-5xl sm:leading-[1.4]">برای فضاهایی که<br /><span className="font-normal italic text-[#8c927d]">شبیه خودتان هستند.</span></h2>
          </Reveal>
          <Reveal direction="left">
            <p className="max-w-lg text-sm font-normal leading-8 text-[#737568]">انتخاب مبلمان، بخشی از تعریف شخصیت فضاست. مجموعه‌های آخوندی را ببینید و جزئیاتی را پیدا کنید که با نگاه شما هماهنگ‌اند.</p>
            <Link href="/products" className="mt-5 inline-flex items-center gap-3 border-b border-[#a65e43] pb-2 text-xs font-semibold text-[#8d513d]">کاوش در تمام محصولات <ArrowLeft size={15} /></Link>
          </Reveal>
        </div>
        {categories.length > 0 && <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * .055}>
              <Link href={cat.link} className="group relative block overflow-hidden rounded-xl bg-[#ece8df] sm:rounded-2xl">
                <div className="relative aspect-[.92/1] overflow-hidden sm:aspect-[1/1.08]">
                  {cat.image && <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 640px) 48vw, 24vw" className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.06] sm:p-6" />}
                  <span className="absolute right-3 top-3 text-[9px] font-medium tracking-widest text-[#858575]">0{i + 1}</span>
                  <span className="absolute bottom-3 left-3 grid h-8 w-8 place-items-center rounded-full border border-[#c8c1b5] bg-[#f7f5ef]/80 text-[#42483b] transition-all group-hover:bg-[#42483b] group-hover:text-white"><ArrowUpLeft size={15} /></span>
                </div>
                <div className="flex items-center justify-between border-t border-[#d9d3c9] px-3 py-3 sm:px-4 sm:py-4">
                  <h3 className="text-xs font-semibold text-[#33372e] sm:text-sm">{cat.name}</h3><Plus size={14} className="text-[#a65e43] transition-transform group-hover:rotate-90" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>}
      </section>

      {firstSection && <section className="relative z-10 bg-[#e9e5dc] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div><span className="text-[10px] font-semibold tracking-[.25em] text-[#a65e43]">A CURATED SELECTION · 01</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{firstSection.title}</h2></div>
            <Link href="/products" className="inline-flex w-fit items-center gap-3 border-b border-[#a65e43] pb-2 text-xs font-semibold text-[#8d513d]">مشاهده همه محصولات <ArrowLeft size={15} /></Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {firstSection.products.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>}

      {secondaryBanners.map((banner, i) => <section key={banner.id} className="relative z-10 mx-auto my-14 max-w-[1440px] px-4 sm:my-20 sm:px-8 lg:px-12">
        <Reveal direction={i % 2 ? "left" : "right"}>
          <Link href={banner.link || "/products"} className="group relative block aspect-[16/8] min-h-[210px] overflow-hidden rounded-xl bg-[#42483b] sm:aspect-[16/5.5] sm:min-h-[280px] sm:rounded-2xl">
            <Image src={banner.image} alt={banner.alt || "گروه آخوندی"} fill sizes="100vw" className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#20251f]/65 via-[#20251f]/15 to-transparent" />
            <span className="absolute right-5 top-5 text-[9px] font-medium tracking-[.24em] text-white/80 sm:right-9 sm:top-8">AKHOONDI · EDITION 0{i + 2}</span>
            <span className="absolute bottom-6 right-5 max-w-[75%] text-xl font-medium text-white sm:bottom-10 sm:right-9 sm:text-4xl">نگاهی تازه به انتخاب‌های ماندگار</span>
            <span className="absolute bottom-5 left-5 grid h-10 w-10 place-items-center rounded-full border border-white/60 text-white transition-all group-hover:-translate-x-1 group-hover:bg-white group-hover:text-[#292b25] sm:bottom-9 sm:left-9 sm:h-12 sm:w-12"><ArrowUpLeft size={18} /></span>
          </Link>
        </Reveal>
      </section>)}

      {remainingSections.map((section, index) => <section key={section.id} className="relative z-10 mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <Reveal className="mb-9 flex items-end justify-between gap-4 sm:mb-12">
          <div><span className="text-[10px] font-semibold tracking-[.25em] text-[#a65e43]">DISCOVER MORE · 0{index + 2}</span><h2 className="mt-3 text-2xl font-semibold sm:text-4xl">{section.title}</h2></div>
          <Link href="/products" className="flex shrink-0 items-center gap-2 border-b border-[#a65e43] pb-2 text-[10px] font-semibold text-[#8d513d] sm:text-xs">همه محصولات <ArrowLeft size={14} /></Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {section.products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>)}

      {allProducts.length > 0 && <section className="relative z-10 mx-3 my-12 overflow-hidden rounded-2xl bg-[#41483b] text-white sm:mx-6 sm:my-20 lg:mx-10">
        <div className="grid md:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <span className="text-[10px] font-medium tracking-[.25em] text-[#d7c1a7]">SELECTED FOR YOU</span>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.5] sm:text-5xl">انتخاب‌هایی<br /><span className="font-normal italic text-[#d7c1a7]">با امضای شما</span></h2>
            <p className="mt-4 max-w-sm text-xs leading-7 text-white/65 sm:text-sm">در میان محصولات منتخب گروه آخوندی، جزئیات موردنظرتان را پیدا کنید.</p>
            <Link href="/products" className="mt-7 inline-flex w-fit items-center gap-4 border border-[#d7c1a7] px-5 py-3 text-xs font-semibold text-[#f7f5ef] transition-colors hover:bg-[#d7c1a7] hover:text-[#292b25]">رفتن به فروشگاه <ArrowLeft size={15} /></Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/15 p-px">
            {allProducts.slice(0, 4).map(p => <Link key={p.id} href={`/product/${p.slug}`} className="group relative min-h-[155px] overflow-hidden bg-[#eeebe3] sm:min-h-[230px]">
              {p.image && <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.06] sm:p-5" />}
              <span className="absolute inset-x-2 bottom-2 truncate bg-[#f7f5ef]/90 px-2 py-2 text-[10px] font-semibold text-[#33372e] sm:inset-x-4 sm:bottom-4 sm:px-3 sm:text-xs">{p.title}</span>
            </Link>)}
          </div>
        </div>
      </section>}

      <div className="relative z-10"><Ticker reverse /></div>

      {blogs.length > 0 && <section className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div><span className="text-[10px] font-semibold tracking-[.25em] text-[#a65e43]">THE JOURNAL</span><h2 className="mt-3 text-3xl font-semibold sm:text-5xl">یادداشت‌هایی از دنیای طراحی</h2></div>
          <Link href="/articles" className="inline-flex w-fit items-center gap-3 border-b border-[#a65e43] pb-2 text-xs font-semibold text-[#8d513d]">مطالعه همه مطالب <ArrowLeft size={15} /></Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {blogs.slice(0, 3).map((blog, i) => <Reveal key={blog.id} delay={i * .08}>
            <Link href={`/article/${blog.slug}`} className="group block">
              <div className="relative aspect-[1.18/1] overflow-hidden rounded-xl bg-[#e9e4da] sm:rounded-2xl">
                {blog.image && <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.045]" />}
                <span className="absolute right-3 top-3 bg-[#f7f5ef]/90 px-3 py-1.5 text-[9px] font-medium text-[#55584b]">{blog.date || "AKHOONDI JOURNAL"}</span>
              </div>
              <div className="flex items-start justify-between gap-4 pt-4">
                <div><h3 className="text-base font-semibold leading-7 text-[#33372e] transition-colors group-hover:text-[#a65e43]">{blog.title}</h3>{blog.excerpt && <p className="mt-2 line-clamp-2 text-xs leading-7 text-[#777568]">{blog.excerpt}</p>}</div>
                <ChevronLeft size={17} className="mt-2 shrink-0 text-[#a65e43] transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>
          </Reveal>)}
        </div>
      </section>}

      <footer className="relative z-10 bg-[#292e27] px-5 py-12 text-[#f7f5ef] sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 sm:grid-cols-[1.2fr_.8fr] sm:gap-16">
          <div>
            <div className="flex items-center gap-3">{logo && <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white"><Image src={logo} alt="گروه آخوندی" fill className="object-contain p-1" /></span>}<span className="text-xs font-semibold tracking-[.2em]">AKHOONDI DESIGN HOUSE</span></div>
            <h2 className="mt-7 text-3xl font-medium leading-[1.5] sm:text-5xl">فضا را با نگاه<br /><span className="font-normal italic text-[#d7c1a7]">خودتان تعریف کنید.</span></h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-xs font-medium text-white/75 sm:text-sm">
              <Link href="/products" className="border-b border-white/15 py-3 transition-colors hover:text-[#d7c1a7]">فروشگاه <ArrowLeft className="mr-2 inline" size={13} /></Link>
              <Link href="/about-us" className="border-b border-white/15 py-3 transition-colors hover:text-[#d7c1a7]">درباره ما <ArrowLeft className="mr-2 inline" size={13} /></Link>
              <Link href="/articles" className="border-b border-white/15 py-3 transition-colors hover:text-[#d7c1a7]">مجله طراحی <ArrowLeft className="mr-2 inline" size={13} /></Link>
              <Link href="/contact-info" className="border-b border-white/15 py-3 transition-colors hover:text-[#d7c1a7]">تماس با ما <Phone className="mr-2 inline" size={13} /></Link>
            </div>
            <p className="text-[9px] font-medium tracking-[.18em] text-white/35">© AKHOONDI DESIGN HOUSE</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
