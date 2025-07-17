"use client";

import { loginUser } from "@/app/services/auth";
import { LoginFormValues, LoginResponse } from "@/app/types/login";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse | null>(null);

  const login = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);
      const res = await loginUser(data);

      if (res && res.role === "admin") {
        Cookies.set("token", res.token, { expires: 1 });
        localStorage.setItem("user", JSON.stringify(res));
        setUser(res);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.replace("/dashboard");
      } else {
        throw new Error("Acceso denegado: Solo usuarios admin pueden acceder");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error en el login";
      setError(errorMessage);
      throw err;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      console.log("Stored user:", storedUser);

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === "admin") {
          setUser(userData);
        } else {
          logout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getToken = () => {
    return user?.token || Cookies.get("token");
  };

  return { user, login, logout, loading, error, getToken };
}
