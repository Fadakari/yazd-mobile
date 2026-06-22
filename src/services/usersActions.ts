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
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "خطا در تأیید کد");
    }

    addToast({
        title: data.message || "ثبت نام با موفقیت تکمیل شد",
    });
    location.reload()
    return await res.json();
};
// otp
export const sendOtp = async (phone_number: string) => {
    try {
        const result = await api.post("/users/otp/request/", { phone_number })
        if (result.status == 200) {
            addToast({
                title: "کد تایید با موفیقت به شماره تلفن شما ارسال شد ",
                description: phone_number
            })
            return result
        } else if (result.status == 400) {
            addToast({
                title: "شماره تلفن باید ۱۱ رقم باشد",
                description: phone_number,
                color: "danger"
            })
        }
    } catch (error: any) {
        console.log(error)

        addToast({
            title: error?.response?.message || "ورود ناموفق بود"
        })
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
            throw new Error(data.error || "خطا در تأیید کد");
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
    const res = await api.post("/users/check-user-status/", { phone_number: phone });
    const data = await res.data;
    return data?.has_password;
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

