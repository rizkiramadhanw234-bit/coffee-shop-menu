import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../entities/base.js";
import { CartItem } from "./cart.item.entity.js";
import { Order } from "../order/order.entity.js";

@Entity("cart")
export class Cart extends BaseEntity {
  @Column({ name: "guest_id", type: "varchar", length: 36, nullable: true })
  guestId: string;

  @Column({
    name: "cart_status",
    type: "enum",
    enum: ["active", "checked_out"],
    default: "active",
  })
  cartStatus: string;

  //   relations
  @OneToMany(() => CartItem, (item) => item.cart)
  cartItem: CartItem[];

  @OneToMany(() => Order, (order) => order.cart)
  order: Order;
}
