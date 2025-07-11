export interface LoginFormValues {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
  role: string;
}

export interface LoginResponse {
  email: string;
  id: number;
  name: string;
  picture: string;
  role: string;
  token: string;
}
