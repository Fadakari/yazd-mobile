import { addToast } from "@heroui/toast"
import api from "./api"
export const login = async (phone_number: string, password: string) => {
    const res = await fetch("/internal-api/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone_number, password }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "خطا در ورود");
    }

    if (data.is_new_user || data.accepted_terms === false) {
        await acceptTerms("1.0.0");
    }

    addToast({
        title: data.message || "ورود موفقیت‌آمیز بود",
    });
    location.reload();
    return data;
};
// otp
export const sendOtp = async (phone_number: string) => {
    try {
        const response = await fetch("/internal-api/auth/send-otp", {
            method: "POST",
            body: JSON.stringify({ phone_number }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        
        if (response.ok) {
            addToast({
                title: "کد تایید با موفقیت به شماره تلفن شما ارسال شد",
                description: phone_number
            });
            return { status: 200, data };
        } else if (response.status === 400) {
            addToast({
                title: "شماره تلفن وارد شده نامعتبر است",
                description: phone_number,
                color: "danger"
            });
            return { status: 400, data };
        } else {
             throw new Error(data.error);
        }
    } catch (error: any) {
        console.log(error);
        addToast({
            title: error?.message || "وقوع خطای نامشخص"
        });
    }
}
export const verifyOtp = async (
    phone_number: string,
    code: string,
    referral_code?: string
) => {
    try {
        const result = await fetch("/internal-api/auth/verify-otp", {
            method: "POST",
            body: JSON.stringify({ phone_number, code, referral_code }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await result.json();

        if (!result.ok) {
            throw new Error(data.error || "خطا در تایید کد");
        }

        if (data.is_new_user || data.accepted_terms === false) {
            await acceptTerms("1.0.0");
        }

        addToast({
            title: data.message || "ثبت نام با موفقیت تکمیل شد",
        });

        location.reload()
        return data;
    } catch (error: any) {
        addToast({
            title: error?.message || "کد تایید نامعتبر یا منقضی است",
            description: "دوباره تلاش کنید",
            classNames: { description: "text-xs" },
            color: "danger",
        });
    }
};

export const acceptTerms = async (terms_version: string) => {
    try {
        const response = await fetch("/internal-api/auth/accept-terms", {
            method: "POST",
            body: JSON.stringify({ terms_version, accept: true }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "خطا در تایید قوانین");
        }
        return data;
    } catch (error: any) {
        console.error(error);
        return null;
    }
};

// user
export const editInfo = async (data: any) => {
    try {
        const response = await fetch("/internal-api/users/edit", {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        if (!response.ok) {
            return {
                success: false,
                errors: result.errors || {},
                message: result.message || "خطایی رخ داده است",
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (err) {
        console.error("خطا در editInfo:", err);
        return {
            success: false,
            errors: {},
            message: "خطا در ارتباط با سرور",
        };
    }
};
export const changePassword = async (data: any) => {
    try {
        const response = await fetch("/internal-api/users/change-password", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        if (!response.ok) {
            return {
                success: false,
                errors: result.errors || {},
                message: result.message || "خطایی رخ داده است",
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (err) {
        console.error("خطا در editInfo:", err);
        return {
            success: false,
            errors: {},
            message: "خطا در ارتباط با سرور",
        };
    }
};

export async function checkPhoneExists(phone: string) {
    try {
        const res = await fetch("/internal-api/auth/check-status", {
            method: "POST",
            body: JSON.stringify({ phone_number: phone }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        return data?.has_password;
    } catch (e) {
        console.error(e);
        return false;
    }
}
export async function GenDiscount(data: { order_amount: number }) {
    try {
        const response = await fetch("/internal-api/users/discount", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        if (!response.ok) {
            return {
                success: false,
                errors: result.errors || {},
                message: result.message || "خطایی رخ داده است",
            };
        }
        return {
            success: true,
            data: result.data,
        };
    } catch (err) {
        console.error("خطا در editInfo:", err);
        return {
            success: false,
            errors: {},
            message: "خطا در ارتباط با سرور",
        };
    }
}

