"use client";

import { loginUser, logoutUser, getCurrentUser } from "@/app/services/auth";
import { LoginFormValues, LoginResponse, User } from "@/app/types/login";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);

  // Función para limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    Cookies.remove("token");
    setUser(null);
    setCurrentUserData(null);
  }, []);

  // Función para obtener los datos actuales del usuario
  const fetchCurrentUser = useCallback(async () => {
    // Evitar llamadas múltiples simultáneas
    if (isFetchingUserData) {
      return null; // No devolver currentUserData para evitar dependencias
    }

    try {
      setIsFetchingUserData(true);
      // Obtener token directamente para evitar dependencias
      const token =
        localStorage.getItem("accessToken") ||
        user?.token ||
        Cookies.get("token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const userData = await getCurrentUser(token);
      setCurrentUserData(userData);
      return userData;
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      setError("Error al cargar los datos del usuario");
      throw error;
    } finally {
      setIsFetchingUserData(false);
    }
  }, [isFetchingUserData, user]);

  const login = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);
      const res = await loginUser(data);

      if (res && ["admin", "hr"].includes(res.user?.role || res.role)) {
        // Extraer el token, priorizando access_token sobre token
        const accessToken = res.access_token || res.token;
        const refreshToken = res.refresh_token;

        if (!accessToken) {
          throw new Error("No se recibió token de autenticación del servidor");
        }

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Store user data
        localStorage.setItem("user", JSON.stringify(res));

        // Set cookies for backward compatibility
        Cookies.set("token", accessToken, { expires: 1 });

        setUser(res);

        // Obtener datos actualizados del usuario
        try {
          await fetchCurrentUser();
        } catch (userError) {
          console.warn(
            "No se pudieron obtener los datos actualizados del usuario:",
            userError
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.replace("/dashboard");
      } else {
        throw new Error(
          "Acceso denegado: Solo usuarios admin o HR pueden acceder"
        );
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

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      clearAuthData();
      router.push("/login");
    }
  };

  // Verificar autenticación al cargar - solo una vez
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");

        if (storedUser && accessToken) {
          const userData = JSON.parse(storedUser);
          const userRole = userData.user?.role || userData.role;

          if (["admin", "hr"].includes(userRole)) {
            if (isMounted) {
              setUser(userData);
            }
            // Obtener datos actualizados del usuario
            try {
              const currentUserData = await getCurrentUser(accessToken);
              if (isMounted) {
                setCurrentUserData(currentUserData);
              }
            } catch (userError) {
              console.warn(
                "No se pudieron obtener los datos actualizados del usuario:",
                userError
              );
            }
          } else {
            // Limpiar datos directamente
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            Cookies.remove("token");
            if (isMounted) {
              setUser(null);
              setCurrentUserData(null);
            }
            // Usar window.location en lugar de router para evitar dependencias
            window.location.href = "/login";
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Sin dependencias para evitar bucles

  const getToken = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userToken = user?.access_token || user?.token;
    const cookieToken = Cookies.get("token");

    return accessToken || userToken || cookieToken;
  }, [user]);

  return {
    user,
    currentUserData,
    login,
    logout,
    loading,
    error,
    getToken,
    fetchCurrentUser,
    clearAuthData,
    isFetchingUserData,
  };
}
