import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginRequest, LoginAdminResponse } from "@/types/auth.types";
import { loginAdmin, logoutAdmin } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export const authKeys = {
  auth: ["auth"],
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAdmin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await loginAdmin(data);
      return res;
    },
    onSuccess: (data: LoginAdminResponse) => {
      setAdmin(data);
      queryClient.invalidateQueries({ queryKey: authKeys.auth });
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await logoutAdmin();
    },
    onSuccess: () => {
      clearAuth();
      router.push("/auth/login");
    },
  });
}
