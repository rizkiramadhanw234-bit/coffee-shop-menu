import { BaseType } from "./base.type";
import { ProductType } from "./product.type";

export interface AddToCartType extends BaseType {
  guestId: string;
  variantId: string;
  qty: number;
  subTotal: number;
}

export interface AddToCartResponse {
  message: string;
  data: AddToCartType;
}

export interface AddToCartRequest {
  variantId: string | null;
  qty: number;
}

export interface DecrementRequest {
  cartId: string;
  variantId: string;
}

export interface VariantType {
  id: string;
  variantName: string;
  price: number;
  product: ProductType;
}

export interface CartItemType {
  id: string;
  variantId: string;
  qty: number;
  subTotal: number;
  variant: VariantType;
}

export interface CartType extends BaseType {
  guestId: string;
  cartStatus: string;
  cartItem: CartItemType[];
}

export interface CartResponse {
  message: string;
  data: CartType | null;
  totalItem: number;
  totalPrice: number;
}
