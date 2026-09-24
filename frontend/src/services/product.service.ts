import { axiosApi } from "./axios";
import { toFormData } from "axios";
import {
  ProductRequest,
  UpdateProduct,
  ProductResponse,
  ProductByIdResponse,
  ProductRequestResponse,
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

// admin
export async function createProduct(data: ProductRequest) {
  const res = await axiosApi.post<ProductRequestResponse>(
    "/product/create",
    toFormData(data),
  );
  return res.data.data;
}

export async function updateProduct(id: string, data: UpdateProduct) {
  const res = await axiosApi.put<ProductRequestResponse>(
    `/product/update/${id}`,
    toFormData(data),
  );
  return res.data.data;
}

export async function deleteProduct(id: string) {
  const res = await axiosApi.delete(`/product/delete/${id}`);
  return res.data;
}
