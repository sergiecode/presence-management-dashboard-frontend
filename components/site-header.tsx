"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const glass: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.28)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    borderTop: "2px solid rgba(255, 255, 255, 0.3)",
    borderLeft: "2px solid rgba(255, 255, 255, 0.3)",
    borderRight: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  };

  const pathname = usePathname();
  const [title, setTitle] = useState("Portal RRHH");

  useEffect(() => {
    if (!pathname) return;

    const sortedNav = [...navMain].sort((a, b) => b.url.length - a.url.length);
    const currentItem = sortedNav.find((item) => pathname.startsWith(item.url));

    setTitle(currentItem ? currentItem.title : "Portal RRHH");
  }, [pathname]);

  return (
    <header
      style={glass}
      className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  );
}
