"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { getUsers } from "@/app/services/dashboard";

interface UserData extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  department?: string;
  position?: string;
  status: string;
  registrationDate: string;
  pending_approval?: boolean;
}

export default function EmployeesPage() {
  const [employeeData, setEmployeeData] = useState<UserData[]>([]);
  const [pendingApprovalData, setPendingApprovalData] = useState<UserData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar autenticación
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error("No se encontró información de usuario autenticado");
        }

        const userData = JSON.parse(userStr);
        if (userData.role !== "admin") {
          throw new Error(
            "Solo los administradores pueden ver la lista de usuarios"
          );
        }

        // Obtener usuarios de la API - Sin filtros para obtener todos los usuarios
        const response = await getUsers({}); // Sin filtros para traer todos
        const users = response?.data || [];

        // Procesar y dividir usuarios
        const processedUsers = users.map((user: any, index: number) => {
          return {
            id: user.id || index + 1,
            name: user.name || `Usuario ${user.id || index + 1}`,
            email: user.email || "email@ejemplo.com",
            department: user.department || "Departamento General",
            position: user.position || "Empleado",
            status: user.active ? "active" : "inactive",
            registrationDate: user.created_at || new Date().toISOString(),
            pending_approval: user.pending_approval || false,
          };
        });

        // Separar empleados activos/inactivos y pendientes de aprobación
        const activeEmployees = processedUsers.filter(
          (user: UserData) => !user.pending_approval
        );
        const pendingEmployees = processedUsers.filter(
          (user: UserData) => user.pending_approval
        );

        setEmployeeData(activeEmployees);
        setPendingApprovalData(pendingEmployees);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");

        // Datos de respaldo en caso de error
        setEmployeeData([]);
        setPendingApprovalData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 h-full justify-center items-center">
        <div className="text-lg">Cargando empleados...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 h-full justify-center items-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <DataTable
        employeeData={employeeData}
        pendingApprovalData={pendingApprovalData}
      />
    </div>
  );
}
