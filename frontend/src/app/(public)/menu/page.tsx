"use client";

import ProductCard from "@/components/product.card";
import { useFindAllProducts } from "@/hooks/product.hook";
import { useFindAllCategories } from "@/hooks/category.hook";
import { useState, useRef } from "react";
import { useProductStore } from "@/stores/product.store";
import PaginationPage from "@/components/pagination";
import { SpinnerCustom } from "@/components/loading";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AiFillProduct } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import bgImage from "../../../../public/background-coffee.png";

export default function MenuPage() {
  const debouncedSearch = useRef<ReturnType<typeof setTimeout>>(null);
  const { page, setPage, productName, setProductName, slug, setSlug } =
    useProductStore();
  const [search, setSearch] = useState(productName ?? "");

  const limit = 6;
  const offset = (page - 1) * limit;

  // products data
  const { data: product, isLoading } = useFindAllProducts(
    limit,
    offset,
    productName,
    slug,
  );

  const productData = product?.data ?? [];
  const totalProducts = product?.meta.total ?? 0;
  const totalPages = Math.ceil(totalProducts / limit);

  //   category data
  const { data: category } = useFindAllCategories();
  const categories = category ?? [];

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSlug(e.target.value);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }
    debouncedSearch.current = setTimeout(() => {
      setProductName(value);
      setPage(1);
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen flex justify-center">
        <div className="p-4">
          <div className="pb-2">
            <h1 className="font-semibold text-lg ">
              Temukan menu favorit anda..
            </h1>
          </div>

          <div className="pb-4">
            <Image src={bgImage} alt="" className="w-full h-full" />
          </div>

          <div className="pb-4 flex gap-6 items-center justify-between">
            <div className="relative">
              <Input
                className="w-55 pr-8"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
              />
              <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <NativeSelect onChange={handleSelectCategory} value={slug}>
              <NativeSelectOption value="">Select Category</NativeSelectOption>
              {categories.map((cat) => (
                <NativeSelectOption key={cat.id} value={cat.slug}>
                  {cat.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {isLoading ? (
            <div className="h-130 flex items-center justify-center">
              <SpinnerCustom />
            </div>
          ) : (
            <>
              {productData?.length === 0 ? (
                <div>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <AiFillProduct />
                      </EmptyMedia>
                      <EmptyTitle>products is empty</EmptyTitle>
                      <EmptyDescription>No products found</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 items-center justify-center">
                  {productData?.map((product) => (
                    <ProductCard key={product.id} data={product} />
                  ))}
                </div>
              )}
              <div className="pt-4 pb-17">
                <PaginationPage totalPages={totalPages} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
