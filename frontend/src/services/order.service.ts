import { axiosApi } from "./axios";
import type {
  OrderRequest,
  OrderCreateResponse,
  OrderFindAllResponse,
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
