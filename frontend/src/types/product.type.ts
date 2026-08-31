import { BaseType } from "./base.type";

export type EnumStatus = "available" | "unavailable";

export interface ProductRequest {
  productName: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  status: EnumStatus | string;
}

export type UpdateProduct = Partial<ProductRequest>;

export interface ProductVariant {
  id: string;
  variantName: string;
  price: number;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

export interface ProductType extends BaseType {
  productName: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  status: EnumStatus | string;
  category: ProductCategory;
  variant: ProductVariant[];
}

export interface MetaType {
  total: number;
  limit: number;
  offset: number;
}

export interface ProductResponse {
  message: string;
  data: ProductType[];
  meta: MetaType;
}

export interface ProductByIdResponse {
  message: string;
  data: ProductType;
}
