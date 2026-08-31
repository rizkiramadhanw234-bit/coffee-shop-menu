import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { findAllProducts, findProductById } from "@/services/product.service";

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
      const res = await findAllProducts(limit, offset, productName, slug);
      return res;
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
