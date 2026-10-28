import type { NewProductDetails, ProductSpecifications } from "@/types/product";
/**
 * فرمت‌دهی هوشمند و استاندارد تاریخ انقضا (برای حل مشکل برعکس نمایش داده شدن)
 * ورودی‌هایی مانند 14/10/1404 را به فرمت استاندارد 1404/10/14 تبدیل می‌کند.
 */
export function formatExpirationDate(dateStr: string | null | undefined): string {
  if (!dateStr || typeof dateStr !== "string") return "";

  const trimmed = dateStr.trim();
  if (!trimmed) return "";

  // تبدیل ارقام فارسی به انگلیسی
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishStr = trimmed.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d).toString());

  // جدا کردن بخش‌ها بر اساس اسلش، خط تیره یا نقطه
  const parts = englishStr.split(/[/.-]/).map((p) => p.trim()).filter(Boolean);

  if (parts.length === 3) {
    // اگر بخش آخر ۴ رقمی است (مانند روز/ماه/سال: 14/10/1404) -> به سال/ماه/روز تبدیل شود
    if (parts[2].length === 4) {
      return `${parts[2]}/${parts[1].padStart(2, "0")}/${parts[0].padStart(2, "0")}`;
    }
    // اگر بخش اول ۴ رقمی است (مانند سال/ماه/روز: 1404/10/14) -> ترتیب استاندارد حفظ شود
    if (parts[0].length === 4) {
      return `${parts[0]}/${parts[1].padStart(2, "0")}/${parts[2].padStart(2, "0")}`;
    }
  }

  if (parts.length === 2) {
    if (parts[1].length === 4) {
      return `${parts[1]}/${parts[0].padStart(2, "0")}`;
    }
    if (parts[0].length === 4) {
      return `${parts[0]}/${parts[1].padStart(2, "0")}`;
    }
  }

  return trimmed;
}


/**
 * تابعی هوشمند برای تشخیص و استخراج اطلاعات مدل جدید توضیحات محصول
 * از بین تمام ساختارهای متداول ارسال دیتا توسط بک‌اند جنگو (آبجکت تودرتو یا فیلدهای مستقیم).
 * اگر هیچ دیتایی از مدل جدید وجود نداشته باشد، مقدار null برمی‌گرداند تا سیستم به صورت خودکار
 * به مدل قدیمی (توضیحات قبلی و نظرات) سوئیچ کند.
 */
export function extractNewProductDetails(product: any): NewProductDetails | null {
  if (!product || typeof product !== "object") return null;

  // بررسی آبجکت‌های تودرتوی احتمالی که بک‌اند ممکن است ایجاد کند
  const rawDetails =
    product.details ||
    product.product_details ||
    product.specifications ||
    product.pharmacy_details ||
    product.medical_details ||
    product.extra_details ||
    product.extra_info ||
    product.drug_info ||
    product.info ||
    product.new_description ||
    product.description_model ||
    {};

  // تابع کمکی برای استخراج فیلد با در نظر گرفتن تمام نام‌گذاری‌های متداول انگلیسی و فارسی
  const getField = (...keys: string[]): any => {
    for (const key of keys) {
      if (
        rawDetails[key] !== undefined &&
        rawDetails[key] !== null &&
        String(rawDetails[key]).trim() !== ""
      ) {
        return rawDetails[key];
      }
      if (
        product[key] !== undefined &&
        product[key] !== null &&
        String(product[key]).trim() !== ""
      ) {
        return product[key];
      }
    }
    return null;
  };

  // ۱. تاریخ انقضا
  const raw_expiration_date = getField(
    "expiration_date",
    "expire_date",
    "expiry_date",
    "exp_date",
    "expiration",
    "tarikh_engheza"
  );
  const expiration_date = formatExpirationDate(raw_expiration_date);

  // ۲. بخش مشخصات
  const specifications: ProductSpecifications = {
    weight: getField("weight", "vazn", "product_weight"),
    dimensions: getField("dimensions", "dimension", "abaad", "product_dimensions"),
    package_count: getField(
      "package_count",
      "count_in_pack",
      "count_in_package",
      "quantity_in_pack",
      "pack_count",
      "tedad_dar_baste"
    ),
    size: getField("size", "product_size"),
    consumption_age: getField(
      "consumption_age",
      "suitable_age",
      "age_group",
      "age_range",
      "age_of_use",
      "sen_masraf"
    ),
    manufacturer: getField(
      "manufacturer",
      "company",
      "manufacturer_company",
      "producer",
      "sherkat_sazandeh"
    ),
    health_code: getField(
      "health_code",
      "irc",
      "irc_code",
      "license_code",
      "permit_code",
      "sanitary_code",
      "code_behdashti"
    ),
    country: getField(
      "country",
      "country_of_origin",
      "manufacturing_country",
      "made_in",
      "keshvar_sazandeh"
    ),
    suitable_for: getField(
      "suitable_for",
      "target_audience",
      "suitable_to",
      "for_who",
      "monaseb_baraye"
    ),
    product_type: getField("product_type", "type", "form", "noe_mahsoul"),
    container_type: getField("container_type", "enclosure_type", "package_type", "noe_mahfazeh"),
  };

  // ۳. بخش‌های متنی WYSIWYG
  const additional_description = getField(
    "additional_description",
    "extra_description",
    "supplementary_description",
    "full_description",
    "tozihat_takmili"
  );
  const usage_method = getField(
    "usage_method",
    "how_to_use",
    "consumption_method",
    "direction_of_use",
    "dosage",
    "ravesh_masraf"
  );
  const consumption_warning = getField(
    "consumption_warning",
    "warning",
    "warnings",
    "cautions",
    "precaution",
    "hoshdar_masraf"
  );
  const indications = getField(
    "indications",
    "uses",
    "consumption_cases",
    "indications_of_use",
    "mavared_masraf"
  );
  const storage_conditions = getField(
    "storage_conditions",
    "storage",
    "maintenance",
    "preservation_conditions",
    "sharaye_negahdari"
  );
  const ingredients = getField(
    "ingredients",
    "compounds",
    "composition",
    "formulation",
    "tarkibat"
  );

  // بررسی اینکه آیا مشخصاتی وارد شده است
  const hasSpecs = Object.values(specifications).some(
    (val) => val !== null && val !== undefined && String(val).trim() !== ""
  );

  // بررسی اینکه آیا حتی یکی از فیلدهای متنی ۶ گانه مقدار دارد
  const hasWysiwyg = [
    additional_description,
    usage_method,
    consumption_warning,
    indications,
    storage_conditions,
    ingredients,
  ].some((val) => val !== null && val !== undefined && String(val).trim() !== "");

  // اگر هیچ اطلاعاتی از مدل جدید وجود نداشت، null برگردان تا مدل قبلی نمایش داده شود
  if (!hasSpecs && !hasWysiwyg && !expiration_date) {
    return null;
  }

  return {
    expiration_date,
    specifications,
    additional_description,
    usage_method,
    consumption_warning,
    indications,
    storage_conditions,
    ingredients,
  };
}
