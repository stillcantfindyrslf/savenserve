import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Slider,
  Divider,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
} from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import { ItemWithImages } from "@/store/useItemStore/types";
import { FaFilter } from "react-icons/fa6";
import CustomBadge from "./CustomBadge";

interface ProductFiltersProps {
  items: ItemWithImages[];
  searchParams: URLSearchParams;
  categoryPath: string;
  onFilterChange: (filterParams: URLSearchParams) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  items,
  searchParams,
  onFilterChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const hasDiscount = searchParams.get("hasDiscount") === "true";
  const brand = searchParams.get("brand");
  const country = searchParams.get("country");
  const bestBeforeMax = searchParams.get("bestBeforeMax");

  useEffect(() => {
    if (items?.length) {
      const brands = new Set<string>();
      items.forEach(item => {
        if (item.brand) brands.add(item.brand);
      });
      setAvailableBrands(Array.from(brands).sort());

      const countries = new Set<string>();
      items.forEach(item => {
        if (item.country_of_origin) countries.add(item.country_of_origin);
      });
      setAvailableCountries(Array.from(countries).sort());

      const prices = items.map(item => item.price).filter(price => price > 0);
      if (prices.length) {
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceRange([min, max]);
      }
    }
  }, [items]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (minPrice !== null) count++;
    if (maxPrice !== null) count++;
    if (hasDiscount) count++;
    if (brand) count++;
    if (country) count++;
    if (bestBeforeMax) count++;
    return count;
  };

  const handleFilterChange = (filterType: string, value: string | boolean | number | null) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === null || value === "" || value === false) {
      newParams.delete(filterType);
    } else {
      newParams.set(filterType, value.toString());
    }

    onFilterChange(newParams);
  };

  const handlePriceRangeChange = (values: number[]) => {
    if (values.length === 2) {
      const [min, max] = values;
      const newParams = new URLSearchParams(searchParams.toString());

      if (min > priceRange[0]) {
        newParams.set("minPrice", min.toString());
      } else {
        newParams.delete("minPrice");
      }

      if (max < priceRange[1]) {
        newParams.set("maxPrice", max.toString());
      } else {
        newParams.delete("maxPrice");
      }

      onFilterChange(newParams);
    }
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();
    const sortOrder = searchParams.get("sortOrder");

    if (sortOrder) {
      newParams.set("sortOrder", sortOrder);
    }

    onFilterChange(newParams);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="flat"
        startContent={<FaFilter size={20} className="text-color-text mt-0.5" />}
        className="bg-gray-50 text-gray-700 gap-1.5 text-color-text hover:underline"
        endContent={getActiveFilterCount() > 0 &&
          <CustomBadge count={getActiveFilterCount()} />
        }
        onPress={() => setIsOpen(true)}
      >
        Фильтры
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        placement="right"
        size="sm"
        hideCloseButton
      >
        <DrawerContent>
          <DrawerHeader className="flex justify-between items-center py-3 px-4">
            <h3 className="text-lg font-semibold text-color-text">Фильтры товаров</h3>
            <Button isIconOnly variant="light" onPress={() => setIsOpen(false)}>
              <IoClose size={22} className="text-color-text" />
            </Button>
          </DrawerHeader>

          <DrawerBody className="px-4 py-3">
            <div className="space-y-5">
              <div>
                <h4 className="font-medium mb-2 text-color-text">Диапазон цен</h4>
                <Slider
                  minValue={priceRange[0]}
                  maxValue={priceRange[1]}
                  value={[
                    minPrice !== null ? minPrice : priceRange[0],
                    maxPrice !== null ? maxPrice : priceRange[1]
                  ]}
                  onChange={(values) => {
                    if (Array.isArray(values)) {
                      handlePriceRangeChange(values);
                    }
                  }}
                  color="primary"
                  showSteps={false}
                  step={1}
                  size="md"
                  classNames={{
                    base: "px-1",
                    track: "bg-gray-200/70",
                    filler: "bg-green-500"
                  }}
                  renderThumb={props => (
                    <div
                      {...props}
                      className="group p-1 top-1/2 bg-white border-2 border-green-500 rounded-full cursor-grab active:cursor-grabbing"
                    >
                      <span className="block w-2 h-2 rounded-full bg-green-500 group-active:w-3 group-active:h-3 transition-all" />
                    </div>
                  )}
                />
                <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
                  <div className="border border-gray-200 rounded-lg py-1 px-2 bg-white/60 text-center">
                    {minPrice !== null ? minPrice : priceRange[0]} р.
                  </div>
                  <div className="border-t border-dashed border-gray-300 flex-1 mx-2"></div>
                  <div className="border border-gray-200 rounded-lg py-1 px-2 bg-white/60 text-center">
                    {maxPrice !== null ? maxPrice : priceRange[1]} р.
                  </div>
                </div>
              </div>

              <Divider className="bg-gray-200 my-3" />

              <div>
                <h4 className="font-medium mb-2 text-color-text">Скидки</h4>
                <Checkbox
                  isSelected={hasDiscount}
                  onValueChange={(checked) => handleFilterChange("hasDiscount", checked)}
                  size="md"
                  color="success"
                  className="px-3"
                >
                  <span className="text-color-text">Товары со скидкой</span>
                </Checkbox>
              </div>

              {availableBrands.length > 0 && (
                <>
                  <Divider className="bg-gray-200 my-3" />

                  <div>
                    <h4 className="font-medium mb-2 text-color-text">Бренд</h4>
                    <Select
                      label="Выберите бренд"
                      placeholder="Все бренды"
                      selectedKeys={brand ? [brand] : []}
                      onChange={(e) => handleFilterChange("brand", e.target.value || null)}
                      radius="lg"
                      items={[
                        { key: "", value: "", label: "Все бренды" },
                        ...availableBrands.map(brandName => ({
                          key: brandName,
                          value: brandName,
                          label: brandName
                        }))
                      ]}
                    >
                      {(item) => (
                        <SelectItem key={item.key} value={item.value}>
                          {item.label}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                </>
              )}

              {availableCountries.length > 0 && (
                <>
                  <Divider className="bg-gray-200 my-3" />

                  <div>
                    <h4 className="font-medium mb-2 text-color-text">Страна производства</h4>
                    <Select
                      label="Выберите страну"
                      placeholder="Все страны"
                      selectedKeys={country ? [country] : []}
                      onChange={(e) => handleFilterChange("country", e.target.value || null)}
                      radius="lg"
                      items={[
                        { key: "", value: "", label: "Все страны" },
                        ...availableCountries.map(countryName => ({
                          key: countryName,
                          value: countryName,
                          label: countryName
                        }))
                      ]}
                    >
                      {(item) => (
                        <SelectItem key={item.key} value={item.value}>
                          {item.label}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                </>
              )}

              <Divider className="bg-gray-200 my-3" />

              <div>
                <h4 className="font-medium mb-2 text-color-text">Срок годности</h4>
                <RadioGroup
                  value={bestBeforeMax || ""}
                  onValueChange={(value) => handleFilterChange("bestBeforeMax", value || null)}
                  color="success"
                  size="md"
                  classNames={{
                    base: "px-1",
                    wrapper: "gap-2"
                  }}
                >
                  <Radio value=""><span className="text-color-text">Любой срок</span></Radio>
                  <Radio value="7"><span className="text-color-text">До 7 дней</span></Radio>
                  <Radio value="14"><span className="text-color-text">До 14 дней</span></Radio>
                  <Radio value="30"><span className="text-color-text">До 30 дней</span></Radio>
                </RadioGroup>
              </div>
            </div>
          </DrawerBody>

          <DrawerFooter className="px-4 py-3">
            <div className="flex gap-3 w-full">
              <Button
                variant="flat"
                color="default"
                className="flex-1 hover:bg-gray-300"
                radius="sm"
                size="md"
                onPress={handleResetFilters}
              >
                Сбросить
              </Button>

              <Button
                className="flex-1 bg-green-500 text-white"
                radius="sm"
                size="md"
                onPress={() => setIsOpen(false)}
              >
                Закрыть
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProductFilters;