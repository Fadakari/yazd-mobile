// src/context/SiteContext.tsx
"use client";
import { createContext, useContext } from "react";

const SiteContext = createContext({
  logo: "",
  siteTitle: "سایت ما",
  mapUrl: "#",
  enamadLink: "",
  enamadImage: "",
  gatewayImage: "",
});

export function SiteProvider({ children, settings, logo }: { 
    children: React.ReactNode, 
    settings: any, 
    logo: string 
}) {
  return (
    <SiteContext.Provider value={{
      logo,
      siteTitle: settings?.site_title || "سایت ما",
      mapUrl: settings?.map_url || "#",
      enamadLink: settings?.enamad_link || "",
      enamadImage: settings?.enamad_image || "",
      gatewayImage: settings?.payment_gateway_image || "",
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() { return useContext(SiteContext); }