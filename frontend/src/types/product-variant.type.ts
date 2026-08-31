import { BaseType } from "./base.type";
import { ProductType } from "./product.type";

export interface VariantType extends BaseType {
  productId: string;
  variantName: string;
  price: number;
  product: ProductType;
}

export interface VariantResponse {
  message: string;
  data: VariantType[];
}

export interface VariantResponseById {
  message: string;
  data: VariantType;
}
