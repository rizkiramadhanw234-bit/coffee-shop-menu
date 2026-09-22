"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerCustom } from "@/components/loading";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest, LoginAdminResponse } from "@/types/auth.types";
import { useLogin } from "@/hooks/auth.hook";
import { useAuthStore } from "@/stores/auth.store";
import { axiosApi } from "@/services/axios";

export default function LoginPage() {
  const router = useRouter();
  const { accessToken, setAdmin, isHydrated, loading } = useAuthStore();

  const { mutateAsync: login, isError, isPending } = useLogin();
  const [form, setFrom] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(form);
    } catch (error) {
      setFieldError("Invalid Credentials");
      console.error(error, isError);
    }
  };

  useEffect(() => {
    axiosApi
      .post<LoginAdminResponse>("/auth/refresh-token")
      .then((res) => {
        setAdmin(res.data);
        if (res.data.accessToken) {
          router.push("/dashboard");
        }
      })
      .catch(() => {
        setAdmin(null);
        router.push("/auth/login");
      });
  }, []);

  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  if (accessToken) return null;

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          {isError && <p className="text-red-500">{fieldError}</p>}
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={(e) => setFrom({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) =>
                    setFrom({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                {isPending ? "Loading..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
