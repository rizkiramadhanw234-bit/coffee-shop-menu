import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createPayment } from "@/services/payment.service";

export const paymentKeys = {
  payment: ["payment"],
};

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await createPayment(orderId);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.payment });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
