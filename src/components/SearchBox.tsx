"use client";

import { useCategories } from "@/context/CategoriesContext";
import { SearchBlogs } from "@/services/blogActions";
import { GetProducts } from "@/services/shopActions";
import { BlogCategoryNode, CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { FaArrowRightLong, FaRegFileLines } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { CiImageOff } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalContent, useDisclosure } from "@heroui/react";
import { useSite } from "@/context/SiteContext";

const initialData: {
  articles: BlogCategoryNode[];
  products: ProductType[];
  categories: CategoryNode[];
} = { articles: [], products: [], categories: [] };
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
function SearchInput({
  value,
  onChange,
  loading,
  error,
  data,
  searchValue,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  data: {
    articles: BlogCategoryNode[];
    products: ProductType[];
    categories: CategoryNode[];
  };
  searchValue: string;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { siteTitle } = useSite();
  const handleResultClick: any = () => {
    onChange("");
    onClose();
  };
  return (
    <div className="z-10 flex items-center p-2">
      <RiSearch2Line className="size-6 absolute right-5 text-zinc-400" />
      <input
        type="search"
        placeholder="جستجو در سایت.."
        autoComplete="off"
        name="search"
        id="search"
        className="hidden sm:block input !bg-white !rounded-full !border-zinc-200 !pr-10 w-full text-sm lg:text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={onOpen}
        className="block sm:hidden input !bg-white !rounded-full !border-zinc-200 !pr-10 w-full text-sm lg:text-base text-right"
      >
        جستجو در {siteTitle}..
      </button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="flex flex-col">
              <div className="relative">
                <input
                  type="search"
                  placeholder="جستجو در سایت.."
                  autoComplete="off"
                  name="search"
                  id="search"
                  className="input !bg-white !rounded-none !border-zinc-200 !pr-12 placeholder:pr-2 w-full text-xl lg:text-base"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-zinc-500"
                >
                  <FaArrowRightLong className="size-8 " />
                </button>
              </div>
              {/* نمایش نتایج در موبایل داخل مودال */}
              {searchValue.length > 2 && (
                <div className="relative z-10 mt-2">
                  <SearchResults
                    handleResultClick={handleResultClick}
                    searchValue={searchValue}
                    loading={loading}
                    error={error}
                    data={data}
                  />
                </div>
              )}
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function SearchResults({
  loading,
  error,
  data,
  searchValue,
  handleResultClick,
}: {
  loading: boolean;
  error: string | null;
  searchValue: string;
  data: {
    articles: BlogCategoryNode[];
    products: ProductType[];
    categories: CategoryNode[];
  };
  handleResultClick: () => void;
}) {
  const hasResults =
    !!data.articles?.length ||
    !!data.products?.length ||
    !!data.categories?.length;

  return (
    <motion.div
      key="search-results"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full mt-2 w-full bg-white sm:border border-zinc-200 sm:rounded-xl sm:shadow-lg z-20 text-lg sm:text-sm font-semibold overflow-auto"
    >
      {loading ? (
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-zinc-200 rounded" />
              <div className="flex-1 h-4 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-5">{error}</div>
      ) : hasResults ? (
        <>
          {data.categories?.length > 0 && (
            <>
              <ul className="space-y-2 grid grid-cols-1">
                {data.categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="hover:text-black text-zinc-600 cursor-pointer"
                  >
                    <Link
                      onClick={handleResultClick}
                      href={`/products?category_id=${cat.id}`}
                      className="size-full flex items-center justify-between hover:bg-zinc-100 p-3"
                    >
                      <p className="flex items-center gap-1">
                        همه‌ی کالاهای دسته
                        <span className="text-blue-500">
                          {highlightMatch(cat.name, searchValue)}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <hr className="text-zinc-300" />
            </>
          )}
          {data.products?.length > 0 && (
            <>
              <ul>
                {data.products.slice(0, 6).map((product) => {
                  console.log(product);
                  return (
                    <li
                      key={product.id}
                      className="hover:text-black text-zinc-600 cursor-pointer"
                    >
                      <Link
                        onClick={handleResultClick}
                        href={`/product/${product.slug}`}
                        className="p-3 hover:bg-zinc-100 w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1">
                          {product.cover_image ? (
                            <Image
                              src={product.cover_image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="size-10 rounded-sm"
                            />
                          ) : (
                            <div className="size-10 bg-zinc-200 rounded-md flex items-center justify-center">
                              <CiImageOff className="size-7" />
                            </div>
                          )}

                          {highlightMatch(product.name, searchValue)}
                        </div>
                        <p className="text-blue-500">
                          {product.is_available ? (
                            product.isDiscounted ? (
                              <div className="flex flex-col">
                                <span>
                                  {(product?.final_price ?? 0).toLocaleString(
                                    "fa-IR"
                                  )}{" "}
                                  تومان
                                </span>
                                <span className="line-through text-zinc-400 text-sm">
                                  {product.price.toLocaleString("fa-IR")} تومان
                                </span>
                              </div>
                            ) : (
                              <span>
                                {(
                                  product.final_price ??
                                  product.price ??
                                  0
                                ).toLocaleString("fa-IR")}{" "}
                                تومان
                              </span>
                            )
                          ) : (
                            "ناموجود"
                          )}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <hr className="text-zinc-300" />
            </>
          )}
          {data.articles?.length > 0 && (
            <ul>
              {data.articles.map((article) => (
                <li
                  key={article.id}
                  className="hover:text-black text-zinc-600 cursor-pointer"
                >
                  <Link
                    onClick={handleResultClick}
                    href={`/article/${article.slug}`}
                    className="size-full flex items-center justify-between hover:bg-zinc-100 p-4"
                  >
                    <p className="flex items-center gap-1">
                      <FaRegFileLines className="size-5" />
                      {highlightMatch(article.title, searchValue)}
                    </p>
                    <FiExternalLink className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="p-5 text-center text-sm text-zinc-600">
          نتیجه‌ای یافت نشد
        </div>
      )}
    </motion.div>
  );
}

export default function SearchBox() {
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categories = useCategories();
  const isMobile = useIsMobile();
  const handleResultClick: any = () => {
    setSearchValue("");
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.length > 2) {
        const fetchData = async () => {
          try {
            setLoading(true);
            setError(null);
            const [articlesRes, productsRes] = await Promise.all([
              SearchBlogs({ search: searchValue }),
              GetProducts({ search: searchValue }),
            ]);
            const filteredCategories = categories?.filter((cat) => {
              const nameMatch = cat.name
                ?.toLowerCase()
                .includes(searchValue.toLowerCase());

              const childMatch = Array.isArray(cat.children)
                ? cat.children.some((child) =>
                    child.name
                      ?.toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                : false;

              return nameMatch || childMatch;
            });
            setData({
              articles: articlesRes.data,
              products: productsRes.results,
              categories: filteredCategories || [],
            });
          } catch (err) {
            console.log(err);
            setError("مشکلی در دریافت نتایج پیش آمد");
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      } else {
        setData(initialData);
      }
    }, 500); // ۰.۵ ثانیه دیلی

    return () => clearTimeout(delayDebounce);
  }, [searchValue, categories]);

  return (
    <div className="relative w-3/4 lg:w-auto lg:min-w-96 xl:min-w-[400px]">
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        loading={loading}
        error={error}
        data={data}
        searchValue={searchValue}
      />
      {/* فقط در دسکتاپ نمایش داده بشه */}
      <AnimatePresence>
        {searchValue.length > 2 && !isMobile && (
          <SearchResults
            handleResultClick={handleResultClick}
            searchValue={searchValue}
            loading={loading}
            error={error}
            data={data}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
