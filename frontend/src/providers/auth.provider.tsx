"use client";
import { axiosApi } from "@/services/axios";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginAdminResponse } from "@/types/auth.types";
import { SpinnerCustom } from "@/components/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setAdmin, accessToken, isHydrated } = useAuthStore();

  useEffect(() => {
    axiosApi
      .post<LoginAdminResponse>("/admin/refresh-token")
      .then((res) => {
        if (!res.data.accessToken) {
          router.push("/auth/login");
        }
        setAdmin(res.data);
        setLoading(false);
      })
      .catch(() => {
        setAdmin(null);
        setLoading(false);
        router.push("/auth/login");
      });
  }, []);

  if (loading || !isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  if (!accessToken) return null;

  return <>{children}</>;
}
