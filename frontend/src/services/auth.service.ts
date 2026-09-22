import { axiosApi } from "./axios";
import type { LoginRequest, LoginAdminResponse } from "@/types/auth.types";

export async function loginAdmin(data: LoginRequest) {
  const res = await axiosApi.post<LoginAdminResponse>("/auth/login", data);
  return res.data;
}

export async function logoutAdmin() {
  const res = await axiosApi.post("/auth/logout");
  return res.data;
}
