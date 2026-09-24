import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  findAllProducts,
  findProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product.service";
import { ProductRequest, UpdateProduct } from "@/types/product.type";

export const productKeys = {
  product: ["product"] as const,
  list: (limit: number, offset: number, productName: string, slug: string) =>
    [
      ...productKeys.product,
      "list",
      { limit, offset, productName, slug },
    ] as const,
  detail: (id: string) => [...productKeys.product, id] as const,
};

export function useFindAllProducts(
  limit: number,
  offset: number,
  productName: string,
  slug: string,
) {
  return useQuery({
    queryKey: productKeys.list(limit, offset, productName, slug),
    queryFn: async () => {
      try {
        const res = await findAllProducts(limit, offset, productName, slug);
        return res;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFindProductById(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const res = await findProductById(id);
      return res;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProductRequest) => {
      const res = await createProduct(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.product });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProduct) => {
      const res = await updateProduct(id, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.product });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDeleteProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.product });
    },
  });
}
