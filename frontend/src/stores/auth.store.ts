import { create } from "zustand";
import type { AdminDto } from "@/types/admin.type";
import type { LoginAdminResponse } from "@/types/auth.types";

export interface AuthStoreType {
  accessToken: string | null;
  admin: AdminDto | null;
  loading: boolean;
  isHydrated: boolean;

  setAdmin: (admin: LoginAdminResponse | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStoreType>((set) => ({
  accessToken: null,
  admin: null,
  loading: true,
  isHydrated: false,

  setAdmin(admin) {
    set({
      accessToken: admin?.accessToken,
      admin: admin?.data,
      loading: false,
      isHydrated: true,
    });
  },

  clearAuth() {
    set({
      accessToken: null,
      admin: null,
      loading: false,
      isHydrated: false,
    });
  },
}));
