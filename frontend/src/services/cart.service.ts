import { axiosApi } from "./axios";
import type {
  AddToCartResponse,
  AddToCartRequest,
  CartResponse,
  DecrementRequest,
} from "@/types/cart.type";

export async function addToCart(data: AddToCartRequest) {
  const res = await axiosApi.post<AddToCartResponse>("/cart/add-to-cart", data);
  return res.data.data;
}

export async function decrementCart(data: DecrementRequest) {
  const res = await axiosApi.patch<AddToCartResponse>("cart/decrement", data);
  return res.data.data;
}

export async function findCarts() {
  const res = await axiosApi.get<CartResponse>("/cart");
  return res.data;
}

export async function deleteCart(id: string) {
  const res = await axiosApi.delete(`/cart/delete/${id}`);
  return res.data;
}
