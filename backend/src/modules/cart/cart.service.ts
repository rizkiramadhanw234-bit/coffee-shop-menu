import { appDataSource } from "../../config/db.js";
import { Cart } from "./cart.entity.js";
import { Variant } from "../product-variant/variant.entity.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";

const cartRepo = appDataSource.getRepository(Cart);
const variantRepo = appDataSource.getRepository(Variant);

export async function addToCart(guestId: string, variantId: string, qty = 1) {
  const variant = await variantRepo.findOneBy({ id: variantId });
  if (!variant) {
    throw new AppError("Variant not found!", HTTP_STATUS.NOT_FOUND);
  }

  let cart = await cartRepo.findOne({
    where: { variantId: variant.id, guestId },
  });

  if (cart !== null) {
    cart.qty += qty;
    cart.subTotal = variant.price * cart.qty;
    await cartRepo.save(cart);
  } else {
    cart = new Cart();
    cart.guestId = guestId;
    cart.variantId = variant.id;
    cart.qty = qty;
    cart.subTotal = variant.price * qty;
    await cartRepo.save(cart);
  }

  if (!cart) {
    throw new AppError("failed add to cart", HTTP_STATUS.BAD_REQUEST);
  }

  return { data: cart };
}

export async function decrementCart(variantId: string, guestId: string) {
  const variant = await variantRepo.findOneBy({ id: variantId });
  if (!variant) {
    throw new AppError("variant not found", HTTP_STATUS.NOT_FOUND);
  }

  let cart = await cartRepo.findOne({
    where: { variantId: variant.id, guestId },
  });

  if (!cart) {
    throw new AppError("cart not found", HTTP_STATUS.NOT_FOUND);
  }

  if (cart.qty <= 1) {
    return { data: cart };
  }

  cart.qty -= 1;
  cart.subTotal = variant.price * cart.qty;
  await cartRepo.save(cart);

  return { data: cart };
}

export async function findCarts(guestId: string) {
  const cart = await cartRepo.find({
    where: { guestId },
    relations: { variant: { product: true } },
    select: {
      variant: { variantName: true, price: true },
    },
  });
  if (cart.length === 0) {
    throw new AppError("carts not found!", HTTP_STATUS.NOT_FOUND);
  }

  const res = cart.map((carts) => ({
    ...carts,
    subTotal: Number(carts.subTotal),
    variant: {
      ...carts.variant,
      price: Number(carts.variant.price),
    },
  }));

  return { data: res };
}

export async function deleteCart(id: string, guestId: string) {
  const cart = await cartRepo.findOne({
    where: { id, guestId },
  });
  if (!cart) {
    throw new AppError("cart not found!", HTTP_STATUS.NOT_FOUND);
  }

  await cartRepo.delete(id);

  return;
}
