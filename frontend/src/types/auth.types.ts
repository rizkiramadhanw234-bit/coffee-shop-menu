import type { AdminDto } from "./admin.type";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginAdminResponse {
  message: string;
  accessToken: string;
  data: AdminDto;
}
