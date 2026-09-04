import { axiosApi } from "./axios";
import type { OrderResponse, OrderRequest } from "@/types/order.type";

export async function createOrder(data: OrderRequest) {
  const res = await axiosApi.post<OrderResponse>("/order/create", data);
  return res.data.data;
}

export async function cancelOrder(id: string) {
  const res = await axiosApi.patch(`/order/cancelled/${id}`);
  return res.data;
}

export async function findGuestOrders() {
  const res = await axiosApi.get<OrderResponse>("/order");
  return res.data.data;
}
