export interface VariantDto {
  productId: string;
  variantName: string;
  price: number;
}

export type UpdateVariantDto = Partial<VariantDto>;
