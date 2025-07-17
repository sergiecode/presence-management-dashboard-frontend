// services/dashboard.ts

const API_BASE_URL = "/api/dashboard";

// Función helper para hacer peticiones autenticadas
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!).token
    : null;

  console.log("🔐 authenticatedFetch - URL:", url);
  console.log("🔐 authenticatedFetch - Token presente:", !!token);

  if (!token) {
    throw new Error("No se encontró token de autenticación");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  console.log("🌐 Response status:", response.status);
  console.log("🌐 Response statusText:", response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Response error:", errorText);
    throw new Error(
      `Error ${response.status}: ${response.statusText} - ${errorText}`
    );
  }

  const jsonResponse = await response.json();
  console.log("✅ JSON response:", jsonResponse);
  return jsonResponse;
}

// Servicios para el dashboard
export const dashboardService = {
  // Obtener estadísticas de ausencias
  async getAbsences(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return authenticatedFetch(`${API_BASE_URL}/absences?${params}`);
  },

  // Obtener heatmap de analíticas
  async getAnalyticsHeatmap() {
    return authenticatedFetch(`${API_BASE_URL}/analytics/heatmap`);
  },

  // Obtener analíticas mensuales
  async getAnalyticsMonthly() {
    return authenticatedFetch(`${API_BASE_URL}/analytics/monthly`);
  },

  // Obtener datos de overtime
  async getAnalyticsOvertime() {
    return authenticatedFetch(`${API_BASE_URL}/analytics/overtime`);
  },

  // Obtener predicciones
  async getAnalyticsPrediction() {
    return authenticatedFetch(`${API_BASE_URL}/analytics/prediction`);
  },

  // Obtener logs de auditoría
  async getAuditLogs(
    params: {
      user_email?: string;
      action?: string;
      entity_type?: string;
      entity_id?: number;
      date?: string;
      page?: number;
      page_size?: number;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return authenticatedFetch(`${API_BASE_URL}/audit-logs?${queryParams}`);
  },

  // Crear check-in
  async createCheckin(data: {
    date: string;
    gps_lat: number;
    gps_long: number;
    late_reason?: string;
    location_detail?: string;
    location_type: "home" | "office";
    notes?: string;
    time: string;
    user_id: number;
  }) {
    return authenticatedFetch(`${API_BASE_URL}/checkins`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Exportar check-ins
  async exportCheckins(
    params: {
      startDate?: string;
      endDate?: string;
      userId?: number;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const token = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!).token
      : null;

    const response = await fetch(
      `${API_BASE_URL}/checkins/export?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.blob(); // Para descargar el archivo
  },

  // Ver check-ins
  async viewCheckins(date: string) {
    return authenticatedFetch(`${API_BASE_URL}/checkins/view?date=${date}`);
  },

  // Actualizar check-in
  async updateCheckin(
    id: number,
    data: {
      date: string;
      gps_lat: number;
      gps_long: number;
      late_reason?: string;
      location_detail?: string;
      location_type: "home" | "office";
      notes?: string;
      time: string;
      user_id: number;
    }
  ) {
    return authenticatedFetch(`${API_BASE_URL}/checkins/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Obtener resumen diario
  async getDailySummary(date: string) {
    return authenticatedFetch(`${API_BASE_URL}/daily-summary?date=${date}`);
  },

  // Obtener usuarios con paginación
  async getUsers(page: number = 1, pageSize: number = 100) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    console.log("🌐 Llamando a /api/users/ con params:", params.toString());

    try {
      const result = await authenticatedFetch(`/api/users/?${params}`);
      console.log("✅ Respuesta de /api/users/:", result);
      return result;
    } catch (error) {
      console.error("❌ Error en getUsers:", error);
      throw error;
    }
  },
};
