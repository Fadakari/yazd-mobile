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

export interface BmiAnalysis {
  bmi: number;
  status: "underweight" | "normal" | "overweight" | "obese";
  statusText: string;
  statusColor: string;
  idealWeightMin: number;
  idealWeightMax: number;
  weightDifference: number; // positive = needs to lose, negative = needs to gain
}
