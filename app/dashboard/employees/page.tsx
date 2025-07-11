'use client';

import { DataTable } from "@/components/data-table";

export default function EmployeesPage() {
  const employeeData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Empleado ${i + 1}`,
    email: `empleado${i + 1}@empresa.com`,
    department: ['Ventas', 'TI', 'Marketing', 'RH', 'Finanzas'][i % 5],
    position: ['Gerente', 'Desarrollador', 'Diseñador', 'Analista', 'Asistente'][i % 5],
    status: i % 3 === 0 ? 'inactive' : 'active',
    registrationDate: new Date(2023, i % 12, (i % 28) + 1).toISOString()
  }));

  const pendingApprovalData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 100,
    name: `Solicitante ${i + 1}`,
    email: `solicitante${i + 1}@gmail.com`,
    department: ['Contabilidad', 'Operaciones', 'Logística', 'Legal', 'Servicios'][i % 5],
    position: ['Contador', 'Coordinador', 'Especialista', 'Abogado', 'Técnico'][i % 5],
    registrationDate: new Date(2024, i % 6, (i % 20) + 1).toISOString()
  }));

  return (
    <div className="flex flex-col gap-4 h-full">
      <DataTable 
        employeeData={employeeData}
        pendingApprovalData={pendingApprovalData}
      />
    </div>
  );
}