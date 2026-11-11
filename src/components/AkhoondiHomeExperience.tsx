"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpLeft, MoveUpLeft, ArrowDown } from "lucide-react";

type Product = {
  id: number;
  title: string;
  slug: string;
  image: string;
  price?: number;
  oldPrice?: number;
  discount?: number;
  isFeatured?: boolean;
};
type Category = { id: number; name: string; image: string; link: string };
type Banner = { id: number; image: string; alt: string; link: string };
type Blog = { id: number; title: string; excerpt: string; image: string; date: string; slug: string };
type ProductSection = { id: number; title: string; type: string; products: Product[] };

const money = (value?: number) =>
  typeof value === "number" && value > 0 ? new Intl.NumberFormat("fa-IR").format(value) : null;

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 34, filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduced ? 0 : 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProductTile({ product, index }: { product: Product; index: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group min-w-0"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.7] overflow-hidden bg-[#eeeae3]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_72%,rgba(255,255,255,.9),transparent_66%)]" />
          {product.image && (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 40vw, 24vw"
              className="relative z-[1] object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.075]"
            />
          )}
          <span className="absolute left-4 top-4 z-[2] text-[10px] tracking-[.22em] text-[#817b70]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute bottom-4 right-4 z-[2] grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-[#292820] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpLeft size={17} />
          </span>
        </div>
        <div className="flex items-start justify-between gap-3 border-b border-[#ded9cf] py-4">
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold text-[#28271f] sm:text-base">{product.title}</h3>
            {money(product.price) && <p className="mt-2 text-xs text-[#777166]">{money(product.price)} <span className="mr-1">تومان</span></p>}
          </div>
          <span className="mt-1 shrink-0 text-[#8e887d] transition-transform duration-300 group-hover:-translate-x-1"><MoveUpLeft size={17} /></span>
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
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 105]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);
  const hero = banners[0];
  const secondaryBanners = banners.slice(1);
  const featured = useMemo(() => sections.flatMap((s) => s.products).filter((p, i, all) => all.findIndex((x) => x.id === p.id) === i).slice(0, 4), [sections]);
  const firstSection = sections.find((s) => s.products.length > 0);
  const remainingSections = sections.filter((s) => s.products.length > 0 && s.id !== firstSection?.id);

  return (
    <main dir="rtl" className="overflow-hidden bg-[#f7f5f0] text-[#292820]">
      <section ref={heroRef} className="relative isolate min-h-[690px] overflow-hidden bg-[#e9e5dc] sm:min-h-[760px]">
        <div className="absolute inset-0">
          {hero?.image ? (
            <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
              <Image src={hero.image} alt={hero.alt || "گروه آخوندی"} fill priority sizes="100vw" className="object-cover object-center" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(115deg,#d9d2c5_0%,#eee9df_48%,#c7bba9_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-[#171710]/70 via-[#171710]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171710]/35 via-transparent to-[#171710]/10" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[690px] max-w-[1440px] flex-col px-6 pb-10 pt-7 text-white sm:min-h-[760px] sm:px-12 lg:px-20">
          <header className="flex items-center justify-between border-b border-white/25 pb-5">
            <Link href="/" aria-label="صفحه اصلی" className="flex items-center gap-3">
              {logo && <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white/90 p-1"><Image src={logo} alt="لوگوی گروه آخوندی" fill className="object-contain p-1" /></span>}
              <span className="text-sm font-bold tracking-wide sm:text-base">AKHOONDI <span className="font-light">GROUP</span></span>
            </Link>
            <nav className="hidden items-center gap-9 text-[13px] text-white/85 md:flex">
              <Link href="/products" className="transition-colors hover:text-white">محصولات</Link>
              <Link href="/about-us" className="transition-colors hover:text-white">درباره مجموعه</Link>
              <Link href="/articles" className="transition-colors hover:text-white">مجله</Link>
            </nav>
            <Link href="/products" className="flex items-center gap-2 border border-white/50 px-4 py-2 text-xs transition-colors hover:bg-white hover:text-[#292820] sm:px-5 sm:py-3">
              مشاهده محصولات <ArrowUpLeft size={15} />
            </Link>
          </header>

          <div className="flex flex-1 items-center">
            <div className="max-w-[720px] pb-8 pt-20">
              <Reveal>
                <span className="mb-7 inline-flex items-center gap-3 text-[10px] tracking-[.3em] text-white/75 sm:text-xs">
                  <span className="h-px w-10 bg-[#d5b98c]" /> AKHOONDI GROUP / FURNITURE
                </span>
                <h1 className="text-[clamp(3.2rem,8vw,7.5rem)] font-semibold leading-[1.12] tracking-[-.055em]">
                  زیبایی، در <span className="font-light italic">جزئیات</span><br />ماندگار می‌شود.
                </h1>
                <p className="mt-7 max-w-md text-sm leading-8 text-white/75 sm:text-base">
                  میز، صندلی و مبلمان؛ برای فضاهایی که قرار است به‌یادماندنی باشند.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Link href="/products" className="group inline-flex items-center gap-5 bg-[#e7d8bf] px-6 py-4 text-sm font-semibold text-[#292820] transition-colors hover:bg-white">
                    کشف مجموعه <ArrowUpLeft size={18} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                  <span className="text-xs text-white/60">طراحی برای زندگی روزمره</span>
                </div>
              </Reveal>
            </div>
          </div>
          <div className="flex items-end justify-between border-t border-white/25 pt-5 text-[10px] tracking-widest text-white/70">
            <span>DESIGNED TO BELONG</span>
            <span className="flex items-center gap-2"><ArrowDown size={14} /> SCROLL TO EXPLORE</span>
            <span>{hero ? "01 / VISUAL STORY" : "AKHOONDI GROUP"}</span>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
        <Reveal className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <span className="text-[10px] tracking-[.28em] text-[#9a8060]">A THOUGHTFUL WAY TO LIVE</span>
            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.45] tracking-tight sm:text-6xl">فضا را با انتخاب‌های <span className="font-light italic text-[#9a8060]">درست</span> تعریف کنید.</h2>
          </div>
          <div className="flex flex-col justify-end gap-6 md:pr-10">
            <p className="max-w-lg text-sm leading-8 text-[#777166]">هر قطعه، بخشی از حال‌وهوای یک فضاست. مجموعه محصولات گروه آخوندی را ببینید و انتخابی متناسب با سلیقه و نیاز خود پیدا کنید.</p>
            <Link href="/products" className="group inline-flex w-fit items-center gap-4 border-b border-[#9a8060] pb-3 text-sm font-semibold">رفتن به فروشگاه <ArrowUpLeft size={17} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></Link>
          </div>
        </Reveal>
        {categories.length > 0 && (
          <div className="mt-20 grid grid-cols-2 border-t border-[#ded9cf] sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * .04}>
                <Link href={cat.link} className="group relative flex min-h-[170px] flex-col justify-between border-b border-l border-[#ded9cf] p-5 transition-colors duration-500 hover:bg-[#eee9df] sm:min-h-[210px] sm:p-7">
                  <span className="text-[10px] tracking-widest text-[#a69b8b]">0{i + 1}</span>
                  {cat.image && <span className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20"><Image src={cat.image} alt={cat.name} fill sizes="80px" className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" /></span>}
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold">{cat.name}<ArrowUpLeft size={16} className="text-[#9a8060] transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {firstSection && (
        <section className="bg-[#e9e5dc] py-24 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-20">
            <Reveal className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div><span className="text-[10px] tracking-[.28em] text-[#9a8060]">THE COLLECTION / 01</span><h2 className="mt-4 text-4xl font-medium sm:text-6xl">{firstSection.title || "انتخاب‌های مجموعه"}</h2></div>
              <Link href="/products" className="group inline-flex items-center gap-3 text-sm">تمام محصولات <ArrowUpLeft size={17} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-4">
              {firstSection.products.slice(0, 8).map((p, i) => <ProductTile key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {secondaryBanners.map((banner, i) => (
        <section key={banner.id} className="relative mx-auto my-20 max-w-[1440px] overflow-hidden px-6 sm:px-12 lg:px-20">
          <Link href={banner.link || "/products"} className="group relative block aspect-[16/7] min-h-[230px] overflow-hidden bg-[#ddd5c8]">
            <Image src={banner.image} alt={banner.alt || "مجموعه گروه آخوندی"} fill sizes="100vw" className="object-cover transition-transform duration-1000 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/35 to-transparent" />
            <span className="absolute bottom-6 right-6 text-xs tracking-[.2em] text-white sm:bottom-10 sm:right-10">AKHOONDI GROUP / 0{i + 2}</span>
            <span className="absolute bottom-6 left-6 grid h-12 w-12 place-items-center rounded-full border border-white/70 text-white transition-all group-hover:bg-white group-hover:text-[#292820] sm:bottom-10 sm:left-10"><ArrowUpLeft size={20} /></span>
          </Link>
        </section>
      ))}

      {remainingSections.map((section, index) => (
        <section key={section.id} className="mx-auto max-w-[1440px] px-6 py-20 sm:px-12 lg:px-20">
          <Reveal className="mb-10 flex items-end justify-between gap-4">
            <div><span className="text-[10px] tracking-[.28em] text-[#9a8060]">THE COLLECTION / 0{index + 2}</span><h2 className="mt-4 text-3xl font-medium sm:text-5xl">{section.title}</h2></div>
            <Link href="/products" className="hidden items-center gap-2 text-sm sm:flex">مشاهده همه <ArrowUpLeft size={16} /></Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-4">
            {section.products.slice(0, 4).map((p, i) => <ProductTile key={p.id} product={p} index={i} />)}
          </div>
        </section>
      ))}

      {featured.length > 0 && (
        <section className="mx-6 my-16 overflow-hidden bg-[#292820] text-[#f7f5f0] sm:mx-12 lg:mx-20">
          <div className="grid md:grid-cols-[.85fr_1.15fr]">
            <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20">
              <span className="text-[10px] tracking-[.3em] text-[#c8ad86]">OBJECTS WITH CHARACTER</span>
              <h2 className="mt-6 text-4xl font-medium leading-[1.35] sm:text-6xl">انتخابی برای<br /><span className="font-light italic text-[#c8ad86]">ماندن.</span></h2>
              <p className="mt-6 max-w-sm text-sm leading-8 text-white/60">نگاهی نزدیک‌تر به برخی از محصولات مجموعه.</p>
              <Link href="/products" className="mt-9 inline-flex w-fit items-center gap-4 border-b border-[#c8ad86] pb-3 text-sm">دیدن همه محصولات <ArrowUpLeft size={17} /></Link>
            </div>
            <div className="grid grid-cols-2 bg-[#e9e5dc]">
              {featured.slice(0, 4).map((p, i) => (
                <Link key={p.id} href={`/product/${p.slug}`} className={`group relative min-h-[190px] overflow-hidden border-[#d4ccbf] ${i % 2 === 0 ? "border-l" : ""} ${i < 2 ? "border-b" : ""}`}>
                  {p.image && <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-contain p-4 transition-transform duration-700 group-hover:scale-110" />}
                  <span className="absolute bottom-3 right-3 left-3 truncate text-xs font-semibold text-[#292820]">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {blogs.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-6 py-24 sm:px-12 lg:px-20">
          <Reveal className="mb-12 flex items-end justify-between gap-5">
            <div><span className="text-[10px] tracking-[.28em] text-[#9a8060]">JOURNAL / NOTES & IDEAS</span><h2 className="mt-4 text-4xl font-medium sm:text-6xl">از دنیای طراحی</h2></div>
            <Link href="/articles" className="group hidden items-center gap-2 text-sm sm:flex">همه مقاله‌ها <ArrowUpLeft size={17} className="transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></Link>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {blogs.slice(0, 3).map((blog, i) => (
              <Reveal key={blog.id} delay={i * .08}>
                <Link href={`/article/${blog.slug}`} className="group block">
                  <div className="relative aspect-[5/4] overflow-hidden bg-[#e9e5dc]">
                    {blog.image && <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <span className="absolute bottom-4 right-4 bg-[#f7f5f0] px-3 py-2 text-[10px] text-[#777166]">{blog.date}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-[#ded9cf] py-5">
                    <div><h3 className="text-lg font-semibold leading-8">{blog.title}</h3>{blog.excerpt && <p className="mt-2 line-clamp-2 text-xs leading-7 text-[#777166]">{blog.excerpt}</p>}</div>
                    <ArrowUpLeft size={19} className="mt-1 shrink-0 text-[#9a8060] transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <footer className="bg-[#e9e5dc] px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-7 border-t border-[#d3ccbf] pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">{logo && <span className="relative h-10 w-10"><Image src={logo} alt="Akhoondi Group" fill className="object-contain" /></span>}<span className="text-sm font-bold tracking-wider">AKHOONDI GROUP</span></div>
          <p className="text-xs text-[#777166]">مجموعه محصولات گروه آخوندی</p>
          <Link href="/products" className="inline-flex items-center gap-3 text-sm font-semibold">شروع جست‌وجو <ArrowUpLeft size={17} /></Link>
        </div>
      </footer>
    </main>
  );
}
