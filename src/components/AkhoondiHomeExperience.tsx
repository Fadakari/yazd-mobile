"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, ReactNode, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpLeft, ArrowDown, Search, ShoppingBag, UserRound, Sparkles,
  MoveUpLeft, Star, Menu, X, Plus, Instagram, Phone, ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContextProvider";
import { useUser } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalProvider";

type Product = {
  id: number; title: string; slug: string; image: string; price?: number;
  oldPrice?: number; discount?: number; isFeatured?: boolean;
};
type Category = { id: number; name: string; image: string; link: string };
type Banner = { id: number; image: string; alt: string; link: string };
type Blog = { id: number; title: string; excerpt: string; image: string; date: string; slug: string };
type ProductSection = { id: number; title: string; type: string; products: Product[] };

const money = (value?: number) =>
  typeof value === "number" && value > 0 ? new Intl.NumberFormat("fa-IR").format(value) : null;

function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right" | "scale";
}) {
  const reduced = useReducedMotion();
  const initial = direction === "left" ? { opacity: 0, x: 70, rotate: -3 }
    : direction === "right" ? { opacity: 0, x: -70, rotate: 3 }
    : direction === "scale" ? { opacity: 0, scale: .82, rotate: -4 }
    : { opacity: 0, y: 65, rotate: 1.5 };
  return (
    <motion.div className={className} initial={reduced ? false : initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: .12 }}
      transition={{ duration: reduced ? 0 : .9, delay, ease: [.16, 1, .3, 1] }}>
      {children}
    </motion.div>
  );
}

function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="overflow-hidden border-y-2 border-[#1c1b25] bg-[#d9ff59] py-3 text-[#1c1b25]">
      <motion.div className="flex w-max items-center gap-8 whitespace-nowrap text-xl font-black tracking-tight sm:text-3xl"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center gap-8">AKHOONDI DESIGN CLUB <Sparkles className="h-6 w-6" /> زندگی با انتخاب‌های خاص <span className="text-[#ff593d]">✳</span></span>
        ))}
      </motion.div>
    </div>
  );
}

function ProductCard({ product, index, featured = false }: { product: Product; index: number; featured?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.article initial={reduced ? false : { opacity: 0, y: 50, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .12 }}
      transition={{ duration: .75, delay: (index % 4) * .08, ease: [.16, 1, .3, 1] }}
      className={`group relative ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className={`relative isolate overflow-hidden rounded-[1.8rem] border-2 border-[#1c1b25] bg-[#f4eee5] shadow-[7px_8px_0_#1c1b25] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[12px_14px_0_#1c1b25] ${featured ? "aspect-[1.25/1] md:aspect-[2.15/1]" : "aspect-[.86/1]"}`}>
          <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#ffb8a6] transition-transform duration-700 group-hover:scale-[1.7]" />
          <div className="absolute bottom-[-18%] right-[-12%] h-52 w-52 rounded-full border-[22px] border-[#d9ff59]/70 transition-transform duration-700 group-hover:rotate-45" />
          {product.image && <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 50vw, 30vw" className="relative z-[1] object-contain p-4 transition-transform duration-700 group-hover:scale-[1.12] group-hover:-rotate-3" />}
          <span className="absolute right-4 top-4 z-[2] grid h-10 w-10 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] text-xs font-black">{String(index + 1).padStart(2, "0")}</span>
          {product.discount ? <span className="absolute left-4 top-4 z-[2] -rotate-6 rounded-full bg-[#ff593d] px-3 py-2 text-xs font-black text-white">{product.discount}٪ تخفیف</span> : null}
          <span className="absolute bottom-4 left-4 z-[2] grid h-11 w-11 translate-y-4 place-items-center rounded-full bg-[#283cff] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpLeft /></span>
        </div>
        <div className="flex items-start justify-between gap-3 px-1 pt-5">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-black leading-7 text-[#1c1b25] sm:text-lg">{product.title}</h3>
            {money(product.price) && <p className="mt-2 text-sm font-bold text-[#77717c]">{money(product.price)} <span className="text-xs font-medium">تومان</span></p>}
          </div>
          <MoveUpLeft className="mt-1 shrink-0 text-[#283cff] transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2" />
        </div>
      </Link>
    </motion.article>
  );
}

export default function AkhoondiHomeExperience({
  logo, banners, categories, sections, blogs,
}: {
  logo: string; banners: Banner[]; categories: Category[]; sections: ProductSection[]; blogs: Blog[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user } = useUser();
  const { onOpen: onAuthOpen }: any = useAuthModal();
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.13]);
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
    <main dir="rtl" className="relative isolate -mx-2 -mt-0 overflow-hidden bg-[#fff9f1] text-[#1c1b25] [--ink:#1c1b25] [--blue:#283cff]">
      <div className="pointer-events-none absolute inset-x-0 top-[900px] -z-0 h-[1200px] opacity-40" style={{ backgroundImage: "radial-gradient(#283cff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* The homepage has its own single, functional header. */}
      <header className="relative z-50 px-4 pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 rounded-[1.6rem] border-2 border-[#1c1b25] bg-[#fff9f1] px-4 py-3 shadow-[5px_5px_0_#1c1b25] sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border-2 border-[#1c1b25] bg-[#d9ff59]">
              {logo && <Image src={logo} alt="گروه آخوندی" fill className="object-contain p-1" />}
            </span>
            <span className="hidden leading-tight sm:block"><b className="block text-sm font-black tracking-wide">AKHOONDI</b><small className="text-[10px] font-bold tracking-[.24em] text-[#77717c]">DESIGN GROUP</small></span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-black lg:flex">
            <Link href="/products" className="transition-colors hover:text-[#283cff]">فروشگاه</Link>
            <Link href="/about-us" className="transition-colors hover:text-[#283cff]">درباره ما</Link>
            <Link href="/articles" className="transition-colors hover:text-[#283cff]">مجله</Link>
            <Link href="/contact-info" className="transition-colors hover:text-[#283cff]">تماس</Link>
          </nav>
          <form onSubmit={submitSearch} className="hidden max-w-[270px] flex-1 items-center rounded-full border-2 border-[#1c1b25] bg-white px-3 py-2 md:flex">
            <Search className="h-4 w-4 shrink-0" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="دنبال چی می‌گردی؟" className="min-w-0 flex-1 bg-transparent px-2 text-xs font-bold outline-none placeholder:text-[#aaa3a0]" />
          </form>
          <div className="flex items-center gap-2">
            <button onClick={() => user?.identity ? router.push("/profile") : onAuthOpen()} aria-label="حساب کاربری" className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#ffb8a6] transition-transform hover:-rotate-12"><UserRound size={18} /></button>
            <Link href="/profile/cart" aria-label="سبد خرید" className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] transition-transform hover:rotate-12"><ShoppingBag size={18} />{cart?.total_items > 0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff593d] px-1 text-[10px] font-black text-white">{cart.total_items}</span>}</Link>
            <button onClick={() => setMenuOpen(v => !v)} className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#283cff] text-white lg:hidden">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-3 grid max-w-[1500px] grid-cols-2 gap-2 rounded-2xl border-2 border-[#1c1b25] bg-white p-4 text-sm font-black shadow-[4px_4px_0_#1c1b25] lg:hidden">
          {[["فروشگاه","/products"],["درباره ما","/about-us"],["مجله","/articles"],["تماس با ما","/contact-info"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#fff1e8] p-3">{label}</Link>)}
          <form onSubmit={submitSearch} className="col-span-2 flex items-center gap-2 rounded-xl border-2 border-[#1c1b25] p-3"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جست‌وجو در محصولات" className="min-w-0 flex-1 bg-transparent outline-none" /></form>
        </motion.nav>}
      </header>

      {/* Hero: oversized, layered, colorful and alive. */}
      <section ref={heroRef} className="relative mx-auto mt-5 min-h-[690px] max-w-[1600px] px-4 sm:px-8 lg:min-h-[790px] lg:px-12">
        <div className="absolute inset-x-4 inset-y-0 overflow-hidden rounded-[2.2rem] border-2 border-[#1c1b25] bg-[#283cff] shadow-[8px_9px_0_#1c1b25] sm:inset-x-8 lg:inset-x-12">
          {hero?.image ? <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0"><Image src={hero.image} alt={hero.alt || "گروه آخوندی"} fill priority sizes="100vw" className="object-cover" /></motion.div> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_40%,#ffb8a6_0_12%,transparent_12.5%),radial-gradient(circle_at_70%_40%,#d9ff59_0_26%,transparent_26.5%),linear-gradient(125deg,#283cff,#6d78ff_55%,#ffb8a6)]" />}
          <div className="absolute inset-0 bg-gradient-to-l from-[#11132b]/80 via-[#11132b]/30 to-transparent" />
          <div className="absolute -left-16 top-20 h-64 w-64 rounded-full border-[32px] border-[#d9ff59]/70" />
        </div>
        <div className="relative z-10 flex min-h-[690px] flex-col justify-between px-6 py-10 text-white sm:px-12 sm:py-14 lg:min-h-[790px] lg:px-20">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-white/60 bg-white/10 px-4 py-2 text-[10px] font-black tracking-[.24em] backdrop-blur-md sm:text-xs">FURNITURE WITH ATTITUDE ✳</span>
            <span className="hidden -rotate-6 rounded-2xl border-2 border-[#1c1b25] bg-[#d9ff59] px-5 py-3 text-sm font-black text-[#1c1b25] shadow-[4px_4px_0_#1c1b25] sm:block">MAKE ROOM<br />FOR GOOD DESIGN</span>
          </div>
          <div className="max-w-[800px] pb-10 pt-24">
            <Reveal direction="right">
              <p className="mb-5 flex items-center gap-3 text-xs font-black tracking-widest text-[#d9ff59]"><span className="h-1 w-12 rounded-full bg-[#d9ff59]" /> از اینجا فضا، شخصیت پیدا می‌کند</p>
              <h1 className="text-[clamp(3.5rem,9vw,9rem)] font-black leading-[1.03] tracking-[-.07em]">یه کم<br /><span className="relative inline-block text-[#d9ff59]">متفاوت‌تر</span><br />زندگی کن<span className="text-[#ffb8a6]">!</span></h1>
              <p className="mt-7 max-w-lg text-sm font-bold leading-8 text-white/85 sm:text-lg">میز، صندلی و مبلمان؛ برای فضاهایی که قرار نیست شبیه همه‌جا باشند.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/products" className="group inline-flex items-center gap-5 rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] px-7 py-4 text-sm font-black text-[#1c1b25] shadow-[5px_5px_0_#1c1b25] transition-all hover:-translate-y-1 hover:shadow-[7px_8px_0_#1c1b25]">بزن بریم کشف کنیم <ArrowUpLeft className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></Link>
                <span className="text-xs font-bold text-white/75">طراحی که توی چشم می‌مونه ✳</span>
              </div>
            </Reveal>
          </div>
          <div className="flex items-end justify-between border-t border-white/35 pt-5 text-[10px] font-black tracking-[.2em] text-white/75">
            <span>AKHOONDI / EST. DESIGN</span><span className="flex items-center gap-2">پایین‌تر رو ببین <ArrowDown size={16} className="animate-bounce" /></span><span>01 — 06</span>
          </div>
        </div>
        <motion.div animate={reduced ? {} : { y: [0, -12, 0], rotate: [-8, -2, -8] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-6 left-8 z-20 grid h-24 w-24 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#ff593d] text-center text-xs font-black leading-5 text-white shadow-[5px_5px_0_#1c1b25] sm:left-20 sm:h-32 sm:w-32 sm:text-sm">GOOD<br />VIBES<br />ONLY ✳</motion.div>
      </section>

      <div className="relative z-10 mt-16"><Marquee /></div>

      {/* Intro and categories */}
      <section className="relative z-10 mx-auto max-w-[1500px] px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <Reveal direction="right">
            <span className="inline-flex -rotate-2 items-center gap-2 rounded-lg bg-[#ffb8a6] px-4 py-2 text-xs font-black">NOT BORING. NEVER. <Star size={14} fill="currentColor" /></span>
            <h2 className="mt-7 text-5xl font-black leading-[1.25] tracking-tight sm:text-7xl">خونه‌ات،<br /><span className="text-[#283cff]">قانون‌های</span><br />خودشو داره!</h2>
          </Reveal>
          <Reveal direction="left" className="relative">
            <div className="absolute -right-4 -top-10 h-20 w-20 rounded-full bg-[#d9ff59]" />
            <p className="relative text-base font-bold leading-9 text-[#6d6670] sm:text-lg">هر گوشه از فضا می‌تونه یه امضای شخصی داشته باشه. بین مجموعه‌ها بچرخ، ترکیب موردعلاقه‌ات رو پیدا کن و حال‌وهوای تازه‌ای به محیطت بده.</p>
            <Link href="/products" className="mt-7 inline-flex items-center gap-3 border-b-2 border-[#283cff] pb-2 text-sm font-black text-[#283cff]">همه‌ی محصولات <ChevronLeft /></Link>
          </Reveal>
        </div>
        {categories.length > 0 && <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * .07} direction={i % 2 ? "scale" : "up"}>
              <Link href={cat.link} className={`group relative flex min-h-[235px] flex-col justify-between overflow-hidden rounded-[1.7rem] border-2 border-[#1c1b25] p-5 shadow-[5px_6px_0_#1c1b25] transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[9px_10px_0_#1c1b25] sm:min-h-[290px] sm:p-7 ${["bg-[#d9ff59]","bg-[#ffb8a6]","bg-[#d9d5ff]","bg-[#ffcf6e]"][i % 4]}`}>
                <span className="flex items-center justify-between text-[11px] font-black"><span>0{i + 1} / CATEGORY</span><Plus className="transition-transform duration-500 group-hover:rotate-90" /></span>
                {cat.image && <span className="relative mx-auto h-28 w-full flex-1 sm:h-36"><Image src={cat.image} alt={cat.name} fill sizes="(max-width: 768px) 45vw, 22vw" className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6" /></span>}
                <span className="mt-4 flex items-center justify-between gap-2 text-lg font-black sm:text-xl">{cat.name}<ArrowUpLeft className="shrink-0 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>}
      </section>

      {firstSection && <section className="relative z-10 overflow-hidden bg-[#d9d5ff] px-5 py-24 sm:px-10 lg:px-16">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full border-[55px] border-white/40" />
        <div className="relative mx-auto max-w-[1500px]">
          <Reveal className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><span className="text-xs font-black tracking-[.2em] text-[#283cff]">THE GOOD STUFF / 01</span><h2 className="mt-4 text-4xl font-black sm:text-6xl">{firstSection.title}</h2></div>
            <Link href="/products" className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] px-5 py-3 text-sm font-black shadow-[4px_4px_0_#1c1b25]">همه رو ببین <ArrowUpLeft /></Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
            {firstSection.products.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} featured={i === 0} />)}
          </div>
        </div>
      </section>}

      {secondaryBanners.map((banner, i) => <section key={banner.id} className="relative z-10 mx-auto my-20 max-w-[1500px] px-5 sm:px-10 lg:px-16">
        <Reveal direction={i % 2 ? "left" : "right"}>
          <Link href={banner.link || "/products"} className="group relative block aspect-[16/8] min-h-[260px] overflow-hidden rounded-[2rem] border-2 border-[#1c1b25] bg-[#ffb8a6] shadow-[8px_8px_0_#1c1b25] sm:aspect-[16/6]">
            <Image src={banner.image} alt={banner.alt || "گروه آخوندی"} fill sizes="100vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#171526]/55 via-transparent to-transparent" />
            <span className="absolute right-6 top-6 rounded-full bg-[#d9ff59] px-4 py-2 text-xs font-black text-[#1c1b25]">AKHOONDI SPECIAL / 0{i + 2}</span>
            <span className="absolute bottom-6 right-6 text-3xl font-black text-white drop-shadow-lg sm:bottom-10 sm:right-10 sm:text-5xl">فضای تازه، حس تازه ✳</span>
            <span className="absolute bottom-6 left-6 grid h-14 w-14 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#ff593d] text-white transition-transform group-hover:rotate-45"><ArrowUpLeft size={24} /></span>
          </Link>
        </Reveal>
      </section>)}

      {remainingSections.map((section, index) => <section key={section.id} className="relative z-10 mx-auto max-w-[1500px] px-5 py-20 sm:px-10 lg:px-16">
        <Reveal className="mb-12 flex items-end justify-between gap-4">
          <div><span className="text-xs font-black tracking-[.2em] text-[#ff593d]">MORE TO LOVE / 0{index + 2}</span><h2 className="mt-4 text-3xl font-black sm:text-5xl">{section.title}</h2></div>
          <Link href="/products" className="flex shrink-0 items-center gap-2 rounded-full bg-[#283cff] px-4 py-3 text-xs font-black text-white">همه محصولات <ArrowUpLeft size={16} /></Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
          {section.products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>)}

      {allProducts.length > 0 && <section className="relative z-10 mx-4 my-16 overflow-hidden rounded-[2rem] border-2 border-[#1c1b25] bg-[#ff593d] shadow-[8px_8px_0_#1c1b25] sm:mx-8 lg:mx-12">
        <div className="absolute -left-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/20" />
        <div className="relative grid md:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col justify-center p-8 text-white sm:p-12 lg:p-16">
            <span className="flex items-center gap-2 text-xs font-black tracking-widest"><Sparkles size={16} /> OBJECTS WITH CHARACTER</span>
            <h2 className="mt-6 text-5xl font-black leading-[1.2] sm:text-7xl">خاص<br />پسندها<br /><span className="text-[#d9ff59]">اینجان!</span></h2>
            <p className="mt-6 max-w-sm text-sm font-bold leading-8 text-white/80">یه دور دیگه بین انتخاب‌های گروه آخوندی بچرخ.</p>
            <Link href="/products" className="mt-8 inline-flex w-fit items-center gap-4 rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] px-6 py-4 text-sm font-black text-[#1c1b25] shadow-[4px_4px_0_#1c1b25]">بریم فروشگاه <ArrowUpLeft /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-[#d9ff59] p-4 sm:p-6">
            {allProducts.slice(0, 4).map((p, i) => <Link key={p.id} href={`/product/${p.slug}`} className="group relative min-h-[180px] overflow-hidden rounded-2xl border-2 border-[#1c1b25] bg-[#fff9f1] sm:min-h-[240px]">
              {p.image && <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-contain p-3 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" />}
              <span className="absolute bottom-3 right-3 left-3 truncate rounded-lg bg-[#1c1b25] px-3 py-2 text-xs font-black text-white">{p.title}</span>
            </Link>)}
          </div>
        </div>
      </section>}

      <div className="relative z-10"><Marquee reverse /></div>

      {blogs.length > 0 && <section className="relative z-10 mx-auto max-w-[1500px] px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><span className="text-xs font-black tracking-[.2em] text-[#283cff]">THE JOURNAL / STORIES</span><h2 className="mt-4 text-5xl font-black sm:text-7xl">چیزهایی برای<br /><span className="text-[#ff593d]">الهام گرفتن.</span></h2></div>
          <Link href="/articles" className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] px-5 py-3 text-sm font-black shadow-[4px_4px_0_#1c1b25]">همه نوشته‌ها <ArrowUpLeft /></Link>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {blogs.slice(0, 3).map((blog, i) => <Reveal key={blog.id} delay={i * .1} direction={i === 1 ? "scale" : "up"}>
            <Link href={`/article/${blog.slug}`} className="group block">
              <div className={`relative aspect-[.92/1] overflow-hidden rounded-[1.7rem] border-2 border-[#1c1b25] shadow-[6px_6px_0_#1c1b25] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[10px_10px_0_#1c1b25] ${["bg-[#ffb8a6]","bg-[#d9d5ff]","bg-[#ffcf6e]"][i]}`}>
                {blog.image && <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                <span className="absolute right-4 top-4 rounded-full border-2 border-[#1c1b25] bg-[#d9ff59] px-4 py-2 text-[10px] font-black">{blog.date || "AKHOONDI JOURNAL"}</span>
                <span className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full border-2 border-[#1c1b25] bg-[#283cff] text-white"><ArrowUpLeft /></span>
              </div>
              <div className="flex items-start justify-between gap-4 px-1 pt-5">
                <div><h3 className="text-xl font-black leading-8">{blog.title}</h3>{blog.excerpt && <p className="mt-2 line-clamp-2 text-sm font-medium leading-7 text-[#77717c]">{blog.excerpt}</p>}</div>
                <ChevronLeft className="mt-2 shrink-0 text-[#ff593d]" />
              </div>
            </Link>
          </Reveal>)}
        </div>
      </section>}

      <footer className="relative z-10 overflow-hidden border-t-2 border-[#1c1b25] bg-[#1c1b25] px-5 py-16 text-white sm:px-10 lg:px-16">
        <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full border-[45px] border-[#283cff]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-12 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="flex items-center gap-3">{logo && <span className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white p-1"><Image src={logo} alt="گروه آخوندی" fill className="object-contain p-1" /></span>}<span className="text-lg font-black tracking-wider">AKHOONDI GROUP</span></div>
            <h2 className="mt-8 max-w-2xl text-4xl font-black leading-[1.3] sm:text-6xl">فضای معمولی؟<br /><span className="text-[#d9ff59]">نه، ممنون!</span></h2>
            <p className="mt-5 text-sm font-bold text-white/60">مجموعه محصولات گروه آخوندی</p>
          </div>
          <div className="flex flex-col justify-end gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm font-bold">
              <Link href="/products" className="rounded-xl border border-white/20 p-4 hover:bg-white/10">فروشگاه <ArrowUpLeft className="inline mr-2" size={16} /></Link>
              <Link href="/about-us" className="rounded-xl border border-white/20 p-4 hover:bg-white/10">درباره ما <ArrowUpLeft className="inline mr-2" size={16} /></Link>
              <Link href="/articles" className="rounded-xl border border-white/20 p-4 hover:bg-white/10">مجله <ArrowUpLeft className="inline mr-2" size={16} /></Link>
              <Link href="/contact-info" className="rounded-xl border border-white/20 p-4 hover:bg-white/10">تماس با ما <Phone className="inline mr-2" size={16} /></Link>
            </div>
            <p className="text-xs font-bold text-white/40">© AKHOONDI GROUP</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
