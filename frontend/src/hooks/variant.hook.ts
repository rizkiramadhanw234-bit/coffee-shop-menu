import { findAllVariants, findVariantById } from "@/services/variant.service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const variantKeys = {
  variant: ["variant"] as const,
  detail: (id: string) => [...variantKeys.variant, id] as const,
};

export function useFindAllVariants() {
  return useQuery({
    queryKey: variantKeys.variant,
    queryFn: async () => {
      const res = await findAllVariants();
      return res;
    },
  });
}

export function useFindVariantById(id: string) {
  return useQuery({
    queryKey: variantKeys.detail(id),
    queryFn: async () => {
      const res = await findVariantById(id);
      return res;
    },
    enabled: !!id,
  });
}
