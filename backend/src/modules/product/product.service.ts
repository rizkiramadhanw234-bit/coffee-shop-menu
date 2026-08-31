import { appDataSource } from "../../config/db.js";
import { Product } from "./product.entity.js";
import { Category } from "../category/category.entity.js";
import type { ProductDto, UpdateProductDto } from "./product.dto.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";
import { Like } from "typeorm";

const productRepo = appDataSource.getRepository(Product);
const categoryRepo = appDataSource.getRepository(Category);

export async function createProduct(data: ProductDto) {
  const category = await categoryRepo.findOneBy({ id: data.categoryId });
  if (!category) {
    throw new AppError("category not found!", HTTP_STATUS.NOT_FOUND);
  }

  const productExist = await productRepo.findOneBy({
    productName: data.productName,
  });
  if (productExist) {
    throw new AppError("Product exist", HTTP_STATUS.CONFLICT);
  }

  const product = productRepo.create({
    ...data,
    imageUrl: `${process.env.BASE_URL}/public/coverImage/${data.imageUrl.filename}`,
  });
  await productRepo.save(product);

  return { data: product };
}

export async function updateProduct(id: string, data: UpdateProductDto) {
  const product = await productRepo.findOneBy({ id });
  if (!product) {
    throw new AppError("product not found!", HTTP_STATUS.NOT_FOUND);
  }

  const updated = await productRepo.save({
    ...product,
    ...data,
    ...(data.imageUrl && {
      imageUrl: `${process.env.BASE_URL}/public/coverImage/${data.imageUrl.filename}`,
    }),
  });

  return { data: updated };
}

export async function deleteProduct(id: string) {
  const product = await productRepo.findOneBy({ id });
  if (!product) {
    throw new AppError("product not found!", HTTP_STATUS.NOT_FOUND);
  }
  await productRepo.delete(id);

  return;
}

export async function findAllProducts(
  limit: number,
  offset: number,
  productName: string,
  slug: string,
) {
  const where = {
    ...(productName && { productName: Like(`%${productName}%`) }),
    ...(slug && { category: { slug } }),
  };
  const [product, total] = await productRepo.findAndCount({
    where,
    relations: { category: true, variant: true },
    take: limit,
    skip: offset,
    select: {
      category: { name: true, slug: true },
      variant: { id: true, variantName: true, price: true },
    },
    order: { productName: "DESC" },
  });
  if (product.length === 0) {
    throw new AppError("product not found!", HTTP_STATUS.NOT_FOUND);
  }
  const data = product.map((product) => ({
    ...product,
    variant: product.variant.map((variant) => ({
      ...variant,
      price: Number(variant.price),
    })),
  }));

  return { data, meta: { total, limit, offset } };
}

export async function findProductById(id: string) {
  const product = await productRepo.findOne({
    where: { id },
    relations: { category: true, variant: true },
    select: {
      category: { name: true, slug: true },
      variant: { id: true, variantName: true, price: true },
    },
  });
  if (!product) {
    throw new AppError("Product not found!", HTTP_STATUS.NOT_FOUND);
  }

  const variant = product.variant.map((variant) => ({
    ...variant,
    price: Number(variant.price),
  }));

  return { data: { ...product, variant } };
}
