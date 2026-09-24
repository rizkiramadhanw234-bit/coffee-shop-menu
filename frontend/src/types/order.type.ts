import { BaseType } from "./base.type";

export type EnumStatus = "pending" | "confirmed" | "failed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderRequest {
  cartId: string;
  customerName: string;
  tableNo: number;
}

export interface OrderCreateType extends BaseType {
  cartId: string;
  guestId: string;
  orderCode: string;
  totalItem: number;
  totalPrice: number;
  statusOrder: EnumStatus | string;
  paymentStatus: PaymentStatus | string;
  customerName: string;
  tableNo: number;
}

export interface OrderCreateResponse {
  message: string;
  data: OrderCreateType;
}

export interface VariantType extends BaseType {
  productId: string;
  variantName: string;
  price: number;
  product: ProductType;
}

export interface ProductType extends BaseType {
  productName: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  status: string;
}

export interface CartItemDetailType extends BaseType {
  cartId: string;
  guestId: string;
  variantId: string;
  qty: number;
  subTotal: number;
  variant: VariantType;
}

export interface CartDetailType extends BaseType {
  guestId: string;
  cartStatus: string;
  cartItem: CartItemDetailType[];
}

export interface OrderDetailType extends BaseType {
  cartId: string;
  guestId: string;
  orderCode: string;
  totalItem: number;
  totalPrice: number;
  statusOrder: EnumStatus | string;
  paymentStatus: PaymentStatus | string;
  customerName: string;
  tableNo: number;
  cart: CartDetailType;
}

export interface MetaType {
  total: number;
  limit: number;
  offset: number;
}

export interface OrderFindAllResponse {
  message: string;
  data: OrderDetailType[];
  meta: MetaType;
}

export interface OrderFindByIdResponse {
  message: string;
  data: OrderDetailType;
}
