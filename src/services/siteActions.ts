export async function GetActiveLogo() {
    try {
        const res = await fetch(
            "https://api.abajstore.ir/home/active-logo/"
        );

        if (!res.ok) return "/logo.png";

        const data = await res.json();

        const active = Array.isArray(data)
            ? data[0]
            : data;

        return active?.image || "/logo.png";
    } catch {
        return "/logo.png";
    }
}