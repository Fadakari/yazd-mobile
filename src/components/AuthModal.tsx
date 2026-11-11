"use client";
import {
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiXMark } from "react-icons/hi2";
import {
  LoginFormValues,
  loginSchema,
  OtpFormValues,
  otpSchema,
  SignupFormValues,
  signupSchema,
} from "@/schemas/authSchema";
import { convertPersianToEnglish } from "@/utils/converNumbers";
import {
  checkPhoneExists,
  login,
  sendOtp,
  verifyOtp,
} from "@/services/usersActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function AuthModal() {
  const { isOpen, onOpenChange, onClose } = useAuthModal();
  const [step, setStep] = useState<"PHONE" | "OTP" | "PASSWORD">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const searchParams = useSearchParams();
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const phoneForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const checkPhoneNumber = async ({ phone_number }: SignupFormValues) => {
    try {
      setLoading(true);
      const converted = convertPersianToEnglish(phone_number);
      setPhoneNumber(converted);

      const exists = await checkPhoneExists(converted);
      if (exists) {
        setIsNewUser(false);
        setStep("PASSWORD");
      } else {
        setIsNewUser(true);
        const result = await sendOtp(converted);
        if (result?.status === 200) {
          setStep("OTP");
          setCanResend(false);
          setResendTimer(120);
        } else {
          phoneForm.setError("phone_number", {
            message: "ارسال کد تایید ناموفق بود",
          });
        }
      }
    } catch {
      phoneForm.setError("phone_number", {
        message: "خطایی در ارسال اطلاعات",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPasswordLogin = async ({ password }: { password: string }) => {
    setHasPasswordError(false);
    setLoading(true);

    try {
      const result = await login(phoneNumber, password);
      if (result?.status === 200) {
        loginForm.reset();
        onClose();
        const redirectTo =
          searchParams.get("redirectTo") || "/profile";

        router.push(redirectTo);
      }
    } catch {
      loginForm.setError("password", {
        message: "رمز عبور اشتباه است",
      });
      setHasPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormValues) => {
    setLoading(true);
    try {
      const result = await verifyOtp(
        phoneNumber,
        data.code,
        data.referral_code
      );
      if (result?.status === 200) {
        loginForm.reset();
        onClose();
        const redirectTo =
          searchParams.get("redirectTo") || "/profile";
        router.push(redirectTo);
      }
    } catch {
      otpForm.setError("code", {
        message: "کد وارد شده اشتباه یا منقضی شده",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "OTP") {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    phoneForm.reset();
    otpForm.reset();
    loginForm.reset();
  }, [step]);

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      classNames={{
        base: "bg-white border border-zinc-200 text-zinc-950 rounded-3xl p-2 sm:p-4 shadow-2xl max-w-md w-full mx-4",
        backdrop: "bg-black/50 backdrop-blur-md",
      }}
    >
      <ModalContent className="text-right" dir="rtl">
        {(onClose) => (
          <form
            onSubmit={
              step === "PHONE"
                ? phoneForm.handleSubmit(checkPhoneNumber)
                : step === "OTP"
                  ? otpForm.handleSubmit(onOtpSubmit)
                  : loginForm.handleSubmit(onPasswordLogin)
            }
            className="w-full flex flex-col justify-between"
          >
            <ModalHeader className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-base font-extrabold text-zinc-950">ورود / عضویت در خوش‌طعم</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <HiXMark className="size-6" />
              </button>
            </ModalHeader>

            <ModalBody className="space-y-4 px-2 sm:px-4">
              {step === "PHONE" && (
                <>
                  <label htmlFor="phone_number" className="text-xs font-bold text-zinc-700">
                    شماره موبایل خود را وارد فرمایید
                  </label>
                  <input
                    {...phoneForm.register("phone_number")}
                    maxLength={11}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-amber-400 rounded-xl h-12 px-4 text-sm text-zinc-900 placeholder:text-slate-500 outline-none transition-colors text-right"
                    id="phone_number"
                    inputMode="numeric"
                    placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                  />
                  {phoneForm.formState.errors.phone_number && (
                    <p className="text-xs text-red-400">
                      {phoneForm.formState.errors.phone_number.message}
                    </p>
                  )}
                </>
              )}

              {step === "PASSWORD" && (
                <>
                  <label htmlFor="password" className="text-xs font-bold text-zinc-700">
                    رمز عبور حساب کاربری
                  </label>
                  <div className="relative w-full">
                    <input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-amber-400 rounded-xl h-12 px-4 pl-11 text-sm text-zinc-900 placeholder:text-slate-500 outline-none transition-colors text-right"
                      placeholder="رمز عبور خود را وارد کنید"
                      id="password"
                    />

                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-zinc-500 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      className="text-amber-400 hover:underline"
                      onClick={() => {
                        setPhoneNumber("");
                        setStep("PHONE");
                      }}
                    >
                      تغییر شماره موبایل
                    </button>

                    <button
                      type="button"
                      className="text-zinc-500 hover:text-amber-400 transition-colors"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const result = await sendOtp(phoneNumber);
                          if (result?.status === 200) {
                            setStep("OTP");
                            setCanResend(false);
                            setResendTimer(120);
                          }
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      ورود با پیامک کد یکبار مصرف
                    </button>
                  </div>

                  {!loading && hasPasswordError && (
                    <p className="text-xs text-red-400">
                      {loginForm.formState.errors.password?.message}
                    </p>
                  )}
                </>
              )}

              {step === "OTP" && (
                <>
                  <div className="bg-red-50 border border-red-200 p-3.5 text-red-700 text-xs rounded-xl flex items-center justify-between">
                    <span>کد تایید به شماره {phoneNumber} پیامک شد</span>
                    <button
                      type="button"
                      className="text-red-700 hover:underline font-bold"
                      onClick={() => {
                        setPhoneNumber("");
                        setStep("PHONE");
                      }}
                    >
                      تغییر شماره
                    </button>
                  </div>

                  <label htmlFor="otp_code" className="text-xs font-bold text-zinc-700">
                    کد تایید ۶ رقمی
                  </label>
                  <InputOtp
                    {...otpForm.register("code")}
                    errorMessage={otpForm.formState.errors?.code?.message}
                    isInvalid={!!otpForm.formState.errors.code}
                    length={6}
                    dir="ltr"
                    id="otp_code"
                    classNames={{
                      input: "w-full",
                      base: "w-full",
                      wrapper: "w-full justify-center gap-2",
                      segmentWrapper: "w-full",
                      segment: "w-11 h-12 bg-zinc-50 border-zinc-300 text-zinc-950 text-lg font-black rounded-xl focus:border-red-500",
                      errorMessage: "text-right text-xs text-red-500",
                    }}
                  />

                  {isNewUser && (
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-700">کد معرف (اختیاری)</label>
                      <input
                        {...otpForm.register("referral_code")}
                        maxLength={11}
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-red-500 rounded-xl h-11 px-4 text-xs text-zinc-900 outline-none"
                      />
                    </div>
                  )}

                  {step === "OTP" && (
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        className="text-xs text-red-700 font-bold hover:underline disabled:opacity-50 disabled:no-underline"
                        onClick={() => {
                          sendOtp(phoneNumber);
                          setCanResend(false);
                          setResendTimer(120);
                        }}
                        disabled={!canResend}
                      >
                        {canResend
                          ? "ارسال مجدد کد تایید"
                          : `ارسال مجدد تا ${(Math.floor(resendTimer / 60)).toLocaleString("fa-IR")}:${String(
                              resendTimer % 60
                            ).padStart(2, "0")}`}
                      </button>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-red-500/25 transition-all active:scale-98 disabled:opacity-60"
              >
                {loading
                  ? "در حال پردازش..."
                  : step === "PHONE"
                    ? "ادامه"
                    : step === "OTP"
                      ? "تایید و ورود"
                      : "ورود به حساب"}
              </button>
            </ModalBody>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
