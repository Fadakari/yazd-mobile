import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MainHeroSlider, { SliderItem } from "@/components/MainHeroSlider";
import AmazingOfferSlider, { OfferProduct } from "@/components/AmazingOfferSlider";
import CategorySection, { CategoryItem } from "@/components/CategorySection";
import ShegeftAngizSlider, { ProductCardType } from "@/components/ShegeftAngizSlider";
import LatestBlogSection, { BlogPostItem } from "@/components/LatestBlogSection";
import NewProductsSlider, { NewProductItem } from "@/components/NewProductsSlider";
import TrustBadgesBar from "@/components/TrustBadgesBar";
import { GetShopCategoriesTreeList } from "@/services/shopActions"; // <--- ایمپورت جدید

export const revalidate = 300;

// --- اینترفیس‌های API ---
interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number;
  cover_image: string | null;
  is_available: boolean;
  is_featured: boolean;
}
interface ApiBanner {
  id: number;
  banner_image: string;
  alt: string;
  link: string;
}
interface ApiCategoryInternal {
    id: number;
    name: string;
}
interface ApiSection {
  id: number;
  title: string;
  item_type: "category" | "product" | "banner" | "static_banner";
  filter_choice?: string;
  products: ApiProduct[];
  banner_image: ApiBanner[];
  categories: ApiCategoryInternal[];
}

// --- توابع دریافت دیتا ---

async function getHomeData(): Promise<ApiSection[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/home/sliders-index/`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch home data");

    return res.json();
  } catch (error) {
    console.error("Home Data Error:", error);
    return [];
  }
}

// در فایل page.tsx
async function getLatestArticles(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/`, { 
        
        next: {
          revalidate: 300
        }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data['data'].map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt: item.description || item.excerpt || "",
        // تغییر مهم: اگر عکس نبود، رشته خالی بگذار (تا بعداً لوگو را جایگزین کنیم)
        image: item.image || item.cover || item.thumbnail || "", 
        date: item.created_at_shamsi || "جدید",
        author: item.author_name || "ادمین",
        slug: item.slug
    }));
  } catch (error) {
    return [];
  }
}

// --- داده‌های دامی برای بلاگ (در صورت قطعی API) ---
const dummyBlogPosts: BlogPostItem[] = [
  {
    id: 1,
    title: "راهنمای جامع خرید بهترین پاوربانک در سال 2025",
    excerpt: "در این مقاله به بررسی مهم‌ترین ویژگی‌های یک پاوربانک خوب می‌پردازیم...",
    image: "https://images.unsplash.com/photo-1609592424368-e66a8589c31c?q=80&w=600&auto=format&fit=crop",
    date: "1403/10/05",
    author: "محمد احمدی",
    slug: "powerbank-guide-2025",
    category: "راهنمای خرید",
    readTime: "7 دقیقه"
  },
  // ... سایر پست‌های دامی که داشتید
];

// --- تابع کمکی برای نمایش فقط دسته‌بندی‌های اصلی (بدون زیرمجموعه‌ها) ---
function flattenCategories(categories: any[], defaultIcon: string): CategoryItem[] {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    // اگر عکس نداشت، از defaultIcon (همان لوگوی سایت) استفاده کن
    icon: cat.image || cat.icon || defaultIcon, 
    link: `/products?category_id=${cat.id}`,
  }));
}

// تابع جدید برای دریافت لوگوی سایت
async function getActiveLogo(): Promise<string> {
  try {
    // آدرس API را مطابق ناوبار تنظیم کردم
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/active-logo/`, { 
      next: { revalidate: 3600 } // کش برای ۱ ساعت
    });
    
    if (!res.ok) return "/logo.png"; // عکس پیش‌فرض در صورت خطا
    
    const data = await res.json();
    const active = Array.isArray(data) ? data[0] : data;
    return active?.image || "/logo.png";
  } catch (error) {
    return "/logo.png";
  }
}

export default async function Home() {
  // دریافت موازی دیتا (شامل لیست درختی دسته‌بندی‌ها)
  const homeDataPromise = getHomeData();
  const blogDataPromise = getLatestArticles();
  const categoriesTreePromise = GetShopCategoriesTreeList(); // <--- فراخوانی سرویس دسته‌بندی
  const logoPromise = getActiveLogo();
  
const [apiData, fetchedBlogPosts, categoriesTree, siteLogo] = await Promise.all([
    homeDataPromise, 
    blogDataPromise,
    categoriesTreePromise,
    logoPromise
  ]);

  // --- کد جدید: مستقیم از fetchedBlogPosts استفاده می‌کنیم ---
  const blogPosts = fetchedBlogPosts.map(post => ({
    ...post,
    // اگر پست عکس نداشت، لوگوی سایت را بگذار (جایگزین Placeholder)
    image: post.image || siteLogo 
  }));
  // const blogPosts = fetchedBlogPosts.length > 0 ? fetchedBlogPosts : dummyBlogPosts;

  const bannerSection = apiData.find((item) => item.item_type === "banner");
  const productSection = apiData.find((item) => item.item_type === "product");
  // نکته: دیگر نیازی به categorySection از apiData نداریم چون ناقص است

  // برای محصولات/محصولات درون دسته‌بندی‌ها، یک مپر عمومی می‌سازیم
  const getFullImageUrl = (path: string | null | undefined) => {
    if (!path || typeof path !== "string") return "";
    const cleanPath = path.trim();
    if (!cleanPath) return "";
    if (cleanPath.startsWith("http")) return cleanPath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.valiasrstore.com";
    return `${baseUrl}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
  };

  const mapApiProductToNewProduct = (p: any): NewProductItem => {
    let discountPrice = p.discount_price ?? p.price;
    if (discountPrice == 0 || discountPrice == null) {
      discountPrice = p.price;
    };
    const originalPrice = p.price;
    
    // تخفیف زمانی وجود دارد که:
    // 1. قیمت پس از تخفیف کمتر از قیمت اصلی باشد
    // 2. قیمت پس از تخفیف 0 نباشد (یعنی یک قیمت واقعی است)
    const hasDiscount = discountPrice > 0 && discountPrice < originalPrice;
    
    const discountPercent = hasDiscount
      ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
      : 0;

    return {
      id: p.id,
      title: p.name,
      price: discountPrice,
      oldPrice: hasDiscount ? originalPrice : undefined,
      discount: hasDiscount ? discountPercent : undefined,
      image: p.cover_image ? getFullImageUrl(p.cover_image) : siteLogo,
      isSpecial: p.is_featured,
      slug: p.slug
    };
  };

  // محصولات کلی صفحه (اگر نیاز باشد در جاهای دیگر استفاده کنیم)
  const allApiProducts: NewProductItem[] = [];

  // 3. پیشنهادات عمودی — می‌توانیم از اولین بخش محصولات استفاده کنیم به عنوان پیش‌فرض
  const firstProductSection = apiData.find((it) => it.item_type === "product");
  const verticalOffers: OfferProduct[] = (firstProductSection?.products || [])
    .slice(0, 6)
    .map((p: any) => ({
      id: p.id,
      title: p.name,
      image: p.cover_image || siteLogo,
      price: (p.discount_price ?? p.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      link: `/product/${p.slug}`,
    }));


  // اضافه کردن شرطِ پشتیبانی از ساختار results بک‌اند
  const categoriesArray = Array.isArray(categoriesTree) 
    ? categoriesTree 
    : (categoriesTree?.data || categoriesTree?.results || []);
    
  const allCategories = flattenCategories(categoriesArray, siteLogo);

  // 5. شگفت انگیز — از محصولات جدید استخراج می‌شود (در صورت موجود بودن)
  const shegeftAngizData: ProductCardType[] = (firstProductSection?.products || []).map(mapApiProductToNewProduct).map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    oldPrice: p.oldPrice,
    discountPercentage: p.discount,
    image: p.image,
    link: `/product/${p.slug}`
  }));

  // آماده‌سازی بخش‌های برای رندر: ترتیب: بنر اول، دسته‌بندی دوم، بقیه (بدون محدودیت)
  const bannerSectionToRender = apiData.find((item) => item.item_type === "banner") || null;
  const staticBannerSections = apiData.filter((item) => item.item_type === "static_banner");
  const nonBannerSections = apiData.filter((item) => item.item_type !== "banner" && item.item_type !== "static_banner");

  return (
    <main className="w-full bg-[#f1f5f9] min-h-screen pb-14">

      {/* 1. بنر هیرو و پیشنهادات کناری (با تطبیق خودکار ستون‌ها در صورت خالی بودن پیشنهادات) */}
      <section className="container mx-auto px-3 sm:px-4 pt-3 sm:pt-6 pb-2">
        {bannerSectionToRender ? (
          <div>
            <div className={`grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5 ${verticalOffers.length > 0 ? "lg:h-[390px]" : ""}`}>
              <div className={`${verticalOffers.length > 0 ? "col-span-12 lg:col-span-9" : "col-span-12"} h-full`}>
                {(() => {
                  const slides: SliderItem[] = (bannerSectionToRender.banner_image || []).map((b: any) => ({
                    id: b.id,
                    image: b.banner_image || siteLogo,
                    title: "",
                    subtitle: "",
                    description: "",
                    link: b.link || "#",
                  }));
                  return slides.length > 0 ? (
                    <MainHeroSlider slides={slides} />
                  ) : (
                    <div className="w-full h-64 bg-white rounded-3xl flex items-center justify-center text-slate-400 border border-slate-100">بنری یافت نشد</div>
                  );
                })()}
              </div>
              {verticalOffers.length > 0 && (
                <div className="hidden lg:block lg:col-span-3 h-full overflow-hidden">
                  <AmazingOfferSlider offers={verticalOffers} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* نوار مزایای فروشگاه */}
      <div className="scroll-reveal">
        <TrustBadgesBar />
      </div>

      {/* ۲. پیشنهاد شگفت‌انگیز روز (در صورت موجود بودن) */}
      {shegeftAngizData.length > 0 && (
        <div className="scroll-reveal">
          <ShegeftAngizSlider products={shegeftAngizData} />
        </div>
      )}

      {/* ۳. دسته‌بندی‌های ثابت سایت */}
      <div className="scroll-reveal">
        <CategorySection categories={allCategories} />
      </div>

      {/* ۴. اسلایدرها و بنرهای ایستا (یکی در میان با چیدمان گرید متقارن) */}
      <section className="container mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-6 sm:space-y-8">
        {(() => {
          const sliders = nonBannerSections;
          const bannerGroups: ApiBanner[][] = [];
          
          // گروه‌بندی عکس‌های هر بخش static_banner
          staticBannerSections.forEach((section) => {
            if (section.banner_image && section.banner_image.length > 0) {
              bannerGroups.push(section.banner_image);
            }
          });
          
          type CombinedItem = 
            | { type: 'slider'; data: ApiSection }
            | { type: 'banner_group'; data: ApiBanner[] };

          const combined: CombinedItem[] = [];
          
          // ادغام اسلایدرها و دسته‌های بنر یکی در میان
          for (let i = 0; i < Math.max(sliders.length, bannerGroups.length); i++) {
            if (i < sliders.length) {
              combined.push({ type: 'slider', data: sliders[i] });
            }
            if (i < bannerGroups.length) {
              combined.push({ type: 'banner_group', data: bannerGroups[i] });
            }
          }
          
          let sliderCounter = 0;

          return combined.map((item, index) => {
            if (item.type === 'slider') {
              const currentThemeIndex = sliderCounter++;
              const section: ApiSection = item.data;
              
              // product -> horizontal product slider
              if (section.item_type === "product") {
                const products: NewProductItem[] = (section.products || []).map(mapApiProductToNewProduct);
                allApiProducts.push(...products);

                return (
                  <div key={`slider-${section.id}`}>
                    <NewProductsSlider
                      title={section.title || "محصولات"}
                      highlightTitle=""
                      products={products}
                      viewAllLink="/products"
                      sectionId={section.id}
                      sectionType="product"
                      themeIndex={currentThemeIndex}
                    />
                  </div>
                );
              }

              // category -> اگر شامل categories است، از آنها اسلایدر محصولات بساز
              if (section.item_type === "category") {
                const catProductsRaw = (section.categories || []).flatMap((c: any) => c.products || []);
                const products: NewProductItem[] = catProductsRaw.map(mapApiProductToNewProduct);
                allApiProducts.push(...products);

                // دریافت اولین دسته‌بندی برای category_id
                const firstCategory = section.categories?.[0];
                const categoryId = firstCategory?.id;

                return (
                  <div key={`slider-${section.id}`}>
                    <NewProductsSlider
                      title={section.title || "دسته‌بندی"}
                      highlightTitle=""
                      products={products}
                      viewAllLink="/products"
                      categoryId={categoryId}
                      sort="newest"
                      sectionId={section.id}
                      sectionType="category"
                      themeIndex={currentThemeIndex}
                    />
                  </div>
                );
              }
            }
            
            if (item.type === 'banner_group') {
              const group: ApiBanner[] = item.data;
              if (!group || group.length === 0) return null;

              // انتخاب ستون‌بندی هوشمند و واکنش‌گرا بر اساس تعداد بنرها
              let gridColsClass = "grid-cols-1";
              let heightClass = "h-[160px] sm:h-[220px] md:h-[290px]";

              if (group.length === 2) {
                gridColsClass = "grid-cols-1 md:grid-cols-2";
                heightClass = "h-[150px] sm:h-[190px] md:h-[240px]";
              } else if (group.length === 3) {
                gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
                heightClass = "h-[140px] sm:h-[180px] md:h-[220px]";
              } else if (group.length >= 4) {
                gridColsClass = "grid-cols-2 lg:grid-cols-4";
                heightClass = "h-[130px] sm:h-[160px] md:h-[190px]";
              }

              return (
                <div key={`banner-group-${index}`} className={`grid ${gridColsClass} gap-3 sm:gap-4 md:gap-5 my-3 sm:my-5 scroll-reveal`}>
                  {group.map((banner) => (
                    <Link 
                      key={`banner-${banner.id}`}
                      href={banner.link || "#"}
                      className={`block relative w-full ${heightClass} rounded-2xl sm:rounded-3xl overflow-hidden group shadow-[0_6px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.14)] transition-all duration-300 border-2 border-white/80 hover:-translate-y-1`}
                    >
                      <Image
                        src={banner.banner_image}
                        alt={banner.alt || "بنر تبلیغاتی"}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </Link>
                  ))}
                </div>
              );
            }
            
            return null;
          });
        })()}
      </section>

      {/* ۵. آخرین مقالات بلاگ */}
      <div className="scroll-reveal">
        <LatestBlogSection posts={blogPosts} />
      </div>
    </main>
  );
}