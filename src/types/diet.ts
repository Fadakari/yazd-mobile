export interface DietPlan {
  id: number;
  title: string;
  subtitle?: string;
  duration_months: number;
  price_rial: number;
  price_toman: number;
  badge?: string;
  is_vip?: boolean;
  features?: string[];
}

export type Gender = "female" | "male";

export interface DietTypeItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface DietOrderFormData {
  diet_type: string;
  gender: Gender;
  full_name: string;
  phone_number: string;
  country: string;
  height: number; // cm
  weight: number; // kg
  age: number;    // years
  plan_id: number;
  discount_code?: string;
  payment_method: "online";
}

export type BmiStatusType =
  | "underweight" // کمبود وزن
  | "normal"      // وزن نرمال
  | "overweight"  // اضافه وزن
  | "obese_1"     // چاقی درجه ۱
  | "obese_2"     // چاقی درجه ۲
  | "obese_3";    // چاقی درجه ۳ (مفرط)

export interface BmiAnalysis {
  bmi: number;
  status: BmiStatusType;
  statusText: string;             // مثلا "چاقی درجه ۱"
  obesityGrade: string;           // مثلا "چاقی کلاس ۱ (خفیف تا متوسط)"
  statusColor: string;            // رنگ مربوطه (HEX)
  badgeClass: string;             // کلاس‌های استایل تیلویند بج
  
  // وزن ایده‌آل
  idealWeightMin: number;         // حداقل وزن نرمال (کیلوگرم)
  idealWeightMax: number;         // حداکثر وزن نرمال (کیلوگرم)
  idealWeightTarget: number;      // وزن هدف دقیق (کیلوگرم)
  
  // تفاوت وزن
  weightDifference: number;       // اختلاف تا وزن هدف (کیلوگرم)
  differenceText: string;         // متن توصیفی اختلاف وزن
  differenceType: "excess" | "deficit" | "ideal"; // اضافه وزن / کمبود وزن / ایده‌آل
  
  // وضعیت بدنی تکمیلی
  bmr: number;                    // متابولیسم پایه (کالری مصرفی در استراحت)
  tdee: number;                   // کالری تخمینی روزانه با فعالیت معمولی
  bodyFatPercentage: number;      // تخمین درصد چربی بدن
  bodyFatCategory: string;        // دسته چربی (ورزشکاری / فیت / متوسط / بالا)
  healthRiskLevel: string;        // سطح خطر بیماری‌های متابولیک
  healthRiskColor: string;        // رنگ نشانگر سطح خطر
  estimatedWeeksToGoal: number;   // تخمین هفته‌های رسیدن به هدف
  
  // توصیه‌ها و تحلیل
  recommendationTitle: string;    // عنوان پیشنهاد تخصصی
  recommendationText: string;     // توضیحات کارشناسی
  suggestedDietType: string;      // نوع رژیم پیشنهادی
  suggestedDietName: string;      // نام فارسی رژیم پیشنهادی
}
