import localFont from "next/font/local";

export const iranyekan = localFont({
    variable: "--font-iranyekan",
    display: "swap",
    src: [
        {
            path: "../../public/fonts/iranyekanwebregular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
});

export const pelak = localFont({
    variable: "--font-pelak",
    display: "swap",
    src: [
        {
            path: "../../public/fonts/Pelak-Regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
});

export const noora = localFont({
    variable: "--font-noora",
    display: "swap",
    src: [
        {
            path: "../../public/fonts/Noora Fa-En 03 Regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
});

export const dana = localFont({
    variable: "--font-dana",
    display: "swap",
    src: [
        {
            path: "../../public/fonts/dana-fanum-regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
});
