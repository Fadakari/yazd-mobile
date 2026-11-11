import AkhoondiHomeExperience from "@/components/AkhoondiHomeExperience";
import { GetShopCategoriesTreeList } from "@/services/shopActions";

export const revalidate = 30;

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
interface ApiSection {
  id: number;
  title: string;
  item_type: "category" | "product" | "banner" | "static_banner";
  products: ApiProduct[];
  banner_image: ApiBanner[];
  categories: Array<{ id: number; name: string; products?: ApiProduct[] }>;
}
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
}

async function getHomeData(): Promise<ApiSection[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/sliders-index/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch home data");
    return res.json();
  } catch (error) {
    console.error("Home Data Error:", error);
    return [];
  }
}

async function getLatestArticles(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      excerpt: item.description || item.excerpt || "",
      image: item.image || item.cover || item.thumbnail || "",
      date: item.created_at_shamsi || "",
      slug: item.slug,
    }));
  } catch {
    return [];
  }
}

async function getActiveLogo(): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/active-logo/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return "/logo.png";
    const data = await res.json();
    const active = Array.isArray(data) ? data[0] : data;
    return active?.image || "/logo.png";
  } catch {
    return "/logo.png";
  }
}

export default async function Home() {
  const [apiData, fetchedBlogs, categoriesTree, siteLogo] = await Promise.all([
    getHomeData(),
    getLatestArticles(),
    GetShopCategoriesTreeList(),
    getActiveLogo(),
  ]);

  const categoriesArray = Array.isArray(categoriesTree)
    ? categoriesTree
    : categoriesTree?.data || categoriesTree?.results || [];

  const categories = categoriesArray.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image || cat.icon || siteLogo,
    link: `/products?category_id=${cat.id}`,
  }));

  const mapProduct = (p: ApiProduct) => {
    const discounted = p.discount_price > 0 && p.discount_price < p.price
      ? p.discount_price
      : p.price;
    return {
      id: p.id,
      title: p.name,
      slug: p.slug,
      image: p.cover_image || siteLogo,
      price: discounted,
      oldPrice: discounted < p.price ? p.price : undefined,
      discount: discounted < p.price && p.price > 0
        ? Math.round(((p.price - discounted) / p.price) * 100)
        : undefined,
      isFeatured: p.is_featured,
    };
  };

  const banners = apiData
    .filter((section) => section.item_type === "banner" || section.item_type === "static_banner")
    .flatMap((section) => section.banner_image || [])
    .filter((banner) => Boolean(banner.banner_image))
    .map((banner) => ({
      id: banner.id,
      image: banner.banner_image,
      alt: banner.alt || "",
      link: banner.link || "/products",
    }));

  const sections = apiData
    .filter((section) => section.item_type === "product" || section.item_type === "category")
    .map((section) => {
      const rawProducts = section.item_type === "product"
        ? section.products || []
        : (section.categories || []).flatMap((category) => category.products || []);
      return {
        id: section.id,
        title: section.title || (section.item_type === "category" ? "دسته‌بندی منتخب" : "محصولات"),
        type: section.item_type,
        products: rawProducts.map(mapProduct),
      };
    })
    .filter((section) => section.products.length > 0);

  const blogs = fetchedBlogs.map((post) => ({
    ...post,
    image: post.image || siteLogo,
  }));

  return (
    <AkhoondiHomeExperience
      logo={siteLogo}
      banners={banners}
      categories={categories}
      sections={sections}
      blogs={blogs}
    />
  );
}
