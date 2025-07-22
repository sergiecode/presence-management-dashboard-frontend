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
  MapPin, 
  Download, 
  RefreshCw, 
  Plus,
  Edit,
  Search,
  Filter,
  Users,
  Building2,
  Home
} from "lucide-react";
import {
  getCheckinsView,
  getAttendanceIndividual,
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
  location_type: "home" | "office";
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

interface IndividualAttendance {
  user: {
    id: number;
    email: string;
    name: string;
    picture: string;
    role: string;
    checkin_start_time: string;
    timezone: string;
    notification_offset_min: number;
    pending_approval: boolean;
    active: boolean;
    email_confirmed: boolean;
    surname: string;
    phone: string;
    checkout_end_time: string;
    dni: string;
    cuil: string;
    birth_date: string | null;
    hire_date: string | null;
    location: Record<string, unknown>;
    weekly_hours: number;
    notes: string;
    team: string;
    zoho_access: boolean;
    teams_access: boolean;
    on_site_required: boolean;
    weekly_objective_days: number;
    monthly_objective_days: number;
    office_days: string;
    end_of_day_absence_detection: boolean;
  };
  checkin: {
    id: number;
    user_id: number;
    time: string;
    notes: string;
    late: boolean;
    late_reason: string;
    created_at: string;
    checkout_time: string;
    overtime: boolean;
    locations: Array<{
      id: number;
      checkin_id: number;
      location_type: number;
      location_detail: string;
      created_at: string;
    }>;
  } | null;
  checkout: {
    checkout_time: string;
    checkout_status: string;
    overtime: boolean;
  } | null;
  absence: Record<string, unknown> | null;
}

interface DailySummary {
  date: string;
  total_checkins: number;
  on_time: number;
  late: number;
  absent: number;
  unique_users: number;
  overtime?: number; // Agregar campo para tiempo extra
}

// Interface para la respuesta real del API
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
  const [individualData, setIndividualData] = useState<IndividualAttendance[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Estados de filtrado y paginación
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'detailed'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'late' | 'ontime' | 'overtime'>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'office' | 'home'>('all');
  
  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCheckin, setEditingCheckin] = useState<CheckinRecord | null>(null);
  
  // Estados de formularios
  const [createForm, setCreateForm] = useState<CreateCheckinData>({
    locations: [{ location_type: 1, location_detail: '' }],
    notes: '',
    time: new Date().toISOString().slice(0, 16),
    user_id: 0,
  });
  const [editForm, setEditForm] = useState<EditCheckinData>({});

  const fetchAttendanceData = useCallback(
    async (date: string) => {
      try {
        setLoading(true);
        setError(null);

        // Convertir fecha de YYYY-MM-DD a MM/dd/yyyy evitando problemas de timezone
        const [year, month, day] = date.split('-');
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

        // Obtener datos individuales detallados para cada usuario único (solo si hay pocos registros)
        const uniqueUserIds = [...new Set((checkinsData || []).map((checkin: CheckinRecord) => checkin.user_id))] as number[];
        
        if (uniqueUserIds.length <= 20) { // Solo cargar detalles si hay 20 usuarios o menos
          const individualPromises = uniqueUserIds.map(userId => 
            getAttendanceIndividual(userId, `${year}/${month}/${day}`)
          );
          
          try {
            const individualResults = await Promise.all(individualPromises);
            setIndividualData(individualResults.filter(result => result !== null));
          } catch (individualError) {
            console.error("Error fetching individual data:", individualError);
            setIndividualData([]);
          }
        } else {
          setIndividualData([]);
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
          // Usar datos del backend - IMPLEMENTADO ✅
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
            absent: 0, // TODO: Implementar endpoint para calcular ausentes
            unique_users: uniqueUsers,
            overtime: dailySummaryFromAPI.total_overtime,
          });
        } else if (checkinsData && checkinsData.length > 0) {
          // TODO: Remover cálculo manual cuando daily-summary esté siempre disponible
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
            absent: 0, // TODO: Implementar cálculo de ausentes
            unique_users: uniqueUsers,
            overtime: overtime,
          });
        } else {
          // Sin datos disponibles
          setDailySummary({
            date,
            total_checkins: 0,
            on_time: 0,
            late: 0,
            absent: 0, // TODO: Mostrar empleados esperados vs presentes
            unique_users: 0,
            overtime: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Error al cargar los datos de asistencia");

        // Incluso en caso de error, intentar mantener los datos existentes o establecer valores por defecto
        if (checkins.length === 0) {
          setCheckins([]);
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
      } finally {
        setLoading(false);
      }
    },
    [checkins.length]
  ); // useCallback dependencies

  useEffect(() => {
    if (user) {
      fetchAttendanceData(selectedDate);
    }
  }, [selectedDate, user, fetchAttendanceData]);

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

  const getStatusBadge = (late: boolean, hasCheckout: boolean = false) => {
    if (late) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
          Tarde
        </Badge>
      );
    } else if (hasCheckout) {
      return (
        <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
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
  };

  // Configuración de React Table
  const columnHelper = createColumnHelper<CheckinRecord>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('user_name', {
      header: 'Usuario',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {info.getValue().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-sm text-muted-foreground">{info.row.original.user_email}</div>
          </div>
        </div>
      ),
      filterFn: 'includesString',
    }),
    columnHelper.accessor('checkin_time', {
      header: 'Entrada',
      cell: (info) => (
        <div className="font-mono text-sm">
          {new Date(info.getValue()).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    }),
    columnHelper.accessor('checkout_time', {
      header: 'Salida',
      cell: (info) => (
        <div className="font-mono text-sm">
          {info.getValue() ? new Date(info.getValue()!).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }) : '-'}
        </div>
      ),
    }),
    columnHelper.accessor('late', {
      header: 'Estado',
      cell: (info) => {
        const isLate = info.getValue();
        const hasCheckout = !!info.row.original.checkout_time;
        const isOvertime = info.row.original.overtime;
        
        if (isLate) {
          return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Tarde</Badge>;
        } else if (isOvertime) {
          return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">Tiempo Extra</Badge>;
        } else if (hasCheckout) {
          return <Badge className="bg-gray-500/20 text-gray-700 border-gray-500/30">Finalizado</Badge>;
        } else {
          return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">A tiempo</Badge>;
        }
      },
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'all') return true;
        const isLate = row.original.late;
        const isOvertime = row.original.overtime;
        const hasCheckout = !!row.original.checkout_time;
        
        if (filterValue === 'late') return isLate;
        if (filterValue === 'overtime') return isOvertime;
        if (filterValue === 'ontime') return !isLate && !isOvertime;
        return true;
      },
    }),
    columnHelper.accessor('location_type', {
      header: 'Ubicación',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {info.getValue() === 'office' ? '🏢' : '🏠'}
          </span>
          <span className="capitalize">
            {info.getValue() === 'office' ? 'Oficina' : 'Casa'}
          </span>
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'all') return true;
        return row.original.location_type === filterValue;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
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
  ], []);

  const filteredData = useMemo(() => {
    let filtered = checkins;

    if (searchTerm) {
      filtered = filtered.filter(
        (checkin) =>
          checkin.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          checkin.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((checkin) => {
        if (statusFilter === 'late') return checkin.late;
        if (statusFilter === 'overtime') return checkin.overtime;
        if (statusFilter === 'ontime') return !checkin.late && !checkin.overtime;
        return true;
      });
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter((checkin) => checkin.location_type === locationFilter);
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

  // Funciones de manejo de formularios
  const handleEditCheckin = (checkin: CheckinRecord) => {
    setEditingCheckin(checkin);
    setEditForm({
      notes: checkin.notes,
      time: new Date(checkin.checkin_time).toISOString().slice(0, 16),
      locations: [{
        location_type: checkin.location_type === 'office' ? 1 : 2,
        location_detail: checkin.location_detail || ''
      }]
    });
    setShowEditModal(true);
  };

  const handleCreateCheckin = async () => {
    try {
      await createCheckinForUser(createForm);
      setShowCreateModal(false);
      setCreateForm({
        locations: [{ location_type: 1, location_detail: '' }],
        notes: '',
        time: new Date().toISOString().slice(0, 16),
        user_id: 0,
      });
      fetchAttendanceData(selectedDate);
    } catch (err) {
      console.error('Error creating checkin:', err);
      setError('Error al crear el registro de asistencia');
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
      console.error('Error updating checkin:', err);
      setError('Error al actualizar el registro de asistencia');
    }
  };
    <div className="space-y-4">
      {individualData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay datos detallados para esta fecha</p>
        </div>
      ) : (
        individualData.map((data) => (
          <Card key={data.user.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {data.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{data.user.name} {data.user.surname}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>{data.user.email}</span>
                      <Badge variant="outline" className="text-xs">
                        {data.user.role}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Estado</div>
                  <Badge className={`${data.checkin?.late ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : 'bg-green-500/20 text-green-700 border-green-500/30'}`}>
                    {!data.checkin ? 'Ausente' : data.checkin.late ? 'Tarde' : 'Puntual'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Información del Usuario */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN PERSONAL</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">DNI:</span> {data.user.dni || 'No especificado'}</div>
                    <div><span className="font-medium">CUIL:</span> {data.user.cuil || 'No especificado'}</div>
                    <div><span className="font-medium">Teléfono:</span> {data.user.phone || 'No especificado'}</div>
                    <div><span className="font-medium">Fecha de Nacimiento:</span> {data.user.birth_date || 'No especificado'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN LABORAL</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Fecha de Contratación:</span> {data.user.hire_date || 'No especificado'}</div>
                    <div><span className="font-medium">Equipo:</span> {data.user.team || 'No asignado'}</div>
                    <div><span className="font-medium">Horas Semanales:</span> {data.user.weekly_hours}h</div>
                    <div><span className="font-medium">Días Objetivo Semanales:</span> {data.user.weekly_objective_days}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">CONFIGURACIÓN</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Requiere Oficina:</span>
                      <Badge variant={data.user.on_site_required ? 'destructive' : 'secondary'} className="text-xs">
                        {data.user.on_site_required ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Zona Horaria:</span> {data.user.timezone || 'No especificado'}</div>
                    <div><span className="font-medium">Hora Inicio:</span> {data.user.checkin_start_time || 'No especificado'}</div>
                    <div><span className="font-medium">Hora Fin:</span> {data.user.checkout_end_time || 'No especificado'}</div>
                  </div>
                </div>
              </div>

              {/* Información de Asistencia */}
              {data.checkin && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">REGISTRO DE ASISTENCIA</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🕐</div>
                        <div>
                          <div className="font-medium">Entrada</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(data.checkin.time).toLocaleString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      {data.checkout && (
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🕕</div>
                          <div>
                            <div className="font-medium">Salida</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(data.checkout.checkout_time).toLocaleString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {data.checkin.late && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="text-yellow-600">⚠️</div>
                            <div>
                              <div className="font-medium text-yellow-800">Llegada Tardía</div>
                              <div className="text-sm text-yellow-700">{data.checkin.late_reason}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {(data.checkin.overtime || data.checkout?.overtime) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="text-blue-600">⏰</div>
                            <div>
                              <div className="font-medium text-blue-800">Tiempo Extra</div>
                              <div className="text-sm text-blue-700">Registrado</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ubicaciones */}
                  {data.checkin.locations && data.checkin.locations.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">UBICACIONES</h5>
                      <div className="space-y-2">
                        {data.checkin.locations.map((location) => (
                          <div key={location.id} className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{location.location_detail}</span>
                            <Badge variant="outline" className="text-xs">
                              Tipo {location.location_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {data.checkin.notes && (
                    <div className="mt-4">
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">NOTAS</h5>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        {data.checkin.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Si hay ausencia */}
              {data.absence && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">INFORMACIÓN DE AUSENCIA</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800">Ausencia registrada</div>
                  </div>
                </div>
              )}

              {/* Si no hay checkin ni ausencia */}
              {!data.checkin && !data.absence && (
                <div className="border-t pt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-gray-600">No hay registro de asistencia para esta fecha</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

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
            Gestión de Asistencia
          </h1>
          <p className="text-muted-foreground">
            Monitorea y gestiona la asistencia de los empleados
          </p>
          <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded border">
            ✅ <strong>IMPLEMENTADO:</strong> Daily Summary integrado con datos
            reales del API
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('overview')}
              className="h-8"
            >
              Vista General
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="h-8"
            >
              Vista Detallada
            </Button>
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
          <div className="flex gap-2">
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

      {/* Resumen diario - IMPLEMENTADO con datos reales del API ✅ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Check-ins
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : dailySummary?.total_checkins || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              de {dailySummary?.unique_users || 0} usuarios únicos
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
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarde</CardTitle>
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
              % del total
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
              {dailySummary && dailySummary.total_checkins > 0
                ? (
                    (dailySummary.overtime! / dailySummary.total_checkins) *
                    100
                  ).toFixed(1)
                : 0}
              % con tiempo extra
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vista de datos - IMPLEMENTADO con datos reales ✅ */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {viewMode === 'overview' ? 'Resumen de Asistencia' : 'Vista Detallada Individual'} - {selectedDate}
          </CardTitle>
          <CardDescription>
            {loading
              ? "Cargando..."
              : viewMode === 'overview'
              ? `${checkins.length} registros encontrados`
              : `${individualData.length} empleados con datos detallados`}
            {!loading && ((viewMode === 'overview' && checkins.length > 0) || (viewMode === 'detailed' && individualData.length > 0)) && (
              <span className="ml-2 text-green-600">
                ✅ Datos reales del API
              </span>
            )}
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
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex space-x-4 p-4 border rounded"
                >
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {viewMode === 'overview' ? (
                checkins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay registros de asistencia para esta fecha</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {checkins.map((checkin) => (
                      <div
                        key={checkin.checkin_id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getLocationIcon(checkin.location_type)}
                            </div>
                            <div>
                              <div className="font-medium">{checkin.user_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {checkin.user_email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(checkin.late, !!checkin.checkout_time)}
                            <div className="text-right">
                              <div className="font-mono text-sm">
                                {new Date(checkin.checkin_time).toLocaleTimeString(
                                  "es-ES",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {checkin.location_type === "office"
                                  ? "Oficina"
                                  : "Casa"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {(checkin.location_detail || checkin.notes) && (
                          <div className="mt-3 pt-3 border-t space-y-2">
                            {checkin.location_detail && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {checkin.location_detail}
                              </div>
                            )}
                            {checkin.late && (
                              <div className="text-sm">
                                <span className="font-medium text-yellow-600">
                                  ⚠️ Llegada tardía
                                </span>
                              </div>
                            )}
                            {checkin.overtime && (
                              <div className="text-sm">
                                <span className="font-medium text-blue-600">
                                  ⏰ Tiempo extra registrado
                                </span>
                              </div>
                            )}
                            {checkin.notes && (
                              <div className="text-sm">
                                <span className="font-medium">Notas:</span>{" "}
                                {checkin.notes}
                              </div>
                            )}
                            {checkin.checkout_time && (
                              <div className="text-sm">
                                <span className="font-medium">Salida:</span>{" "}
                                {new Date(checkin.checkout_time).toLocaleTimeString(
                                  "es-ES",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                renderDetailedView()
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
