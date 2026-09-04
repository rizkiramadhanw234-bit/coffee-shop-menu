import { appDataSource } from "../../config/db.js";
import { CartItem } from "./cart.item.entity.js";
import { Cart } from "./cart.entity.js";
import { Variant } from "../product-variant/variant.entity.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";

const cartItemRepo = appDataSource.getRepository(CartItem);
const cartRepo = appDataSource.getRepository(Cart);
const variantRepo = appDataSource.getRepository(Variant);

export async function addToCart(guestId: string, variantId: string, qty = 1) {
  let cartrepo = await cartRepo.findOne({
    where: { guestId, cartStatus: "active" },
    relations: { cartItem: true },
  });

  if (!cartrepo) {
    cartrepo = new Cart();
    cartrepo.guestId = guestId;
    await cartRepo.save(cartrepo);
  }

  const variant = await variantRepo.findOne({
    where: { id: variantId },
  });
  if (!variant) {
    throw new AppError("Variant not found!", HTTP_STATUS.NOT_FOUND);
  }

  let cart = await cartItemRepo.findOne({
    where: {
      cartId: cartrepo.id,
      variantId: variant.id,
      guestId,
    },
  });

  if (cart !== null) {
    cart.qty += qty;
    cart.subTotal = variant.price * cart.qty;
    await cartItemRepo.save(cart);
  } else {
    cart = new CartItem();
    cart.cartId = cartrepo.id;
    cart.guestId = guestId;
    cart.variantId = variant.id;
    cart.qty = qty;
    cart.subTotal = variant.price * qty;
    await cartItemRepo.save(cart);
  }
  if (!cart) {
    throw new AppError("failed add to cart", HTTP_STATUS.BAD_REQUEST);
  }

  return { data: cart };
}

export async function decrementCart(
  cartId: string,
  variantId: string,
  guestId: string,
) {
  const variant = await variantRepo.findOneBy({ id: variantId });
  if (!variant) {
    throw new AppError("variant not found", HTTP_STATUS.NOT_FOUND);
  }

  let cart = await cartItemRepo.findOne({
    where: { id: cartId, variantId: variant.id, guestId },
  });

  if (!cart) {
    throw new AppError("cart not found", HTTP_STATUS.NOT_FOUND);
  }

  if (cart.qty <= 1) {
    return { data: cart };
  }

  cart.qty -= 1;
  cart.subTotal = variant.price * cart.qty;
  await cartItemRepo.save(cart);

  return { data: cart };
}

export async function findCarts(guestId: string) {
  const cart = await cartRepo.findOne({
    where: { guestId, cartStatus: "active" },
    relations: { cartItem: { variant: { product: true } } },
    select: {
      cartItem: {
        id: true,
        variantId: true,
        qty: true,
        subTotal: true,
        variant: {
          id: true,
          productId: true,
          variantName: true,
          price: true,
          product: {
            id: true,
            productName: true,
            imageUrl: true,
          },
        },
      },
    },
  });

  if (!cart) {
    throw new AppError("cart is empty", HTTP_STATUS.NOT_FOUND);
  }

  const cartItem = cart.cartItem.map((data) => ({
    ...data,
    subTotal: Number(data.subTotal),
    variant: {
      ...data.variant,
      price: Number(data.variant.price),
    },
  }));

  const totalItem = cartItem.length;
  const totalPrice = cartItem.reduce((sum, item) => sum + item.subTotal, 0);

  return { data: { ...cart, cartItem }, totalItem, totalPrice };
}

export async function deleteCart(id: string, guestId: string) {
  const cart = await cartItemRepo.findOne({
    where: { id, guestId },
  });
  if (!cart) {
    throw new AppError("cart not found!", HTTP_STATUS.NOT_FOUND);
  }

  await cartItemRepo.delete(id);

  return;
}
