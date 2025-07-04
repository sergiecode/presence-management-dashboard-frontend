// features/auth/services.ts

import { LoginFormValues, LoginResponse } from "../types/login"

export async function loginUser(data: LoginFormValues): Promise<LoginResponse> {
  const response = await fetch('http://localhost:8081/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include' // Importante para manejar cookies
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error en el login')
  }

  return response.json()
}