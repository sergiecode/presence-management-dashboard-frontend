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
import { Skeleton } from "@/components/ui/skeleton";
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
  ChevronDown,
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
import { toast } from "sonner";
import { CatalogLocationType } from "@/app/types/api";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    start_time?: string;
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
  checkin_start_time?: string;
  timezone?: string;
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
    start_time?: string;
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
    start_time?: string;
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
  const { user, loading: userLoading } = useUser();

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

  // Function to check if a time is considered late for a specific user
  const isTimeLate = useCallback((timeStr: string, userId?: number): boolean => {
    if (!timeStr) return false;
    
    try {
      // Find the selected user
      const selectedUser = userId ? allUsers.find(user => user.id === userId) : null;
      
      // Get user's check-in start time (default to 8:00 if not set)
      const userStartTime = selectedUser?.checkin_start_time || "08:00";
      
      // Get user's timezone (default to Argentina timezone if not set)
      const userTimezone = selectedUser?.timezone || "America/Argentina/Buenos_Aires";
      
      // Parse the input time string
      const inputDate = new Date(timeStr);
      
      // Convert to user's timezone for comparison
      const userLocalTime = new Intl.DateTimeFormat('en-CA', {
        timeZone: userTimezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }).format(inputDate);
      
      // Parse start time (format: "HH:MM")
      const [startHour, startMinute] = userStartTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      
      // Parse input time
      const [inputHour, inputMinute] = userLocalTime.split(':').map(Number);
      const inputTimeInMinutes = inputHour * 60 + inputMinute;
      
      // Consider late if more than 15 minutes after start time
      const lateThreshold = startTimeInMinutes + 15;
      
      return inputTimeInMinutes > lateThreshold;
    } catch (error) {
      console.error("Error checking if time is late:", error);
      return false;
    }
  }, [allUsers]);

  // Estados de filtrado y paginación
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportingType, setExportingType] = useState<'attendance' | 'checkins' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "late" | "ontime" | "overtime"
  >("all");
  const [locationFilter, setLocationFilter] = useState<
    "all" | "remote_declared" | "remote_alternative" | "client" | "office"
  >("all");

  // Estados para catálogos dinámicos
  const [locationTypes] = useState<CatalogLocationType[]>([]);

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<{location_type: number, location_detail: string, start_time?: string}[]>([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState<{name: string, email: string} | null>(null);
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

  // Estado para el date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateDatePicker, setShowCreateDatePicker] = useState(false);

  // Estados de formularios
  const [createForm, setCreateForm] = useState<CreateCheckinData>({
    locations: [{ location_type: 1, location_detail: "", start_time: "" }],
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

  // Load catalogs from API
  // const loadCatalogs = useCallback(async () => {
  //   try {
  //     setCatalogsLoading(true);
  //     const [locationTypesData, absenceTypesData] = await Promise.all([
  //       getLocationTypes(),
  //       getAbsenceTypes(),
  //     ]);
  //     setLocationTypes(locationTypesData || []);
  //     setAbsenceTypes(absenceTypesData || []);
  //   } catch (error) {
  //     console.error("Error loading catalogs:", error);
  //     toast.error("Error al cargar los catálogos");
  //   } finally {
  //     setCatalogsLoading(false);
  //   }
  // }, []);

  const fetchAttendanceData = useCallback(async (date: string) => {
    try {
      setLoading(true);

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
        console.log("📅 Fetching live stats for date:", date);
        const response = await getDashboardSummary(date);
        
        // The API returns the data directly, not wrapped in a data property
        if (response && typeof response === 'object') {
          if ('absent_today' in response && 'total_employees' in response) {
            liveStatsFromAPI = response as LiveStats;
            console.log("✅ Live stats received:", liveStatsFromAPI);
          } else if ('data' in response && response.data) {
            liveStatsFromAPI = response.data as LiveStats;
            console.log("✅ Live stats received:", liveStatsFromAPI);
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
      toast.error("Error al cargar los datos de asistencia");
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

  // Load catalogs on mount
  // useEffect(() => {
  //   if (user) {
  //     loadCatalogs();
  //   }
  // }, [user, loadCatalogs]); 

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
      const locations = checkin.locations && checkin.locations.length > 0 
        ? checkin.locations.map(loc => ({
            location_type: loc.location_type,
            location_detail: loc.location_detail,
            start_time: loc.start_time || "",
          }))
        : [{ location_type: 1, location_detail: "", start_time: "" }];
      
      setEditForm({
        notes: checkin.notes,
        late_reason: checkin.late_reason,
        time: localDateTimeString,
        userTimezone: userTimezone,
        locations: locations,
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
      
      const locations = checkin.locations && checkin.locations.length > 0 
        ? checkin.locations.map(loc => ({
            location_type: loc.location_type,
            location_detail: loc.location_detail,
            start_time: loc.start_time || "",
          }))
        : [{ location_type: 1, location_detail: "", start_time: "" }];
      
      setEditForm({
        notes: checkin.notes,
        late_reason: checkin.late_reason,
        time: localDateTimeString,
        userTimezone: userTimezone,
        locations: locations,
      });
      setShowEditModal(true);
    }
  }, [user]);

  const handleCreateCheckin = async () => {
    // Validate user selection
    if (!createForm.user_id || createForm.user_id === 0) {
      toast.error("Debe seleccionar un usuario para crear el check-in");
      return;
    }

    // Validate time
    if (!createForm.time || createForm.time.trim() === "") {
      toast.error("Debe seleccionar una fecha y hora para el check-in");
      return;
    }

    // Validate late_reason for late check-ins
    if (isTimeLate(createForm.time, createForm.user_id) && (!createForm.late_reason || createForm.late_reason.trim() === "")) {
      toast.error("El motivo de tardanza es obligatorio para check-ins tardíos (después de las 8:00 AM)");
      return;
    }

    // Validate locations
    if (!createForm.locations || createForm.locations.length === 0) {
      toast.error("Debe especificar al menos una ubicación");
      return;
    }

    // Validate that all locations have details
    const invalidLocations = createForm.locations.filter(
      location => !location.location_detail || location.location_detail.trim() === ""
    );
    if (invalidLocations.length > 0) {
      toast.error("Todos los detalles de ubicación son obligatorios");
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
        locations: [{ location_type: 1, location_detail: "", start_time: "" }],
        late_reason: "",
        notes: "",
        time: "",
        user_id: 0,
      });
      // Clear search state after successful creation
      setUserSearchTerm("");
      setShowUserDropdown(false);
      fetchAttendanceData(selectedDate);
      toast.success("Check-in creado exitosamente");
    } catch (err) {
      console.error("Error creating checkin:", err);
      toast.error("Error al crear el registro de asistencia");
    }
  };

  const handleUpdateCheckin = async () => {
    if (!editingCheckin) return;
    
    if (!editingCheckin.checkin_id) {
      console.error("Checkin ID is null or undefined:", editingCheckin);
      toast.error("Error: ID de check-in no válido");
      return;
    }

    // Validate locations
    if (!editForm.locations || editForm.locations.length === 0) {
      toast.error("Debe especificar al menos una ubicación");
      return;
    }

    // Validate that all locations have details
    const invalidLocations = editForm.locations.filter(
      location => !location.location_detail || location.location_detail.trim() === ""
    );
    if (invalidLocations.length > 0) {
      toast.error("Todos los detalles de ubicación son obligatorios");
      return;
    }

    // Validate late_reason for late check-ins
    if (editingCheckin.late && (!editForm.late_reason || editForm.late_reason.trim() === "")) {
      toast.error("El motivo de tardanza es obligatorio para check-ins tardíos");
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
      toast.success("Check-in actualizado exitosamente");
    } catch (err) {
      console.error("Error updating checkin:", err);
      toast.error("Error al actualizar el registro de asistencia");
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
      toast.success(
        `ART Asistencia exportado exitosamente (${dateToUse})`
      );
    } catch (err) {
      console.error("Error exporting data:", err);
      toast.error("Error al exportar los datos");
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-mono text-sm cursor-help">
                {formatTimeInUserTimezone(info.getValue())}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
              <p className="font-medium">Hora convertida a la zona horaria del usuario</p>
              <p className="text-xs text-gray-300 mt-1">
                {user?.user?.timezone ? `Configurada: ${user.user.timezone}` : "Por defecto: GMT-3 (Argentina)"}
              </p>
            </TooltipContent>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("checkout_time", {
        header: "Salida",
        cell: (info) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-mono text-sm cursor-help">
                {formatTimeInUserTimezone(info.getValue())}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
              <p className="font-medium">Hora convertida a la zona horaria del usuario</p>
              <p className="text-xs text-gray-300 mt-1">
                {user?.user?.timezone ? `Configurada: ${user.user.timezone}` : "Por defecto: GMT-3 (Argentina)"}
              </p>
            </TooltipContent>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("late", {
        header: "Estado",
        cell: (info) => {
          const isLate = info.getValue();
          const isOvertime = info.row.original.overtime;
          const hasCheckout = !!info.row.original.checkout_time;

          // If user has checked out, show "Finalizado" regardless of late/overtime status
          if (hasCheckout) {
            return (
              <Badge className="bg-gray-500/20 text-gray-700 border-gray-500/30">
                Finalizado
              </Badge>
            );
          } else if (isLate) {
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
        header: "Ubicaciones",
        cell: (info) => {
          const record = info.row.original;
          const locations = record.locations;
          
          if (!locations || locations.length === 0) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-lg">❓</span>
                <span className="text-muted-foreground">Desconocido</span>
              </div>
            );
          }

          const getLocationInfo = (type: number) => {
            // Use dynamic catalogs if available, fallback to hardcoded enums
            if (locationTypes.length > 0) {
              const locationType = locationTypes.find(lt => lt.id === type);
              if (locationType) {
                return { icon: "📍", label: locationType.name };
              }
            }
            
            // Fallback to hardcoded enums
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

          // If only one location, show it normally
          if (locations.length === 1) {
            const location = locations[0];
            const locationInfo = getLocationInfo(location.location_type);
            
            return (
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {locationInfo.icon}
                </span>
                <div className="flex flex-col">
                  <span className="capitalize text-sm font-medium">
                    {locationInfo.label}
                  </span>
                  {location.location_detail && (
                    <span className="text-xs text-muted-foreground max-w-[200px] truncate" title={location.location_detail}>
                      {location.location_detail}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // If multiple locations, show a compact summary with expandable details
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {locations.length} ubicación{locations.length > 1 ? 'es' : ''}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {locations.length}
                </Badge>
              </div>
              
              {/* Show latest location as preview */}
              <div className="flex items-center gap-2 p-1 bg-muted/50 dark:bg-muted/30 rounded">
                <span className="text-sm">
                  {getLocationInfo(locations[locations.length - 1].location_type).icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">
                    {getLocationInfo(locations[locations.length - 1].location_type).label}
                  </div>
                  {locations[locations.length - 1].location_detail && (
                    <div className="text-xs text-muted-foreground truncate" title={locations[locations.length - 1].location_detail}>
                      {locations[locations.length - 1].location_detail}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Show additional locations count if more than 1 - clickeable */}
              {locations.length > 1 && (
                <button
                  onClick={() => {
                    setSelectedLocations(locations);
                    setSelectedUserInfo({
                      name: info.row.original.name,
                      email: info.row.original.email
                    });
                    setShowLocationsModal(true);
                  }}
                  className="text-xs text-primary font-medium hover:text-primary/80 transition-colors cursor-pointer underline decoration-dotted"
                >
                  +{locations.length - 1} ubicación{locations.length > 2 ? 'es' : ''} más
                </button>
              )}
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
    [columnHelper, handleEditCheckin, formatTimeInUserTimezone, locationTypes, user?.user?.timezone]
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
          <div className="relative flex gap-2">
            <Input
              value={selectedDate ? format(new Date(selectedDate + 'T12:00:00'), "dd/MM/yyyy") : ""}
              placeholder="31/07/2025"
              className="w-40 bg-background pr-10"
              onChange={(e) => {
                const inputValue = e.target.value;
                // Parse DD/MM/YYYY format
                const match = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                if (match) {
                  const [, day, month, year] = match;
                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  if (!isNaN(date.getTime())) {
                    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    setSelectedDate(formattedDate);
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setShowDatePicker(true);
                }
              }}
            />
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarDays className="size-3.5" />
                  <span className="sr-only">Seleccionar fecha</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate + 'T12:00:00') : undefined}
                  captionLayout="dropdown"
                  month={selectedDate ? new Date(selectedDate + 'T12:00:00') : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setSelectedDate(`${year}-${month}-${day}`);
                    }
                    setShowDatePicker(false);
                  }}
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
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Dialog open={showCreateModal} onOpenChange={(open) => {
              setShowCreateModal(open);
              if (!open) {
                // Reset form when modal is closed
                setCreateForm({
                  locations: [{ location_type: 1, location_detail: "", start_time: "" }],
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
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
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
                                    locations: prev.locations?.map((loc, index) => 
                                      index === 0 
                                        ? {
                                            ...loc,
                                            location_detail: autoLocationDetail,
                                          }
                                        : loc
                                    ) || [],
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
                      <div className="text-sm mt-1 p-3 bg-muted/30 dark:bg-muted/20 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {allUsers.find(u => u.id === createForm.user_id)?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Usuario seleccionado:</span>
                            <span className="ml-1 text-foreground">{allUsers.find(u => u.id === createForm.user_id)?.name}</span>
                          </div>
                        </div>
                        {(() => {
                          const selectedUser = allUsers.find(u => u.id === createForm.user_id);
                          if (selectedUser) {
                            const startTime = selectedUser.checkin_start_time || "08:00";
                            const timezone = selectedUser.timezone || "America/Argentina/Buenos_Aires";
                            return (
                              <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Horario de entrada:</span> 
                                  <span className="ml-1 font-mono">{startTime}</span>
                                  <span className="ml-1 text-xs">({timezone})</span>
                                </div>
                                {/* Solo mostrar el estado si hay fecha y hora seleccionada */}
                                {createForm.time && createForm.time.trim() !== "" && (
                                  <div className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                                    isTimeLate(createForm.time, createForm.user_id)
                                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50" 
                                      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                                  }`}>
                                    <span>
                                      {isTimeLate(createForm.time, createForm.user_id) ? "⚠️" : "✅"}
                                    </span>
                                    <span>
                                      {isTimeLate(createForm.time, createForm.user_id)
                                        ? "Este check-in se considera tarde (más de 15 min después del horario)" 
                                        : "Este check-in está a tiempo"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha y Hora</Label>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 flex-1">
                        <Label htmlFor="date-picker" className="px-1 text-sm">
                          Fecha
                        </Label>
                        <Popover open={showCreateDatePicker} onOpenChange={setShowCreateDatePicker}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="w-full justify-between font-normal"
                            >
                              {createForm.time ? (() => {
                                const date = new Date(createForm.time);
                                return !isNaN(date.getTime()) ? date.toLocaleDateString("es-ES") : "Seleccionar fecha";
                              })() : "Seleccionar fecha"}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={createForm.time ? new Date(createForm.time) : undefined}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                if (date) {
                                  // Get current time for the selected date
                                  const now = new Date();
                                  const hours = String(now.getHours()).padStart(2, '0');
                                  const minutes = String(now.getMinutes()).padStart(2, '0');
                                  
                                  const year = date.getFullYear();
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const day = String(date.getDate()).padStart(2, '0');
                                  
                                  setCreateForm((prev) => ({
                                    ...prev,
                                    time: `${year}-${month}-${day}T${hours}:${minutes}`,
                                  }));
                                }
                                setShowCreateDatePicker(false);
                              }}
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
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <Label htmlFor="time-picker" className="px-1 text-sm">
                          Hora
                        </Label>
                        <Input
                          type="time"
                          id="time-picker"
                          step="60"
                          value={createForm.time ? (() => {
                            const date = new Date(createForm.time);
                            return !isNaN(date.getTime()) ? 
                              `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : 
                              "";
                          })() : ""}
                          onChange={(e) => {
                            const timeValue = e.target.value;
                            if (timeValue && createForm.time) {
                              const [hours, minutes] = timeValue.split(':');
                              const currentDate = new Date(createForm.time);
                              const year = currentDate.getFullYear();
                              const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                              const day = String(currentDate.getDate()).padStart(2, '0');
                              
                              setCreateForm((prev) => ({
                                ...prev,
                                time: `${year}-${month}-${day}T${hours}:${minutes}`,
                              }));
                            } else if (timeValue) {
                              // If no date is selected, use today's date
                              const today = new Date();
                              const year = today.getFullYear();
                              const month = String(today.getMonth() + 1).padStart(2, '0');
                              const day = String(today.getDate()).padStart(2, '0');
                              const [hours, minutes] = timeValue.split(':');
                              
                              setCreateForm((prev) => ({
                                ...prev,
                                time: `${year}-${month}-${day}T${hours}:${minutes}`,
                              }));
                            }
                          }}
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ubicaciones</Label>
                    <div className="space-y-3">
                      {createForm.locations?.map((location, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Ubicación {index + 1}</span>
                            {createForm.locations && createForm.locations.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCreateForm((prev) => ({
                                    ...prev,
                                    locations: prev.locations?.filter((_, i) => i !== index) || [],
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Tipo de Ubicación</Label>
                            <Select
                              value={location.location_type.toString()}
                              onValueChange={(value) => {
                                const locationType = parseInt(value);
                                const autoLocationDetail = autoPopulateLocationDetails(createForm.user_id, locationType);
                                
                                setCreateForm((prev) => ({
                                  ...prev,
                                  locations: prev.locations?.map((loc, i) => 
                                    i === index 
                                      ? {
                                          location_type: locationType,
                                          location_detail: autoLocationDetail || loc.location_detail || "",
                                          start_time: loc.start_time || "",
                                        }
                                      : loc
                                  ) || [],
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {locationTypes.length > 0 ? (
                                  // Use dynamic catalogs
                                  locationTypes.map((locationType) => (
                                    <SelectItem key={locationType.id} value={locationType.id.toString()}>
                                      📍 {locationType.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  // Fallback to hardcoded enums
                                  <>
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
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Detalle de Ubicación</Label>
                            <Input
                              placeholder="Ej: Piso 3, Escritorio 42"
                              value={location.location_detail}
                              onChange={(e) =>
                                setCreateForm((prev) => ({
                                  ...prev,
                                  locations: prev.locations?.map((loc, i) => 
                                    i === index 
                                      ? {
                                          location_type: loc.location_type,
                                          location_detail: e.target.value,
                                          start_time: loc.start_time || "",
                                        }
                                      : loc
                                  ) || [],
                                }))
                              }
                              className={location.location_detail && 
                                (location.location_type === LOCATION_TYPES.OFFICE || 
                                 location.location_type === LOCATION_TYPES.REMOTE_DECLARED) 
                                ? "bg-gray-50" : ""}
                            />
                            {(location.location_type === LOCATION_TYPES.OFFICE || 
                              location.location_type === LOCATION_TYPES.REMOTE_DECLARED) && 
                              location.location_detail && (
                              <p className="text-xs text-muted-foreground">
                                {location.location_type === LOCATION_TYPES.OFFICE 
                                  ? "Dirección de oficina ABSTI auto-completada" 
                                  : "Dirección del usuario auto-completada"}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Hora de Inicio en esta Ubicación (Opcional)</Label>
                            <Input
                              type="time"
                              placeholder="HH:MM"
                              value={location.start_time || ""}
                              onChange={(e) =>
                                setCreateForm((prev) => ({
                                  ...prev,
                                  locations: prev.locations?.map((loc, i) => 
                                    i === index 
                                      ? {
                                          location_type: loc.location_type,
                                          location_detail: loc.location_detail,
                                          start_time: e.target.value,
                                        }
                                      : loc
                                  ) || [],
                                }))
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              Especifica cuándo comenzaste a trabajar desde esta ubicación
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCreateForm((prev) => ({
                            ...prev,
                            locations: [
                              ...(prev.locations || []),
                              {
                                location_type: 1,
                                location_detail: "",
                                start_time: "",
                              },
                            ],
                          }));
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Ubicación
                      </Button>
                    </div>
                  </div>
                  {isTimeLate(createForm.time, createForm.user_id) && (
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
                  {!isTimeLate(createForm.time, createForm.user_id) && createForm.late_reason && (
                    <div className="space-y-2">
                      <Label>Motivo de Tardanza</Label>
                      <Textarea
                        placeholder="Explicar el motivo de la tardanza..."
                        value={createForm.late_reason}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setCreateForm((prev) => ({
                            ...prev,
                            late_reason: e.target.value,
                          }))
                        }
                        className="border-gray-200 focus:border-gray-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Opcional para check-ins a tiempo
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
                    <Button 
                      onClick={handleCreateCheckin}
                      disabled={!createForm.user_id || !createForm.time || !createForm.locations[0].location_detail}
                      className={!createForm.user_id || !createForm.time || !createForm.locations[0].location_detail ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {!createForm.user_id ? "Hace falta seleccionar un usuario" : 
                       !createForm.time ? "Hace falta seleccionar una fecha y hora" :
                       !createForm.locations[0].location_detail ? "Hace falta completar la ubicación" :
                       "Crear Check-in"}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Registros</p>
              {loading ? (
                <Skeleton className="h-6 w-12 mb-1" />
              ) : (
                <p className="text-lg font-bold">
                  {liveStats?.total_employees || 0}
                </p>
              )}
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
              {loading ? (
                <Skeleton className="h-6 w-12 mb-1" />
              ) : (
                <p className="text-lg font-bold text-green-600">
                  {liveStats?.present_today || 0}
                </p>
              )}
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
              {loading ? (
                <Skeleton className="h-6 w-12 mb-1" />
              ) : (
                <p className="text-lg font-bold text-yellow-600">
                  {liveStats?.absent_today || 0}
                </p>
              )}
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
              <p className="text-xs font-medium text-muted-foreground">Finalizados</p>
              {loading ? (
                <Skeleton className="h-6 w-8 mb-1" />
              ) : (
                <p className="text-lg font-bold text-gray-600">
                  {checkins.filter(checkin => checkin.checkout_time !== null).length}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                registros completados
              </p>
            </div>
            <Clock className="h-4 w-4 text-gray-600" />
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
              {loading ? (
                <Skeleton className="h-4 w-[200px] mt-1" />
              ) : (
                <CardDescription className="text-sm">
                  {`${filteredData.length} de ${checkins.length} registros`}
                </CardDescription>
              )}
            </div>

          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col min-h-0">


          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px] rounded-full" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-8 rounded" />
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
              <Label>Ubicaciones</Label>
              <div className="space-y-3">
                {editForm.locations?.map((location, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ubicación {index + 1}</span>
                      {editForm.locations && editForm.locations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditForm((prev) => ({
                              ...prev,
                              locations: prev.locations?.filter((_, i) => i !== index) || [],
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Tipo de Ubicación</Label>
                      <Select
                        value={location.location_type?.toString() || "1"}
                        onValueChange={(value) => {
                          const locationType = parseInt(value);
                          const userId = editingCheckin?.user_id || 0;
                          const autoLocationDetail = autoPopulateLocationDetails(userId, locationType);
                          
                          setEditForm((prev) => ({
                            ...prev,
                            locations: prev.locations?.map((loc, i) => 
                              i === index 
                                ? {
                                    location_type: locationType,
                                    location_detail: autoLocationDetail || loc.location_detail || "",
                                    start_time: loc.start_time || "",
                                  }
                                : loc
                            ) || [],
                          }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locationTypes.length > 0 ? (
                            // Use dynamic catalogs
                            locationTypes.map((locationType) => (
                              <SelectItem key={locationType.id} value={locationType.id.toString()}>
                                📍 {locationType.name}
                              </SelectItem>
                            ))
                          ) : (
                            // Fallback to hardcoded enums
                            <>
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
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Detalle de Ubicación</Label>
                      <Input
                        placeholder="Ej: Piso 3, Escritorio 42"
                        value={location.location_detail || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            locations: prev.locations?.map((loc, i) => 
                              i === index 
                                ? {
                                    location_type: loc.location_type,
                                    location_detail: e.target.value,
                                    start_time: loc.start_time || "",
                                  }
                                : loc
                            ) || [],
                          }))
                        }
                        className={location.location_detail && 
                          (location.location_type === LOCATION_TYPES.OFFICE || 
                           location.location_type === LOCATION_TYPES.REMOTE_DECLARED) 
                          ? "bg-gray-50" : ""}
                      />
                      {(location.location_type === LOCATION_TYPES.OFFICE || 
                        location.location_type === LOCATION_TYPES.REMOTE_DECLARED) && 
                        location.location_detail && (
                        <p className="text-xs text-muted-foreground">
                          {location.location_type === LOCATION_TYPES.OFFICE 
                            ? "Dirección de oficina ABSTI auto-completada" 
                            : "Dirección del usuario auto-completada"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Hora de Inicio en esta Ubicación (Opcional)</Label>
                      <Input
                        type="time"
                        placeholder="HH:MM"
                        value={location.start_time || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            locations: prev.locations?.map((loc, i) => 
                              i === index 
                                ? {
                                    location_type: loc.location_type,
                                    location_detail: loc.location_detail || "",
                                    start_time: e.target.value,
                                  }
                                : loc
                            ) || [],
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Especifica cuándo comenzaste a trabajar desde esta ubicación
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditForm((prev) => ({
                      ...prev,
                      locations: [
                        ...(prev.locations || []),
                        {
                          location_type: 1,
                          location_detail: "",
                          start_time: "",
                        },
                      ],
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ubicación
                </Button>
              </div>
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

      {/* Modal de Ubicaciones */}
      <Dialog open={showLocationsModal} onOpenChange={setShowLocationsModal}>
        <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Todas las Ubicaciones</DialogTitle>
            <DialogDescription>
              Ubicaciones registradas para este check-in
            </DialogDescription>
            {selectedUserInfo && (
              <div className="mt-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                <span className="font-medium">{selectedUserInfo.name}</span> • {selectedUserInfo.email}
              </div>
            )}
          </DialogHeader>
          <div className="space-y-4">
            {selectedLocations.map((location, index) => {
              const getLocationInfo = (type: number) => {
                // Use dynamic catalogs if available, fallback to hardcoded enums
                if (locationTypes.length > 0) {
                  const locationType = locationTypes.find(lt => lt.id === type);
                  if (locationType) {
                    return { icon: "📍", label: locationType.name };
                  }
                }
                
                // Fallback to hardcoded enums
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
                <div key={index} className="border border-border rounded-lg p-4 space-y-3 bg-card">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{locationInfo.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        Ubicación {index + 1}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locationInfo.label}
                      </p>
                    </div>
                  </div>
                  
                  {location.location_detail && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Dirección:</label>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        {location.location_detail}
                      </p>
                    </div>
                  )}
                  
                  {location.start_time && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Hora de inicio:</label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {location.start_time}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowLocationsModal(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
