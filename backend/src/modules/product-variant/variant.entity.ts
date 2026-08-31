import { Product } from "../product/product.entity.js";
import { Entity, ManyToOne, OneToMany, Column, JoinColumn } from "typeorm";
import { BaseEntity } from "../../entities/base.js";
import { Cart } from "../cart/cart.entity.js";
import { Order } from "../order/order.entity.js";

@Entity("variant")
export class Variant extends BaseEntity {
  @Column({ name: "product_id", type: "varchar", length: 36, nullable: true })
  productId: string;

  @Column({
    name: "variant_name",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  variantName: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  //   relations
  @ManyToOne(() => Product, (product) => product.variant, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @OneToMany(() => Cart, (cart) => cart.variant)
  cart: Cart[];

  @OneToMany(() => Order, (order) => order.variant)
  order: Order[];
}
