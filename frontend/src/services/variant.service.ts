import { axiosApi } from "./axios";
import {
  VariantResponse,
  VariantResponseById,
} from "@/types/product-variant.type";

export async function findAllVariants() {
  const res = await axiosApi.get<VariantResponse>("/variant");
  return res.data.data;
}

export async function findVariantById(id: string) {
  const res = await axiosApi.get<VariantResponseById>(`/variant/${id}`);
  return res.data.data;
}
