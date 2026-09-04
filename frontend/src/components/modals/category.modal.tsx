"use client";
import type {
  CategoryRequest,
  UpdateCategory,
  CategoryType,
} from "@/types/category.type";
import { useCreateCategory, useUpdateCategory } from "@/hooks/category.hook";
import { useState, useEffect } from "react";

interface CategoryProps {
  data: CategoryType;
}

export default function Category({ data }: CategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<CategoryRequest>({
    name: "",
    slug: "",
  });
  const { mutateAsync: newCategory, isPending } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: loading } = useUpdateCategory(
    data.id,
  );

  useEffect(() => {
    if (data !== null) {
      setForm({
        ...form,
        name: data.name,
        slug: data.slug,
      });
    } else {
      setForm({
        ...form,
        name: "",
        slug: "",
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      if (data !== null) {
        await newCategory(form as CategoryRequest);
      } else {
        await updateCategory(form as UpdateCategory);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return <></>;
}
