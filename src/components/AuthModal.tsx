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
      className="m-0 h-[100dvh] max-w-full sm:h-auto sm:max-w-[520px]"
    >
      <ModalContent className="h-full overflow-y-auto rounded-none border-2 border-[#252923] bg-[#f7f5ef] text-base shadow-[8px_9px_0_#252923] sm:h-auto sm:max-h-[92dvh] sm:rounded-[2rem]">
        {(onClose) => (
          <form
            onSubmit={
              step === "PHONE"
                ? phoneForm.handleSubmit(checkPhoneNumber)
                : step === "OTP"
                  ? otpForm.handleSubmit(onOtpSubmit)
                  : loginForm.handleSubmit(onPasswordLogin)
            }
            className="flex min-h-full w-full flex-col sm:min-h-0"
          >
            <ModalHeader className="flex items-center justify-between">
              <p>ورود | ثبت‌نام</p>
              <button type="button" onClick={onClose}>
                <HiXMark className="size-6" />
              </button>
            </ModalHeader>

            <ModalBody className="gap-5 px-6 pb-8 pt-6 sm:px-8">
              {step === "PHONE" && (
                <>
                  <label htmlFor="phone_number">شماره تلفن</label>
                  <input
                    {...phoneForm.register("phone_number")}
                    maxLength={11}
                    className="input !rounded-xl !border-2 !border-[#d8d2c7] !bg-white !px-4 !py-4 text-base sm:text-base"
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
                      className="input !rounded-xl !border-2 !border-[#d8d2c7] !bg-white !px-4 !py-4 pr-12 text-base sm:text-base"
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
                    className="mt-2 text-right text-xs font-bold text-[#59634f] underline underline-offset-2"
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
                      className="relative text-xs font-bold text-[#59634f] underline underline-offset-4 hover:text-[#a65e43]"
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
                  <div className="rounded-xl border border-[#c8b995] bg-[#e6e2d8] p-4 text-sm font-medium leading-7 text-[#41483b]">
                    کد تایید برای شماره {phoneNumber} ارسال شد
                    <button
                      type="button"
                      className="mr-2 mt-2 text-xs font-bold text-[#59634f] underline underline-offset-4"
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
                      segment: "input w-full !py-6 text-base",
                      errorMessage: "text-right",
                    }}
                  />

                  {isNewUser && (
                    <>
                      <label>کد معرف (اختیاری)</label>
                      <input
                        {...otpForm.register("referral_code")}
                        maxLength={11}
                        className="input !rounded-xl !border-2 !border-[#d8d2c7] !bg-white !px-4 !py-4"
                      />
                    </>
                  )}
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-full border-2 border-[#252923] bg-[#c8b995] px-5 py-4 font-black text-[#252923] shadow-[4px_4px_0_#252923] transition-all hover:-translate-y-0.5 hover:bg-[#d9c6b4] hover:shadow-[6px_6px_0_#252923] disabled:cursor-wait disabled:opacity-60"
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
                  className="pb-3 text-xs font-bold text-[#59634f] hover:text-[#a65e43]"
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
