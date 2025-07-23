"use client";

import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/admin/login-screen";

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // if using cookies
      });
      if (res.ok) {
        router.push("/admin/dashboard");
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  return <LoginScreen onLogin={handleLogin} />;
} 