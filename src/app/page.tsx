import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MainHeroSlider, { SliderItem } from "@/components/MainHeroSlider";
import AmazingOfferSlider, { OfferProduct } from "@/components/AmazingOfferSlider";
import CategorySection, { CategoryItem } from "@/components/CategorySection";
import ShegeftAngizSlider, { ProductCardType } from "@/components/ShegeftAngizSlider";
import LatestBlogSection, { BlogPostItem } from "@/components/LatestBlogSection";
import NewProductsSlider, { NewProductItem } from "@/components/NewProductsSlider";
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
      "https://api.abajstore.ir/home/sliders-index/",
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
    const res = await fetch("https://api.abajstore.ir/blog/posts/", { 
        
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
    const res = await fetch("https://api.abajstore.ir/home/active-logo/", { 
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
  const mapApiProductToNewProduct = (p: any): NewProductItem => {
    let discountPrice = p.discount_price ?? p.price;
    if (discountPrice == 0) {
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
      image: p.cover_image || siteLogo,
      isSpecial: p.is_featured,
      slug: p.slug,
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
    <main className="w-full bg-[#f9f9f9] min-h-screen pb-10">

      {/* 1. بنر (اول، بدون عنوان پایینی) */}
      <section className="container mx-auto px-4 py-6">
        {bannerSectionToRender ? (
          <div>
            <div className="grid grid-cols-12 gap-4 lg:h-[350px]">
              <div className="col-span-12 lg:col-span-9 h-[300px] md:h-[420px] lg:h-full">
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
                    <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">بنری یافت نشد</div>
                  );
                })()}
              </div>
              <div className="hidden lg:block lg:col-span-3 h-full overflow-hidden">
                {verticalOffers.length > 0 && <AmazingOfferSlider offers={verticalOffers} />}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* 2. دسته‌بندی‌های ثابت سایت */}
      <CategorySection categories={allCategories} />

      {/* 3. اسلایدرها و بنرهای ایستا (یکی در میون) */}
      <section className="container mx-auto px-4 py-6 space-y-8">
        {(() => {
          const sliders = nonBannerSections;
          const banners: ApiBanner[] = []; // هر عکس بنر جداگانه
          
          // تمام عکس‌های تمام static_banner ها را جمع کن
          staticBannerSections.forEach((section) => {
            if (section.banner_image && section.banner_image.length > 0) {
              banners.push(...section.banner_image);
            }
          });
          
          const combined = [];
          
          // ادغام اسلایدرها و بنرها یکی در میان
          for (let i = 0; i < Math.max(sliders.length, banners.length); i++) {
            if (i < sliders.length) {
              combined.push({ type: 'slider', data: sliders[i] });
            }
            if (i < banners.length) {
              combined.push({ type: 'banner', data: banners[i] });
            }
          }
          
          return combined.map((item, index) => {
            if (item.type === 'slider') {
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
                    />
                  </div>
                );
              }
            }
            
            if (item.type === 'banner') {
              const banner: ApiBanner = item.data;
              return (
                <div key={`banner-${banner.id}`}>
                  <Link 
                    href={banner.link || "#"}
                    className="block relative w-full h-[200px] md:h-[300px] rounded-[20px] overflow-hidden group"
                  >
                    <Image
                      src={banner.banner_image}
                      alt={banner.alt || "بنر"}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </Link>
                </div>
              );
            }
            
            return null;
          });
        })()}
      </section>
      

      {/* شگفت‌انگیز */}
      {shegeftAngizData.length > 0 && <ShegeftAngizSlider products={shegeftAngizData} />}

      {/* بلاگ */}
      <LatestBlogSection posts={blogPosts} />
    </main>
  );
}