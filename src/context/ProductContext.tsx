"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { ProductColor, ProductMaterial } from "@/types/product";

interface ProductOptionsContextType {
  selectedColor: ProductColor | null;
  setSelectedColor: (color: ProductColor | null) => void;
  selectedMaterial: ProductMaterial | null;
  setSelectedMaterial: (material: ProductMaterial | null) => void;
}

const ProductContext = createContext<ProductOptionsContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
  product: { color?: ProductColor[]; material?: ProductMaterial[] };
}

function findFirstAvailable<T extends { stock?: number }>(
  items: T[]
): T | null {
  if (!items || items.length === 0) return null;
  return items.find((item) => (item.stock ?? 0) > 0) ?? null;
}

export const ProductProvider = ({ children, product }: ProviderProps) => {
  const colors = useMemo(() => product.color ?? [], [product.color]);
  const materials = useMemo(() => product.material ?? [], [product.material]);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    () => findFirstAvailable(colors)
  );

  const [selectedMaterial, setSelectedMaterial] = useState<ProductMaterial | null>(
    () => findFirstAvailable(materials)
  );

  return (
    <ProductContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        selectedMaterial,
        setSelectedMaterial,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductOptions = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductOptions must be used within a ProductProvider");
  return context;
};
