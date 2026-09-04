import { BaseEntity } from "../../entities/base.js";
import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";
import { Cart } from "../cart/cart.entity.js";
import { Variant } from "../product-variant/variant.entity.js";

@Entity("order")
export class Order extends BaseEntity {
  @Column({ name: "cart_id", type: "varchar", length: 36, nullable: true })
  cartId: string;

  @Column({ name: "guest_id", type: "varchar", length: 36, nullable: true })
  guestId: string;

  @Column({ name: "order_code", type: "varchar", length: 100, nullable: true })
  orderCode: string;

  @Column({ name: "total_item", type: "int", default: 0, nullable: true })
  totalItem: number;

  @Column({
    name: "total_price",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalPrice: number;

  @Column({
    name: "status_order",
    type: "enum",
    enum: ["pending", "confirmed", "failed", "cancelled"],
    default: "pending",
  })
  statusOrder: string;

  @Column({
    name: "customer_name",
    type: "varchar",
    length: 150,
    nullable: true,
  })
  customerName: string;

  @Column({ name: "table_no", type: "int", nullable: true })
  tableNo: number;

  //   relations
  @ManyToOne(() => Cart, (cart) => cart.order, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;
}
