import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../entities/base.js";
import { Token } from "./token.entity.js";
import { Session } from "./session.entity.js";

@Entity("admin")
export class Admin extends BaseEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 150 })
  email: string;

  @Column({ name: "password_hash", type: "varchar", length: 250 })
  password: string;

  @Column({
    name: "admin_role",
    type: "enum",
    enum: ["super_admin", "staff"],
    default: "staff",
  })
  adminRole: string;

  @Column({ name: "last_login", type: "timestamp", nullable: true })
  lastLogin: Date;

  //   relations
  @OneToMany(() => Token, (token) => token.admin)
  token: Token[];

  @OneToMany(() => Session, (session) => session.admin)
  session: Session[];
}
