import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { OrderRequest } from "@/types/order.type";
import {
  createOrder,
  cancelOrder,
  findGuestOrders,
  findAllOrders,
} from "@/services/order.service";

export const orderKeys = {
  oders: ["orders"],
  list: (
    limit: number,
    offset: number,
    customerName: string,
    statusOrder: string,
  ) =>
    [
      ...orderKeys.oders,
      "list",
      { limit, offset, customerName, statusOrder },
    ] as const,
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderRequest) => {
      return await createOrder(data);
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
      return await cancelOrder(id);
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
      try {
        return await findGuestOrders();
      } catch (error) {
        return null;
      }
    },
  });
}

// admin
export function useFindAllOrders(
  limit: number,
  offset: number,
  customerName: string,
  statusOrder: string,
) {
  return useQuery({
    queryKey: orderKeys.list(limit, offset, customerName, statusOrder),
    queryFn: async () => {
      try {
        return await findAllOrders(limit, offset, customerName, statusOrder);
      } catch (error) {
        return null;
      }
    },
  });
}
