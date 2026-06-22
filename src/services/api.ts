import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,

    },
    
    withCredentials: true
});

// api.interceptors.response.use(
//     res => res,
//     async err => {
//         const originalRequest = err.config;
//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const res = await fetch("/api/auth/refresh", {
//                     method: "POST",
//                     credentials: "include", // بسیار مهم برای ارسال کوکی HttpOnly
//                 });

//                 if (res.ok) {
//                     return api(originalRequest); // retry
//                 } else {
//                 }
//             } catch {
//             }
//         }

//         return Promise.reject(err);
//     }
// )

export default api;
