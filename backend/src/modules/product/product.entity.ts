import { BaseEntity } from "../../entities/base.js";
import { Column, ManyToOne, Entity, JoinColumn, OneToMany } from "typeorm";
import { Category } from "../category/category.entity.js";
import { Variant } from "../product-variant/variant.entity.js";

@Entity("product")
export class Product extends BaseEntity {
  @Column({
    name: "product_name",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  productName: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "image_url", type: "varchar", length: 255, nullable: true })
  imageUrl: string;

  @Column({ name: "category_id", type: "varchar", length: 36, nullable: true })
  categoryId: string;

  @Column({
    type: "enum",
    enum: ["available", "unvailable"],
    default: "available",
    nullable: true,
  })
  status: string;

  //   relations
  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => Variant, (variant) => variant.product)
  variant: Variant[];
}
