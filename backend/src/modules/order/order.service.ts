import { appDataSource } from "../../config/db.js";
import { Order } from "./order.entity.js";
import { Cart } from "../cart/cart.entity.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";
import { generateCode } from "../../utils/orderCode.js";

const orderRepo = appDataSource.getRepository(Order);
const cartRepo = appDataSource.getRepository(Cart);

export async function createOrder(
  guestId: string,
  cartId: string,
  customerName: string,
  tableNo: number,
) {
  const cart = await cartRepo.findOne({
    where: { id: cartId, guestId },
  });
  if (!cart) {
    throw new AppError("cart not found!", HTTP_STATUS.NOT_FOUND);
  }

  if (!cart.variantId) {
    throw new AppError("variant not found!", HTTP_STATUS.NOT_FOUND);
  }

  const order = new Order();
  order.guestId = guestId;
  order.orderCode = generateCode();
  order.cartId = cart.id;
  order.variantId = cart.variantId;
  order.qty = cart.qty;
  order.priceAt = Number(cart.subTotal);
  order.statusOrder = "pending";
  order.customerName = customerName;
  order.tableNo = tableNo;
  await orderRepo.save(order);

  if (!order) {
    order.statusOrder = "failed";
    await orderRepo.save(order);
    throw new AppError("order failed", HTTP_STATUS.BAD_REQUEST);
  }

  return { data: order };
}

export async function cancelOrder(id: string, guestId: string) {
  const order = await orderRepo.findOne({
    where: { id, statusOrder: "pending", guestId },
  });
  if (!order) {
    throw new AppError("order not found!", HTTP_STATUS.NOT_FOUND);
  }
  order.statusOrder = "cancelled";
  await orderRepo.save(order);
  return;
}

export async function deleteOrder(id: string, guestId: string) {
  const order = await orderRepo.findOne({
    where: { id, guestId },
  });
  if (!order) {
    throw new AppError("order not found!", HTTP_STATUS.NOT_FOUND);
  }

  await orderRepo.delete(id);
  return;
}

export async function findOrders(guestId: string) {
  const orders = await orderRepo.find({
    where: { guestId },
    relations: { variant: { product: true } },
  });

  if (orders.length === 0) {
    throw new AppError("order not found", HTTP_STATUS.NOT_FOUND);
  }

  return { data: orders };
}

// admin access
export async function findPendingOrders(limit: number, offset: number) {
  const [orders, total] = await orderRepo.findAndCount({
    where: { statusOrder: "pending" },
    relations: { variant: { product: true } },
    select: {
      variant: {
        variantName: true,
        price: true,
        product: { productName: true, imageUrl: true },
      },
    },
    take: limit,
    skip: offset,
  });

  if (orders.length === 0) {
    throw new AppError("orders not found", HTTP_STATUS.NOT_FOUND);
  }

  const res = orders.map((order) => ({
    ...order,
    priceAt: Number(order.priceAt),
    variant: {
      ...order.variant,
      price: Number(order.variant.price),
    },
  }));

  return { data: res, meta: { total, limit, offset } };
}

export async function findAllOrders(limit: number, offset: number) {
  const [orders, total] = await orderRepo.findAndCount({
    take: limit,
    skip: offset,
    relations: { variant: { product: true } },
    select: {
      variant: {
        variantName: true,
        price: true,
        product: { productName: true, imageUrl: true },
      },
    },
  });

  if (orders.length === 0) {
    throw new AppError("no orders found!", HTTP_STATUS.NOT_FOUND);
  }

  const res = orders.map((order) => ({
    ...order,
    priceAt: Number(order.priceAt),
    variant: {
      ...order.variant,
      price: Number(order.variant.price),
    },
  }));

  return { data: res, meta: { total, limit, offset } };
}

export async function updateStatusOrder(id: string, statusOrder: string) {
  const order = await orderRepo.findOne({
    where: { id, statusOrder: "pending" },
  });

  if (!order) {
    throw new AppError("Order not found", HTTP_STATUS.NOT_FOUND);
  }

  order.statusOrder = statusOrder;
  await orderRepo.save(order);

  return { data: order.statusOrder };
}

export async function deleteOrderAdmin(id: string) {
  const order = await orderRepo.findOneBy({ id });
  if (order) {
    throw new AppError("order not found", HTTP_STATUS.NOT_FOUND);
  }

  await orderRepo.delete(id);

  return;
}
