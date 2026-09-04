import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { AddToCartRequest, DecrementRequest } from "@/types/cart.type";
import {
  addToCart,
  decrementCart,
  findCarts,
  deleteCart,
} from "@/services/cart.service";

export const cartKeys = {
  cart: ["cart"],
};

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddToCartRequest) => {
      const res = await addToCart(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useDecrementCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DecrementRequest) => {
      const res = await decrementCart(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useFindAllCarts() {
  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: async () => {
      const res = await findCarts();
      return res;
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteCart(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
    },
  });
}
