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
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiZap,
  FiInfo,
  FiClock,
  FiArrowRight,
  FiMaximize2,
} from "react-icons/fi";
import {
  FaFemale,
  FaMale,
  FaFire,
  FaClock as FaClockIcon,
  FaBalanceScale,
  FaRunning,
  FaHeartbeat,
  FaBaby,
  FaStar,
  FaUserMd,
  FaWeight,
  FaDumbbell,
} from "react-icons/fa";
import { GiMuscleUp, GiAvocado, GiWeightScale } from "react-icons/gi";
import { MdOutlinePregnantWoman } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

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
  const [isBmiModalOpen, setIsBmiModalOpen] = useState<boolean>(false);

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

  // محاسبه تخصصی BMI، درجه چاقی، وزن ایده‌آل و وضعیت متابولیک بدن
  const calculateBmi = () => {
    if (!height || !weight || !age) return;
    const heightInMeters = height / 100;
    const bmiVal = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

    // تعیین دسته‌بندی و درجه چاقی بر اساس رده‌بندی سازمان بهداشت جهانی (WHO)
    let status: BmiAnalysis["status"] = "normal";
    let statusText = "وزن کاملاً نرمال و سلامت";
    let obesityGrade = "فاقد چاقی (توده سلامت استاندارد)";
    let statusColor = "#10b981"; // سبز
    let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    let healthRiskLevel = "بسیار پایین (محدوده استاندارد سلامت)";
    let healthRiskColor = "#10b981";
    let suggestedDietType = "maintenance";
    let suggestedDietName = "رژیم تثبیت وزن یا ورزشکاری";
    let recommendationTitle = "حفظ تعادل متابولیک و تقویت بافت عضلانی";
    let recommendationText =
      "تبریک! شاخص توده بدنی و وضعیت وزن شما در ایده‌آل‌ترین سطح استاندارد بین‌المللی قرار دارد. برای حفظ این آمادگی و تناسب اندام، رژیم تثبیت وزن یا برنامه تغذیه سلامت و ورزشی بهترین گزینه برای شماست.";

    if (bmiVal < 18.5) {
      status = "underweight";
      statusText = "کمبود وزن (لاغری)";
      obesityGrade = "فاقد چاقی (کمبود توده بدنی)";
      statusColor = "#3b82f6"; // آبی
      badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
      healthRiskLevel = "ریسک فقر مواد مغذی و ضعف عضلانی";
      healthRiskColor = "#3b82f6";
      suggestedDietType = "weight_gain";
      suggestedDietName = "رژیم افزایش وزن و عضله‌سازی";
      recommendationTitle = "نیاز به دریافت کالری مازاد باکیفیت و عضله‌سازی";
      recommendationText =
        "شاخص توده بدنی شما نشان‌دهنده کمبود وزن است. برای رسیدن به وزن ایده‌آل، نیاز به یک رژیم پرکالریِ مغذی همراه با پروتئین کافی و کربوهیدرات‌های پیچیده دارید تا وزن اضافه شده به صورت توده عضلانی سالم باشد نه چربی مضر.";
    } else if (bmiVal >= 25 && bmiVal < 30) {
      status = "overweight";
      statusText = "اضافه وزن (پیش‌چاقی)";
      obesityGrade = "اضافه وزن خفیف تا متوسط (مرحله پیش‌چاقی)";
      statusColor = "#f59e0b"; // زرد/نارنجی
      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
      healthRiskLevel = "متوسط (افزایش خفیف ریسک متابولیک)";
      healthRiskColor = "#f59e0b";
      suggestedDietType = "weight_loss";
      suggestedDietName = "رژیم اصولی کاهش وزن";
      recommendationTitle = "پیشگیری از ورود به درجات چاقی با اصلاح تغذیه";
      recommendationText =
        "وزن فعلی شما کمی بالاتر از حد سلامت است. با یک رژیم اصولی و متناسب با سفره خانواده می‌توانید ظرف چند هفته به وزن ایده‌آل برسید و از پیشروی به مراحل چاقی و خطرات قلبی عروقی جلوگیری کنید.";
    } else if (bmiVal >= 30 && bmiVal < 35) {
      status = "obese_1";
      statusText = "چاقی درجه ۱ (متوسط)";
      obesityGrade = "چاقی بالینی درجه یک (Class I)";
      statusColor = "#f97316"; // نارنجی تند
      badgeClass = "bg-orange-50 text-orange-700 border-orange-200";
      healthRiskLevel = "بالا (ریسک کبد چرب، مقاومت انسولین و فشار خون)";
      healthRiskColor = "#f97316";
      suggestedDietType = "weight_loss";
      suggestedDietName = "رژیم تخصصی کاهش وزن و چربی‌سوزی";
      recommendationTitle = "کاهش بار متابولیک و پیشگیری از کبد چرب";
      recommendationText =
        "شما در محدوده چاقی درجه یک قرار دارید. کاهش ۵ تا ۱۰ درصد از وزن فعلی، خطر ابتلا به دیابت نوع دو و فشار خون را به شدت کاهش می‌دهد. شروع یک رژیم علمی در این مقطع کاملاً حیاتی و اثربخش است.";
    } else if (bmiVal >= 35 && bmiVal < 40) {
      status = "obese_2";
      statusText = "چاقی درجه ۲ (شدید)";
      obesityGrade = "چاقی شدید بالینی (Class II)";
      statusColor = "#ef4444"; // قرمز
      badgeClass = "bg-red-50 text-red-700 border-red-200";
      healthRiskLevel = "خیلی بالا (فشار جدی بر مفاصل، ستون فقرات و عروق)";
      healthRiskColor = "#ef4444";
      suggestedDietType = "fasting";
      suggestedDietName = "رژیم فست‌مد یا کتوپلاس تخصصی";
      recommendationTitle = "کنترل فوری التهاب بدنی و شکستن استپ وزنی";
      recommendationText =
        "چاقی درجه ۲ فشار قابل‌توجهی به مفاصل زانو، ستون فقرات و سیستم قلبی-عروقی وارد می‌کند. پیروی از یک برنامه رژیمی هدفمند برای شکستن مقاومت به انسولین و چربی‌سوزی پایدار ضروری است.";
    } else if (bmiVal >= 40) {
      status = "obese_3";
      statusText = "چاقی درجه ۳ (مفرط و پرخطر)";
      obesityGrade = "چاقی مفرط بالینی (Class III - Morbid Obesity)";
      statusColor = "#881337"; // زرشکی تیره
      badgeClass = "bg-rose-100 text-rose-900 border-rose-300";
      healthRiskLevel = "بسیار بحرانی (نیازمند مداخله جدی تغذیه‌ای)";
      healthRiskColor = "#881337";
      suggestedDietType = "shock";
      suggestedDietName = "رژیم شوک یا بسته اختصاصی VIP";
      recommendationTitle = "مداخله جامع تغذیه‌ای و پیگیری مستمر";
      recommendationText =
        "شاخص توده بدنی بالای ۴۰ در دسته چاقی مفرط قرار دارد. اکیداً توصیه می‌شود با یک برنامه رژیمی علمی، مرحله‌به‌مرحله و دارای پشتیبانی مستمر متخصص، مسیر درمان و کاهش وزن را آغاز کنید.";
    }

    // محدوده وزن نرمال (BMI بین ۱۸.۵ تا ۲۴.۹)
    const idealWeightMin = Math.round(18.5 * heightInMeters * heightInMeters);
    const idealWeightMax = Math.round(24.9 * heightInMeters * heightInMeters);
    // وزن ایده‌آل هدف (بر اساس فرمول اختصاصی استاندارد جنسیت)
    const idealWeightTarget = Math.round(
      (gender === "male" ? 22.2 : 21.6) * heightInMeters * heightInMeters
    );

    // محاسبه میزان اضافه یا کمبود وزن
    let differenceType: BmiAnalysis["differenceType"] = "ideal";
    let weightDifference = 0;
    let differenceText = "در محدوده کاملاً ایده‌آل";

    if (weight > idealWeightMax) {
      differenceType = "excess";
      weightDifference = Math.round((weight - idealWeightTarget) * 10) / 10;
      differenceText = `حدود ${weightDifference.toLocaleString("fa-IR")} کیلوگرم اضافه وزن`;
    } else if (weight < idealWeightMin) {
      differenceType = "deficit";
      weightDifference = Math.round((idealWeightTarget - weight) * 10) / 10;
      differenceText = `حدود ${weightDifference.toLocaleString("fa-IR")} کیلوگرم کمبود وزن`;
    } else {
      differenceType = "ideal";
      weightDifference = Math.round(Math.abs(weight - idealWeightTarget) * 10) / 10;
      differenceText = `در محدوده ایده‌آل (اختلاف جزئی ${weightDifference.toLocaleString("fa-IR")} کیلوگرم تا نقطه مرکزی)`;
    }

    // متابولیسم پایه (BMR) با فرمول میفلین-سنت جور
    const bmr = Math.round(
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161
    );

    // کالری مصرفی روزانه برآورد شده (TDEE با ضریب فعالیت سبک)
    const tdee = Math.round(bmr * 1.375);

    // تخمین درصد چربی بدن (فرمول Deurenberg)
    const genderFactor = gender === "male" ? 1 : 0;
    let bodyFatVal = 1.2 * bmiVal + 0.23 * age - 10.8 * genderFactor - 5.4;
    bodyFatVal = Math.max(5, Math.min(65, Math.round(bodyFatVal * 10) / 10));

    let bodyFatCategory = "نرمال و متناسب";
    if (gender === "male") {
      if (bodyFatVal < 14) bodyFatCategory = "ورزشکاری و کم‌چربی";
      else if (bodyFatVal <= 18) bodyFatCategory = "فیتنس و متناسب";
      else if (bodyFatVal <= 24) bodyFatCategory = "متوسط و طبیعی";
      else bodyFatCategory = "توده چربی مازاد";
    } else {
      if (bodyFatVal < 21) bodyFatCategory = "ورزشکاری و کم‌چربی";
      else if (bodyFatVal <= 25) bodyFatCategory = "فیتنس و متناسب";
      else if (bodyFatVal <= 31) bodyFatCategory = "متوسط و طبیعی";
      else bodyFatCategory = "توده چربی مازاد";
    }

    // تخمین زمان مورد نیاز برای رسیدن به وزن هدف با شیب اصولی (هفته‌ای ۰.۷ کیلوگرم)
    const estimatedWeeksToGoal = Math.max(
      2,
      Math.ceil(Math.abs(weight - idealWeightTarget) / 0.7)
    );

    const resultData: BmiAnalysis = {
      bmi: bmiVal,
      status,
      statusText,
      obesityGrade,
      statusColor,
      badgeClass,
      idealWeightMin,
      idealWeightMax,
      idealWeightTarget,
      weightDifference,
      differenceText,
      differenceType,
      bmr,
      tdee,
      bodyFatPercentage: bodyFatVal,
      bodyFatCategory,
      healthRiskLevel,
      healthRiskColor,
      estimatedWeeksToGoal,
      recommendationTitle,
      recommendationText,
      suggestedDietType,
      suggestedDietName,
    };

    setBmiResult(resultData);
    setIsBmiModalOpen(true);
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

            {/* کارت نتیجه آنالیز BMI در صفحه */}
            {bmiResult && (
              <div className="mt-6 p-5 md:p-6 rounded-3xl bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/90 shadow-sm flex flex-col gap-5 animate-fade-down">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-md shrink-0"
                      style={{ backgroundColor: bmiResult.statusColor }}
                    >
                      <span className="text-[10px] opacity-90">BMI</span>
                      <span className="text-xl md:text-2xl leading-none font-mono">
                        {bmiResult.bmi}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 font-bold">وضعیت بدنی شما:</span>
                        <span
                          className="text-base md:text-lg font-black"
                          style={{ color: bmiResult.statusColor }}
                        >
                          {bmiResult.statusText}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                          {bmiResult.obesityGrade}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        وزن ایده‌آل برای شما:{" "}
                        <span className="font-black text-[#12465a]">
                          {bmiResult.idealWeightTarget.toLocaleString("fa-IR")} کیلوگرم
                        </span>{" "}
                        <span className="text-gray-400">
                          (بازه سلامت: {bmiResult.idealWeightMin} تا {bmiResult.idealWeightMax} kg)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="text-center md:text-left text-xs bg-white py-2 px-3.5 rounded-xl border border-gray-200 shadow-2xs">
                      {bmiResult.differenceType === "excess" ? (
                        <div className="flex items-center gap-1.5 text-amber-600 font-black">
                          <FiTrendingUp className="size-4" />
                          <span>{bmiResult.differenceText}</span>
                        </div>
                      ) : bmiResult.differenceType === "deficit" ? (
                        <div className="flex items-center gap-1.5 text-blue-600 font-black">
                          <FiTrendingDown className="size-4" />
                          <span>{bmiResult.differenceText}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                          <FiCheck className="size-4" />
                          <span>{bmiResult.differenceText}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsBmiModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#12465a]/10 hover:bg-[#12465a] text-[#12465a] hover:text-white font-bold text-xs transition-all cursor-pointer group"
                    >
                      <FiMaximize2 className="size-3.5 group-hover:scale-110 transition-transform" />
                      <span>مشاهده گزارش کامل و پیشرفته</span>
                    </button>
                  </div>
                </div>

                {/* نوار مینیاتوری طیف BMI */}
                <div className="w-full flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span>طیف شاخص توده بدنی (BMI Spectrum)</span>
                    <span style={{ color: bmiResult.statusColor }}>
                      شاخص شما: {bmiResult.bmi} ({bmiResult.statusText})
                    </span>
                  </div>

                  {/* نوار رنگی */}
                  <div className="relative w-full h-3 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
                    <div className="bg-blue-400 h-full" style={{ width: "16%" }} title="کمبود وزن (<18.5)" />
                    <div className="bg-emerald-500 h-full" style={{ width: "23%" }} title="نرمال (18.5-24.9)" />
                    <div className="bg-amber-400 h-full" style={{ width: "18%" }} title="اضافه وزن (25-29.9)" />
                    <div className="bg-orange-500 h-full" style={{ width: "16%" }} title="چاقی درجه ۱ (30-34.9)" />
                    <div className="bg-red-500 h-full" style={{ width: "14%" }} title="چاقی درجه ۲ (35-39.9)" />
                    <div className="bg-rose-900 h-full" style={{ width: "13%" }} title="چاقی درجه ۳ (40+)" />
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>۱۵ (لاغری)</span>
                    <span>۱۸.۵ (نرمال)</span>
                    <span>۲۵ (اضافه وزن)</span>
                    <span>۳۰ (چاقی ۱)</span>
                    <span>۳۵ (چاقی ۲)</span>
                    <span>۴۰+ (مفرط)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- ۴. انتخاب برنامه سلامتی (پلن‌ها از بک‌اند) --- */}
        <section id="diet-plans-section" className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 md:p-10 scroll-mt-24">
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

      {/* --- ۶. مودال پیشرفته و جامع آنالیز بدنی و BMI --- */}
      {bmiResult && (
        <Modal
          isOpen={isBmiModalOpen}
          onOpenChange={setIsBmiModalOpen}
          size="3xl"
          scrollBehavior="inside"
          backdrop="blur"
          classNames={{
            backdrop: "bg-slate-900/60 backdrop-blur-sm z-[9999]",
            wrapper: "z-[10000]",
            base: "max-h-[90vh] rounded-3xl bg-white border border-gray-100 shadow-2xl text-right dir-rtl font-sans",
            header: "border-b border-gray-100 py-4 px-6 md:px-8",
            body: "p-6 md:p-8 space-y-6 overflow-y-auto",
            footer: "border-t border-gray-100 py-4 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/70",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5 text-[#12465a]">
                    <div className="w-10 h-10 rounded-2xl bg-[#12465a]/10 flex items-center justify-center text-[#12465a]">
                      <FiActivity className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-[#12465a]">
                        گزارش جامع آنالیز وضعیت بدنی و BMI
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        بر اساس اطلاعات ثبت‌شده: {gender === "female" ? "خانم" : "آقا"} {age} ساله با قد {height} سانتی‌متر و وزن {weight} کیلوگرم
                      </p>
                    </div>
                  </div>
                </ModalHeader>

                <ModalBody className="space-y-6">
                  {/* بنر وضعیت اصلی و گیج شاخص توده بدنی */}
                  <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200/80 shadow-2xs flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-20 h-20 rounded-3xl flex flex-col items-center justify-center text-white font-black shadow-lg shrink-0"
                          style={{ backgroundColor: bmiResult.statusColor }}
                        >
                          <span className="text-[11px] font-medium tracking-wide">BMI</span>
                          <span className="text-2xl md:text-3xl leading-none font-mono">
                            {bmiResult.bmi}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-bold mb-1">
                            سطح و درجه وضعیت شما:
                          </div>
                          <div
                            className="text-xl md:text-2xl font-black mb-1"
                            style={{ color: bmiResult.statusColor }}
                          >
                            {bmiResult.statusText}
                          </div>
                          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs">
                            {bmiResult.obesityGrade}
                          </span>
                        </div>
                      </div>

                      {/* نشانگر ریسک سلامت */}
                      <div className="text-center sm:text-left p-3 rounded-2xl bg-white border border-gray-200 shadow-2xs max-w-xs">
                        <div className="text-[11px] text-gray-400 font-bold mb-1">
                          ارزیابی ریسک بیماری‌های متابولیک:
                        </div>
                        <div
                          className="text-xs font-black"
                          style={{ color: bmiResult.healthRiskColor }}
                        >
                          {bmiResult.healthRiskLevel}
                        </div>
                      </div>
                    </div>

                    {/* نوار بصری طیف استاندارد BMI با نشانگر متحرک کاربر */}
                    <div className="w-full pt-4 border-t border-gray-100">
                      <div className="relative w-full h-8 mb-1">
                        <div
                          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out"
                          style={{
                            left: `${Math.min(96, Math.max(4, ((bmiResult.bmi - 14) / (44 - 14)) * 100))}%`,
                          }}
                        >
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-black text-white shadow-xs font-mono"
                            style={{ backgroundColor: bmiResult.statusColor }}
                          >
                            {bmiResult.bmi}
                          </span>
                          <div
                            className="w-0 h-0 border-x-4 border-x-transparent border-t-5"
                            style={{ borderTopColor: bmiResult.statusColor }}
                          />
                        </div>
                      </div>

                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-200 shadow-inner">
                        <div className="bg-blue-400 h-full" style={{ width: "16%" }} title="کمبود وزن (<18.5)" />
                        <div className="bg-emerald-500 h-full" style={{ width: "23%" }} title="نرمال (18.5-24.9)" />
                        <div className="bg-amber-400 h-full" style={{ width: "18%" }} title="اضافه وزن (25-29.9)" />
                        <div className="bg-orange-500 h-full" style={{ width: "16%" }} title="چاقی درجه ۱ (30-34.9)" />
                        <div className="bg-red-500 h-full" style={{ width: "14%" }} title="چاقی درجه ۲ (35-39.9)" />
                        <div className="bg-rose-900 h-full" style={{ width: "13%" }} title="چاقی مفرط (40+)" />
                      </div>

                      <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1 px-1">
                        <span>۱۵ (لاغری)</span>
                        <span>۱۸.۵ (نرمال)</span>
                        <span>۲۵ (اضافه وزن)</span>
                        <span>۳۰ (چاقی ۱)</span>
                        <span>۳۵ (چاقی ۲)</span>
                        <span>۴۰+ (مفرط)</span>
                      </div>
                    </div>
                  </div>

                  {/* گرید ۴ شاخص اصلی درخواستی */}
                  <div>
                    <h4 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                      <FiAward className="size-4 text-[#12465a]" />
                      <span>شاخص‌های اختصاصی وزن و وضعیت بدنی:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {/* ۱. شاخص توده بدنی */}
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 mb-2">
                          <span className="text-xs font-bold text-gray-500">شاخص توده بدنی</span>
                          <GiWeightScale className="size-5 text-[#12465a]" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-gray-800 font-mono">
                            {bmiResult.bmi}{" "}
                            <span className="text-xs font-normal text-gray-400">kg/m²</span>
                          </div>
                          <div
                            className="text-xs font-bold mt-1"
                            style={{ color: bmiResult.statusColor }}
                          >
                            {bmiResult.statusText}
                          </div>
                        </div>
                      </div>

                      {/* ۲. وضعیت و درجه چاقی */}
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 mb-2">
                          <span className="text-xs font-bold text-gray-500">درجه و رده چاقی</span>
                          <FiAward className="size-5 text-amber-500" />
                        </div>
                        <div>
                          <div className="text-base font-black text-gray-800 line-clamp-1">
                            {bmiResult.obesityGrade}
                          </div>
                          <div className="text-xs text-gray-400 font-medium mt-1">
                            طبق رده‌بندی بالینی WHO
                          </div>
                        </div>
                      </div>

                      {/* ۳. میزان اضافه یا کمبود وزن */}
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 mb-2">
                          <span className="text-xs font-bold text-gray-500">میزان اختلاف وزن</span>
                          {bmiResult.differenceType === "excess" ? (
                            <FiTrendingUp className="size-5 text-amber-500" />
                          ) : bmiResult.differenceType === "deficit" ? (
                            <FiTrendingDown className="size-5 text-blue-500" />
                          ) : (
                            <FiCheck className="size-5 text-emerald-500" />
                          )}
                        </div>
                        <div>
                          <div
                            className="text-xl font-black"
                            style={{ color: bmiResult.statusColor }}
                          >
                            {bmiResult.differenceType === "excess"
                              ? `+${bmiResult.weightDifference} کیلوگرم`
                              : bmiResult.differenceType === "deficit"
                              ? `-${bmiResult.weightDifference} کیلوگرم`
                              : "وزن ایده‌آل"}
                          </div>
                          <div className="text-xs text-gray-500 font-medium mt-1">
                            {bmiResult.differenceType === "excess"
                              ? "اضافه وزن نسبت به وزن هدف"
                              : bmiResult.differenceType === "deficit"
                              ? "کمبود وزن نسبت به هدف"
                              : "در بهترین محدوده توده بدنی"}
                          </div>
                        </div>
                      </div>

                      {/* ۴. وزن ایده‌آل شخص */}
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 mb-2">
                          <span className="text-xs font-bold text-gray-500">وزن ایده‌آل شما</span>
                          <FiTarget className="size-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-[#12465a]">
                            {bmiResult.idealWeightTarget.toLocaleString("fa-IR")}{" "}
                            <span className="text-xs font-normal text-gray-400">کیلوگرم</span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium mt-1">
                            بازه مجاز: {bmiResult.idealWeightMin} تا {bmiResult.idealWeightMax} kg
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* بخش پارامترهای فیزیولوژیک و متابولیک بدن */}
                  <div>
                    <h4 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                      <FiZap className="size-4 text-amber-500" />
                      <span>پارامترهای تکمیلی متابولیسم و ترکیب بدن:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {/* متابولیسم پایه BMR */}
                      <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                          <FaFire className="size-5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold">متابولیسم پایه (BMR)</div>
                          <div className="text-base font-black text-gray-800 mt-0.5 font-mono">
                            {bmiResult.bmr.toLocaleString("fa-IR")}{" "}
                            <span className="text-xs font-normal text-gray-500">کالری/روز</span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            حداقل انرژی مصرفی بدن در استراحت
                          </div>
                        </div>
                      </div>

                      {/* تخمین درصد چربی */}
                      <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                          <FaHeartbeat className="size-5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold">تخمین چربی بدن</div>
                          <div className="text-base font-black text-gray-800 mt-0.5 font-mono">
                            {bmiResult.bodyFatPercentage}٪
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            وضعیت: {bmiResult.bodyFatCategory}
                          </div>
                        </div>
                      </div>

                      {/* زمان تقریبی تا وزن هدف */}
                      <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                          <FiClock className="size-5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-bold">مدت زمان تخمینی</div>
                          <div className="text-base font-black text-gray-800 mt-0.5">
                            حدود {bmiResult.estimatedWeeksToGoal} هفته
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            با کاهش اصولی هفتگی (بدون افت متابولیسم)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* تحلیل و توصیه تخصصی کارشناس */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <FaUserMd className="size-4" />
                      </div>
                      <h5 className="text-sm font-black text-emerald-900">
                        توصیه تخصصی کارشناس تغذیه: {bmiResult.recommendationTitle}
                      </h5>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      {bmiResult.recommendationText}
                    </p>

                    <div className="pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="text-xs font-bold text-emerald-900">
                        رژیم غذایی پیشنهادی برای وضعیت شما:{" "}
                        <span className="text-[#12465a] underline decoration-emerald-500 underline-offset-4">
                          {bmiResult.suggestedDietName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDietType(bmiResult.suggestedDietType);
                          addToast({
                            title: "نوع رژیم تنظیم شد",
                            description: `نوع رژیم روی «${bmiResult.suggestedDietName}» تنظیم گردید.`,
                            color: "success",
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        انتخاب این نوع رژیم در فرم
                      </button>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    بستن پنجره
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const el = document.getElementById("diet-plans-section");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#12465a] hover:bg-[#0bb2c9] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>مشاهده پلن‌ها و ادامه ثبت رژیم</span>
                    <FiChevronLeft className="size-4" />
                  </button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
