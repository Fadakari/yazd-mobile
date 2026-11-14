"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiCheck,
  FiChevronLeft,
  FiPercent,
  FiCreditCard,
  FiLock,
  FiActivity,
  FiAlertCircle,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import {
  FaFemale,
  FaMale,
  FaFire,
  FaClock,
  FaBalanceScale,
  FaRunning,
  FaHeartbeat,
  FaBaby,
  FaStar,
} from "react-icons/fa";
import { GiMuscleUp, GiAvocado, GiWeightScale } from "react-icons/gi";
import { MdOutlinePregnantWoman } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { addToast } from "@heroui/toast";

import { useUser } from "@/context/UserContext";
import {
  getDietPlans,
  submitDietOrder,
  checkDietDiscount,
} from "@/services/dietActions";
import { DietPlan, Gender, BmiAnalysis } from "@/types/diet";

// --- انواع رژیم غذایی مطابق پی‌دی‌اف ---
const DIET_TYPES = [
  {
    id: "shock",
    title: "رژیم شوک",
    description: "شکستن استپ وزنی و تسریع سوخت‌وساز بدن",
    icon: FaFire,
    badge: "فوری",
    color: "#ff5722",
  },
  {
    id: "fasting",
    title: "فست مد",
    description: "روزه متناوب مدرن برای چربی‌سوزی هوشمند",
    icon: FaClock,
    badge: "محبوب",
    color: "#0bb2c9",
  },
  {
    id: "keto_plus",
    title: "کتوپلاس",
    description: "کتوژنیک سلامت با کربوهیدرات کنترل‌شده",
    icon: GiAvocado,
    badge: "تخصصی",
    color: "#10b981",
  },
  {
    id: "weight_loss",
    title: "رژیم کاهش وزن",
    description: "کاهش اصولی وزن با سفره معمولی خانواده",
    icon: GiWeightScale,
    badge: "پرتکرار",
    color: "#3b82f6",
  },
  {
    id: "weight_gain",
    title: "رژیم افزایش وزن",
    description: "افزایش وزن ایمن و حجم‌گیری عضلانی",
    icon: GiMuscleUp,
    badge: "عضله‌ساز",
    color: "#8b5cf6",
  },
  {
    id: "maintenance",
    title: "تثبیت",
    description: "تثبیت پایدار وزن پس از رسیدن به وزن ایده‌آل",
    icon: FaBalanceScale,
    badge: "ماندگار",
    color: "#06b6d4",
  },
  {
    id: "kids_teens",
    title: "کودک و نوجوان",
    description: "تغذیه اصولی رشد قد و وزن متناسب سن",
    icon: FaBaby,
    badge: "رشد",
    color: "#ec4899",
  },
  {
    id: "athlete",
    title: "ورزشکار حرفه‌ای",
    description: "بهینه‌سازی انرژی، ریکاوری و درصد چربی",
    icon: FaRunning,
    badge: "حرفه‌ای",
    color: "#f59e0b",
  },
  {
    id: "lactation",
    title: "شیرده",
    description: "کاهش وزن ایمن بدون کاهش کیفیت شیر مادر",
    icon: FaHeartbeat,
    badge: "مادران",
    color: "#f43f5e",
  },
  {
    id: "pregnancy",
    title: "باردار",
    description: "تغذیه سلامت دوران بارداری تحت نظر کارشناس",
    icon: MdOutlinePregnantWoman,
    badge: "مراقبت",
    color: "#a855f7",
  },
];

const COUNTRIES = [
  "ایران",
  "ترکیه",
  "امارات",
  "آلمان",
  "کانادا",
  "انگلستان",
  "استرالیا",
  "سایر کشورها",
];

export default function DietPlanPage() {
  const router = useRouter();
  const { user } = useUser();

  // --- وضعیت‌های فرم ---
  const [dietType, setDietType] = useState<string>("weight_loss");
  const [gender, setGender] = useState<Gender>("female");
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [country, setCountry] = useState<string>("ایران");

  // مقادیر فیزیکی
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(75);
  const [age, setAge] = useState<number>(28);

  // آنالیز BMI
  const [bmiResult, setBmiResult] = useState<BmiAnalysis | null>(null);

  // پلن‌های داینامیک سرور (بدون دیتای فیک)
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // تخفیف
  const [discountCode, setDiscountCode] = useState<string>("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState<boolean>(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    percentage: number;
  } | null>(null);

  // ارسال فرم
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // بارگذاری پلن‌های رژیم از بک‌اند
  useEffect(() => {
    async function loadPlans() {
      setIsLoadingPlans(true);
      try {
        const remotePlans = await getDietPlans();
        if (remotePlans && remotePlans.length > 0) {
          setPlans(remotePlans);
          setSelectedPlanId(remotePlans[0].id);
        } else {
          setPlans([]);
          setSelectedPlanId(null);
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
        setPlans([]);
        setSelectedPlanId(null);
      } finally {
        setIsLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  // پر کردن خودکار مشخصات کاربر لاگین شده
  useEffect(() => {
    if (user?.identity) {
      if (user.identity.first_name && user.identity.last_name) {
        setFullName(`${user.identity.first_name} ${user.identity.last_name}`);
      }
      if (user.identity.phone_number) {
        setPhoneNumber(user.identity.phone_number);
      }
    }
  }, [user]);

  // پلن انتخاب شده فعلی
  const selectedPlan = useMemo(() => {
    if (!selectedPlanId) return null;
    return plans.find((p) => p.id === selectedPlanId) || null;
  }, [plans, selectedPlanId]);

  // محاسبه مبالغ
  const finalPriceToman = useMemo(() => {
    if (!selectedPlan) return 0;
    const base = selectedPlan.price_toman;
    if (appliedDiscount) {
      return Math.max(0, base - appliedDiscount.amount);
    }
    return base;
  }, [selectedPlan, appliedDiscount]);

  const finalPriceRial = useMemo(() => {
    if (!selectedPlan) return 0;
    return finalPriceToman * 10;
  }, [selectedPlan, finalPriceToman]);

  // محاسبه BMI و وزن ایده‌آل
  const calculateBmi = () => {
    if (!height || !weight) return;
    const heightInMeters = height / 100;
    const bmiVal = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

    let status: BmiAnalysis["status"] = "normal";
    let statusText = "وزن طبیعی و ایده‌آل";
    let statusColor = "#10b981"; // سبز

    if (bmiVal < 18.5) {
      status = "underweight";
      statusText = "کمبود وزن";
      statusColor = "#3b82f6"; // آبی
    } else if (bmiVal >= 25 && bmiVal < 30) {
      status = "overweight";
      statusText = "اضافه وزن";
      statusColor = "#f59e0b"; // نارنجی
    } else if (bmiVal >= 30) {
      status = "obese";
      statusText = "چاقی و اضافه وزن مفرط";
      statusColor = "#ef4444"; // قرمز
    }

    const idealWeightMin = Math.round(18.5 * heightInMeters * heightInMeters);
    const idealWeightMax = Math.round(24.9 * heightInMeters * heightInMeters);
    const idealWeightMid = Math.round((idealWeightMin + idealWeightMax) / 2);
    const weightDiff = weight - idealWeightMid;

    setBmiResult({
      bmi: bmiVal,
      status,
      statusText,
      statusColor,
      idealWeightMin,
      idealWeightMax,
      weightDifference: weightDiff,
    });
  };

  // اعمال کد تخفیف
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      addToast({
        title: "کد تخفیف خالی است",
        description: "لطفاً کد تخفیف خود را وارد کنید.",
        color: "warning",
      });
      return;
    }

    if (!selectedPlan) {
      addToast({
        title: "پلن انتخاب نشده است",
        description: "لطفاً ابتدا یک پلن رژیم انتخاب نمایید.",
        color: "warning",
      });
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const res = await checkDietDiscount(discountCode, selectedPlan.price_toman);
      if (res) {
        const discountAmt = res.discount_amount || (res.discount_percentage ? Math.round(selectedPlan.price_toman * (res.discount_percentage / 100)) : 0);
        setAppliedDiscount({
          code: discountCode.trim(),
          amount: discountAmt,
          percentage: res.discount_percentage || 0,
        });
        addToast({
          title: "کد تخفیف اعمال شد",
          description: res.message || "تخفیف با موفقیت بر روی فاکتور شما لحاظ شد.",
          color: "success",
        });
      }
    } catch (err: any) {
      addToast({
        title: "خطا در کد تخفیف",
        description: err.message || "کد تخفیف نامعتبر است.",
        color: "danger",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // ثبت نهایی و اتصال به درگاه
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      addToast({
        title: "عدم فعال بودن پلن‌ها",
        description: "در حال حاضر پلن فعالی توسط سرور برای خرید ارائه نشده است.",
        color: "warning",
      });
      return;
    }

    if (!fullName.trim()) {
      addToast({
        title: "نام و نام خانوادگی الزامی است",
        description: "لطفاً نام و نام خانوادگی خود را وارد کنید.",
        color: "danger",
      });
      return;
    }

    if (!phoneNumber.trim() || !/^(\+98|0)?9\d{9}$/.test(phoneNumber.replace(/\s+/g, ""))) {
      addToast({
        title: "شماره همراه نامعتبر است",
        description: "لطفاً یک شماره تلفن همراه معتبر ۱۱ رقمی وارد کنید.",
        color: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        diet_type: dietType,
        gender,
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        country,
        height,
        weight,
        age,
        plan_id: selectedPlan.id,
        discount_code: appliedDiscount?.code,
        payment_method: "online" as const,
      };

      const result = await submitDietOrder(payload);

      const redirectUrl =
        result.gateway_url ||
        result.redirect_url ||
        result.payment_url ||
        result.url ||
        result.data?.gateway_url ||
        result.data?.redirect_url ||
        result.data?.payment_url;

      if (redirectUrl) {
        if (typeof redirectUrl === "string" && redirectUrl.startsWith("http")) {
          window.location.href = redirectUrl;
        } else if (typeof redirectUrl === "string") {
          router.push(redirectUrl);
        }
      } else {
        addToast({
          title: "وضعیت سرور",
          description: result.message || "اطلاعات ثبت شد.",
          color: "primary",
        });
      }
    } catch (err: any) {
      addToast({
        title: "عدم برقراری ارتباط با سرور",
        description: err.message || "امکان اتصال به درگاه پرداخت در حال حاضر وجود ندارد.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] pb-24 font-sans text-gray-800 dir-rtl">
      {/* --- ۱. سربرگ و مسیر ناوبری --- */}
      <div className="w-full bg-gradient-to-b from-gray-50/80 to-transparent border-b border-gray-100 py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#12465a] transition-colors">
              صفحه اصلی
            </Link>
            <FiChevronLeft className="text-xs" />
            <span className="text-[#12465a]">دریافت رژیم غذایی آنلاین</span>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black text-[#12465a] mb-4 tracking-tight">
              دریافت برنامه
            </h1>
            <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-6">
              بهترین روش برای رسیدن به وزن ایده‌آل، داشتن یک رژیم غذایی بدون دردسر هست.
            </p>

            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col gap-2.5 text-right text-xs md:text-sm text-gray-700">
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-black text-base">✔</span>
                <span>کلیه غذاهای رژیم شما، غذای خانواده است.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-black text-base">✔</span>
                <span>
                  در این بخش، متخصصین ما با توجه به جزیی‌ترین اطلاعاتی که از وضعیت خود به ما می‌دهید،
                  رژیم غذایی اختصاصی شما را به صورت آنلاین در اختیارتان قرار می‌دهند.
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1 text-xs font-bold text-gray-500">
              <span>کافیه اطلاعات خود را وارد کنید و مراحل را انجام دهید</span>
              <span className="text-lg animate-bounce">⬇️</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 max-w-5xl mt-10 flex flex-col gap-14">
        {/* --- ۲. انتخاب نوع رژیم --- */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#12465a] mb-2">نوع رژیم</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              لطفاً نوع رژیم خود را بر اساس هدف سلامتی انتخاب کنید
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 md:gap-4">
            {DIET_TYPES.map((dt) => {
              const IconComp = dt.icon;
              const isSelected = dietType === dt.id;

              return (
                <button
                  type="button"
                  key={dt.id}
                  onClick={() => setDietType(dt.id)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 text-center group cursor-pointer ${
                    isSelected
                      ? "border-[#12465a] bg-[#12465a]/5 shadow-md shadow-[#12465a]/10 scale-[1.02]"
                      : "border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-xs"
                  }`}
                >
                  {/* بج گوشه */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#12465a] text-white flex items-center justify-center shadow-xs">
                      <FiCheck className="size-3 stroke-[3]" />
                    </div>
                  )}

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${
                      isSelected ? "bg-white shadow-sm" : "bg-white/80"
                    }`}
                    style={{ color: dt.color }}
                  >
                    <IconComp className="text-2xl" />
                  </div>

                  <span
                    className={`text-xs md:text-sm font-black mb-1 transition-colors ${
                      isSelected ? "text-[#12465a]" : "text-gray-800"
                    }`}
                  >
                    {dt.title}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                    {dt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* --- ۳. مشخصات فردی و ابعاد بدنی --- */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#12465a] mb-2">مشخصات فردی</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              لطفاً مشخصات فردی خود را به درستی مشخص کنید
            </p>
          </div>

          {/* انتخاب جنسیت با کاراکتر */}
          <div className="flex items-center justify-center gap-6 md:gap-12 mb-10">
            {/* خانم */}
            <div
              onClick={() => setGender("female")}
              className={`flex flex-col items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all duration-300 ${
                gender === "female"
                  ? "bg-pink-50/80 ring-2 ring-pink-500 shadow-sm scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-md">
                <FaFemale className="text-5xl" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-black text-sm text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="accent-pink-600 size-4"
                />
                <span>خانم هستم</span>
              </label>
            </div>

            {/* آقا */}
            <div
              onClick={() => setGender("male")}
              className={`flex flex-col items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all duration-300 ${
                gender === "male"
                  ? "bg-blue-50/80 ring-2 ring-[#12465a] shadow-sm scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#12465a] to-[#0bb2c9] flex items-center justify-center text-white shadow-md">
                <FaMale className="text-5xl" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-black text-sm text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="accent-[#12465a] size-4"
                />
                <span>آقا هستم</span>
              </label>
            </div>
          </div>

          {/* فیلدهای متنی (نام، شماره تماس، کشور) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                نام و نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: علی رضایی"
                required
                className="w-full h-13 px-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#12465a] outline-none text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                شماره همراه <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09123456789"
                dir="ltr"
                required
                className="w-full h-13 px-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#12465a] outline-none text-sm font-medium transition-all text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                کشور <span className="text-red-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-13 px-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#12465a] outline-none text-sm font-medium transition-all"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* اسلایدرها و اندازه‌گیری قد، وزن و سن */}
          <div className="flex flex-col gap-8 bg-gray-50/70 p-6 md:p-8 rounded-3xl border border-gray-100">
            {/* قد */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-gray-700">قد (سانتی‌متر)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHeight((h) => Math.max(100, h - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus className="size-3" />
                  </button>
                  <span className="text-xl font-black text-[#12465a] min-w-16 text-center">
                    {height} <span className="text-xs font-normal text-gray-500">cm</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setHeight((h) => Math.min(230, h + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus className="size-3" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="100"
                max="230"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-[#12465a] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
                <span>100</span>
                <span>150</span>
                <span>175</span>
                <span>200</span>
                <span>230</span>
              </div>
            </div>

            {/* وزن */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-gray-700">وزن (کیلوگرم)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWeight((w) => Math.max(30, w - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus className="size-3" />
                  </button>
                  <span className="text-xl font-black text-[#12465a] min-w-16 text-center">
                    {weight} <span className="text-xs font-normal text-gray-500">kg</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setWeight((w) => Math.min(220, w + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus className="size-3" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-[#0bb2c9] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
                <span>30</span>
                <span>65</span>
                <span>90</span>
                <span>130</span>
                <span>220</span>
              </div>
            </div>

            {/* سن */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-gray-700">سن (سال)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAge((a) => Math.max(10, a - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus className="size-3" />
                  </button>
                  <span className="text-xl font-black text-[#12465a] min-w-16 text-center">
                    {age} <span className="text-xs font-normal text-gray-500">سال</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAge((a) => Math.min(95, a + 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus className="size-3" />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-[#12465a] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
                <span>10</span>
                <span>25</span>
                <span>45</span>
                <span>65</span>
                <span>95</span>
              </div>
            </div>

            {/* دکمه محاسبه کن */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={calculateBmi}
                className="flex items-center gap-2 bg-[#12465a] hover:bg-[#0bb2c9] text-white px-8 py-3 rounded-full font-bold text-sm shadow-md transition-all duration-300 active:scale-95"
              >
                <FiActivity className="size-4" />
                <span>محاسبه کن</span>
              </button>
            </div>

            {/* کارت نتیجه آنالیز BMI */}
            {bmiResult && (
              <div className="mt-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-down">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-inner"
                    style={{ backgroundColor: bmiResult.statusColor }}
                  >
                    <span className="text-xs">BMI</span>
                    <span className="text-lg leading-tight">{bmiResult.bmi}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">وضعیت بدنی شما:</span>
                      <span
                        className="text-sm font-black"
                        style={{ color: bmiResult.statusColor }}
                      >
                        {bmiResult.statusText}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      محدوده وزن ایده‌آل برای قد شما بین{" "}
                      <span className="font-bold text-[#12465a]">
                        {bmiResult.idealWeightMin} تا {bmiResult.idealWeightMax}
                      </span>{" "}
                      کیلوگرم است.
                    </p>
                  </div>
                </div>

                <div className="text-left text-xs bg-gray-50 py-2.5 px-4 rounded-xl border border-gray-100">
                  {bmiResult.weightDifference > 0 ? (
                    <span className="text-amber-600 font-bold">
                      پیشنهاد کاهش: حدود {bmiResult.weightDifference} کیلوگرم
                    </span>
                  ) : bmiResult.weightDifference < 0 ? (
                    <span className="text-blue-600 font-bold">
                      پیشنهاد افزایش: حدود {Math.abs(bmiResult.weightDifference)} کیلوگرم
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold">
                      تبریک! شما در وزن ایده‌آل قرار دارید
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- ۴. انتخاب برنامه سلامتی (پلن‌ها از بک‌اند) --- */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#12465a] mb-2">برنامه‌های سلامتی</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              لطفاً برنامه مورد نظر خود را بر اساس دوره و اهداف انتخاب کنید
            </p>
          </div>

          {isLoadingPlans ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-3xl bg-gray-100 animate-pulse border border-gray-200"
                />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="p-8 md:p-12 text-center bg-gray-50/80 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3">
              <FiAlertCircle className="size-9 text-amber-500" />
              <p className="text-sm font-bold text-gray-700">
                پلن‌های رژیم غذایی در حال حاضر در حال پیکربندی توسط سرور می‌باشند.
              </p>
              <p className="text-xs text-gray-500">
                به محض تعریف و فعال‌سازی پلن‌ها در پنل مدیریت، این بخش به صورت خودکار فعال خواهد شد.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative flex flex-col justify-between p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "border-[#12465a] bg-gradient-to-b from-[#12465a]/5 to-transparent shadow-lg shadow-[#12465a]/10 scale-[1.02]"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs"
                      }`}
                    >
                      {/* بج VIP */}
                      {plan.is_vip && (
                        <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-900 text-[10px] font-black px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                          <FaStar className="size-3 text-stone-900" />
                          <span>پکیج طلایی VIP</span>
                        </div>
                      )}

                      <div>
                        {/* نشانگر دوره */}
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                              plan.is_vip
                                ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-900"
                                : isSelected
                                ? "bg-[#12465a] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {plan.badge || plan.duration_months}
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "border-[#12465a] bg-[#12465a]" : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && <FiCheck className="size-3 text-white stroke-[3]" />}
                          </div>
                        </div>

                        <h3 className="text-base font-black text-gray-800 mb-1.5 line-clamp-1">
                          {plan.title}
                        </h3>
                        {plan.subtitle && (
                          <p className="text-xs text-gray-500 line-clamp-2 min-h-8 mb-4">
                            {plan.subtitle}
                          </p>
                        )}

                        {/* ویژگی‌های پلن */}
                        {plan.features && plan.features.length > 0 && (
                          <ul className="flex flex-col gap-2 mb-6 border-t border-gray-100 pt-3">
                            {plan.features.slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                                <span className="text-[#0bb2c9] text-xs font-bold">✦</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* قیمت به ریال و تومان */}
                      <div className="pt-4 border-t border-gray-100 text-center">
                        <div className="text-xl font-black text-[#12465a] tracking-tight">
                          {plan.price_rial.toLocaleString("fa-IR")}{" "}
                          <span className="text-xs font-normal text-gray-500">ریال</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ({plan.price_toman.toLocaleString("fa-IR")} تومان)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* کد تخفیف */}
              <div className="mt-10 pt-8 border-t border-gray-100 max-w-lg mx-auto">
                <label className="block text-xs font-bold text-gray-600 mb-2 text-center">
                  کد تخفیف (اگر کد تخفیف دارید در قسمت پایین وارد کنید)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="کد تخفیف را وارد کنید"
                    dir="ltr"
                    className="flex-1 h-12 px-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#12465a] outline-none text-sm font-mono text-center transition-all uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount}
                    className="h-12 px-6 rounded-2xl bg-gray-800 hover:bg-[#12465a] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isApplyingDiscount ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <FiPercent className="size-3.5" />
                        <span>ثبت کد</span>
                      </>
                    )}
                  </button>
                </div>

                {appliedDiscount && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <span>
                      تخفیف اعمال شده ({appliedDiscount.percentage}٪):{" "}
                      <b>{appliedDiscount.amount.toLocaleString("fa-IR")} تومان</b>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedDiscount(null);
                        setDiscountCode("");
                      }}
                      className="text-emerald-700 hover:text-red-500 font-bold"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>

              {/* کادر مبلغ قابل پرداخت برجسته */}
              <div className="mt-8 p-5 md:p-6 rounded-2xl border-2 border-dashed border-[#12465a]/30 bg-[#12465a]/5 text-center">
                <div className="text-xs md:text-sm text-gray-600 font-bold mb-1">
                  مبلغ قابل پرداخت برای شما:
                </div>
                <div className="text-2xl md:text-3xl font-black text-[#12465a] tracking-tight">
                  {finalPriceRial.toLocaleString("fa-IR")}{" "}
                  <span className="text-sm font-bold">ریال</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  معادل {finalPriceToman.toLocaleString("fa-IR")} تومان
                </div>
              </div>
            </>
          )}
        </section>

        {/* --- ۵. روش پرداخت و ثبت نهایی --- */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#12465a] mb-2">روش پرداخت</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              روش پرداخت خود را انتخاب کنید (تنها درگاه رسمی و امن پرداخت آنلاین)
            </p>
          </div>

          <div className="max-w-xl mx-auto flex flex-col gap-4">
            {/* گزینه درگاه آنلاین */}
            <label className="flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 border-[#12465a] bg-blue-50/20 cursor-pointer shadow-xs">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked
                  readOnly
                  className="accent-[#12465a] size-4.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-800">
                    پرداخت آنلاین اینترنتی
                  </span>
                  <span className="text-xs text-gray-500">
                    اتصال مستقیم به کلیه کارت‌های شتاب از طریق درگاه پرداخت بانکی شاپرک
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/Behpardakht-Mellat-Logo.png"
                  alt="درگاه پرداخت"
                  className="h-8 object-contain opacity-80"
                />
              </div>
            </label>

            {/* پیام امنیتی شاپرک */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <FiLock className="size-4 text-emerald-600 flex-shrink-0" />
              <span>
                پرداخت شما در بستر رمزنگاری‌شده شاپرک (بانک مرکزی جمهوری اسلامی ایران) انجام می‌شود.
              </span>
            </div>

            {/* دکمه ارسال و پرداخت */}
            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedPlan || plans.length === 0}
                className="w-full md:w-3/4 py-4 rounded-2xl bg-[#12465a] hover:bg-[#0bb2c9] text-white font-black text-base shadow-lg shadow-[#12465a]/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>در حال برقراری ارتباط با سرور...</span>
                  </>
                ) : plans.length === 0 ? (
                  <span>در انتظار فعال‌سازی پلن‌ها توسط سرور</span>
                ) : (
                  <>
                    <FiCreditCard className="size-5" />
                    <span>
                      پرداخت و دریافت رژیم (
                      {finalPriceRial.toLocaleString("fa-IR")} ریال)
                    </span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-gray-400 text-center">
                پس از پرداخت موفق، اطلاعات و پرونده شما بلافاصله در اختیار متخصص تغذیه قرار می‌گیرد.
              </span>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
