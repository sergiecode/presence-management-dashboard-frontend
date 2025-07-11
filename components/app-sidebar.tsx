"use client"

import * as React from "react"
import {
  IconCalendar,
  IconChartBar,
  IconFolder,
  IconHome,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import styles from "./sidebar.module.css";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface NavMainProps {
  items: NavItem[];
}

const data = {
  user: {
    name: "Matias Flamini",
    email: "mati@absti.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "#",
      icon: IconSettings,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <img src="/logo2.png" className={styles.imgLogo} alt="Logo" />
                <span className="text-base font-semibold">Portal RRHH</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userS={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
