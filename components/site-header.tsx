"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./ui/mode-toggle";

const navMain = [
  { title: "Panel Principal", url: "/dashboard" },
  { title: "Asistencia", url: "/dashboard/attendance" },
  { title: "Empleados", url: "/dashboard/employees" },
  { title: "Reportes", url: "/dashboard/reports" },
  { title: "Gestion de Licencias", url: "/dashboard/leave-management" },
  { title: "Registros de Auditoria", url: "/dashboard/audit-logs" },
  { title: "Equipos", url: "/dashboard/teams" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [title, setTitle] = useState("Portal RRHH");

  useEffect(() => {
    if (!pathname) return;

    const sortedNav = [...navMain].sort((a, b) => b.url.length - a.url.length);
    const currentItem = sortedNav.find((item) => pathname.startsWith(item.url));

    setTitle(currentItem ? currentItem.title : "Portal RRHH");
  }, [pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-2">
      <div className="data-[state=open]:bg-sidebar-accent flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
      <div className="px-6">
        <ModeToggle />
      </div>
    </header>
  );
}
