"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFindProductById } from "@/hooks/product.hook";
import VariantModal from "./modals/variant.modal";

interface MenuDetailProps {
  productId: string;
}

export default function MenuDetail({ productId }: MenuDetailProps) {
  const { data: product } = useFindProductById(productId);
  const variants = product?.variant.map((variant) => variant.variantName);

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Detail</Button>} />
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto p-0 sm:max-w-xl">
        {/* Image */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          {product?.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName ?? ""}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
          {product?.category?.name && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 px-6 pb-6">
          <DialogHeader className="gap-2 text-left">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-2xl font-bold leading-tight tracking-tight">
                {product?.productName}
              </DialogTitle>
              {product?.status && (
                <Badge variant="secondary" className="shrink-0 capitalize">
                  {product.status}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {product?.description || "Belum ada deskripsi."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 border-t pt-4">
            <div>
              <VariantModal />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Variants
            </h4>
            <div className="flex flex-wrap gap-2">
              {product?.variant.map((data) => (
                <div
                  key={data.id}
                  className="flex items-center gap-2 rounded-full border bg-muted/50 py-1 pl-3 pr-1 text-sm font-medium"
                >
                  <span>{data.variantName}</span>
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold tabular-nums text-primary-foreground">
                    Rp.{data.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
