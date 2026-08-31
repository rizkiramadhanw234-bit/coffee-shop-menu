import { Variant } from "../modules/product-variant/variant.entity.js";
import { Product } from "../modules/product/product.entity.js";
import { Category } from "../modules/category/category.entity.js";
import { Cart } from "../modules/cart/cart.entity.js";
import { Order } from "../modules/order/order.entity.js";
import { Admin } from "../modules/admin/admin.entity.js";
import { Token } from "../modules/admin/token.entity.js";
import { Session } from "../modules/admin/session.entity.js";

export const entities = [
  Variant,
  Product,
  Cart,
  Category,
  Order,
  Admin,
  Token,
  Session,
];
