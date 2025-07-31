"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Building2, 
  UserCheck,
  Shield,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  getUsersStats,
  getMonthlyAnalytics,
  getAttendanceStatsRange,
  getUsers,
  getCheckinsView,
} from "@/app/services/dashboard";
import { useUser } from "@/app/contexts/UserContext";
import Link from "next/link";

interface UsersStats {
  total_users: number;
  admin: number;
  employees: number;
  hr: number;
  access_stats: {
    on_site_required: number;
    teams_access: number;
    zoho_access: number;
  };
  team_stats: null | Record<string, unknown>;
}

interface MonthlyData {
  month: string;
  total: number;
  late: number;
  overtime: number;
}

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  pending_approval: boolean;
  active: boolean;
  checkin_start_time: string;
}

interface AttendanceStats {
  total_checkins: number;
  on_time: number;
  on_time_pct: number;
  late: number;
  late_pct: number;
}

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();

  // Estados principales
  const [usersStats, setUsersStats] = useState<UsersStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [attendanceStats, setAttendanceStats] =
    useState<AttendanceStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [todayCheckins, setTodayCheckins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas de usuarios
      try {
        const usersData = await getUsersStats();
        setUsersStats(usersData);
      } catch (err) {
        console.error("Error fetching users stats:", err);
      }

      // Obtener datos mensuales
      try {
        const monthlyResponse = await getMonthlyAnalytics({
          page: 1,
          page_size: 12,
        });
        setMonthlyData(monthlyResponse?.data || []);
      } catch (err) {
        console.error("Error fetching monthly data:", err);
      }

      // Obtener usuarios pendientes de aprobación
      try {
        const usersResponse = await getUsers({ limit: 1000 });
        const allUsers = usersResponse?.data || [];
        const pending = allUsers.filter(
          (user: UserData) => user.pending_approval === true
        );
        setPendingUsers(pending);
      } catch (err) {
        console.error("Error fetching pending users:", err);
      }

      // Obtener check-ins de hoy
      try {
        const today = new Date().toISOString().split("T")[0];
        const [year, month, day] = today.split("-");
        const formattedDate = `${month}/${day}/${year}`;
        const todayCheckinsResponse = await getCheckinsView(formattedDate);
        const todayData =
          todayCheckinsResponse?.data || todayCheckinsResponse || [];
        setTodayCheckins(todayData.length);
      } catch (err) {
        console.error("Error fetching today checkins:", err);
      }

      // Obtener estadísticas de asistencia del último mes
      try {
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const attendanceData = await getAttendanceStatsRange({
          startDate,
          endDate,
        });
        setAttendanceStats(attendanceData);
      } catch (err) {
        console.error("Error fetching attendance stats:", err);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Calcular métricas derivadas
  const currentMonth = monthlyData.find(
    (item) => new Date(item.month).getMonth() === new Date().getMonth()
  );

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Debes estar autenticado para ver esta página</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Ejecutivo
          </h1>
          <p className="text-muted-foreground">
            Resumen completo del sistema de gestión de presencia empresarial
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-500 hover:text-red-700 flex-shrink-0 cursor-pointer"
            aria-label="Cerrar mensaje de error"
          >
            ×
          </button>
        </div>
      )}

      {/* Métricas principales de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Usuarios</p>
              <div className="text-lg font-bold text-blue-600">
                {loading ? "..." : usersStats?.total_users || 0}
              </div>
              <p className="text-xs text-muted-foreground">registrados</p>
            </div>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Administradores</p>
              <div className="text-lg font-bold text-purple-600">
                {loading ? "..." : usersStats?.admin || 0}
              </div>
              <p className="text-xs text-muted-foreground">con privilegios</p>
            </div>
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Empleados</p>
              <div className="text-lg font-bold text-green-600">
                {loading ? "..." : usersStats?.employees || 0}
              </div>
              <p className="text-xs text-muted-foreground">activos</p>
            </div>
            <UserCheck className="h-4 w-4 text-green-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Recursos Humanos</p>
              <div className="text-lg font-bold text-orange-600">
                {loading ? "..." : usersStats?.hr || 0}
              </div>
              <p className="text-xs text-muted-foreground">personal RRHH</p>
            </div>
            <Building2 className="h-4 w-4 text-orange-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pendientes</p>
              <div className="text-lg font-bold text-orange-600">
                {loading ? "..." : pendingUsers.length}
              </div>
              <p className="text-xs text-muted-foreground">por aprobar</p>
            </div>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Métricas de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Check-ins (30 días)</p>
              <div className="text-lg font-bold text-blue-600">
                {loading ? "..." : attendanceStats?.total_checkins || 0}
              </div>
              <p className="text-xs text-muted-foreground">registros totales</p>
            </div>
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tardanzas (30 días)</p>
              <div className="text-lg font-bold text-yellow-600">
                {loading ? "..." : attendanceStats?.late || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats?.late_pct || 0}% del total
              </p>
            </div>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Check-ins Hoy</p>
              <div className="text-lg font-bold text-indigo-600">
                {loading ? "..." : todayCheckins}
              </div>
              <p className="text-xs text-muted-foreground">registros de hoy</p>
            </div>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Resumen mensual actual */}
      {currentMonth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Resumen del Mes Actual
            </CardTitle>
            <CardDescription>
              Estadísticas de{" "}
              {new Date(currentMonth.month).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentMonth.total}
                </div>
                <p className="text-sm text-muted-foreground">Total Registros</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {currentMonth.late}
                </div>
                <p className="text-sm text-muted-foreground">Tardanzas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enlaces rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/attendance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Gestión de Asistencia
              </CardTitle>
              <CardDescription>
                Sistema completo de check-ins, reportes y exportación
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/employees">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-green-600" />
                Gestión de Empleados
              </CardTitle>
              <CardDescription>
                Administración de usuarios, roles y permisos
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Reportes y Analytics
              </CardTitle>
              <CardDescription>
                Análisis detallado y reportes personalizados
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
