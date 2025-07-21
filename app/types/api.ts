// types/api.ts

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "hr" | "employee";
  team_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "admin" | "hr" | "employee";
  team_id?: number;
  is_active?: boolean;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: "admin" | "hr" | "employee";
  team_id?: number;
  is_active?: boolean;
}

export interface Checkin {
  id: number;
  user_id: number;
  check_in_time: string;
  check_out_time?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCheckinData {
  user_id: number;
  check_in_time: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface CheckoutData {
  check_out_time: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface Absence {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  type: "vacation" | "sick" | "personal" | "other";
  reason?: string;
  status: "pending" | "approved" | "rejected";
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAbsenceData {
  user_id: number;
  start_date: string;
  end_date: string;
  type: "vacation" | "sick" | "personal" | "other";
  reason?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
}

export interface DashboardSummary {
  total_employees: number;
  present_today: number;
  absent_today: number;
  pending_requests: number;
  attendance_rate: number;
  recent_checkins: Checkin[];
  pending_absences: Absence[];
}

export interface AttendanceStats {
  total_checkins: number;
  average_hours: number;
  late_arrivals: number;
  early_departures: number;
  by_day: Array<{
    date: string;
    checkins: number;
    average_hours: number;
  }>;
}

export interface AbsenceStats {
  total_absences: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  by_type: Array<{
    type: string;
    count: number;
  }>;
}

export interface AuditLog {
  id: number;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: number;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface PaginationFilters {
  page?: number;
  limit?: number;
}

export interface DateFilters {
  start_date?: string;
  end_date?: string;
}

export interface UserFilters extends PaginationFilters {
  role?: string;
  is_active?: boolean;
}

export interface CheckinFilters extends PaginationFilters, DateFilters {
  user_id?: number;
  location?: string;
}

export interface AbsenceFilters extends PaginationFilters, DateFilters {
  user_id?: number;
  status?: string;
}

export interface AttendanceStatsFilters extends DateFilters {
  user_id?: number;
  team_id?: number;
}

export interface AbsenceStatsFilters extends DateFilters {
  team_id?: number;
}

export interface AuditLogFilters extends PaginationFilters, DateFilters {
  user_email?: string;
  action?: string;
  entity_type?: string;
  entity_id?: number;
}

export interface AnalyticsHeatmapFilters extends DateFilters {
  team_id?: number;
}

export interface AnalyticsMonthlyFilters {
  year?: number;
  month?: number;
  team_id?: number;
}

export interface AnalyticsOvertimeFilters extends DateFilters {
  user_id?: number;
  team_id?: number;
}

export interface AnalyticsPredictionFilters {
  type?: "attendance" | "absence";
  period?: "week" | "month" | "quarter";
  team_id?: number;
}

export interface ExportFilters extends DateFilters {
  user_id?: number;
  team_id?: number;
  format?: "csv" | "excel";
}
