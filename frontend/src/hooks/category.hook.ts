import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryRequest, UpdateCategory } from "@/types/category.type";
import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
} from "@/services/category.service";

export const categoryKeys = {
  category: ["category"] as const,
  detail: (id: string) => [...categoryKeys.category, id] as const,
};

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CategoryRequest) => {
      const res = await createCategory(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.category });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateCategory) => {
      const res = await updateCategory(id, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.category });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDeleteCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await deleteCategory(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.category });
    },
  });
}

export function useFindAllCategories() {
  return useQuery({
    queryKey: categoryKeys.category,
    queryFn: async () => {
      const res = await findAllCategories();
      return res;
    },
  });
}

export function useFindCategoryById(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const res = await findCategoryById(id);
      return res;
    },
    enabled: !!id,
  });
}
