"use client";
import { ProductType } from "@/types/product.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ProductProps {
  data: ProductType;
}

export default function ProductCard({ data }: ProductProps) {
  const router = useRouter();
  return (
    <>
      <Card className="md:w-70 w-45">
        <CardHeader onClick={() => router.push(`/menu/${data.id}`)}>
          <img
            src={data.imageUrl}
            alt={data.description}
            className="w-full aspect-square object-cover rounded-md"
          />
        </CardHeader>
        <CardContent>
          <p>{data.productName}</p>
          <CardDescription>
            {data.description.slice(0, 20) + "..."}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p>Rp.{data.variant[0]?.price}K</p>
          <Button variant="default">
            <span className="text-xs">Add to cart</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
