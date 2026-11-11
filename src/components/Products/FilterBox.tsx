"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { BiSearch } from "react-icons/bi";
import { MdChevronLeft } from "react-icons/md";
import { useEffect, useRef, useState, useTransition } from "react";
import { GoChevronUp } from "react-icons/go";
import { NumberInput, Slider, SliderValue } from "@heroui/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";

const minPrice = 3000;
const maxPrice = 459420000;

export default function FilterBox({
  selected,
  isShow,
  brands: initialBrands = [],
}: {
  selected?: boolean;
  isShow?: boolean;
  brands?: any[];
}) {
  const categories = useCategories();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["1"]));
  const [selectedKeys2, setSelectedKeys2] = useState<any>(new Set(["1"]));
  const [value, setValue] = useState<SliderValue>([
    Number(searchParams?.get("min_price")) || minPrice,
    Number(searchParams?.get("max_price")) || maxPrice,
  ]);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  const [searchCategory, setSearchCategory] = useState<string>("");

  const brands = initialBrands;
  const [searchBrand, setSearchBrand] = useState<string>("");
  const [selectedKeysBrand, setSelectedKeysBrand] = useState<any>(new Set(["1"]));

  const searchedBrands = brands.filter((b) =>
    b.name?.toLowerCase().includes(searchBrand.toLowerCase())
  );

  useEffect(() => {
    if (Array.isArray(value)) {
      setMinInput(value[0]);
      setMaxInput(value[1]);
    }
  }, [value]);

  const reverseValue = (val: SliderValue) => {
    if (Array.isArray(val)) {
      return [maxPrice - (val[1] - minPrice), maxPrice - (val[0] - minPrice)];
    }
    return maxPrice - ((val as number) - minPrice);
  };

  const handleSliderChange = (val: SliderValue) => {
    if (Array.isArray(val)) setValue(reverseValue(val));
  };

  const handleMinChange = (val: number) => {
    setMinInput(val);
    setValue([val, maxInput]);
  };

  const handleMaxChange = (val: number) => {
    setMaxInput(val);
    setValue([minInput, val]);
  };

  const applyFilters = (params: Record<string, any>) => {
    startTransition(() => {
      const query = new URLSearchParams(searchParams);
      if (params.category_id !== undefined) {
        if (params.category_id === null) query.delete("category_id");
        else query.set("category_id", params.category_id.toString());
      }
      if (params.brand_id !== undefined) {
        if (params.brand_id === null) query.delete("brand_id");
        else query.set("brand_id", params.brand_id.toString());
      }
      if (params.min_price !== undefined)
        query.set("min_price", params.min_price.toString());
      if (params.max_price !== undefined)
        query.set("max_price", params.max_price.toString());
      if (params.is_available !== undefined) {
        if (params.is_available === false) {
          query.delete("is_available");
        } else {
          query.set("is_available", String(params.is_available));
        }
      }
      if (params.is_featured !== undefined)
        query.set("is_featured", String(params.is_featured));
      if (params.search) query.set("search", params.search);
      if (params.new_days !== undefined)
        query.set("new_days", params.new_days.toString());
      if (params.sort) query.set("sort", params.sort);
      if (params.page !== undefined) query.set("page", params.page.toString());

      router.push(`${pathname}?${query.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const searchedCategories = categories?.filter((i) =>
    i.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const activeFilters = {
    category_id: searchParams.get("category_id"),
    brand_id: searchParams.get("brand_id"),
    min_price: searchParams.get("min_price"),
    max_price: searchParams.get("max_price"),
    is_available: searchParams.get("is_available"),
  };

  const hasActiveFilter = Object.values(activeFilters).some(Boolean);
  const [isClearing, setIsClearing] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      setHasScroll(listRef.current.scrollHeight > listRef.current.clientHeight);
    }
  }, [searchedCategories]);

  return (
    <div className={`w-full flex-col gap-4 ${isShow ? "flex" : "hidden lg:flex"}`}>
      {/* Clear Filters Button */}
      {hasActiveFilter && (
        <button
          onClick={() => {
            setIsClearing(true);
            startTransition(() => {
              router.push(pathname);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsClearing(false);
            });
          }}
          disabled={isPending && isClearing}
          className="text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all py-3 font-bold text-xs rounded-xl shadow-lg shadow-red-500/20 disabled:opacity-50 w-full"
        >
          {isPending && isClearing ? "در حال پاکسازی..." : "حذف تمام فیلترها"}
        </button>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilter && (
        <div className="bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl p-4 text-xs text-zinc-700 space-y-2.5 shadow-md">
          <p className="font-bold text-amber-400">فیلترهای فعال:</p>
          <ul className="space-y-1.5 leading-5 text-[11px]">
            {activeFilters.is_available && (
              <li className="flex items-center gap-1.5 text-zinc-900">
                <span className="text-amber-400 font-bold">•</span>
                <span>فقط کالاهای موجود</span>
              </li>
            )}
            {activeFilters.category_id && (
              <li className="flex items-center gap-1.5 text-zinc-900">
                <span className="text-amber-400 font-bold">• دسته‌بندی:</span>
                <span className="text-white font-semibold">
                  {categories?.find((c) => c.id.toString() === activeFilters.category_id)?.name || ""}
                </span>
              </li>
            )}
            {activeFilters.brand_id && (
              <li className="flex items-center gap-1.5 text-zinc-900">
                <span className="text-amber-400 font-bold">• برند:</span>
                <span className="text-white font-semibold">
                  {brands?.find((b) => b.id.toString() === activeFilters.brand_id)?.name || ""}
                </span>
              </li>
            )}
            {activeFilters.min_price && activeFilters.max_price && (
              <li className="flex items-center gap-1.5 text-zinc-900">
                <span className="text-amber-400 font-bold">• قیمت:</span>
                <span className="text-amber-300 font-semibold">
                  {Number(activeFilters.min_price).toLocaleString("fa-IR")} تا{" "}
                  {Number(activeFilters.max_price).toLocaleString("fa-IR")} تومان
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Available Only Toggle */}
      <div className="bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-md">
        <span className="text-xs text-zinc-900 font-medium">نمایش کالاهای موجود</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={searchParams.get("is_available") === "true"}
            onChange={(e) => applyFilters({ is_available: e.target.checked })}
          />
          <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {/* Categories Accordion */}
      <div className="bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl p-4 shadow-md relative text-zinc-900">
        <GoChevronUp
          className={`size-5 absolute top-5 left-5 text-amber-400 transition-transform duration-300 ${
            selectedKeys.size === 1 ? "-rotate-180" : "rotate-0"
          }`}
        />
        <Accordion
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          showDivider={false}
          hideIndicator
          className="!px-0"
        >
          <AccordionItem
            key="1"
            title="دسته‌بندی محصولات"
            classNames={{ title: "text-xs font-bold text-zinc-950 pr-1" }}
          >
            <div className="relative w-full flex items-center my-2">
              <input
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                autoComplete="off"
                type="search"
                placeholder="جستجو در دسته‌ها..."
                className="p-2.5 pr-9 bg-zinc-50 border border-zinc-200 rounded-xl w-full text-xs text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-amber-400 transition-colors"
              />
              <BiSearch className="size-4 absolute top-3 right-3 text-amber-400 pointer-events-none" />
            </div>

            <ul
              className="overflow-y-auto max-h-56 text-zinc-700 pt-2 space-y-1 text-xs"
              ref={listRef}
            >
              {Array.isArray(searchedCategories) && searchedCategories.length > 0 ? (
                searchedCategories.map((cat) => {
                  const selectedId = searchParams.get("category_id");
                  const isParentSelected = selectedId === cat.id.toString();
                  const isChildSelected = cat.children?.some(
                    (child) => child.id.toString() === selectedId
                  );

                  return (
                    <li key={cat.id} className="rounded-lg">
                      <button
                        onClick={() => applyFilters({ category_id: cat.id })}
                        className={`w-full py-2 px-2.5 rounded-lg flex items-center justify-between text-right transition-colors ${
                          isParentSelected
                            ? "bg-amber-400/15 text-amber-400 font-bold"
                            : "hover:bg-white/5 text-zinc-700 hover:text-white"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <MdChevronLeft className="size-4 text-amber-400/60" />
                      </button>

                      {(isParentSelected || isChildSelected) &&
                        cat.children &&
                        cat.children.length > 0 && (
                          <ul className="pr-4 border-r border-zinc-200 my-1 space-y-1">
                            {cat.children.map((child) => {
                              const isChildActive = selectedId === child.id.toString();
                              return (
                                <li key={child.id}>
                                  <button
                                    onClick={() => applyFilters({ category_id: child.id })}
                                    className={`w-full py-1.5 px-2 rounded-lg flex items-center justify-between text-right text-[11px] transition-colors ${
                                      isChildActive
                                        ? "text-amber-400 font-bold bg-amber-400/10"
                                        : "text-zinc-500 hover:text-zinc-900"
                                    }`}
                                  >
                                    <span>{child.name}</span>
                                    <MdChevronLeft className="size-3" />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                    </li>
                  );
                })
              ) : (
                <p className="text-center text-slate-500 py-3 text-xs">دسته‌بندی یافت نشد</p>
              )}
            </ul>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Brands Accordion (if brands available) */}
      {brands && brands.length > 0 && (
        <div className="bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl p-4 shadow-md relative text-zinc-900">
          <GoChevronUp
            className={`size-5 absolute top-5 left-5 text-amber-400 transition-transform duration-300 ${
              selectedKeysBrand.size === 1 ? "-rotate-180" : "rotate-0"
            }`}
          />
          <Accordion
            selectedKeys={selectedKeysBrand}
            onSelectionChange={setSelectedKeysBrand}
            showDivider={false}
            hideIndicator
            className="!px-0"
          >
            <AccordionItem
              key="1"
              title="برندها و تولیدکنندگان"
              classNames={{ title: "text-xs font-bold text-zinc-950 pr-1" }}
            >
              <div className="relative w-full flex items-center my-2">
                <input
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  autoComplete="off"
                  type="search"
                  placeholder="جستجوی برند..."
                  className="p-2.5 pr-9 bg-zinc-50 border border-zinc-200 rounded-xl w-full text-xs text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-amber-400 transition-colors"
                />
                <BiSearch className="size-4 absolute top-3 right-3 text-amber-400 pointer-events-none" />
              </div>
              <ul className="overflow-y-auto max-h-56 text-zinc-700 pt-2 space-y-1 text-xs">
                {searchedBrands.length > 0 ? (
                  searchedBrands.map((brand) => {
                    const selectedId = searchParams.get("brand_id");
                    const isSelected = selectedId === brand.id.toString();
                    return (
                      <li key={brand.id}>
                        <button
                          onClick={() => applyFilters({ brand_id: isSelected ? null : brand.id })}
                          className={`w-full py-2 px-2.5 rounded-lg flex items-center justify-between text-right transition-colors ${
                            isSelected
                              ? "bg-amber-400/15 text-amber-400 font-bold"
                              : "hover:bg-white/5 text-zinc-700 hover:text-white"
                          }`}
                        >
                          <span>{brand.name}</span>
                          <MdChevronLeft className="size-4 text-amber-400/60" />
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-center text-slate-500 py-3 text-xs">برندی یافت نشد</p>
                )}
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Price Range Accordion */}
      <div className="bg-white border border-zinc-200/90 backdrop-blur-md rounded-2xl p-4 shadow-md relative text-zinc-900">
        <GoChevronUp
          className={`size-5 absolute top-5 left-5 text-amber-400 transition-transform duration-300 ${
            selectedKeys2.size === 1 ? "-rotate-180" : "rotate-0"
          }`}
        />
        <Accordion
          selectedKeys={selectedKeys2}
          onSelectionChange={setSelectedKeys2}
          showDivider={false}
          hideIndicator
          className="!px-0"
        >
          <AccordionItem
            key="1"
            title="محدوده قیمت"
            classNames={{ title: "text-xs font-bold text-zinc-950 pr-1" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilters({ min_price: minInput, max_price: maxInput });
              }}
              className="flex flex-col w-full pt-2"
            >
              <Slider
                className="w-full border-none px-2 mb-4"
                maxValue={maxPrice}
                minValue={minPrice}
                renderThumb={(props) => (
                  <div
                    {...props}
                    className="p-px top-1/2 bg-amber-400 shadow-md rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                  >
                    <span className="bg-slate-950 rounded-full size-4 block" />
                  </div>
                )}
                classNames={{
                  filler: "bg-gradient-to-r from-red-600 to-amber-500",
                  track: "bg-zinc-200 h-1.5 rounded-full !border-none",
                }}
                hideValue
                value={reverseValue(value)}
                onChange={handleSliderChange}
                dir="rtl"
                aria-label="محدوده قیمت"
              />

              <div className="flex w-full justify-between items-center bg-zinc-50 rounded-xl p-3 my-2 text-xs border border-zinc-200">
                <div className="flex flex-col items-center gap-1 w-1/2 border-l border-zinc-200 pl-2">
                  <span className="text-[11px] text-zinc-500">از</span>
                  <span className="font-black text-red-700 text-xs">
                    {minInput.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[10px] text-zinc-500">تومان</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-1/2 pr-2">
                  <span className="text-[11px] text-zinc-500">تا</span>
                  <span className="font-black text-red-700 text-xs">
                    {maxInput.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[10px] text-zinc-500">تومان</span>
                </div>
              </div>

              <button
                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs shadow-md shadow-red-500/20 hover:from-red-500 hover:to-amber-500 transition-all disabled:opacity-50"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "در حال اعمال..." : "اعمال فیلتر قیمت"}
              </button>
            </form>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
