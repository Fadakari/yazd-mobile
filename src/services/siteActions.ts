export async function GetActiveLogo() {
    try {
    const res = await fetch("https://api.rejimfakhr.com/home/active-logo/", {
      cache: "no-store", // <--- جلوگیری کامل از کش شدن لوگو
    });

    if (!res.ok) return "/logo.png";
    const data = await res.json();
    const active = Array.isArray(data) ? data[0] : data;
    return active?.image || "/logo.png";
  } catch (error) {
    return "/logo.png";
  }
}