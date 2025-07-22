"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDashboardSummary, getUsers } from "@/app/services/dashboard";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingRegistrations: number;
  attendanceRecords: number;
  productivityRate: number;
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingRegistrations: 0,
    attendanceRecords: 0,
    productivityRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar token de autenticación antes de hacer llamadas
        const userStr = localStorage.getItem("user");

        if (!userStr) {
          throw new Error("No se encontró información de usuario autenticado");
        }

        const userData = JSON.parse(userStr);

        if (userData.role !== "admin") {
          throw new Error(
            "Solo los administradores pueden ver estadísticas de usuarios"
          );
        }

        // Obtener usuarios del endpoint real /api/users
        const usersResponse = await getUsers({}); // Sin filtros para traer todos los usuarios

        // TEMPORAL: Comentar getDashboardSummary hasta que el endpoint esté disponible
        const dailySummaryData = null; // Temporal hasta que el endpoint esté listo

        // Procesar datos de usuarios
        const users = usersResponse?.data || [];
        const totalEmployees =
          usersResponse?.pagination?.total || users.length || 0;

        // Calcular empleados activos basado en el campo 'active'
        const activeEmployees = users.filter(
          (user: any) => user.active === true
        ).length;

        // Calcular registros pendientes basado en 'pending_approval'
        const pendingRegistrations = users.filter(
          (user: any) => user.pending_approval === true
        ).length;

        // Calcular asistencia basada en checkin_start_time (si no está vacío, hizo checkin)
        const usersWithCheckin = users.filter(
          (user: any) =>
            user.checkin_start_time && user.checkin_start_time.trim() !== ""
        ).length;

        const attendanceRecords = usersWithCheckin;
        const productivityRate =
          totalEmployees > 0 ? (usersWithCheckin / totalEmployees) * 100 : 0;

        setStats({
          totalEmployees,
          activeEmployees,
          pendingRegistrations,
          attendanceRecords,
          productivityRate,
        });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
        setError(
          `Error al cargar datos: ${
            err instanceof Error ? err.message : "Error desconocido"
          }`
        );
        setStats({
          totalEmployees: 0,
          activeEmployees: 0,
          pendingRegistrations: 0,
          attendanceRecords: 0,
          productivityRate: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const glass: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.81)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(16.4px)",
    WebkitBackdropFilter: "blur(16.4px)",
    border: "1px solid rgba(0, 0, 0, 0.3)",
  };

  // Datos para el gráfico de pastel basados en datos reales
  const chartData = [
    {
      browser: "Activos",
      visitors: stats.activeEmployees,
      fill: "var(--chart-1)",
    },
    {
      browser: "Inactivos",
      visitors:
        stats.totalEmployees -
        stats.activeEmployees -
        stats.pendingRegistrations,
      fill: "var(--chart-2)",
    },
    {
      browser: "Pendientes",
      visitors: stats.pendingRegistrations,
      fill: "var(--chart-3)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    Activos: {
      label: "Activos",
      color: "var(--chart-1)",
    },
    Inactivos: {
      label: "Inactivos",
      color: "var(--chart-2)",
    },
    Pendientes: {
      label: "Pendientes",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Sección de Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Total de Empleados</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : stats.totalEmployees}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {error
                ? "Error al cargar datos"
                : "Usuarios registrados en el sistema"}
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Empleados Activos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : stats.activeEmployees}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
              {loading
                ? "..."
                : `Asistencia hoy: ${stats.productivityRate.toFixed(1)}%`}
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Registros Pendientes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : stats.pendingRegistrations}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {error
                ? "Error al cargar datos"
                : "Usuarios con aprobación pendiente"}
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Registros de Asistencia</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : stats.attendanceRecords}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {loading
                ? "..."
                : `Pendientes hoy: ${Math.max(
                    0,
                    stats.totalEmployees - stats.attendanceRecords
                  )}`}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Gráfico de Pastel */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols gap-4 px-4">
        <Card className="mt-4 w-full" style={glass}>
          <CardHeader className="items-center pb-0">
            <CardTitle>Distribución de Empleados</CardTitle>
            <CardDescription>
              Distribución actual por estado de empleados
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  label={({ name, percent }) => {
                    if (name && percent !== undefined) {
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }
                    return "";
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Resumen visual del estado de empleados
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
