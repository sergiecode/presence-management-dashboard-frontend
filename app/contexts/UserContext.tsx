"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse } from "@/app/types/login";

interface UserContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  clearUser: () => void;
  getToken: () => string | undefined;
  isAuthenticated: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);

        // Check if it's the new API format (with nested user object) or legacy format
        const userRole = userData.user?.role || userData.role;

        if (["admin", "hr"].includes(userRole)) {
          setUser(userData);
        } else {
          console.error("❌ User role not authorized:", userRole);
          // Limpiar datos si el rol no es válido
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } else {
        // Verificar si hay token en cookies pero no en localStorage
        const cookieToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
          
        if (cookieToken && !storedUser) {
          // Sincronizar token de cookies a localStorage
          localStorage.setItem("accessToken", cookieToken);
          console.log("🔄 Token synchronized from cookies to localStorage");
        } else {
          console.log("ℹ️ No stored user or token found");
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Limpiar datos corruptos
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  }, []);

  const getToken = () => {
    return localStorage.getItem("accessToken") || user?.token;
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const isAuthenticated =
    !!user && ["admin", "hr"].includes(user.user?.role || user.role);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        getToken,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
