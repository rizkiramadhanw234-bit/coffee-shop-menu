export interface ProductDto {
  productName: string;
  description: string;
  imageUrl: Express.Multer.File;
  categoryId: string;
  status: string;
}

export type UpdateProductDto = Partial<ProductDto>;
