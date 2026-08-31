import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../entities/base.js";
import { Variant } from "../product-variant/variant.entity.js";
import { Order } from "../order/order.entity.js";

@Entity("cart")
export class Cart extends BaseEntity {
  @Column({ name: "guest_id", type: "varchar", length: 36, nullable: true })
  guestId: string;

  @Column({ name: "variant_id", type: "varchar", length: 36, nullable: true })
  variantId: string;

  @Column({ type: "int", default: 1 })
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
}
