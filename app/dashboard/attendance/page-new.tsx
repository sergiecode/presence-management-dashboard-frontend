"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getCheckinsView,
  getDashboardSummary,
  exportAttendanceReport,
  updateCheckin,
  createCheckinForUser,
  getUsers,
} from "@/app/services/dashboard";
import { useUser } from "@/app/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CheckinRecord {
  checkin_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  date: string;
  checkin_time: string;
  checkout_time?: string;
  checkout_status?: string;
  location_type: "home" | "office" | string;
  location_detail?: string;
  gps_lat: number;
  gps_long: number;
  late: boolean;
  overtime: boolean;
  notes?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface CreateCheckinData {
  locations: Array<{
    location_type: number;
    location_detail: string;
  }>;
  late_reason?: string;
  notes?: string;
  time: string;
  user_id: number;
}

interface EditCheckinData {
  locations?: Array<{
    location_type: number;
    location_detail: string;
  }>;
  late_reason?: string;
  notes?: string;
  time?: string;
  user_id?: number;
}

interface DailySummary {
  date: string;
  total_checkins: number;
  on_time: number;
  late: number;
  absent: number;
  unique_users: number;
  overtime?: number;
}

interface APIDailySummary {
  date: string;
  total_checkins: number;
  total_on_time: number;
  total_late: number;
  total_overtime: number;
  created_at: string;
  updated_at: string;
}

export default function AttendancePage() {
  const { user } = useUser();

  // Estados principales
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Estados de filtrado y paginación
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "late" | "ontime" | "overtime"
  >("all");
  const [locationFilter, setLocationFilter] = useState<
    "all" | "office" | "home"
  >("all");

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCheckin, setEditingCheckin] = useState<CheckinRecord | null>(
    null
  );

  // Estados de formularios
  const [createForm, setCreateForm] = useState<CreateCheckinData>({
    locations: [{ location_type: 1, location_detail: "" }],
    notes: "",
    time: new Date().toISOString().slice(0, 16),
    user_id: 0,
  });
  const [editForm, setEditForm] = useState<EditCheckinData>({});

  const fetchAttendanceData = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      // Convertir fecha de YYYY-MM-DD a MM/dd/yyyy evitando problemas de timezone
      const [year, month, day] = date.split("-");
      const formattedDate = `${month}/${day}/${year}`;

      // Obtener datos generales de check-ins
      const checkinsData = await getCheckinsView(formattedDate);
      setCheckins(checkinsData?.data || checkinsData || []);

      // Cargar usuarios para los formularios
      try {
        const usersData = await getUsers({ limit: 1000 });
        setAllUsers(usersData?.data || usersData || []);
      } catch (userError) {
        console.error("Error fetching users:", userError);
      }

      // Intentar obtener el resumen diario del backend
      let dailySummaryFromAPI: APIDailySummary | null = null;
      try {
        dailySummaryFromAPI = await getDashboardSummary();
      } catch (summaryError) {
        console.error("Error fetching daily summary:", summaryError);
      }

      // Crear resumen diario usando datos del API o calculando manualmente
      if (dailySummaryFromAPI) {
        const uniqueUsers = checkinsData
          ? new Set(
              checkinsData.map((checkin: CheckinRecord) => checkin.user_id)
            ).size
          : 0;
        setDailySummary({
          date: dailySummaryFromAPI.date,
          total_checkins: dailySummaryFromAPI.total_checkins,
          on_time: dailySummaryFromAPI.total_on_time,
          late: dailySummaryFromAPI.total_late,
          absent: 0,
          unique_users: uniqueUsers,
          overtime: dailySummaryFromAPI.total_overtime,
        });
      } else if (checkinsData && checkinsData.length > 0) {
        const onTime = checkinsData.filter(
          (checkin: CheckinRecord) => !checkin.late
        ).length;
        const late = checkinsData.filter(
          (checkin: CheckinRecord) => checkin.late
        ).length;
        const overtime = checkinsData.filter(
          (checkin: CheckinRecord) => checkin.overtime
        ).length;
        const uniqueUsers = new Set(
          checkinsData.map((checkin: CheckinRecord) => checkin.user_id)
        ).size;

        setDailySummary({
          date,
          total_checkins: checkinsData.length,
          on_time: onTime,
          late: late,
          absent: 0,
          unique_users: uniqueUsers,
          overtime: overtime,
        });
      } else {
        setDailySummary({
          date,
          total_checkins: 0,
          on_time: 0,
          late: 0,
          absent: 0,
          unique_users: 0,
          overtime: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Error al cargar los datos de asistencia");
      setDailySummary({
        date,
        total_checkins: 0,
        on_time: 0,
        late: 0,
        absent: 0,
        unique_users: 0,
        overtime: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAttendanceData(selectedDate);
    }
  }, [selectedDate, user, fetchAttendanceData]);

  // Funciones de manejo de formularios
  const handleEditCheckin = (checkin: CheckinRecord) => {
    setEditingCheckin(checkin);
    setEditForm({
      notes: checkin.notes,
      time: new Date(checkin.checkin_time).toISOString().slice(0, 16),
      locations: [
        {
          location_type: checkin.location_type === "office" ? 1 : 2,
          location_detail: checkin.location_detail || "",
        },
      ],
    });
    setShowEditModal(true);
  };

  const handleCreateCheckin = async () => {
    try {
      await createCheckinForUser(createForm);
      setShowCreateModal(false);
      setCreateForm({
        locations: [{ location_type: 1, location_detail: "" }],
        notes: "",
        time: new Date().toISOString().slice(0, 16),
        user_id: 0,
      });
      fetchAttendanceData(selectedDate);
    } catch (err) {
      console.error("Error creating checkin:", err);
      setError("Error al crear el registro de asistencia");
    }
  };

  const handleUpdateCheckin = async () => {
    if (!editingCheckin) return;

    try {
      await updateCheckin(editingCheckin.checkin_id, editForm);
      setShowEditModal(false);
      setEditingCheckin(null);
      setEditForm({});
      fetchAttendanceData(selectedDate);
    } catch (err) {
      console.error("Error updating checkin:", err);
      setError("Error al actualizar el registro de asistencia");
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportAttendanceReport({
        start_date: selectedDate,
        end_date: selectedDate,
        format: "csv",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${selectedDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Error al exportar los datos");
    } finally {
      setExporting(false);
    }
  };

  // Configuración de React Table
  const columnHelper = createColumnHelper<CheckinRecord>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("user_name", {
        header: "Usuario",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {info.getValue().charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium">{info.getValue()}</div>
              <div className="text-sm text-muted-foreground">
                {info.row.original.user_email}
              </div>
            </div>
          </div>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("checkin_time", {
        header: "Entrada",
        cell: (info) => (
          <div className="font-mono text-sm">
            {new Date(info.getValue()).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ),
      }),
      columnHelper.accessor("checkout_time", {
        header: "Salida",
        cell: (info) => (
          <div className="font-mono text-sm">
            {info.getValue()
              ? new Date(info.getValue()!).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </div>
        ),
      }),
      columnHelper.accessor("late", {
        header: "Estado",
        cell: (info) => {
          const isLate = info.getValue();
          const isOvertime = info.row.original.overtime;
          const hasCheckout = !!info.row.original.checkout_time;

          if (isLate) {
            return (
              <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                Tarde
              </Badge>
            );
          } else if (isOvertime) {
            return (
              <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
                Tiempo Extra
              </Badge>
            );
          } else if (hasCheckout) {
            return (
              <Badge className="bg-gray-500/20 text-gray-700 border-gray-500/30">
                Finalizado
              </Badge>
            );
          } else {
            return (
              <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                A tiempo
              </Badge>
            );
          }
        },
      }),
      columnHelper.accessor("location_type", {
        header: "Ubicación",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {info.getValue() === "office" ? "🏢" : "🏠"}
            </span>
            <span className="capitalize">
              {info.getValue() === "office" ? "Oficina" : "Casa"}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditCheckin(info.row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const filteredData = useMemo(() => {
    let filtered = checkins;

    if (searchTerm) {
      filtered = filtered.filter(
        (checkin) =>
          checkin.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          checkin.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((checkin) => {
        if (statusFilter === "late") return checkin.late;
        if (statusFilter === "overtime") return checkin.overtime;
        if (statusFilter === "ontime")
          return !checkin.late && !checkin.overtime;
        return true;
      });
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(
        (checkin) => checkin.location_type === locationFilter
      );
    }

    return filtered;
  }, [checkins, searchTerm, statusFilter, locationFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

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
            Sistema de Gestión de Asistencia Empresarial
          </h1>
          <p className="text-muted-foreground">
            Panel administrativo para monitoreo y gestión de asistencia
            corporativa
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
          <div className="flex gap-2">
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Check-in
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Check-in</DialogTitle>
                  <DialogDescription>
                    Registrar asistencia para un empleado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Usuario</Label>
                    <Select
                      value={createForm.user_id.toString()}
                      onValueChange={(value) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          user_id: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {allUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name} - {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha y Hora</Label>
                    <Input
                      type="datetime-local"
                      value={createForm.time}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Ubicación</Label>
                    <Select
                      value={createForm.locations[0].location_type.toString()}
                      onValueChange={(value) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          locations: [
                            {
                              ...prev.locations[0],
                              location_type: parseInt(value),
                            },
                          ],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">🏢 Oficina</SelectItem>
                        <SelectItem value="2">🏠 Casa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Detalle de Ubicación</Label>
                    <Input
                      placeholder="Ej: Piso 3, Escritorio 42"
                      value={createForm.locations[0].location_detail}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          locations: [
                            {
                              ...prev.locations[0],
                              location_detail: e.target.value,
                            },
                          ],
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      placeholder="Notas adicionales..."
                      value={createForm.notes}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateCheckin}>
                      Crear Check-in
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => fetchAttendanceData(selectedDate)}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || checkins.length === 0}
            >
              <Download
                className={`h-4 w-4 mr-2 ${exporting ? "animate-spin" : ""}`}
              />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Resumen diario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registros
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : dailySummary?.total_checkins || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              de {dailySummary?.unique_users || 0} empleados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Tiempo</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : dailySummary?.on_time || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dailySummary && dailySummary.total_checkins > 0
                ? (
                    (dailySummary.on_time / dailySummary.total_checkins) *
                    100
                  ).toFixed(1)
                : 0}
              % puntualidad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tardanzas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {loading ? "..." : dailySummary?.late || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dailySummary && dailySummary.total_checkins > 0
                ? (
                    (dailySummary.late / dailySummary.total_checkins) *
                    100
                  ).toFixed(1)
                : 0}
              % tardanzas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Extra</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : dailySummary?.overtime || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              registros con sobretiem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productividad</CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dailySummary && dailySummary.total_checkins > 0
                ? (
                    (dailySummary.on_time / dailySummary.total_checkins) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">índice general</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "late" | "ontime" | "overtime") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="ontime">A Tiempo</SelectItem>
                <SelectItem value="late">Tardanzas</SelectItem>
                <SelectItem value="overtime">Tiempo Extra</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={locationFilter}
              onValueChange={(value: "all" | "office" | "home") =>
                setLocationFilter(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Ubicaciones</SelectItem>
                <SelectItem value="office">🏢 Oficina</SelectItem>
                <SelectItem value="home">🏠 Casa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla principal con React Table */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Registros de Asistencia - {selectedDate}</CardTitle>
          <CardDescription>
            {loading
              ? "Cargando registros..."
              : `${filteredData.length} de ${checkins.length} registros`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex space-x-4 p-4 border rounded"
                >
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay registros</h3>
              <p>
                No se encontraron registros de asistencia para los filtros
                aplicados
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="font-semibold">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-muted/50">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No hay resultados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  a{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    filteredData.length
                  )}{" "}
                  de {filteredData.length} registros
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edición */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Check-in</DialogTitle>
            <DialogDescription>
              Modificar registro de asistencia de {editingCheckin?.user_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <Input
                type="datetime-local"
                value={editForm.time || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, time: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Ubicación</Label>
              <Select
                value={
                  editForm.locations?.[0]?.location_type?.toString() || "1"
                }
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    locations: [
                      {
                        location_type: parseInt(value),
                        location_detail:
                          prev.locations?.[0]?.location_detail || "",
                      },
                    ],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">🏢 Oficina</SelectItem>
                  <SelectItem value="2">🏠 Casa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Detalle de Ubicación</Label>
              <Input
                placeholder="Ej: Piso 3, Escritorio 42"
                value={editForm.locations?.[0]?.location_detail || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    locations: [
                      {
                        location_type: prev.locations?.[0]?.location_type || 1,
                        location_detail: e.target.value,
                      },
                    ],
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                placeholder="Notas adicionales..."
                value={editForm.notes || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCheckin}>Actualizar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
