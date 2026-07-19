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
          searchParams.get("redirectTo") || "/profile/dashboard";

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
          searchParams.get("redirectTo") || "/profile/dashboard";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom-center"
      className="max-w-full h-[100dvh] m-0 sm:max-w-lg sm:h-auto"
    >
      <ModalContent className="text-base rounded-sm overflow-auto h-full">
        {(onClose) => (
          <form
            onSubmit={
              step === "PHONE"
                ? phoneForm.handleSubmit(checkPhoneNumber)
                : step === "OTP"
                  ? otpForm.handleSubmit(onOtpSubmit)
                  : loginForm.handleSubmit(onPasswordLogin)
            }
            className="w-full h-full flex flex-col justify-between"
          >
            <ModalHeader className="flex items-center justify-between">
              <p>ورود | ثبت‌نام</p>
              <button type="button" onClick={onClose}>
                <HiXMark className="size-6" />
              </button>
            </ModalHeader>

            <ModalBody className="">
              {step === "PHONE" && (
                <>
                  <label htmlFor="phone_number">شماره تلفن</label>
                  <input
                    {...phoneForm.register("phone_number")}
                    maxLength={11}
                    className="input text-base sm:text-base"
                    id="phone_number"
                    inputMode="numeric"
                    placeholder="مثلاً 09123456789"
                  />
                  {phoneForm.formState.errors.phone_number && (
                    <p className="text-xs text-red-500">
                      {phoneForm.formState.errors.phone_number.message}
                    </p>
                  )}

                  <div className="flex items-center w-full">
                    <div className="scale-75 -mr-12 -my-5"></div>
                  </div>
                </>
              )}

              {step === "PASSWORD" && (
                <>
                  <label htmlFor="password">رمز عبور</label>
                  <div className="relative w-full">
                    <input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      className="input pr-12 text-base sm:text-base"
                      placeholder="رمز عبور خود را وارد کنید"
                      id="password"
                    />

                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-zinc-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-cyan-500 underline underline-offset-2 mt-2 text-right"
                    onClick={() => {
                      setPhoneNumber("");
                      setStep("PHONE");
                    }}
                  >
                    تغییر شماره
                  </button>

                  {!loading && hasPasswordError && (
                    <p className="text-xs text-red-500">
                      {loginForm.formState.errors.password?.message}
                    </p>
                  )}

                  <div className="flex items-start">
                    <button
                      type="button"
                      className="text-xs spoiler-link text-cyan-500 hover:text-cyan-400 relative"
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
                      ورود با کد تایید
                    </button>
                  </div>
                </>
              )}

              {step === "OTP" && (
                <>
                  <div className="bg-green-100 border border-green-200 p-4 text-zinc-600 rounded-sm">
                    کد تایید برای شماره {phoneNumber} ارسال شد
                    <button
                      type="button"
                      className="text-xs text-cyan-500 underline underline-offset-4 mt-2 mr-2"
                      onClick={() => {
                        setPhoneNumber("");
                        setStep("PHONE");
                      }}
                    >
                      تغییر شماره
                    </button>
                  </div>

                  <label htmlFor="otp_code">کد تایید</label>
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
                      wrapper: "w-full",
                      segmentWrapper: "w-full",
                      segment: "input w-full !py-6",
                      errorMessage: "text-right",
                    }}
                  />

                  {isNewUser && (
                    <>
                      <label>کد معرف (اختیاری)</label>
                      <input
                        {...otpForm.register("referral_code")}
                        maxLength={11}
                        className="input"
                      />
                    </>
                  )}
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-wait mb-5"
              >
                {loading
                  ? "لطفا صبر کنید..."
                  : step === "PHONE"
                    ? "ادامه"
                    : step === "OTP"
                      ? "تایید"
                      : "ورود"}
              </button>

              {step === "OTP" && (
                <button
                  type="button"
                  className="text-xs text-cyan-500 mt-2 pb-3"
                  onClick={() => {
                    sendOtp(phoneNumber);
                    setCanResend(false);
                    setResendTimer(120);
                  }}
                  disabled={!canResend}
                >
                  {canResend
                    ? "ارسال مجدد کد"
                    : `ارسال مجدد بعد از ${Math.floor(resendTimer / 60)}:${String(
                        resendTimer % 60
                      ).padStart(2, "0")}`}
                </button>
              )}
            </ModalBody>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
