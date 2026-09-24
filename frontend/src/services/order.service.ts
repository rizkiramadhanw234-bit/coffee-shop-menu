import { axiosApi } from "./axios";
import type {
  OrderRequest,
  OrderCreateResponse,
  OrderFindAllResponse,
  OrderFindByIdResponse,
} from "@/types/order.type";

export async function createOrder(data: OrderRequest) {
  const res = await axiosApi.post<OrderCreateResponse>("/order/create", data);
  return res.data.data;
}

export async function cancelOrder(id: string) {
  const res = await axiosApi.patch(`/order/cancel/${id}`);
  return res.data;
}

export async function findGuestOrders() {
  const res = await axiosApi.get<OrderFindAllResponse>("/order");
  return res.data.data;
}

// admin
export async function findAllOrders(
  limit: number,
  offset: number,
  customerName: string,
  statusOrder: string,
) {
  const res = await axiosApi.get<OrderFindAllResponse>("/order/all", {
    params: { limit, offset, customerName, statusOrder },
  });
  return res.data;
}

export async function findOrderById(id: string) {
  const res = await axiosApi.get<OrderFindByIdResponse>(`/order/${id}`);
  return res.data.data;
}

export async function updateStatusOrder(id: string, statusOrder: string) {
  const res = await axiosApi.patch(`/order/order-update-status/${id}`, {
    statusOrder,
  });
  return res.data;
}

export async function updatePaymentStatus(id: string, paymentStatus: string) {
  const res = await axiosApi.patch(`/order/payment-update-status/${id}`, {
    paymentStatus,
  });
  return res.data;
}

export async function deleteOrder(id: string) {
  const res = await axiosApi.delete(`/delete-order/${id}`);
  return res.data;
}
