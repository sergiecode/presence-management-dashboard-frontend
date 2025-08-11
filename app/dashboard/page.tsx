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
  Calendar,
  Clock,
  Building2,
  UserCheck,
  Shield,
  BarChart3,
  RefreshCw,
  X,
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
import Image from "next/image";

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
  birth_date?: string;
  profile_picture?: string;
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
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [todayCheckins, setTodayCheckins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [birthdayCardClosed, setBirthdayCardClosed] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [animatingAvatars, setAnimatingAvatars] = useState<Set<number>>(
    new Set()
  );

  // Function to find the next birthdays (can be multiple if same date)
  const getNextBirthdays = useCallback(() => {
    if (!allUsers.length) return [];

    const today = new Date();
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    // Filter users with birth_date and calculate next birthday
    const usersWithBirthdays = allUsers
      .filter((user) => user.birth_date && user.active)
      .map((user) => {
        if (!user.birth_date) return null;

        // Parse birth date - handle both ISO string and date string formats
        let birthDate: Date;
        if (
          typeof user.birth_date === "string" &&
          user.birth_date.includes("T")
        ) {
          // ISO string format like "1995-10-27T00:00:00Z"
          // Parse as UTC and then get local date components to avoid timezone issues
          const utcDate = new Date(user.birth_date);
          birthDate = new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate()
          );
        } else {
          // Simple date string format like "1990-06-11"
          birthDate = new Date(user.birth_date + "T00:00:00");
        }

        // Create birthday dates for this year and next year
        const thisYearBirthday = new Date(
          currentYear,
          birthDate.getMonth(),
          birthDate.getDate()
        );
        thisYearBirthday.setHours(0, 0, 0, 0);

        const nextYearBirthday = new Date(
          currentYear + 1,
          birthDate.getMonth(),
          birthDate.getDate()
        );
        nextYearBirthday.setHours(0, 0, 0, 0);

        // If birthday already passed this year, use next year's date
        const nextBirthday =
          thisYearBirthday >= today ? thisYearBirthday : nextYearBirthday;

        const timeDiff = nextBirthday.getTime() - today.getTime();
        const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
          ...user,
          nextBirthday,
          daysUntil,
        };
      })
      .filter((user) => user !== null)
      .sort((a, b) => a!.daysUntil - b!.daysUntil);

    // Get the minimum days until birthday
    if (usersWithBirthdays.length === 0) return [];

    const minDays = usersWithBirthdays[0]!.daysUntil;

    // Only show birthdays within 5 days
    if (minDays > 5) return [];

    // Group users by days until birthday
    const birthdayGroups: { [key: number]: typeof usersWithBirthdays } = {};
    usersWithBirthdays.forEach((user) => {
      if (!birthdayGroups[user!.daysUntil]) {
        birthdayGroups[user!.daysUntil] = [];
      }
      birthdayGroups[user!.daysUntil].push(user);
    });

    // Get the first two groups (today/tomorrow or consecutive days)
    const sortedDays = Object.keys(birthdayGroups)
      .map(Number)
      .sort((a, b) => a - b);
    const firstDay = sortedDays[0];
    const secondDay = sortedDays[1];

    let result = birthdayGroups[firstDay] || [];

    // If there's a second group and it's within 1-2 days of the first, include it
    if (
      secondDay !== undefined &&
      secondDay <= firstDay + 2 &&
      secondDay <= 5
    ) {
      result = [...result, ...birthdayGroups[secondDay]];
    }

    return result;
  }, [allUsers]);

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

      // Obtener usuarios pendientes de aprobación y cargar todos los usuarios
      try {
        const usersResponse = await getUsers({ limit: 1000 });
        const allUsersData = usersResponse?.data || [];

        setAllUsers(allUsersData);

        const pending = allUsersData.filter(
          (user: UserData) => user.pending_approval === true
        );
        setPendingUsers(pending);
      } catch (err) {
        console.error("Error fetching users:", err);
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

      {/* Próximos Cumpleaños */}
      {(() => {
        const nextBirthdays = getNextBirthdays();
        if (!nextBirthdays || nextBirthdays.length === 0 || birthdayCardClosed)
          return null;

        const formatBirthdayDate = (date: Date) => {
          return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
          });
        };

        // Group birthdays by days until
        const birthdaysByDays: { [key: number]: typeof nextBirthdays } = {};
        nextBirthdays.forEach((user) => {
          if (!birthdaysByDays[user.daysUntil]) {
            birthdaysByDays[user.daysUntil] = [];
          }
          birthdaysByDays[user.daysUntil].push(user);
        });

        const sortedDays = Object.keys(birthdaysByDays)
          .map(Number)
          .sort((a, b) => a - b);
        const firstDay = sortedDays[0];
        const hasMultipleDays = sortedDays.length > 1;

        const isToday = firstDay === 0;
        const isTomorrow = firstDay === 1;

        // Function to get day label
        const getDayLabel = (days: number) => {
          if (days === 0) return "¡HOY!";
          if (days === 1) return "¡MAÑANA!";
          return `${days} día${days !== 1 ? "s" : ""}`;
        };

        return (
          <Card
            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            onMouseEnter={(e) => {
              // Prevenir nuevas animaciones si ya hay una en curso
              if (isCardAnimating) return;

              setIsCardAnimating(true);

              // Crear explosión de confetti desde múltiples puntos de la tarjeta
              const rect = e.currentTarget.getBoundingClientRect();
              const points = [
                {
                  x: rect.left + rect.width * 0.2,
                  y: rect.top + rect.height * 0.3,
                },
                {
                  x: rect.left + rect.width * 0.8,
                  y: rect.top + rect.height * 0.3,
                },
                {
                  x: rect.left + rect.width * 0.5,
                  y: rect.top + rect.height * 0.6,
                },
                {
                  x: rect.left + rect.width * 0.1,
                  y: rect.top + rect.height * 0.7,
                },
                {
                  x: rect.left + rect.width * 0.9,
                  y: rect.top + rect.height * 0.7,
                },
              ];

              let activeAnimations = 0;
              const totalAnimations = points.length * 12; // 5 puntos * 12 confetti cada uno

              points.forEach((point, pointIndex) => {
                setTimeout(() => {
                  for (let i = 0; i < 12; i++) {
                    const confetti = document.createElement("div");
                    confetti.style.position = "fixed";
                    confetti.style.left = point.x + "px";
                    confetti.style.top = point.y + "px";
                    confetti.style.width = "10px";
                    confetti.style.height = "10px";
                    confetti.style.backgroundColor = [
                      "#ff6b6b",
                      "#4ecdc4",
                      "#45b7d1",
                      "#f9ca24",
                      "#f0932b",
                      "#eb4d4b",
                      "#a55eea",
                      "#26de81",
                      "#fd79a8",
                      "#fdcb6e",
                    ][Math.floor(Math.random() * 10)];
                    confetti.style.borderRadius =
                      Math.random() > 0.5 ? "50%" : "0%";
                    confetti.style.pointerEvents = "none";
                    confetti.style.zIndex = "9999";
                    confetti.style.fontSize = "12px";
                    confetti.innerHTML =
                      Math.random() > 0.7
                        ? ["🎉", "🎊", "🎈", "🎂", "🌟", "✨"][
                            Math.floor(Math.random() * 6)
                          ]
                        : "";
                    document.body.appendChild(confetti);

                    const angle =
                      (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
                    const velocity = 60 + Math.random() * 40;
                    const vx = Math.cos(angle) * velocity;
                    const vy = Math.sin(angle) * velocity - 40;

                    let x = 0,
                      y = 0,
                      opacity = 1,
                      rotation = 0;
                    const gravity = 0.6;
                    const rotationSpeed = (Math.random() - 0.5) * 10;
                    let vy_current = vy;

                    const animate = () => {
                      x += vx * 0.016;
                      y += vy_current * 0.016;
                      vy_current += gravity;
                      opacity -= 0.015;
                      rotation += rotationSpeed;

                      confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                      confetti.style.opacity = opacity.toString();

                      if (opacity > 0) {
                        requestAnimationFrame(animate);
                      } else {
                        if (document.body.contains(confetti)) {
                          document.body.removeChild(confetti);
                        }
                        activeAnimations++;
                        // Cuando todas las animaciones terminen, permitir nuevas
                        if (activeAnimations >= totalAnimations) {
                          setIsCardAnimating(false);
                        }
                      }
                    };

                    requestAnimationFrame(animate);
                  }
                }, pointIndex * 100); // Delay progresivo para cada punto
              });
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setBirthdayCardClosed(true)}
              className="absolute top-3 right-3 text-purple-400 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-100 transition-colors cursor-pointer"
              aria-label="Cerrar notificación de cumpleaños"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4 pr-8">
              {/* pr-8 para dar espacio al botón cerrar */}
              <div className="flex">
                {nextBirthdays.map((user, index) => (
                  <div
                    key={user.id}
                    className={`relative group cursor-pointer transition-transform duration-200 hover:scale-110 ${
                      index > 0 ? "-ml-3" : ""
                    }`}
                    onMouseEnter={(e) => {
                      // Prevenir nueva animación si este avatar ya está animando
                      if (animatingAvatars.has(user.id)) return;

                      // Agregar este avatar al set de avatares animando
                      setAnimatingAvatars((prev) => new Set(prev).add(user.id));

                      // Animación específica para cada avatar - más pequeña y rápida
                      const rect = e.currentTarget.getBoundingClientRect();
                      const centerX = rect.left + rect.width / 2;
                      const centerY = rect.top + rect.height / 2;

                      let activeParticles = 0;
                      const totalParticles = 8;

                      for (let i = 0; i < totalParticles; i++) {
                        const confetti = document.createElement("div");
                        confetti.style.position = "fixed";
                        confetti.style.left = centerX + "px";
                        confetti.style.top = centerY + "px";
                        confetti.style.width = "6px";
                        confetti.style.height = "6px";
                        confetti.style.backgroundColor = [
                          "#ff6b6b",
                          "#4ecdc4",
                          "#45b7d1",
                          "#f9ca24",
                        ][Math.floor(Math.random() * 4)];
                        confetti.style.borderRadius = "50%";
                        confetti.style.pointerEvents = "none";
                        confetti.style.zIndex = "9999";
                        document.body.appendChild(confetti);

                        const angle = (Math.PI * 2 * i) / 8;
                        const velocity = 30 + Math.random() * 25;
                        const vx = Math.cos(angle) * velocity;
                        const vy = Math.sin(angle) * velocity - 20;

                        let x = 0,
                          y = 0,
                          opacity = 1;
                        const gravity = 0.4;
                        let vy_current = vy;

                        const animate = () => {
                          x += vx * 0.025;
                          y += vy_current * 0.025;
                          vy_current += gravity;
                          opacity -= 0.03;

                          confetti.style.transform = `translate(${x}px, ${y}px)`;
                          confetti.style.opacity = opacity.toString();

                          if (opacity > 0) {
                            requestAnimationFrame(animate);
                          } else {
                            if (document.body.contains(confetti)) {
                              document.body.removeChild(confetti);
                            }
                            activeParticles++;
                            // Cuando todas las partículas de este avatar terminen, remover del set
                            if (activeParticles >= totalParticles) {
                              setAnimatingAvatars((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(user.id);
                                return newSet;
                              });
                            }
                          }
                        };

                        requestAnimationFrame(animate);
                      }
                    }}
                  >
                    {user.profile_picture ? (
                      <Image
                        src={user.profile_picture}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white dark:border-gray-800 shadow-sm flex items-center justify-center text-white font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    {nextBirthdays.length > 1 &&
                      index === nextBirthdays.length - 1 &&
                      nextBirthdays.length > 3 && (
                        <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          +{nextBirthdays.length - 3}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-purple-800 dark:text-purple-200 mb-1">
                  🎉{" "}
                  {isToday
                    ? "¡Cumpleaños hoy!"
                    : isTomorrow
                    ? "¡Cumpleaños mañana!"
                    : "Próximos cumpleaños"}
                </h3>
                <div className="space-y-2">
                  {sortedDays.map((day) => (
                    <div key={day} className="space-y-1">
                      {sortedDays.length > 1 && (
                        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                          {getDayLabel(day)}
                        </div>
                      )}
                      {birthdaysByDays[day].slice(0, 3).map((user, index) => (
                        <div
                          key={user.id}
                          className="text-sm text-purple-700 dark:text-purple-300"
                        >
                          <span className="font-medium">{user.name}</span>
                          {sortedDays.length === 1 && index === 0 && (
                            <span className="text-purple-600 dark:text-purple-400 ml-2">
                              - {formatBirthdayDate(user.nextBirthday)}
                            </span>
                          )}
                          {sortedDays.length > 1 && (
                            <span className="text-purple-600 dark:text-purple-400 ml-2">
                              - {formatBirthdayDate(user.nextBirthday)}
                            </span>
                          )}
                        </div>
                      ))}
                      {birthdaysByDays[day].length > 3 && (
                        <div className="text-sm text-purple-600 dark:text-purple-400">
                          y {birthdaysByDays[day].length - 3} persona
                          {birthdaysByDays[day].length - 3 > 1 ? "s" : ""} más
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {isToday
                    ? "¡HOY!"
                    : isTomorrow
                    ? "¡MAÑANA!"
                    : `${firstDay} día${firstDay !== 1 ? "s" : ""}`}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {hasMultipleDays
                    ? `${nextBirthdays.length} cumpleaños próximos`
                    : nextBirthdays.length === 1
                    ? "para celebrar"
                    : `${nextBirthdays.length} cumpleaños`}
                </div>
              </div>
            </div>
          </Card>
        );
      })()}

      {/* Métricas principales de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Usuarios
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Administradores
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Empleados
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Recursos Humanos
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Pendientes
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Check-ins (30 días)
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Tardanzas (30 días)
              </p>
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
              <p className="text-xs font-medium text-muted-foreground">
                Check-ins Hoy
              </p>
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
