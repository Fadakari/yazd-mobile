const fs = require('fs');
const path = './src/components/Products/FilterBox.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Props
content = content.replace(
  /isShow\?:\s*boolean;\s*\}/,
  `isShow?: boolean;\n  brands?: any;\n}`
);

// 2. Add brandKeys State
content = content.replace(
  /const \[selectedKeys, setSelectedKeys\] = useState<any>\(new Set\(\["1"\]\)\);/,
  `const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["1"]));\n  const [brandKeys, setBrandKeys] = useState<any>(new Set(["1"]));`
);

// 3. Add searchBrand State
content = content.replace(
  /const \[searchCategory, setSearchCategory\] = useState\(""\);/,
  `const [searchCategory, setSearchCategory] = useState("");\n  const [searchBrand, setSearchBrand] = useState("");`
);

// 4. Update activeFilters
content = content.replace(
  /const activeFilters = \{/,
  `const activeFilters = {\n    brand_id: searchParams.get("brand_id"),`
);

// 5. Update searchedCategories
content = content.replace(
  /const searchedCategories = categories\?\.filter\(\(i\) =>/,
  `const searchedBrands = brands?.filter((i: any) =>\n    i.name.toLowerCase().includes(searchBrand.toLowerCase())\n  );\n\n  const searchedCategories = categories?.filter((i) =>`
);

// 6. Update hasScroll refs
content = content.replace(
  /const \[hasScroll, setHasScroll\] = useState\(false\);/,
  `const [hasScroll, setHasScroll] = useState(false);\n  const brandListRef = useRef<HTMLUListElement>(null);\n  const [brandHasScroll, setBrandHasScroll] = useState(false);`
);

content = content.replace(
  /if \(listRef\.current\) \{\n\s*setHasScroll\(listRef\.current\.scrollHeight > listRef\.current\.clientHeight\);\n\s*\}/,
  `if (listRef.current) {\n      setHasScroll(listRef.current.scrollHeight > listRef.current.clientHeight);\n    }\n    if (brandListRef.current) {\n      setBrandHasScroll(brandListRef.current.scrollHeight > brandListRef.current.clientHeight);\n    }`
);

content = content.replace(
  /\}, \[searchedCategories\]\);/,
  `}, [searchedCategories, searchedBrands]);`
);

// 7. Add Active Brand Display
content = content.replace(
  /\{activeFilters\.category_id && \(/,
  `{activeFilters.brand_id && (
              <li className="flex items-center gap-1">
                <span className="text-zinc-500">▪ برند:</span>
                <span className="text-zinc-800 font-medium">
                  {
                    brands?.find(
                      (b: any) => b.id.toString() === activeFilters.brand_id
                    )?.name
                  }
                </span>
              </li>
            )}
            {activeFilters.category_id && (`
);

// 8. Add Brand Accordion
const brandAccordion = `        </Accordion>
      </div>
      <div className="bg-white shadow rounded-sm px-3 py-0 text-zinc-700 relative mt-2">
        <GoChevronUp
          className={\`size-5 absolute top-5 left-5 transition-transform duration-300 \${
            brandKeys.size === 1 ? "-rotate-180" : "rotate-0"
          }\`}
        />
        <Accordion
          selectedKeys={brandKeys}
          onSelectionChange={setBrandKeys}
          showDivider={false}
          hideIndicator
        >
          <AccordionItem key="1" title="برند">
            <div className="relative w-full flex items-center">
              <input
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                autoComplete="off"
                type="search"
                placeholder="جستجو ..."
                className="p-2 pr-10 border border-zinc-300 rounded-xs w-full outline-none"
              />
              <BiSearch className="size-6 absolute top-3 right-2 text-zinc-400" />
            </div>
            {brandHasScroll && (
              <div className="absolute bg-gradient-to-t from-black/10 to-transparent w-full h-10 bottom-0 left-0 pointer-events-none"></div>
            )}
            <ul
              className="overflow-y-auto max-h-64 text-zinc-500 pt-4 relative rounded-2xl mb-2 xl:mb-4"
              ref={brandListRef}
            >
              {Array.isArray(searchedBrands) &&
              searchedBrands.length > 0 ? (
                searchedBrands.map((brand: any) => {
                  const selectedId = searchParams.get("brand_id");
                  const isSelected = selectedId === brand.id.toString();

                  return (
                    <li key={brand.id} className="mb-1">
                      <button
                        onClick={() => applyFilters({ brand_id: isSelected ? "" : brand.id })}
                        className={\`py-2 flex items-center gap-1 \${
                          isSelected ? "text-primary-500 font-bold" : ""
                        }\`}
                      >
                        <MdChevronLeft className="size-5" />
                        <span>{brand.name}</span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-zinc-400">برندی موجود نیست</li>
              )}
            </ul>
          </AccordionItem>`;

content = content.replace(
  /<\/Accordion>\s*<\/div>\s*<div className="relative bg-white shadow rounded-sm py-0 text-zinc-700">/,
  brandAccordion + '\n        </Accordion>\n      </div>\n      <div className="relative bg-white shadow rounded-sm py-0 text-zinc-700">'
);

fs.writeFileSync(path, content, 'utf8');
