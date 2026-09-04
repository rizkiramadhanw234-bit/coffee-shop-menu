import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../entities/base.js";
import { Variant } from "../product-variant/variant.entity.js";
import { Order } from "../order/order.entity.js";
import { Cart } from "./cart.entity.js";

@Entity("cart-item")
export class CartItem extends BaseEntity {
  @Column({ name: "cart_id", type: "varchar", length: 36, nullable: true })
  cartId: string;

  @Column({ name: "guest_id", type: "varchar", length: 36, nullable: true })
  guestId: string;

  @Column({ name: "variant_id", type: "varchar", length: 36, nullable: true })
  variantId: string;

  @Column({ type: "int", default: 0 })
  qty: number;

  @Column({
    name: "sub_total",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  subTotal: number;

  //   relations
  @ManyToOne(() => Variant, (variant) => variant.cart, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "variant_id" })
  variant: Variant;

  @OneToMany(() => Order, (order) => order.cart)
  order: Order[];

  @ManyToOne(() => Cart, (cart) => cart.cartItem, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;
}
