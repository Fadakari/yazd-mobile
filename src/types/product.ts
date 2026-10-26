export interface ProductSpecifications {
  weight?: string | number | null; // وزن
  dimensions?: string | null; // ابعاد
  package_count?: string | number | null; // تعداد در بسته
  size?: string | null; // سایز
  consumption_age?: string | null; // سن مصرف
  manufacturer?: string | null; // شرکت سازنده
  health_code?: string | null; // کد بهداشتی (IRC)
  country?: string | null; // کشور سازنده
  suitable_for?: string | null; // مناسب برای
  product_type?: string | null; // نوع محصول
  container_type?: string | null; // نوع محفظه
}

export interface NewProductDetails {
  expiration_date?: string | null; // تاریخ انقضا
  specifications: ProductSpecifications; // مشخصات
  additional_description?: string | null; // توضیحات تکمیلی (WYSIWYG)
  usage_method?: string | null; // روش مصرف (WYSIWYG)
  consumption_warning?: string | null; // هشدار مصرف (WYSIWYG)
  indications?: string | null; // موارد مصرف (WYSIWYG)
  storage_conditions?: string | null; // شرایط نگهداری (WYSIWYG)
  ingredients?: string | null; // ترکیبات (WYSIWYG)
}

export default interface ProductType {
  quantity: number;
  id: number;
  name: string;
  price: number;
  cover_image: string;
  description_1: string;
  description_2: string;
  category: string;
  brand?: {
    id: number;
    name: string;
    slug: string;
  };
  stock: number;
  discountPercent?: number;
  slug: string;
  pdfs?: string[];
  images: image[];
  is_available: boolean;
  discount_percentage?: number;
  final_price?: number | null | undefined;
  unit_price?: number;
  isDiscounted?: boolean;
  delivery_price: number;
  color: ProductColor[];
  material: ProductMaterial[];
  discount_price?: null | number;

  // فیلدهای مدل جدید توضیحات داروخانه‌ای / تخصصی
  expiration_date?: string | null;
  expire_date?: string | null;
  expiry_date?: string | null;
  details?: NewProductDetails | any;
  product_details?: NewProductDetails | any;
  specifications?: ProductSpecifications | any;
  additional_description?: string | null;
  usage_method?: string | null;
  consumption_warning?: string | null;
  indications?: string | null;
  storage_conditions?: string | null;
  ingredients?: string | null;
  weight?: string | number | null;
  dimensions?: string | null;
  package_count?: string | number | null;
  size?: string | null;
  consumption_age?: string | null;
  manufacturer?: string | null;
  health_code?: string | null;
  country?: string | null;
  suitable_for?: string | null;
  product_type?: string | null;
  container_type?: string | null;
}

export interface ProductColor {
  id: number;
  product: number;
  color_name: string;
  color_code: string;
  price: number;
  stock: number;
  image: string | null;
  image_url: string | null;
}

export interface ProductMaterial {
  id: number;
  product: number;
  material_name: string;
  price: number;
  stock: number;
}

interface image {
  order: number;
  id: string;
  image: string;
}
