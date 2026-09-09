import { axiosApi } from "./axios";
import type { PaymentResponse } from "@/types/payment.type";

export async function createPayment(orderId: string) {
  const res = await axiosApi.post<PaymentResponse>("/payment/create", {
    orderId,
  });
  return res.data.data;
}
