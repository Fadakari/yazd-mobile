const fs = require('fs');
const path = './src/components/Products/FilterBox.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `          </Accordion>
        </div>
        <div className="relative bg-white shadow rounded-sm py-0 text-zinc-700">`;

const brandAccordion = `          </Accordion>
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
            </AccordionItem>
          </Accordion>
        </div>
        <div className="relative bg-white shadow rounded-sm py-0 text-zinc-700">`;

content = content.replace(targetStr, brandAccordion);
fs.writeFileSync(path, content, 'utf8');
