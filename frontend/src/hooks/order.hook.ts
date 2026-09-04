import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { OrderRequest } from "@/types/order.type";
import {
  createOrder,
  cancelOrder,
  findGuestOrders,
} from "@/services/order.service";

export const orderKeys = {
  oders: ["orders"],
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      const res = await createOrder(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.oders });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useCancelOrder(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await cancelOrder(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.oders });
    },
  });
}

export function useFindGuestOrders() {
  return useQuery({
    queryKey: orderKeys.oders,
    queryFn: async () => {
      const res = await findGuestOrders();
      return res;
    },
  });
}
