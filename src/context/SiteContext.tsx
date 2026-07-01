"use client";

import { createContext, useContext } from "react";

const SiteContext = createContext({
  logo: "/logo.png",
});

export function SiteProvider({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo: string;
}) {
  return (
    <SiteContext.Provider
      value={{
        logo,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}