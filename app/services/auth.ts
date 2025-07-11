// features/auth/services.ts

import { LoginFormValues, LoginResponse } from "../types/login";

export async function loginUser(data: LoginFormValues): Promise<LoginResponse> {
  try {
    console.log("Enviando petición de login:", data);

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    console.log("Respuesta recibida:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Verificar el tipo de contenido antes de hacer .json()
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si falla al parsear JSON, usar el mensaje por defecto
        }
      } else {
        // Si no es JSON, leer como texto
        const errorText = await response.text();
        console.log("Respuesta de error (texto):", errorText);
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Verificar que la respuesta exitosa también sea JSON
    if (!isJson) {
      throw new Error("La respuesta del servidor no es JSON válido");
    }

    const loginResponse = await response.json();

    // Validar que el usuario sea admin
    if (loginResponse.role !== "admin") {
      throw new Error("Acceso denegado: Solo usuarios admin pueden acceder");
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
