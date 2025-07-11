'use client'

import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si ya cargó y no hay usuario, redirige al login
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])
  const sidebarStyle = {
    backgroundImage: "url('/fondo2.jpg')",
    backgroundSize: "cover",        // hace que se ajuste sin deformarse
    backgroundPosition: "center",   // centra la imagen
    backgroundRepeat: "no-repeat",  // evita que se repita    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)"
  } as React.CSSProperties;

  const glass: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.28)",
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    border: "2px solid rgba(255, 255, 255, 0.3)"
  };
  return (

    <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-transparent">
        <SiteHeader />
        <div className="flex flex-1 flex-col" style={glass}>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-6 max-h-[92vh]">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
<SectionCards />
