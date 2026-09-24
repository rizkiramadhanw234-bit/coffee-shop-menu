"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFindAllProducts } from "@/hooks/product.hook";
import { useProductStore } from "@/stores/product.store";
import { useFindAllCategories } from "@/hooks/category.hook";
import { useState, useRef } from "react";
import MenuDetail from "@/components/menu.detail";
import ProductModal from "@/components/modals/product.modal";

export default function MenuProduct() {
  const debouncedSearch = useRef<ReturnType<typeof setTimeout>>(null);
  const [search, setSearch] = useState("");

  const { page, setPage, productName, setProductName, slug, setSlug } =
    useProductStore();
  const limit = 10;
  const offset = (page - 1) * limit;

  const { data: products } = useFindAllProducts(
    limit,
    offset,
    productName,
    slug,
  );
  const dataProducts = products?.data ?? [];
  const totalProduct = products?.meta.total ?? 0;

  const { data: category } = useFindAllCategories();
  const totalCategory = category?.length;

  const menuAvailable = products?.data.filter(
    (data) => data.status === "available",
  );

  const menuUnvailable = products?.data.filter(
    (data) => data.status === "unvailable",
  );

  return (
    <div>
      <h1 className="font-bold text-2xl">Menu</h1>
      <div className="flex items-center justify-between gap-4 py-4">
        <Card className="px-2 w-full">
          <span className="absolute ml-4">Icon</span>
          <div className="flex flex-col items-center gap-2">
            <p>Total Menu</p>
            <span>{totalProduct}</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center gap-2">
            <p>Category</p>
            <span>{totalCategory}</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center gap-2">
            <p>Menu Availabe</p>
            <span>{menuAvailable?.length}</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center gap-2">
            <p>Menu Unavailable</p>
            <span>{menuUnvailable?.length}</span>
          </div>
        </Card>
      </div>

      {/* search */}
      <div>
        <ProductModal product={null} />
      </div>
      <div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">No.</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataProducts.map((data, i) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell>
                  <div>
                    <img
                      src={data.imageUrl}
                      alt=""
                      className="w-17 h-17 rounded-2xl"
                    />
                  </div>
                </TableCell>
                <TableCell>{data.productName}</TableCell>
                <TableCell>{data.category.name}</TableCell>
                <TableCell>{data.status}</TableCell>
                <TableCell className="flex items-end justify-end gap-2">
                  <MenuDetail productId={data.id} />
                  <ProductModal product={data} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
