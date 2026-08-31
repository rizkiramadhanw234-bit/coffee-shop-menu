import { axiosApi } from "./axios";
import {
  ProductRequest,
  ProductResponse,
  ProductByIdResponse,
} from "@/types/product.type";

export async function findAllProducts(
  limit: number,
  offset: number,
  productName: string,
  slug: string,
) {
  const res = await axiosApi.get<ProductResponse>("/product", {
    params: { limit, offset, productName, slug },
  });
  return res.data;
}

export async function findProductById(id: string) {
  const res = await axiosApi.get<ProductByIdResponse>(`/product/${id}`);
  return res.data.data;
}
