import { BaseEntity } from "../../entities/base.js";
import { Admin } from "./admin.entity.js";
import { Token } from "./token.entity.js";
import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";

@Entity("session")
export class Session extends BaseEntity {
  @Column({ name: "ip_address", type: "varchar", length: 255, nullable: false })
  ipAdress: string;

  @Column({ name: "user_agent", type: "varchar", length: 255, nullable: false })
  userAgent: string;

  @Column({ name: "admin_id", type: "varchar", length: 36, nullable: false })
  adminId: string;

  @Column({ name: "token_id", type: "varchar", length: 36, nullable: false })
  tokenId: string;

  //   relations
  @ManyToOne(() => Admin, (admin) => admin.session, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "admin_id" })
  admin: Admin;

  @ManyToOne(() => Token, (token) => token.session, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "token_id" })
  token: Token;
}
