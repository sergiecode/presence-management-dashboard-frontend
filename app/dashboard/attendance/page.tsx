"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getAttendanceSummary,
  getDashboardSummary,
  exportAttendanceReport,
  updateCheckin,
  createCheckinForUser,
  getUsers,
  getUserById,
  downloadFile,
  generateExportFilename,
} from "@/app/services/dashboard";
import { useUser } from "@/app/contexts/UserContext";
import { LOCATION_TYPE_LABELS, LOCATION_TYPES } from "@/app/constants/enums";
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
  user_id: number;
  name: string;
  email: string;
  checkin_id: number;
  checkin_time: string;
  late: boolean;
  location_type: number | null;
  location_detail: string | null;
  locations?: Array<{
    id: number;
    checkin_id: number;
    location_type: number;
    location_detail: string;
    created_at: string;
  }>;
  notes: string;
  late_reason: string;
  checkin_created_at: string;
  absence_id: number | null;
  absence_type: string | null;
  absence_reason: string | null;
  file_url: string | null;
  absence_created_at: string | null;
  checkout_time: string | null;
  checkout_status: string;
  overtime: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  pending_approval: boolean;
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
  userTimezone?: string;
}



interface LiveStats {
  absent_today: number;
  attendance_rate: number;
  present_today: number;
  total_employees: number;
}

export default function AttendancePage() {
  const { user } = useUser();

  // Utility function to format time in user's timezone
  const formatTimeInUserTimezone = useCallback((timeString: string | null, fallback = "-") => {
    if (!timeString) return fallback;
    
    try {
      // Default to Argentina timezone if user timezone is not set
      const userTimezone = (user as { timezone?: string })?.timezone || "America/Argentina/Buenos_Aires";
      
      const date = new Date(timeString);
      
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: userTimezone,
      });
    } catch (error) {
      console.error("Error formatting time:", error, "Time string:", timeString);
      return fallback;
    }
  }, [user]);

  // Helper function to check if a time is late (after 8:00 AM)
  const isTimeLate = (timeStr: string): boolean => {
    if (!timeStr) return false;
    try {
      const date = new Date(timeStr);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const lateThreshold = 8 * 60; // 8:00 AM in minutes
      return totalMinutes > lateThreshold;
    } catch (error) {
      console.error("Error checking if time is late:", error);
      return false;
    }
  };

  // Utility function to format time for backend with timezone info
  const formatTimeForBackend = (timeStr: string) => {
    if (!timeStr) return timeStr;
    
    // Parse the local time string (e.g., "2025-07-28T07:55")
    const localDate = new Date(timeStr);
    
    // For "America/Argentina/Buenos_Aires" (GMT-3), we know the offset is -03:00
    // This is a simplified approach - in production you'd want to use a proper timezone library
    const offsetString = "-03:00"; // GMT-3 for Argentina
    
    // Format as RFC3339 with timezone offset
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
  };

  // Estados principales
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Estados de filtrado y paginación
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportingType, setExportingType] = useState<'attendance' | 'checkins' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "late" | "ontime" | "overtime"
  >("all");
  const [locationFilter, setLocationFilter] = useState<
    "all" | "remote_declared" | "remote_alternative" | "client" | "office"
  >("all");

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingCheckin, setEditingCheckin] = useState<CheckinRecord | null>(
    null
  );

  // Estados para búsqueda de usuarios
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userSearchRef = useRef<HTMLDivElement>(null);

  // Estados para exportación
  const [exportStartDate, setExportStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Estados de formularios
  const [createForm, setCreateForm] = useState<CreateCheckinData>({
    locations: [{ location_type: 1, location_detail: "" }],
    late_reason: "",
    notes: "",
    time: "",
    user_id: 0,
  });

  // Function to auto-populate location details based on user and location type
  const autoPopulateLocationDetails = (userId: number, locationType: number) => {
    const selectedUser = allUsers.find(user => user.id === userId);
    
    if (!selectedUser) return "";

    if (locationType === LOCATION_TYPES.OFFICE) {
      // ABSTI office address
      return "Junin 1120 - 4 B - Recoleta - Ciudad de Buenos Aires - Argentina";
    } else if (locationType === LOCATION_TYPES.REMOTE_DECLARED && selectedUser.location) {
      // User's declared remote address
      const loc = selectedUser.location;
      const parts = [];
      
      if (loc.calle && loc.numero) {
        parts.push(`${loc.calle} ${loc.numero}`);
      } else if (loc.calle) {
        parts.push(loc.calle);
      }
      
      if (loc.piso) {
        parts.push(`Piso ${loc.piso}`);
      }
      
      if (loc.ciudad) {
        parts.push(loc.ciudad);
      }
      
      if (loc.provincia) {
        parts.push(loc.provincia);
      }
      
      if (loc.pais) {
        parts.push(loc.pais);
      }
      
      if (loc.codigo_postal) {
        parts.push(`CP: ${loc.codigo_postal}`);
      }
      
      return parts.filter(Boolean).join(" - ");
    }
    
    return "";
  };
  const [editForm, setEditForm] = useState<EditCheckinData>({});

  // First, filter users who haven't checked in today and are approved
  const eligibleUsers = useMemo(() => {
    if (!selectedDate || !allUsers.length) return [];
    
    // Get user IDs who have already checked in today
    const checkedInUserIds = new Set(
      checkins
        .filter(checkin => checkin.checkin_id !== null)
        .map(checkin => checkin.user_id)
    );
    
    // Filter users who:
    // 1. Haven't checked in today
    // 2. Are approved (not pending approval)
    // 3. Are active
    return allUsers.filter(user => {
      const hasCheckedIn = checkedInUserIds.has(user.id);
      const isApproved = !user.pending_approval;
      const isActive = user.active;
      
      return !hasCheckedIn && isApproved && isActive;
    });
  }, [allUsers, checkins, selectedDate]);

  // Then, filter the eligible users by search term
  const availableUsers = useMemo(() => {
    if (!userSearchTerm) return eligibleUsers;
    
    return eligibleUsers.filter(user => 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [eligibleUsers, userSearchTerm]);

  // Show all eligible users when dropdown is open and no search term
  const displayUsers = useMemo(() => {
    if (showUserDropdown && !userSearchTerm) {
      return eligibleUsers;
    }
    return availableUsers;
  }, [showUserDropdown, userSearchTerm, eligibleUsers, availableUsers]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userSearchRef.current && !userSearchRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const fetchAttendanceData = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener datos de check-ins usando la nueva API
      const attendanceData = await getAttendanceSummary({
        date: date,
        page: 1,
        page_size: 1000
      });
      setCheckins(attendanceData?.data || []);

      // Cargar usuarios para los formularios
      try {
        const usersData = await getUsers({ limit: 1000 });
        setAllUsers(usersData?.data || usersData || []);
      } catch (userError) {
        console.error("Error fetching users:", userError);
      }

      // Obtener estadísticas en vivo del backend
      let liveStatsFromAPI: LiveStats | null = null;
      try {
        const response = await getDashboardSummary();
        
        // The API returns the data directly, not wrapped in a data property
        if (response && typeof response === 'object') {
          if ('absent_today' in response && 'total_employees' in response) {
            liveStatsFromAPI = response as LiveStats;
          } else if ('data' in response && response.data) {
            liveStatsFromAPI = response.data as LiveStats;
          } else {
            console.log("❌ Response doesn't match expected format:", response);
            console.log("Response keys:", Object.keys(response));
          }
        } else {
          console.log("❌ Response is not an object:", typeof response, response);
        }
        
      } catch (statsError) {
        console.error("Error fetching live stats:", statsError);
      }

      // Usar datos del API
      if (liveStatsFromAPI) {
        setLiveStats(liveStatsFromAPI);
      } else {
        console.log("⚠️ No live stats from API, setting defaults");
        setLiveStats({
          absent_today: 0,
          attendance_rate: 0,
          present_today: 0,
          total_employees: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Error al cargar los datos de asistencia");
      setLiveStats({
        absent_today: 0,
        attendance_rate: 0,
        present_today: 0,
        total_employees: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Set initial date after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    // Use local date to avoid timezone issues
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (user && selectedDate && mounted) {
      fetchAttendanceData(selectedDate);
    }
  }, [selectedDate, user, fetchAttendanceData, mounted]);

  // Funciones de manejo de formularios
  const handleEditCheckin = useCallback(async (checkin: CheckinRecord) => {
    setEditingCheckin(checkin);
    
    try {
      // Fetch the specific user's information to get their timezone
      const userData = await getUserById(checkin.user_id);
      const userTimezone = userData.timezone || "America/Argentina/Buenos_Aires";
      
      // Convert UTC time to the specific user's timezone for the datetime picker
      const utcDate = new Date(checkin.checkin_time);
      
      // Create a date object in the user's timezone
      const userDate = new Date(utcDate.toLocaleString("en-US", { timeZone: userTimezone }));
      
      // Format as YYYY-MM-DDTHH:mm for datetime-local input
      const year = userDate.getFullYear();
      const month = String(userDate.getMonth() + 1).padStart(2, '0');
      const day = String(userDate.getDate()).padStart(2, '0');
      const hours = String(userDate.getHours()).padStart(2, '0');
      const minutes = String(userDate.getMinutes()).padStart(2, '0');
      const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      
      // Get location data from the locations array
      const location = checkin.locations && checkin.locations.length > 0 ? checkin.locations[0] : null;
      
      setEditForm({
        notes: checkin.notes,
        late_reason: checkin.late_reason,
        time: localDateTimeString,
        userTimezone: userTimezone,
        locations: [
          {
            location_type: location?.location_type || 1,
            location_detail: location?.location_detail || "",
          },
        ],
      });
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching user information:", error);
      // Fallback to admin timezone if user fetch fails
      const userTimezone = (user as { timezone?: string })?.timezone || "America/Argentina/Buenos_Aires";
      
      const utcDate = new Date(checkin.checkin_time);
      const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone: userTimezone }));
      
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      const location = checkin.locations && checkin.locations.length > 0 ? checkin.locations[0] : null;
      
      setEditForm({
        notes: checkin.notes,
        late_reason: checkin.late_reason,
        time: localDateTimeString,
        userTimezone: userTimezone,
        locations: [
          {
            location_type: location?.location_type || 1,
            location_detail: location?.location_detail || "",
          },
        ],
      });
      setShowEditModal(true);
    }
  }, [user]);

  const handleCreateCheckin = async () => {
    // Validate late_reason for late check-ins
    if (isTimeLate(createForm.time) && (!createForm.late_reason || createForm.late_reason.trim() === "")) {
      setError("El motivo de tardanza es obligatorio para check-ins tardíos (después de las 8:00 AM)");
      return;
    }

    try {
      const formattedCreateForm = {
        ...createForm,
        time: formatTimeForBackend(createForm.time),
      };

      await createCheckinForUser(formattedCreateForm);
      setShowCreateModal(false);
      setCreateForm({
        locations: [{ location_type: 1, location_detail: "" }],
        late_reason: "",
        notes: "",
        time: "",
        user_id: 0,
      });
      fetchAttendanceData(selectedDate);
      setSuccessMessage("Check-in creado exitosamente");
    } catch (err) {
      console.error("Error creating checkin:", err);
      setError("Error al crear el registro de asistencia");
    }
  };

  const handleUpdateCheckin = async () => {
    if (!editingCheckin) return;
    
    if (!editingCheckin.checkin_id) {
      console.error("Checkin ID is null or undefined:", editingCheckin);
      setError("Error: ID de check-in no válido");
      return;
    }

    // Validate late_reason for late check-ins
    if (editingCheckin.late && (!editForm.late_reason || editForm.late_reason.trim() === "")) {
      setError("El motivo de tardanza es obligatorio para check-ins tardíos");
      return;
    }

    try {      
      const formattedEditForm = {
        ...editForm,
        time: editForm.time ? formatTimeForBackend(editForm.time) : undefined,
      };

      await updateCheckin(editingCheckin.checkin_id, formattedEditForm);
      setShowEditModal(false);
      setEditingCheckin(null);
      setEditForm({});
      fetchAttendanceData(selectedDate);
      setSuccessMessage("Check-in actualizado exitosamente");
    } catch (err) {
      console.error("Error updating checkin:", err);
      setError("Error al actualizar el registro de asistencia");
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportingType('attendance');
      
      // Use the currently selected date from the table, or fallback to export start date
      const dateToUse = selectedDate || exportStartDate;
      
      const blob = await exportAttendanceReport({
        date: dateToUse,
      });
      const filename = generateExportFilename('attendance', dateToUse);

      downloadFile(blob, filename, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      
      setShowExportModal(false);
      setSuccessMessage(
        `ART Asistencia exportado exitosamente (${dateToUse})`
      );
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Error al exportar los datos");
    } finally {
      setExporting(false);
      setExportingType(null);
    }
  };

  // Configuración de React Table
  const columnHelper = createColumnHelper<CheckinRecord>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
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
                {info.row.original.email}
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
            {formatTimeInUserTimezone(info.getValue())}
          </div>
        ),
      }),
      columnHelper.accessor("checkout_time", {
        header: "Salida",
        cell: (info) => (
          <div className="font-mono text-sm">
            {formatTimeInUserTimezone(info.getValue())}
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
      columnHelper.display({
        id: "location",
        header: "Ubicación",
        cell: (info) => {
          const record = info.row.original;
          const locations = record.locations;
          const location = locations && locations.length > 0 ? locations[0] : null;
          
          if (!location) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-lg">❓</span>
                <span className="text-muted-foreground">Desconocido</span>
              </div>
            );
          }

          const getLocationInfo = (type: number) => {
            switch (type) {
              case LOCATION_TYPES.REMOTE_DECLARED:
                return { icon: "🏠", label: LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_DECLARED] };
              case LOCATION_TYPES.REMOTE_ALTERNATIVE:
                return { icon: "🏠", label: LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_ALTERNATIVE] };
              case LOCATION_TYPES.CLIENT:
                return { icon: "🏭", label: LOCATION_TYPE_LABELS[LOCATION_TYPES.CLIENT] };
              case LOCATION_TYPES.OFFICE:
                return { icon: "🏢", label: LOCATION_TYPE_LABELS[LOCATION_TYPES.OFFICE] };
              default:
                return { icon: "❓", label: "Desconocido" };
            }
          };

          const locationInfo = getLocationInfo(location.location_type);
          
          return (
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {locationInfo.icon}
              </span>
              <div className="flex flex-col">
                <span className="capitalize text-sm">
                  {locationInfo.label}
                </span>
                {location.location_detail && (
                  <span className="text-xs text-muted-foreground">
                    {location.location_detail}
                  </span>
                )}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("late_reason", {
        header: "Motivo Tardanza",
        cell: (info) => {
          const lateReason = info.getValue();
          const isLate = info.row.original.late;
          
          if (!isLate || !lateReason) {
            return <span className="text-muted-foreground text-sm">-</span>;
          }
          
          const displayText = lateReason.length > 30 ? `${lateReason.substring(0, 30)}...` : lateReason;
          
          return (
            <div className="max-w-xs">
              <span 
                className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded cursor-help"
                title={lateReason.length > 30 ? lateReason : undefined}
              >
                {displayText}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("notes", {
        header: "Notas",
        cell: (info) => {
          const notes = info.getValue();
          
          if (!notes) {
            return <span className="text-muted-foreground text-sm">-</span>;
          }
          
          const displayText = notes.length > 30 ? `${notes.substring(0, 30)}...` : notes;
          
          return (
            <div className="max-w-xs">
              <span 
                className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded cursor-help"
                title={notes.length > 30 ? notes : undefined}
              >
                {displayText}
              </span>
            </div>
          );
        },
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
              disabled={info.row.original.checkin_id === null}
              title={info.row.original.checkin_id === null ? "No se puede editar - Sin datos de check-in" : "Editar check-in"}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [columnHelper, handleEditCheckin, formatTimeInUserTimezone]
  );

  const filteredData = useMemo(() => {
    // First, filter out records with null checkin_id (no actual check-in data)
    let filtered = checkins.filter((checkin) => checkin.checkin_id !== null);

    if (searchTerm) {
      filtered = filtered.filter(
        (checkin) =>
          checkin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          checkin.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      filtered = filtered.filter((checkin) => {
        // Get the first location from the locations array
        const location = checkin.locations && checkin.locations.length > 0 ? checkin.locations[0] : null;
        if (!location) return false;
        
        switch (locationFilter) {
          case "remote_declared":
            return location.location_type === LOCATION_TYPES.REMOTE_DECLARED;
          case "remote_alternative":
            return location.location_type === LOCATION_TYPES.REMOTE_ALTERNATIVE;
          case "client":
            return location.location_type === LOCATION_TYPES.CLIENT;
          case "office":
            return location.location_type === LOCATION_TYPES.OFFICE;
          default:
            return true;
        }
      });
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
        pageSize: 100,
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
    <div className="flex flex-col gap-4 h-full p-6 min-h-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Sistema de Gestión de Asistencia Empresarial
          </h1>
          <p className="text-sm text-muted-foreground">
            Panel administrativo para monitoreo y gestión de asistencia
            corporativa
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-32 justify-start text-left font-normal"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {selectedDate ? format(new Date(selectedDate + 'T12:00:00'), "dd/MM/yyyy") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate + 'T12:00:00') : undefined}
                onSelect={(date: Date | undefined) => {
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    setSelectedDate(`${year}-${month}-${day}`);
                  } else {
                    setSelectedDate("");
                  }
                }}
                initialFocus
                formatters={{
                  formatMonthDropdown: (date: Date) =>
                    date.toLocaleString("es", { month: "long" }),
                  formatCaption: (date: Date) =>
                    date.toLocaleString("es", { month: "long", year: "numeric" }),
                  formatWeekdayName: (date: Date) =>
                    date.toLocaleString("es", { weekday: "short" }),
                }}
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-2 flex-shrink-0">
            <Dialog open={showCreateModal} onOpenChange={(open) => {
              setShowCreateModal(open);
              if (!open) {
                // Reset form when modal is closed
                setCreateForm({
                  locations: [{ location_type: 1, location_detail: "" }],
                  late_reason: "",
                  notes: "",
                  time: "",
                  user_id: 0,
                });
                setUserSearchTerm("");
                setShowUserDropdown(false);
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Check-in
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div>
                <DialogHeader>
                  <DialogTitle>Crear Check-in</DialogTitle>
                  <DialogDescription>
                    Registrar asistencia para un empleado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Usuario</Label>
                    <div className="relative" ref={userSearchRef}>
                      <Input
                        placeholder="Buscar usuario..."
                        value={userSearchTerm}
                        onChange={(e) => {
                          setUserSearchTerm(e.target.value);
                          setShowUserDropdown(true);
                        }}
                        onFocus={() => {
                          setShowUserDropdown(true);
                        }}

                        className="w-full"
                      />
                      {showUserDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {displayUsers.length > 0 ? (
                            displayUsers.map((user) => (
                              <div
                                key={user.id}
                                className="px-3 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                                onClick={() => {
                                  const currentLocationType = createForm.locations[0].location_type;
                                  const autoLocationDetail = autoPopulateLocationDetails(user.id, currentLocationType);
                                  
                                  setCreateForm((prev) => ({
                                    ...prev,
                                    user_id: user.id,
                                    locations: [
                                      {
                                        ...prev.locations[0],
                                        location_detail: autoLocationDetail,
                                      },
                                    ],
                                  }));
                                  setUserSearchTerm(user.name);
                                  setShowUserDropdown(false);
                                }}
                              >
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-muted-foreground">
                              {userSearchTerm ? "No se encontraron usuarios disponibles" : "No hay usuarios disponibles para check-in"}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                    {createForm.user_id > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Usuario seleccionado: {allUsers.find(u => u.id === createForm.user_id)?.name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha y Hora</Label>
                    <DateTimePicker
                      date={createForm.time ? (() => {
                        const date = new Date(createForm.time);
                        return !isNaN(date.getTime()) ? date : undefined;
                      })() : undefined}
                      onDateChange={(date) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          time: date && !isNaN(date.getTime()) ? (() => {
                            // Format the date in local timezone (not UTC)
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            return `${year}-${month}-${day}T${hours}:${minutes}`;
                          })() : "",
                        }))
                      }
                      placeholder="Seleccionar fecha y hora"
                      userTimezone={(user as { timezone?: string })?.timezone || "America/Argentina/Buenos_Aires"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Ubicación</Label>
                    <Select
                      value={createForm.locations[0].location_type.toString()}
                      onValueChange={(value) => {
                        const locationType = parseInt(value);
                        const autoLocationDetail = autoPopulateLocationDetails(createForm.user_id, locationType);
                        
                        setCreateForm((prev) => ({
                          ...prev,
                          locations: [
                            {
                              ...prev.locations[0],
                              location_type: locationType,
                              location_detail: autoLocationDetail,
                            },
                          ],
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={LOCATION_TYPES.OFFICE.toString()}>
                          🏢 {LOCATION_TYPE_LABELS[LOCATION_TYPES.OFFICE]}
                        </SelectItem>
                        <SelectItem value={LOCATION_TYPES.REMOTE_DECLARED.toString()}>
                          🏠 {LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_DECLARED]}
                        </SelectItem>
                        <SelectItem value={LOCATION_TYPES.REMOTE_ALTERNATIVE.toString()}>
                          🏠 {LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_ALTERNATIVE]}
                        </SelectItem>
                        <SelectItem value={LOCATION_TYPES.CLIENT.toString()}>
                          🏢 {LOCATION_TYPE_LABELS[LOCATION_TYPES.CLIENT]}
                        </SelectItem>
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
                      className={createForm.locations[0].location_detail && 
                        (createForm.locations[0].location_type === LOCATION_TYPES.OFFICE || 
                         createForm.locations[0].location_type === LOCATION_TYPES.REMOTE_DECLARED) 
                        ? "bg-gray-50" : ""}
                    />
                    {(createForm.locations[0].location_type === LOCATION_TYPES.OFFICE || 
                      createForm.locations[0].location_type === LOCATION_TYPES.REMOTE_DECLARED) && 
                      createForm.locations[0].location_detail && (
                      <p className="text-xs text-muted-foreground">
                        {createForm.locations[0].location_type === LOCATION_TYPES.OFFICE 
                          ? "Dirección de oficina ABSTI auto-completada" 
                          : "Dirección del usuario auto-completada"}
                      </p>
                    )}
                  </div>
                  {isTimeLate(createForm.time) && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Motivo de Tardanza <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        placeholder="Explicar el motivo de la tardanza..."
                        value={createForm.late_reason}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setCreateForm((prev) => ({
                            ...prev,
                            late_reason: e.target.value,
                          }))
                        }
                        className="border-orange-200 focus:border-orange-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Campo obligatorio para check-ins tardíos
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea
                      placeholder="Notas adicionales..."
                      value={createForm.notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
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
              size="sm"
              onClick={() => {
                // Set export date to the currently selected date
                const currentDate = selectedDate || new Date().toISOString().split("T")[0];
                setExportStartDate(currentDate);
                setShowExportModal(true);
              }}
              disabled={exporting}
            >
              <Download
                className={`h-4 w-4 mr-2 ${exporting ? "animate-spin" : ""}`}
              />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Resumen diario - Compact cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Registros</p>
              <p className="text-lg font-bold">
                {loading ? "..." : liveStats?.total_employees || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                de {liveStats?.total_employees || 0} empleados
              </p>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">A Tiempo</p>
              <p className="text-lg font-bold text-green-600">
                {loading ? "..." : liveStats?.present_today || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {liveStats && liveStats.total_employees > 0
                  ? Math.round((liveStats.present_today / liveStats.total_employees) * 100)
                  : 0}
                % puntualidad
              </p>
            </div>
            <Clock className="h-4 w-4 text-green-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tardanzas</p>
              <p className="text-lg font-bold text-yellow-600">
                {loading ? "..." : liveStats?.absent_today || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {liveStats && liveStats.total_employees > 0
                  ? Math.round((liveStats.absent_today / liveStats.total_employees) * 100)
                  : 0}
                % tardanzas
              </p>
            </div>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tiempo Extra</p>
              <p className="text-lg font-bold text-blue-600">0</p>
              <p className="text-xs text-muted-foreground">
                registros con sobretiem
              </p>
            </div>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Productividad</p>
              <p className="text-lg font-bold text-purple-600">
                {liveStats && liveStats.total_employees > 0
                  ? Math.round((liveStats.present_today / liveStats.total_employees) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground">índice general</p>
            </div>
            <CalendarDays className="h-4 w-4 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filtros y búsqueda - Compact horizontal layout */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: "all" | "late" | "ontime" | "overtime") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-36">
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
          onValueChange={(value: "all" | "remote_declared" | "remote_alternative" | "client" | "office") =>
            setLocationFilter(value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Ubicaciones</SelectItem>
            <SelectItem value="remote_declared">🏠 {LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_DECLARED]}</SelectItem>
            <SelectItem value="remote_alternative">🏠 {LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_ALTERNATIVE]}</SelectItem>
            <SelectItem value="client">🏭 {LOCATION_TYPE_LABELS[LOCATION_TYPES.CLIENT]}</SelectItem>
            <SelectItem value="office">🏢 {LOCATION_TYPE_LABELS[LOCATION_TYPES.OFFICE]}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla principal con React Table */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Registros de Asistencia - {selectedDate}</CardTitle>
              <CardDescription className="text-sm">
                {loading
                  ? "Cargando registros..."
                  : `${filteredData.length} de ${checkins.length} registros`}
              </CardDescription>
            </div>
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm flex items-center gap-2">
                <span>{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-500 hover:text-green-700 cursor-pointer"
                  aria-label="Cerrar mensaje de éxito"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-500 hover:text-red-700 flex-shrink-0 cursor-pointer"
                aria-label="Cerrar mensaje de error"
              >
                <X className="h-4 w-4" />
              </button>
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
              <div className="rounded-md border flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto">
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
              </div>

              {/* Paginación */}
              <div className="flex items-center justify-between space-x-2 py-4 mt-auto">
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

      {/* Modal de Exportación */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Registros</DialogTitle>
            <DialogDescription>
              Selecciona la fecha para exportar el registro de asistencia. El archivo se descargará en formato Excel (.xlsx).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio</Label>
              <Input
                type="date"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={exporting}
              >
                {exporting && exportingType === 'attendance' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar ART Asistencia
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edición */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Check-in</DialogTitle>
            <DialogDescription>
              Modificar registro de asistencia de {editingCheckin?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <DateTimePicker
                date={editForm.time ? (() => {
                  const date = new Date(editForm.time);
                  return !isNaN(date.getTime()) ? date : undefined;
                })() : undefined}
                onDateChange={(date) =>
                  setEditForm((prev) => ({
                    ...prev,
                    time: date && !isNaN(date.getTime()) ? (() => {
                      // Format the date in local timezone (not UTC)
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day}T${hours}:${minutes}`;
                    })() : "",
                  }))
                }
                placeholder="Seleccionar fecha y hora"
                userTimezone={editForm.userTimezone || (user as { timezone?: string })?.timezone || "America/Argentina/Buenos_Aires"}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Ubicación</Label>
              <Select
                value={
                  editForm.locations?.[0]?.location_type?.toString() || "1"
                }
                onValueChange={(value) => {
                  const locationType = parseInt(value);
                  const userId = editingCheckin?.user_id || 0;
                  const autoLocationDetail = autoPopulateLocationDetails(userId, locationType);
                  
                  setEditForm((prev) => ({
                    ...prev,
                    locations: [
                      {
                        location_type: locationType,
                        location_detail: autoLocationDetail || prev.locations?.[0]?.location_detail || "",
                      },
                    ],
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LOCATION_TYPES.OFFICE.toString()}>
                    🏢 {LOCATION_TYPE_LABELS[LOCATION_TYPES.OFFICE]}
                  </SelectItem>
                  <SelectItem value={LOCATION_TYPES.REMOTE_DECLARED.toString()}>
                    🏠 {LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_DECLARED]}
                  </SelectItem>
                  <SelectItem value={LOCATION_TYPES.REMOTE_ALTERNATIVE.toString()}>
                    🏠 {LOCATION_TYPE_LABELS[LOCATION_TYPES.REMOTE_ALTERNATIVE]}
                  </SelectItem>
                  <SelectItem value={LOCATION_TYPES.CLIENT.toString()}>
                    🏢 {LOCATION_TYPE_LABELS[LOCATION_TYPES.CLIENT]}
                  </SelectItem>
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
                className={editForm.locations?.[0]?.location_detail && 
                  (editForm.locations?.[0]?.location_type === LOCATION_TYPES.OFFICE || 
                   editForm.locations?.[0]?.location_type === LOCATION_TYPES.REMOTE_DECLARED) 
                  ? "bg-gray-50" : ""}
              />
              {(editForm.locations?.[0]?.location_type === LOCATION_TYPES.OFFICE || 
                editForm.locations?.[0]?.location_type === LOCATION_TYPES.REMOTE_DECLARED) && 
                editForm.locations?.[0]?.location_detail && (
                <p className="text-xs text-muted-foreground">
                  {editForm.locations?.[0]?.location_type === LOCATION_TYPES.OFFICE 
                    ? "Dirección de oficina ABSTI auto-completada" 
                    : "Dirección del usuario auto-completada"}
                </p>
              )}
            </div>
            {editingCheckin?.late && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Motivo de Tardanza <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Explicar el motivo de la tardanza..."
                  value={editForm.late_reason || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditForm((prev) => ({ ...prev, late_reason: e.target.value }))
                  }
                  className="border-orange-200 focus:border-orange-500"
                />
                <p className="text-xs text-muted-foreground">
                  Campo obligatorio para check-ins tardíos
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                placeholder="Notas adicionales..."
                value={editForm.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
