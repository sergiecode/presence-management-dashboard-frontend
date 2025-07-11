"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { LoginFormValues } from "../types/login";
import { loginUser } from "../services/auth";
import { useUser } from "../contexts/UserContext";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, clearUser } = useUser();

  const login = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);
      const res = await loginUser(data);

      if (res && res.role === "admin") {
        // Guardar token y datos del usuario
        Cookies.set("token", res.token, { expires: 1 });
        setUser(res);

        // Pequeña pausa para mostrar loading
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
      setLoading(false);
    }
  };

  const logout = () => {
    clearUser();
    Cookies.remove("token");
    router.push("/login");
  };

  // Función para obtener el token para las API calls
  const getToken = () => {
    return user?.token || Cookies.get("token");
  };

  return { user, login, logout, loading, error, getToken };
}
