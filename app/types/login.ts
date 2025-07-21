export interface LoginFormValues {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
  role: "admin" | "hr" | "employee";
  checkin_start_time: string;
  timezone: string;
  notification_offset_min: number;
  pending_approval: boolean;
  deactivated: boolean;
  email_confirmed: boolean;
  surname: string;
  phone: string;
  checkout_end_time: string;
  location: Record<string, unknown>;
  // Campos opcionales para compatibilidad
  first_name?: string;
  last_name?: string;
  team_id?: number;
  is_active?: boolean;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  // Backward compatibility
  email: string;
  id: number;
  name: string;
  picture: string;
  role: string;
  token: string;
}
