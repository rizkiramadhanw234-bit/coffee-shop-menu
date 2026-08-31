import { BaseEntity } from "../../entities/base.js";
import { Entity, Column, OneToMany } from "typeorm";
import { Product } from "../product/product.entity.js";

@Entity("category")
export class Category extends BaseEntity {
  @Column({ type: "varchar", length: 150, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 150, unique: true })
  slug: string;

  //   relations
  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
