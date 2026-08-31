"use client";

import { useParams } from "next/navigation";
import { useFindProductById } from "@/hooks/product.hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { SpinnerCustom } from "@/components/loading";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useFindProductById(id);
  const productData = product ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [count, setCount] = useState(1);

  const variantProduct = productData?.variant.find(
    (data) => data.id === selectedVariantId,
  );

  const handleSelectVariant = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariantId(e.target.value);
  };

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1 || 1);

  const totalPrice = (variantProduct?.price ?? 0) * count;

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <SpinnerCustom />
        </div>
      ) : (
        <div className="md:w-70 w-full">
          <CardHeader>
            <img
              src={productData?.imageUrl}
              alt={productData?.description}
              className="w-125 aspect-3/4 object-cover"
            />
          </CardHeader>
          <CardContent className="px-4 mt-4">
            <p className="text-lg">{productData?.productName}</p>
          </CardContent>

          <div className="flex flex-col items-start justify-between py-4 px-4">
            <div className="flex items-center justify-between gap-2 w-full">
              {variantProduct ? (
                <span className="font-bold">Rp.{variantProduct.price}K</span>
              ) : (
                <span className="font-bold">
                  Rp.{productData?.variant[0].price}K
                </span>
              )}

              {/* variant options */}
              <NativeSelect
                onChange={handleSelectVariant}
                value={selectedVariantId ?? ""}
              >
                <NativeSelectOption value="">Pilih Variant</NativeSelectOption>
                {productData?.variant.map((data) => (
                  <NativeSelectOption key={data.id} value={data.id}>
                    {data.variantName}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <CardDescription className="pt-2">
              <p className="font-bold text-black">Deskripsi:</p>
              <span>{productData?.description}</span>
            </CardDescription>

            {/* total and add to cart */}
            <div className="pt-4 flex items-center justify-between w-full">
              <p className="font-bold">Total: Rp.{totalPrice}K</p>
              <div>
                <Button variant="secondary" onClick={handleDecrement}>
                  -
                </Button>
                <span className="px-3">{count}</span>
                <Button variant="secondary" onClick={handleIncrement}>
                  +
                </Button>
              </div>
            </div>

            {/* add to cart button */}
            <div className="pt-4 w-full">
              <Button className="w-full">Add to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
