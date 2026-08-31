import { BaseEntity } from "../../entities/base.js";
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Admin } from "./admin.entity.js";
import { Session } from "./session.entity.js";

@Entity("token")
export class Token extends BaseEntity {
  @Column({
    name: "refresh_token",
    type: "varchar",
    length: 250,
    nullable: false,
  })
  refreshToken: string;

  @Column({ name: "expired_at", type: "date" })
  expiredAt: Date;

  @Column({ name: "admin_id", type: "varchar", length: 36, nullable: false })
  adminId: string;

  //   relations
  @ManyToOne(() => Admin, (admin) => admin.token, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "admin_id" })
  admin: Admin;

  @OneToMany(() => Session, (session) => session.token)
  session: Session[];
}
