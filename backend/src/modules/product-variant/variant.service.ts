import { appDataSource } from "../../config/db.js";
import { Variant } from "./variant.entity.js";
import { Product } from "../product/product.entity.js";
import type { VariantDto, UpdateVariantDto } from "./variant.dto.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";

const variantRepo = appDataSource.getRepository(Variant);
const productRepo = appDataSource.getRepository(Product);

export async function createVariant(data: VariantDto) {
  const product = await productRepo.findOneBy({ id: data.productId });
  if (!product) {
    throw new AppError("product not found!", HTTP_STATUS.NOT_FOUND);
  }

  const price = Number(data.price);
  const newVariant = variantRepo.create({
    ...data,
    price,
  });
  await variantRepo.save(newVariant);

  return { data: newVariant };
}

export async function updateVariant(id: string, data: UpdateVariantDto) {
  const variant = await variantRepo.findOneBy({ id });
  if (!variant) {
    throw new AppError("Variant not found!", HTTP_STATUS.NOT_FOUND);
  }

  const price = Number(data.price);
  const updated = await variantRepo.save({
    ...variant,
    ...data,
    ...(data.price !== undefined && { price }),
  });

  return { data: updated };
}

export async function deleteVariant(id: string) {
  const variant = await variantRepo.findOneBy({ id });
  if (!variant) {
    throw new AppError("variant not found", HTTP_STATUS.NOT_FOUND);
  }

  await variantRepo.delete(id);
  return;
}

export async function findAllVariants() {
  const variant = await variantRepo.find({
    relations: { product: true },
    select: {
      product: {
        id: true,
        productName: true,
        imageUrl: true,
      },
    },
  });
  if (variant.length === 0) {
    throw new AppError("variants not found!", HTTP_STATUS.NOT_FOUND);
  }

  const res = variant.map((variant) => ({
    ...variant,
    price: Number(variant.price),
  }));

  return { data: res };
}

export async function findVariantById(id: string) {
  const variant = await variantRepo.findOne({
    where: { id },
    relations: { product: true },
    select: {
      product: {
        id: true,
        productName: true,
        imageUrl: true,
      },
    },
  });
  if (!variant) {
    throw new AppError("variant not found!", HTTP_STATUS.NOT_FOUND);
  }
  const price = Number(variant.price);
  return { data: { ...variant, price } };
}
