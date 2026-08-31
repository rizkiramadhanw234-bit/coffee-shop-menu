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
      .post("/admin/refresh-token")
      .then((res) => {
        const data = res.data as LoginAdminResponse;
        if (!data.accessToken) {
          router.push("/auth/login");
        }
        setAdmin(data);
        setLoading(false);
      })
      .catch(() => {
        setAdmin(null);
        setLoading(false);
        router.push("/auth/login");
      });
  }, [setAdmin]);

  if (loading || !isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  if (!accessToken) return null;

  return <>{children}</>;
}
