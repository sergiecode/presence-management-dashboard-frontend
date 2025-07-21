"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconCalendar,
  IconChartBar,
  IconFolder,
  IconHome,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import styles from "./sidebar.module.css";

const navMain = [
  {
    title: "Panel Principal",
    url: "/dashboard",
    icon: IconHome,
  },
  {
    title: "Asistencia",
    url: "/dashboard/attendance",
    icon: IconListDetails,
  },
  {
    title: "Empleados",
    url: "/dashboard/employees",
    icon: IconChartBar,
  },
  {
    title: "Reportes",
    url: "/dashboard/reports",
    icon: IconReport,
  },
  {
    title: "Gestion de Licencias",
    url: "/dashboard/leave-management",
    icon: IconCalendar,
  },
  {
    title: "Registros de Auditoria",
    url: "/dashboard/audit-logs",
    icon: IconFolder,
  },
  {
    title: "Equipos",
    url: "/dashboard/teams",
    icon: IconUsers,
  },
];

const navSecondary = [
  {
    title: "Configuración",
    url: "#",
    icon: IconSettings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, currentUserData } = useAuth();

  // Priorizar datos de currentUserData (de /api/users/me) sobre datos de login
  const userData = currentUserData
    ? {
        name: currentUserData.name || `${currentUserData.first_name || ''} ${currentUserData.last_name || ''}`.trim() || "Usuario",
        email: currentUserData.email,
        avatar: currentUserData.picture || "/avatars/default.jpg",
      }
    : user
    ? {
        name: user.name || `${user.user?.first_name || ''} ${user.user?.last_name || ''}`.trim() || "Usuario",
        email: user.email || user.user?.email || "usuario@ejemplo.com",
        avatar: user.picture || "/avatars/default.jpg",
      }
    : {
        name: "Usuario",
        email: "usuario@ejemplo.com",
        avatar: "/avatars/default.jpg",
      };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image 
                  src="/logo2.png" 
                  className={styles.imgLogo} 
                  alt="Logo" 
                  width={32}
                  height={32}
                />
                <span className="text-base font-semibold">Portal RRHH</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userS={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
