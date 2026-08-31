import { BaseType } from "./base.type";

export interface CategoryType extends BaseType {
  name: string;
  slug: string;
}

export interface CategoryResponse {
  message: string;
  data: CategoryType[];
}

export interface CategoryRequest {
  name: string;
  slug: string;
}

export type UpdateCategory = Partial<CategoryRequest>;
