import type { BaseType } from "./base.type";

export type EmunRole = "super_admin" | "staff";

export interface AdminDto extends BaseType {
  name: string;
  email: string;
  adminRole: EmunRole | string;
  lastLogin: Date;
}
