import { axiosApi } from "./axios";
import {
  CategoryResponse,
  CategoryRequest,
  UpdateCategory,
} from "@/types/category.type";

export async function createCategory(data: CategoryRequest) {
  const res = await axiosApi.post<CategoryResponse>("/category/create", data);
  return res.data.data;
}

export async function updateCategory(id: string, data: UpdateCategory) {
  const res = await axiosApi.put<CategoryResponse>(
    `/category/update/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteCategory(id: string) {
  const res = await axiosApi.delete<CategoryResponse>(`/category/delete/${id}`);
  return res.data.message;
}

export async function findAllCategories() {
  const res = await axiosApi.get<CategoryResponse>("/category");
  return res.data.data;
}

export async function findCategoryById(id: string) {
  const res = await axiosApi.get<CategoryResponse>(`/category/${id}`);
  return res.data.data;
}
