// services/dashboard.ts

import {
  CreateUserData,
  UpdateUserData,
  CreateCheckinData,
  CheckoutData,
  CreateAbsenceData,
  CreateTeamData,
  UpdateTeamData,
} from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("❌ No access token found in localStorage");
    throw new Error("No access token found");
  }

  console.log(`🌐 API Call: ${API_BASE_URL}${endpoint}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Dashboard Summary APIs
export async function getDashboardSummary(date?: string) {
  const params = new URLSearchParams();
  if (date) {
    params.append("date", date);
  }
  const queryString = params.toString();
  const url = `/api/dashboard/attendance/live-stats${
    queryString ? `?${queryString}` : ""
  }`;
  console.log("🌐 Calling live-stats API:", url);
  return authenticatedFetch(url);
}

export async function getUsersStats() {
  return authenticatedFetch("/api/dashboard/stats/users");
}

export async function getMonthlyAnalytics(filters?: {
  page?: number;
  page_size?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/analytics/monthly${queryString ? `?${queryString}` : ""}`
  );
}

export async function getOvertimeStats(filters?: {
  page?: number;
  page_size?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/stats/overtime${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAttendanceStatsRange(filters?: {
  startDate?: string;
  endDate?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/stats/attendance${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAttendanceStats(filters?: {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  team_id?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/attendance-stats${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAttendanceSummary(filters?: {
  date?: string;
  page?: number;
  page_size?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/attendance/summary${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAbsenceStats(filters?: {
  start_date?: string;
  end_date?: string;
  team_id?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/absence-stats${queryString ? `?${queryString}` : ""}`
  );
}

// User Management APIs
export async function getUsers(filters?: {
  page?: number;
  limit?: number;
  role?: string;
  is_active?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/users/${queryString ? `?${queryString}` : ""}`
  );
}

export async function createUser(userData: CreateUserData) {
  return authenticatedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(userId: number, userData: UpdateUserData) {
  return authenticatedFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(userId: number) {
  return authenticatedFetch(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

// Check-in/Check-out APIs
export async function getCheckins(filters?: {
  page?: number;
  limit?: number;
  user_id?: number;
  start_date?: string;
  end_date?: string;
  location?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/checkins/${queryString ? `?${queryString}` : ""}`
  );
}

export async function getCheckinsView(date: string) {
  const params = new URLSearchParams();
  params.append("date", date);
  const queryString = params.toString();
  return authenticatedFetch(`/api/dashboard/checkins/view?${queryString}`);
}

export async function getAttendanceIndividual(userId: number, date: string) {
  const params = new URLSearchParams();
  params.append("user_id", userId.toString());
  params.append("date", date);
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/dashboard/attendance/individual?${queryString}`
  );
}

export async function updateCheckin(
  checkinId: number,
  data: {
    locations?: Array<{
      location_type: number;
      location_detail: string;
    }>;
    late_reason?: string;
    notes?: string;
    time?: string;
    user_id?: number;
  }
) {
  return authenticatedFetch(`/api/dashboard/checkins/${checkinId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function createCheckinForUser(data: {
  locations: Array<{
    location_type: number;
    location_detail: string;
  }>;
  late_reason?: string;
  notes?: string;
  time: string;
  user_id: number;
}) {
  return authenticatedFetch("/api/dashboard/checkins", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createCheckin(checkinData: CreateCheckinData) {
  return authenticatedFetch("/api/checkins", {
    method: "POST",
    body: JSON.stringify(checkinData),
  });
}

export async function createCheckout(
  checkinId: number,
  checkoutData: CheckoutData
) {
  return authenticatedFetch(`/api/checkins/${checkinId}/checkout`, {
    method: "PUT",
    body: JSON.stringify(checkoutData),
  });
}

// Absence Management APIs
export async function getAbsences(filters?: {
  page?: number;
  limit?: number;
  user_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/absences${queryString ? `?${queryString}` : ""}`
  );
}

export async function createAbsence(absenceData: CreateAbsenceData) {
  return authenticatedFetch("/api/absences", {
    method: "POST",
    body: JSON.stringify(absenceData),
  });
}

export async function updateAbsenceStatus(
  absenceId: number,
  status: string,
  notes?: string
) {
  return authenticatedFetch(`/api/absences/${absenceId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, notes }),
  });
}

// Team Management APIs
export async function getTeams() {
  return authenticatedFetch("/api/teams");
}

export async function createTeam(teamData: CreateTeamData) {
  return authenticatedFetch("/api/teams", {
    method: "POST",
    body: JSON.stringify(teamData),
  });
}

export async function updateTeam(teamId: number, teamData: UpdateTeamData) {
  return authenticatedFetch(`/api/teams/${teamId}`, {
    method: "PUT",
    body: JSON.stringify(teamData),
  });
}

export async function deleteTeam(teamId: number) {
  return authenticatedFetch(`/api/teams/${teamId}`, {
    method: "DELETE",
  });
}

export async function getTeamMembers(teamId: number) {
  return authenticatedFetch(`/api/teams/${teamId}/members`);
}

export async function addTeamMember(teamId: number, userId: number) {
  return authenticatedFetch(`/api/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function removeTeamMember(teamId: number, userId: number) {
  return authenticatedFetch(`/api/teams/${teamId}/members/${userId}`, {
    method: "DELETE",
  });
}

// Export APIs
export async function exportAttendanceReport(filters?: {
  date?: string;
  user_id?: number;
  team_id?: number;
  format?: "csv" | "excel";
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/export/attendance${
      queryString ? `?${queryString}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();

  // Ensure proper MIME type for Excel files
  if (blob.type === "" || blob.type === "application/octet-stream") {
    return new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  return blob;
}

export async function exportCheckinsReport(filters?: {
  date?: string;
  userId?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.date) params.append("date", filters.date);
    if (filters.userId) params.append("userId", filters.userId.toString());
  }
  const queryString = params.toString();

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/export/checkins${
      queryString ? `?${queryString}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();

  // Ensure proper MIME type for Excel files
  if (blob.type === "" || blob.type === "application/octet-stream") {
    return new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  return blob;
}

export async function exportAbsenceReport(filters?: {
  start_date?: string;
  end_date?: string;
  team_id?: number;
  format?: "csv" | "excel";
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/export/absences${
      queryString ? `?${queryString}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();

  // Ensure proper MIME type for Excel files
  if (blob.type === "" || blob.type === "application/octet-stream") {
    return new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }

  return blob;
}

// Audit Logs API
export async function getAuditLogs(filters?: {
  page?: number;
  limit?: number;
  user_email?: string;
  action?: string;
  entity_type?: string;
  entity_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/audit-logs${queryString ? `?${queryString}` : ""}`
  );
}

// Analytics APIs
export async function getAnalyticsHeatmap(filters?: {
  start_date?: string;
  end_date?: string;
  team_id?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/analytics/heatmap${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAnalyticsMonthly(filters?: {
  year?: number;
  month?: number;
  team_id?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/analytics/monthly${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAnalyticsOvertime(filters?: {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  team_id?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/analytics/overtime${queryString ? `?${queryString}` : ""}`
  );
}

export async function getAnalyticsPrediction(filters?: {
  type?: "attendance" | "absence";
  period?: "week" | "month" | "quarter";
  team_id?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  const queryString = params.toString();
  return authenticatedFetch(
    `/api/analytics/prediction${queryString ? `?${queryString}` : ""}`
  );
}

// Additional User Management APIs
export async function getUserById(userId: number) {
  return authenticatedFetch(`/api/users/${userId}`);
}

export async function updateUserHrDetails(
  userId: number,
  hrData: {
    approve?: boolean;
    birth_date?: string;
    cuil?: string;
    dni?: string;
    hire_date?: string;
    location?: {
      calle?: string;
      ciudad?: string;
      codigo_postal?: string;
      numero?: string;
      pais?: string;
      piso?: string;
      provincia?: string;
      tipo?: number;
    };
    monthly_objective_days?: number;
    notes?: string;
    office_days?: string;
    on_site_required?: boolean;
    team?: string;
    teams_access?: boolean;
    weekly_hours?: number;
    weekly_objective_days?: number;
    zoho_access?: boolean;
  }
) {
  return authenticatedFetch(`/api/users/${userId}/hr-details`, {
    method: "PUT",
    body: JSON.stringify(hrData),
  });
}

export async function updateUserCheckinConfig(
  userId: number,
  configData: {
    checkin_start_time?: string;
    checkout_end_time?: string;
    notification_offset_min?: number;
    timezone?: string;
  }
) {
  return authenticatedFetch(`/api/users/${userId}/checkin-config`, {
    method: "PUT",
    body: JSON.stringify(configData),
  });
}

// Utility function to download files with proper handling
export function downloadFile(blob: Blob, filename: string, mimeType?: string) {
  // Create blob with proper MIME type if provided
  const fileBlob = mimeType ? new Blob([blob], { type: mimeType }) : blob;

  const url = window.URL.createObjectURL(fileBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Generate filename with date
export function generateExportFilename(
  type: "attendance" | "checkins",
  date?: string
): string {
  const dateSuffix = date ? `_${date}` : "";
  const timestamp = new Date().toISOString().split("T")[0];

  if (type === "attendance") {
    return `ART_presentismo${dateSuffix || `_${timestamp}`}.xlsx`;
  } else {
    return `ART_checkins${dateSuffix || `_${timestamp}`}.xlsx`;
  }
}
