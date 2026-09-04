import { BaseType } from "./base.type";
import { CartItemType } from "./cart.type";

export type EnumStatus = "pending" | "confirmed" | "failed" | "cancelled";

export interface OrderRequest {
  cartId: string;
  customerName: string;
  tableNo: number;
}

export interface CartType extends BaseType {
  guestId: string;
  cartStatus: string;
  cartItem: CartItemType[];
}

export interface OrderType extends BaseType {
  cartId: string;
  guestId: string;
  orderCode: string;
  totalItem: number;
  totalPrice: number;
  statusOrder: EnumStatus | string;
  customerName: string;
  tableNo: number;
  cart: CartType;
}

export interface OrderResponse {
  message: string;
  data: OrderType[];
}
