"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse } from "@/app/types/login";

interface UserContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;
  clearUser: () => void;
  getToken: () => string | undefined;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === "admin") {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getToken = () => {
    return user?.token;
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user && user.role === "admin";

  if (loading) {
    return null; // O un spinner
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        getToken,
        isAuthenticated,
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
