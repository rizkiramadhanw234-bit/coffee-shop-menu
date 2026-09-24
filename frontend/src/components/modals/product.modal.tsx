"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  ProductType,
  ProductRequest,
  UpdateProduct,
} from "@/types/product.type";
import { useState, useEffect } from "react";
import { useCreateProduct, useUpdateProduct } from "@/hooks/product.hook";
import { useFindAllCategories } from "@/hooks/category.hook";

interface ProductModalProps {
  product: ProductType | null;
}

export default function ProductModal({ product }: ProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ProductRequest>({
    productName: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    status: "",
  });
  const { mutateAsync: newProduct, isPending: isAddPending } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isEditPending } =
    useUpdateProduct(product?.id ?? "");

  useEffect(() => {
    if (product?.id !== null) {
      setForm({
        ...form,
        productName: product?.productName ?? "",
        description: product?.description ?? "",
        imageUrl: product?.imageUrl ?? "",
        categoryId: product?.categoryId ?? "",
        status: product?.status ?? "",
      });
    } else {
      setForm({
        ...form,
        productName: "",
        description: "",
        imageUrl: "",
        categoryId: "",
        status: "unvailable",
      });
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (product && product.id !== null) {
        await updateProduct(form as UpdateProduct);
      } else {
        await newProduct(form as ProductRequest);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: category } = useFindAllCategories();
  const dataCategory = category ?? [];

  //   handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        imageUrl: file,
      });
    }
  };

  //   handle select dropdown
  const handleSelectDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      categoryId: e.target.value,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger
            render={
              <Button variant="outline">
                {product ? "Edit" : "Add Product"}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {product ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription>
                Make changes your products here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  defaultValue={product?.productName}
                  onChange={(e) =>
                    setForm({ ...form, productName: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="imageUrl">Image</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="file"
                  onChange={handleFileUpload}
                />
              </Field>
              <Field>
                <Label htmlFor="imageUrl">Category</Label>
                <NativeSelect
                  onChange={handleSelectDropdown}
                  defaultValue={product?.category.name}
                >
                  <NativeSelectOption value="">
                    Select Category
                  </NativeSelectOption>
                  {dataCategory?.map((data) => (
                    <NativeSelectOption key={data.id} value={data.id}>
                      {data.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit" onClick={handleSubmit}>
                {isAddPending || isEditPending ? "Loading..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
