import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "../order/order.entity.js";
import { BaseEntity } from "../../entities/base.js";

@Entity("payment")
export class Payment extends BaseEntity {
  @Column({ name: "guest_id", type: "varchar", length: 36, nullable: false })
  guestId: string;

  @Column({ name: "order_id", type: "varchar", length: 36, nullable: false })
  orderId: string;

  @Column({ name: "gross_amount", type: "decimal", precision: 10, scale: 2 })
  grossAmount: number;

  @Column({ name: "snap_token", type: "varchar", nullable: true })
  snapToken: string;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  })
  paymentStatus: string;

  @ManyToOne(() => Order, (order) => order.payment, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order: Order;
}
