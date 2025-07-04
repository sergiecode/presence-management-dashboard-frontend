export interface LoginFormValues {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  role: string
  emailConfirmed: boolean
  pendingApproval: boolean
  deactivated: boolean
  name?: string // opcional si tienes ese campo
}

export interface LoginResponse {
  token: string
  refresh_token: string
  user: User
}
