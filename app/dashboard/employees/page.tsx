"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Users,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserHrDetails,
  updateUserCheckinConfig,
} from "@/app/services/dashboard";
import { useUser } from "@/app/contexts/UserContext";

interface User {
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
  location: {
    calle?: string;
    ciudad?: string;
    codigo_postal?: string;
    numero?: string;
    pais?: string;
    piso?: string;
    provincia?: string;
    tipo?: number;
  };
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
}

interface HrDetailsForm {
  birth_date: string;
  cuil: string;
  dni: string;
  hire_date: string;
  location: {
    calle: string;
    ciudad: string;
    codigo_postal: string;
    numero: string;
    pais: string;
    piso: string;
    provincia: string;
    tipo: number;
  };
  monthly_objective_days: number;
  notes: string;
  office_days: string;
  on_site_required: boolean;
  team: string;
  teams_access: boolean;
  weekly_hours: number;
  weekly_objective_days: number;
  zoho_access: boolean;
}

interface EditUserForm {
  active: boolean;
  birth_date: string;
  checkin_start_time: string;
  checkout_end_time: string;
  cuil: string;
  dni: string;
  email: string;
  email_confirmed: boolean;
  end_of_day_absence_detection: boolean;
  hire_date: string;
  location: {
    calle: string;
    ciudad: string;
    codigo_postal: string;
    numero: string;
    pais: string;
    piso: string;
    provincia: string;
    tipo: number;
  };
  monthly_objective_days: number;
  name: string;
  notes: string;
  notification_offset_min: number;
  office_days: string;
  on_site_required: boolean;
  phone: string;
  picture: string;
  role: string;
  surname: string;
  team: string;
  teams_access: boolean;
  timezone: string;
  weekly_hours: number;
  weekly_objective_days: number;
  zoho_access: boolean;
}

interface CheckinConfigForm {
  checkin_start_time: string;
  checkout_end_time: string;
  notification_offset_min: number;
  timezone: string;
}

export default function EmployeesPage() {
  const { user } = useUser();

  // Estados principales
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Estados de modales
  const [showHrModal, setShowHrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Estados de formularios
  const [hrForm, setHrForm] = useState<HrDetailsForm>({
    birth_date: "",
    cuil: "",
    dni: "",
    hire_date: "",
    location: {
      calle: "",
      ciudad: "",
      codigo_postal: "",
      numero: "",
      pais: "",
      piso: "",
      provincia: "",
      tipo: 1,
    },
    monthly_objective_days: 0,
    notes: "",
    office_days: "",
    on_site_required: false,
    team: "",
    teams_access: false,
    weekly_hours: 0,
    weekly_objective_days: 0,
    zoho_access: false,
  });

  const [editForm, setEditForm] = useState<EditUserForm>({
    active: true,
    birth_date: "",
    checkin_start_time: "",
    checkout_end_time: "",
    cuil: "",
    dni: "",
    email: "",
    email_confirmed: true,
    end_of_day_absence_detection: false,
    hire_date: "",
    location: {
      calle: "",
      ciudad: "",
      codigo_postal: "",
      numero: "",
      pais: "",
      piso: "",
      provincia: "",
      tipo: 1,
    },
    monthly_objective_days: 0,
    name: "",
    notes: "",
    notification_offset_min: 10,
    office_days: "",
    on_site_required: false,
    phone: "",
    picture: "",
    role: "",
    surname: "",
    team: "",
    teams_access: false,
    timezone: "",
    weekly_hours: 0,
    weekly_objective_days: 0,
    zoho_access: false,
  });

  const [checkinConfigForm, setCheckinConfigForm] = useState<CheckinConfigForm>(
    {
      checkin_start_time: "",
      checkout_end_time: "",
      notification_offset_min: 10,
      timezone: "",
    }
  );

  // Estados de validación
  const [hrFormErrors, setHrFormErrors] = useState<string[]>([]);
  const [editFormErrors, setEditFormErrors] = useState<string[]>([]);
  const [checkinFormErrors, setCheckinFormErrors] = useState<string[]>([]);

  // Funciones de validación
  const validateHrForm = (): boolean => {
    const errors: string[] = [];

    if (!hrForm.dni.trim()) errors.push("DNI es obligatorio");
    if (!hrForm.cuil.trim()) errors.push("CUIL es obligatorio");
    if (!hrForm.birth_date) errors.push("Fecha de nacimiento es obligatoria");
    if (!hrForm.hire_date) errors.push("Fecha de contratación es obligatoria");
    if (!hrForm.team.trim()) errors.push("Equipo es obligatorio");
    if (hrForm.weekly_hours <= 0)
      errors.push("Horas semanales debe ser mayor a 0");
    if (hrForm.weekly_objective_days <= 0)
      errors.push("Días objetivo semanales debe ser mayor a 0");
    if (hrForm.monthly_objective_days <= 0)
      errors.push("Días objetivo mensuales debe ser mayor a 0");
    if (!hrForm.location.ciudad.trim()) errors.push("Ciudad es obligatoria");
    if (!hrForm.location.provincia.trim())
      errors.push("Provincia es obligatoria");
    if (!hrForm.location.pais.trim()) errors.push("País es obligatorio");

    setHrFormErrors(errors);
    return errors.length === 0;
  };

  const validateEditForm = (): boolean => {
    const errors: string[] = [];

    // Campos básicos obligatorios
    if (!editForm.name.trim()) errors.push("Nombre es obligatorio");
    if (!editForm.surname.trim()) errors.push("Apellido es obligatorio");
    if (!editForm.email.trim()) errors.push("Email es obligatorio");
    if (!editForm.role) errors.push("Rol es obligatorio");

    // Validaciones adicionales si se están editando esos campos
    if (editForm.weekly_hours > 0 && editForm.weekly_objective_days <= 0) {
      errors.push(
        "Si especificas horas semanales, los días objetivo semanales son obligatorios"
      );
    }
    if (
      editForm.monthly_objective_days > 0 &&
      editForm.weekly_objective_days <= 0
    ) {
      errors.push(
        "Si especificas días mensuales, los días objetivo semanales son obligatorios"
      );
    }

    setEditFormErrors(errors);
    return errors.length === 0;
  };

  const validateCheckinForm = (): boolean => {
    const errors: string[] = [];

    if (!checkinConfigForm.checkin_start_time)
      errors.push("Hora de entrada es obligatoria");
    if (!checkinConfigForm.checkout_end_time)
      errors.push("Hora de salida es obligatoria");
    if (!checkinConfigForm.timezone) errors.push("Zona horaria es obligatoria");
    if (checkinConfigForm.notification_offset_min < 0)
      errors.push("Minutos de notificación no puede ser negativo");

    setCheckinFormErrors(errors);
    return errors.length === 0;
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUsers({ limit: 1000 });

      if (response && response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response && Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        "Error al cargar los usuarios: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    } else if (user && user.role !== "admin") {
      setError("Solo los administradores pueden acceder a esta página");
    }
  }, [user, fetchUsers]);

  const handleCompleteHrDetails = useCallback(
    async (userId: number) => {
      if (users.length === 0) {
        setError(
          "No se han cargado los usuarios. Por favor, haz clic en 'Actualizar' para cargar los datos."
        );
        return;
      }

      const userToEdit = users.find((u) => u.id === userId);

      if (!userToEdit) {
        setError("Usuario no encontrado. Intenta actualizar la página.");
        return;
      }

      // Función para convertir fecha ISO a formato date input (YYYY-MM-DD)
      const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return "";
        // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Si está en formato ISO, extraer solo la fecha
        if (dateStr.includes("T")) return dateStr.split("T")[0];
        return dateStr;
      };

      setSelectedUser(userToEdit);
      setHrForm({
        birth_date: formatDateForInput(userToEdit.birth_date),
        cuil: userToEdit.cuil || "",
        dni: userToEdit.dni || "",
        hire_date: formatDateForInput(userToEdit.hire_date),
        location: {
          calle: userToEdit.location?.calle || "",
          ciudad: userToEdit.location?.ciudad || "",
          codigo_postal: userToEdit.location?.codigo_postal || "",
          numero: userToEdit.location?.numero || "",
          pais: userToEdit.location?.pais || "",
          piso: userToEdit.location?.piso || "",
          provincia: userToEdit.location?.provincia || "",
          tipo: userToEdit.location?.tipo || 1,
        },
        monthly_objective_days: userToEdit.monthly_objective_days || 0,
        notes: userToEdit.notes || "",
        office_days: userToEdit.office_days || "",
        on_site_required: userToEdit.on_site_required || false,
        team: userToEdit.team || "",
        teams_access: userToEdit.teams_access || false,
        weekly_hours: userToEdit.weekly_hours || 0,
        weekly_objective_days: userToEdit.weekly_objective_days || 0,
        zoho_access: userToEdit.zoho_access || false,
      });
      setShowHrModal(true);
    },
    [users]
  );

  const handleEditUser = useCallback(async (userId: number) => {
    try {
      const userDetails = await getUserById(userId);

      // Función para convertir fecha ISO a formato date input (YYYY-MM-DD)
      const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return "";
        // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Si está en formato ISO, extraer solo la fecha
        if (dateStr.includes("T")) return dateStr.split("T")[0];
        return dateStr;
      };

      setSelectedUser(userDetails);
      setEditForm({
        active: userDetails.active,
        birth_date: formatDateForInput(userDetails.birth_date),
        checkin_start_time: userDetails.checkin_start_time || "",
        checkout_end_time: userDetails.checkout_end_time || "",
        cuil: userDetails.cuil || "",
        dni: userDetails.dni || "",
        email: userDetails.email || "",
        email_confirmed: userDetails.email_confirmed,
        end_of_day_absence_detection: userDetails.end_of_day_absence_detection,
        hire_date: formatDateForInput(userDetails.hire_date),
        location: {
          calle: userDetails.location?.calle || "",
          ciudad: userDetails.location?.ciudad || "",
          codigo_postal: userDetails.location?.codigo_postal || "",
          numero: userDetails.location?.numero || "",
          pais: userDetails.location?.pais || "",
          piso: userDetails.location?.piso || "",
          provincia: userDetails.location?.provincia || "",
          tipo: userDetails.location?.tipo || 1,
        },
        monthly_objective_days: userDetails.monthly_objective_days || 0,
        name: userDetails.name || "",
        notes: userDetails.notes || "",
        notification_offset_min: userDetails.notification_offset_min || 10,
        office_days: userDetails.office_days || "",
        on_site_required: userDetails.on_site_required || false,
        phone: userDetails.phone || "",
        picture: userDetails.picture || "",
        role: userDetails.role || "",
        surname: userDetails.surname || "",
        team: userDetails.team || "",
        teams_access: userDetails.teams_access || false,
        timezone: userDetails.timezone || "",
        weekly_hours: userDetails.weekly_hours || 0,
        weekly_objective_days: userDetails.weekly_objective_days || 0,
        zoho_access: userDetails.zoho_access || false,
      });
      setShowEditModal(true);
    } catch (error) {
      setError("Error al cargar los detalles del usuario");
      console.error("Error loading user details:", error);
    }
  }, []);

  const handleConfigCheckin = useCallback(
    (userId: number) => {
      if (users.length === 0) {
        setError(
          "No se han cargado los usuarios. Por favor, haz clic en 'Actualizar' para cargar los datos."
        );
        return;
      }

      const userToConfig = users.find((u) => u.id === userId);

      if (!userToConfig) {
        setError("Usuario no encontrado. Intenta actualizar la página.");
        return;
      }

      setSelectedUser(userToConfig);
      setCheckinConfigForm({
        checkin_start_time: userToConfig.checkin_start_time || "",
        checkout_end_time: userToConfig.checkout_end_time || "",
        notification_offset_min: userToConfig.notification_offset_min || 10,
        timezone: userToConfig.timezone || "",
      });
      setShowCheckinModal(true);
    },
    [users]
  );

  const submitHrDetails = async () => {
    if (!selectedUser) return;

    if (!validateHrForm()) {
      setError("Por favor, completa todos los campos obligatorios marcados");
      return;
    }

    try {
      // Convertir fechas al formato ISO 8601 que espera el backend
      const formatDateForBackend = (dateStr: string) => {
        if (!dateStr) return "";
        // Si ya tiene formato de tiempo, devolverlo tal como está
        if (dateStr.includes("T")) return dateStr;
        // Si es solo fecha, agregar tiempo por defecto (mediodía UTC)
        return `${dateStr}T12:00:00Z`;
      };

      const hrDataFormatted = {
        ...hrForm,
        birth_date: formatDateForBackend(hrForm.birth_date),
        hire_date: formatDateForBackend(hrForm.hire_date),
      };

      await updateUserHrDetails(selectedUser.id, hrDataFormatted);
      setMessage("Detalles de HR actualizados correctamente");
      setShowHrModal(false);
      setHrFormErrors([]);
      fetchUsers();
    } catch (error) {
      setError("Error al actualizar los detalles de HR");
      console.error("Error updating HR details:", error);
    }
  };

  const submitEditUser = async () => {
    if (!selectedUser) return;

    if (!validateEditForm()) {
      setError("Por favor, completa todos los campos obligatorios marcados");
      return;
    }

    try {
      // Función para convertir fechas al formato ISO 8601 que espera el backend
      const formatDateForBackend = (dateStr: string) => {
        if (!dateStr) return "";
        // Si ya tiene formato de tiempo, devolverlo tal como está
        if (dateStr.includes("T")) return dateStr;
        // Si es solo fecha, agregar tiempo por defecto (mediodía UTC)
        return `${dateStr}T12:00:00Z`;
      };

      // Usar todos los campos disponibles del PUT
      const updateData = {
        active: editForm.active,
        birth_date: formatDateForBackend(editForm.birth_date),
        checkin_start_time: editForm.checkin_start_time,
        checkout_end_time: editForm.checkout_end_time,
        cuil: editForm.cuil,
        dni: editForm.dni,
        email: editForm.email,
        email_confirmed: editForm.email_confirmed,
        end_of_day_absence_detection: editForm.end_of_day_absence_detection,
        hire_date: formatDateForBackend(editForm.hire_date),
        location: editForm.location,
        monthly_objective_days: editForm.monthly_objective_days,
        name: editForm.name,
        notes: editForm.notes,
        notification_offset_min: editForm.notification_offset_min,
        office_days: editForm.office_days,
        on_site_required: editForm.on_site_required,
        phone: editForm.phone,
        picture: editForm.picture,
        role: editForm.role as "admin" | "hr" | "employee",
        surname: editForm.surname,
        team: editForm.team,
        teams_access: editForm.teams_access,
        timezone: editForm.timezone,
        weekly_hours: editForm.weekly_hours,
        weekly_objective_days: editForm.weekly_objective_days,
        zoho_access: editForm.zoho_access,
      };

      await updateUser(selectedUser.id, updateData);
      setMessage("Usuario actualizado correctamente");
      setShowEditModal(false);
      setEditFormErrors([]);
      fetchUsers();
    } catch (error) {
      setError("Error al actualizar el usuario");
      console.error("Error updating user:", error);
    }
  };

  const submitCheckinConfig = async () => {
    if (!selectedUser) return;

    if (!validateCheckinForm()) {
      setError("Por favor, completa todos los campos obligatorios marcados");
      return;
    }

    try {
      await updateUserCheckinConfig(selectedUser.id, checkinConfigForm);
      setMessage("Configuración de check-in actualizada correctamente");
      setShowCheckinModal(false);
      setCheckinFormErrors([]);
      fetchUsers();
    } catch (error) {
      setError("Error al actualizar la configuración de check-in");
      console.error("Error updating checkin config:", error);
    }
  };

  const handleDeleteUser = useCallback(
    async (userId: number) => {
      try {
        await deleteUser(userId);
        setMessage("Usuario eliminado correctamente");
        fetchUsers();
      } catch (error) {
        setError("Error al eliminar el usuario");
        console.error("Error deleting user:", error);
      }
    },
    [fetchUsers]
  );

  // Configuración de React Table
  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Usuario",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              {info.row.original.picture ? (
                <Image
                  src={info.row.original.picture}
                  alt={info.getValue()}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-blue-600">
                  {info.getValue().charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium">
                {info.getValue()} {info.row.original.surname}
              </div>
              <div className="text-sm text-muted-foreground">
                {info.row.original.email}
              </div>
            </div>
          </div>
        ),
        filterFn: "includesString",
      }),
      columnHelper.accessor("role", {
        header: "Rol",
        cell: (info) => {
          const role = info.getValue();
          let badgeClass = "";
          let displayName = "";

          switch (role) {
            case "admin":
              badgeClass = "bg-red-500/20 text-red-700 border-red-500/30";
              displayName = "Admin";
              break;
            case "hr":
              badgeClass =
                "bg-purple-500/20 text-purple-700 border-purple-500/30";
              displayName = "RRHH";
              break;
            case "employee":
              badgeClass = "bg-blue-500/20 text-blue-700 border-blue-500/30";
              displayName = "Empleado";
              break;
            default:
              badgeClass = "bg-gray-500/20 text-gray-700 border-gray-500/30";
              displayName = role;
          }

          return (
            <Badge className={`capitalize ${badgeClass}`}>{displayName}</Badge>
          );
        },
      }),
      columnHelper.accessor("team", {
        header: "Equipo",
        cell: (info) => (
          <div className="text-sm">
            <div className="font-medium">{info.getValue() || "-"}</div>
            <div className="text-muted-foreground">
              {info.row.original.weekly_hours}h/sem -{" "}
              {info.row.original.weekly_objective_days}d/sem
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("phone", {
        header: "Contacto",
        cell: (info) => (
          <div className="text-sm">
            <div className="font-medium">
              {info.getValue() || "Sin teléfono"}
            </div>
            <div className="text-muted-foreground">
              {info.row.original.dni || "Sin DNI"}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("active", {
        header: "Estado",
        cell: (info) => (
          <div className="flex items-center gap-2">
            {info.getValue() ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span
              className={info.getValue() ? "text-green-700" : "text-red-700"}
            >
              {info.getValue() ? "Activo" : "Inactivo"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("pending_approval", {
        header: "Aprobación",
        cell: (info) => {
          if (info.getValue()) {
            return (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-orange-700">Pendiente</span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700">Aprobado</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("location", {
        header: "Ubicación",
        cell: (info) => {
          const location = info.getValue();
          if (!location || (!location.ciudad && !location.provincia)) {
            return (
              <span className="text-muted-foreground text-sm">
                No especificada
              </span>
            );
          }
          return (
            <div className="text-sm">
              <div className="font-medium">
                {location.ciudad || "Sin ciudad"}
              </div>
              <div className="text-muted-foreground">
                {location.provincia || "Sin provincia"}
              </div>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        cell: (info) => (
          <div className="flex items-center gap-2">
            {info.row.original.pending_approval && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCompleteHrDetails(info.row.original.id)
                    }
                    className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                  >
                    Completar HR
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Completar información de recursos humanos</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditUser(info.row.original.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar información del usuario</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfigCheckin(info.row.original.id)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurar horarios de check-in</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar a{" "}
                        {info.row.original.name}? Esta acción no se puede
                        deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(info.row.original.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eliminar usuario del sistema</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      }),
    ],
    [
      columnHelper,
      handleCompleteHrDetails,
      handleEditUser,
      handleConfigCheckin,
      handleDeleteUser,
    ]
  );

  const filteredData = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((user) => user.active);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((user) => !user.active);
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((user) => user.pending_approval);
      }
    }

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
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

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Solo los administradores pueden acceder a esta página</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 h-full p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Empleados
            </h1>
            <p className="text-muted-foreground">
              Administra usuarios, permisos y configuraciones del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <Button size="sm" variant="ghost" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{message}</span>
            <Button size="sm" variant="ghost" onClick={() => setMessage(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Administradores
              </CardTitle>
              <Settings className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.role === "admin").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recursos Humanos
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {users.filter((u) => u.role === "hr").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Activos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.active).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendientes Aprobación
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {users.filter((u) => u.pending_approval).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
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
                    placeholder="Buscar por nombre, email o equipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="hr">Recursos Humanos</SelectItem>
                  <SelectItem value="employee">Empleado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de usuarios */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Lista de Empleados</CardTitle>
            <CardDescription>
              {loading
                ? "Cargando usuarios..."
                : `${filteredData.length} de ${users.length} usuarios`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
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
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay usuarios</h3>
                <p>
                  No se encontraron usuarios que coincidan con los filtros
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
                            <TableHead
                              key={header.id}
                              className="font-semibold"
                            >
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
                    de {filteredData.length} usuarios
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

        {/* Modal de Detalles de HR */}
        <Dialog open={showHrModal} onOpenChange={setShowHrModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Completar Detalles de HR</DialogTitle>
              <DialogDescription>
                Completar información de recursos humanos para{" "}
                {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>

            {/* Errores de validación */}
            {hrFormErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                <h4 className="font-semibold mb-2">
                  Campos requeridos faltantes:
                </h4>
                <ul className="text-sm list-disc list-inside">
                  {hrFormErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      DNI <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hrForm.dni}
                      onChange={(e) =>
                        setHrForm((prev) => ({ ...prev, dni: e.target.value }))
                      }
                      placeholder="12345678"
                      className={
                        hrFormErrors.some((e) => e.includes("DNI"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      CUIL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hrForm.cuil}
                      onChange={(e) =>
                        setHrForm((prev) => ({ ...prev, cuil: e.target.value }))
                      }
                      placeholder="20-12345678-9"
                      className={
                        hrFormErrors.some((e) => e.includes("CUIL"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Fecha de Nacimiento{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={hrForm.birth_date}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          birth_date: e.target.value,
                        }))
                      }
                      className={
                        hrFormErrors.some((e) => e.includes("nacimiento"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Fecha de Contratación{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={hrForm.hire_date}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          hire_date: e.target.value,
                        }))
                      }
                      className={
                        hrFormErrors.some((e) => e.includes("contratación"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Laboral</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Equipo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hrForm.team}
                      onChange={(e) =>
                        setHrForm((prev) => ({ ...prev, team: e.target.value }))
                      }
                      placeholder="Desarrollo"
                      className={
                        hrFormErrors.some((e) => e.includes("Equipo"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Horas Semanales <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={hrForm.weekly_hours}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          weekly_hours: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="40"
                      className={
                        hrFormErrors.some((e) => e.includes("semanales"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Días Objetivo Semanales{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={hrForm.weekly_objective_days}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          weekly_objective_days: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="5"
                      className={
                        hrFormErrors.some((e) =>
                          e.includes("objetivo semanales")
                        )
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Días Objetivo Mensuales{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={hrForm.monthly_objective_days}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          monthly_objective_days: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="22"
                      className={
                        hrFormErrors.some((e) =>
                          e.includes("objetivo mensuales")
                        )
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Días de Oficina</Label>
                    <Input
                      value={hrForm.office_days}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          office_days: e.target.value,
                        }))
                      }
                      placeholder="Lunes a Viernes"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="on_site_required"
                    checked={hrForm.on_site_required}
                    onChange={(e) =>
                      setHrForm((prev) => ({
                        ...prev,
                        on_site_required: e.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="on_site_required">Requerido en sitio</Label>
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ubicación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Calle</Label>
                    <Input
                      value={hrForm.location.calle}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: { ...prev.location, calle: e.target.value },
                        }))
                      }
                      placeholder="Av. Corrientes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input
                      value={hrForm.location.numero}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            numero: e.target.value,
                          },
                        }))
                      }
                      placeholder="1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Piso</Label>
                    <Input
                      value={hrForm.location.piso}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: { ...prev.location, piso: e.target.value },
                        }))
                      }
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Ciudad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hrForm.location.ciudad}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            ciudad: e.target.value,
                          },
                        }))
                      }
                      placeholder="Buenos Aires"
                      className={
                        hrFormErrors.some((e) => e.includes("Ciudad"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Provincia <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hrForm.location.provincia}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            provincia: e.target.value,
                          },
                        }))
                      }
                      placeholder="Buenos Aires"
                      className={
                        hrFormErrors.some((e) => e.includes("Provincia"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      País <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hrForm.location.pais}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: { ...prev.location, pais: e.target.value },
                        }))
                      }
                      placeholder="Argentina"
                      className={
                        hrFormErrors.some((e) => e.includes("País"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Código Postal</Label>
                    <Input
                      value={hrForm.location.codigo_postal}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            codigo_postal: e.target.value,
                          },
                        }))
                      }
                      placeholder="C1043"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={hrForm.location.tipo.toString()}
                      onValueChange={(value) =>
                        setHrForm((prev) => ({
                          ...prev,
                          location: { ...prev.location, tipo: parseInt(value) },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Casa</SelectItem>
                        <SelectItem value="2">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Accesos y Permisos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accesos y Permisos</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="teams_access"
                      checked={hrForm.teams_access}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          teams_access: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="teams_access">Acceso a Teams</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="zoho_access"
                      checked={hrForm.zoho_access}
                      onChange={(e) =>
                        setHrForm((prev) => ({
                          ...prev,
                          zoho_access: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="zoho_access">Acceso a Zoho</Label>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  value={hrForm.notes}
                  onChange={(e) =>
                    setHrForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowHrModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={submitHrDetails}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                >
                  Guardar Detalles
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Edición de Usuario */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modificar información de {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>

            {/* Errores de validación */}
            {editFormErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                <h4 className="font-semibold mb-2">
                  Campos requeridos faltantes:
                </h4>
                <ul className="text-sm list-disc list-inside">
                  {editFormErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={
                        editFormErrors.some((e) => e.includes("Nombre"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editForm.surname}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          surname: e.target.value,
                        }))
                      }
                      className={
                        editFormErrors.some((e) => e.includes("Apellido"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={
                        editFormErrors.some((e) => e.includes("Email"))
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Rol <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={editForm.role}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger
                        className={
                          editFormErrors.some((e) => e.includes("Rol"))
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="hr">Recursos Humanos</SelectItem>
                        <SelectItem value="employee">Empleado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Equipo</Label>
                    <Input
                      value={editForm.team}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          team: e.target.value,
                        }))
                      }
                      placeholder="Desarrollo"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active_edit"
                      checked={editForm.active}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          active: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="active_edit">Usuario activo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email_confirmed_edit"
                      checked={editForm.email_confirmed}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          email_confirmed: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="email_confirmed_edit">
                      Email confirmado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="teams_access_edit"
                      checked={editForm.teams_access}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          teams_access: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="teams_access_edit">Acceso a Teams</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="zoho_access_edit"
                      checked={editForm.zoho_access}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          zoho_access: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="zoho_access_edit">Acceso a Zoho</Label>
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Laboral</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Horas Semanales</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editForm.weekly_hours}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          weekly_hours: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Días Objetivo Semanales</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editForm.weekly_objective_days}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          weekly_objective_days: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Días Objetivo Mensuales</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editForm.monthly_objective_days}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          monthly_objective_days: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="22"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Días de Oficina</Label>
                    <Input
                      value={editForm.office_days}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          office_days: e.target.value,
                        }))
                      }
                      placeholder="Lunes a Viernes"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="on_site_required_edit"
                      checked={editForm.on_site_required}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          on_site_required: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="on_site_required_edit">
                      Requerido en sitio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="end_of_day_absence_edit"
                      checked={editForm.end_of_day_absence_detection}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          end_of_day_absence_detection: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="end_of_day_absence_edit">
                      Detección de ausencia fin de día
                    </Label>
                  </div>
                </div>
              </div>

              {/* Horarios y Notificaciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Horarios y Notificaciones
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hora de Entrada</Label>
                    <Input
                      type="time"
                      value={editForm.checkin_start_time}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          checkin_start_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora de Salida</Label>
                    <Input
                      type="time"
                      value={editForm.checkout_end_time}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          checkout_end_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Zona Horaria</Label>
                    <Select
                      value={editForm.timezone}
                      onValueChange={(value) =>
                        setEditForm((prev) => ({ ...prev, timezone: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar zona horaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Argentina/Buenos_Aires">
                          🇦🇷 Buenos Aires (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/Argentina/Cordoba">
                          🇦🇷 Córdoba (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/Argentina/Mendoza">
                          🇦🇷 Mendoza (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/Santiago">
                          🇨🇱 Santiago (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/Montevideo">
                          🇺🇾 Montevideo (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/Sao_Paulo">
                          🇧🇷 São Paulo (GMT-3)
                        </SelectItem>
                        <SelectItem value="UTC">🌍 UTC (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minutos de Notificación</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editForm.notification_offset_min}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          notification_offset_min:
                            parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={submitEditUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                >
                  Actualizar Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración de Check-in */}
        <Dialog open={showCheckinModal} onOpenChange={setShowCheckinModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configuración de Check-in</DialogTitle>
              <DialogDescription>
                Configurar horarios de check-in para {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>

            {/* Errores de validación */}
            {checkinFormErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                <h4 className="font-semibold mb-2">
                  Campos requeridos faltantes:
                </h4>
                <ul className="text-sm list-disc list-inside">
                  {checkinFormErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Hora de Entrada <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  value={checkinConfigForm.checkin_start_time}
                  onChange={(e) =>
                    setCheckinConfigForm((prev) => ({
                      ...prev,
                      checkin_start_time: e.target.value,
                    }))
                  }
                  className={
                    checkinFormErrors.some((e) => e.includes("entrada"))
                      ? "border-red-500"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Hora de Salida <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  value={checkinConfigForm.checkout_end_time}
                  onChange={(e) =>
                    setCheckinConfigForm((prev) => ({
                      ...prev,
                      checkout_end_time: e.target.value,
                    }))
                  }
                  className={
                    checkinFormErrors.some((e) => e.includes("salida"))
                      ? "border-red-500"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Minutos de Notificación</Label>
                <Input
                  type="number"
                  min="0"
                  value={checkinConfigForm.notification_offset_min}
                  onChange={(e) =>
                    setCheckinConfigForm((prev) => ({
                      ...prev,
                      notification_offset_min: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="10"
                  className={
                    checkinFormErrors.some((e) => e.includes("notificación"))
                      ? "border-red-500"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Zona Horaria <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={checkinConfigForm.timezone}
                  onValueChange={(value) =>
                    setCheckinConfigForm((prev) => ({
                      ...prev,
                      timezone: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={
                      checkinFormErrors.some((e) => e.includes("horaria"))
                        ? "border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Seleccionar zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Argentina/Buenos_Aires">
                      🇦🇷 Buenos Aires (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Argentina/Cordoba">
                      🇦🇷 Córdoba (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Argentina/Mendoza">
                      🇦🇷 Mendoza (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Argentina/Salta">
                      🇦🇷 Salta (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Argentina/Ushuaia">
                      🇦🇷 Ushuaia (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Santiago">
                      🇨🇱 Santiago (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Montevideo">
                      🇺🇾 Montevideo (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Sao_Paulo">
                      🇧🇷 São Paulo (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/Lima">
                      🇵🇪 Lima (GMT-5)
                    </SelectItem>
                    <SelectItem value="America/Bogota">
                      🇨🇴 Bogotá (GMT-5)
                    </SelectItem>
                    <SelectItem value="America/Mexico_City">
                      🇲🇽 Ciudad de México (GMT-6)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      🇺🇸 Nueva York (GMT-5)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      🇺🇸 Los Ángeles (GMT-8)
                    </SelectItem>
                    <SelectItem value="Europe/Madrid">
                      🇪🇸 Madrid (GMT+1)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      🇬🇧 Londres (GMT+0)
                    </SelectItem>
                    <SelectItem value="UTC">🌍 UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckinModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={submitCheckinConfig}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                >
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
