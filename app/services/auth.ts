// services/auth.ts

import { LoginFormValues, LoginResponse, User } from "../types/login";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function loginUser(data: LoginFormValues): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    // Verificar el tipo de contenido antes de hacer .json()
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch {
          // Si falla al parsear JSON, usar el mensaje por defecto
        }
      } else {
        // Si no es JSON, leer como texto
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
        console.error("Error en la respuesta:", errorMessage);
      }

      throw new Error(errorMessage);
    }

    // Verificar que la respuesta exitosa también sea JSON
    if (!isJson) {
      throw new Error("La respuesta del servidor no es JSON válido");
    }

    const loginResponse = await response.json();

    // Validar que el usuario tenga permisos de admin o HR
    if (!["admin", "hr"].includes(loginResponse.role)) {
      throw new Error(
        "Acceso denegado: Solo usuarios admin o HR pueden acceder"
      );
    }

    return loginResponse;
  } catch (error) {
    // Si es un error de red o fetch
    if (error instanceof TypeError) {
      throw new Error("Error de conexión: No se puede conectar al servidor");
    }
    // Re-lanzar otros errores
    throw error;
  }
}

export async function logoutUser(refreshToken?: string): Promise<void> {
  try {
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch (error) {
    console.error("Error en logout:", error);
  }
}

export async function refreshToken(
  refreshToken: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("La respuesta del servidor no es JSON válido");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Error de conexión: No se puede conectar al servidor");
    }
    throw error;
  }
}
