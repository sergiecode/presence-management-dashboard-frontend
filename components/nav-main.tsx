"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
  }[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  // Ordenamos las rutas para evitar que /dashboard se active para todas
  const sortedItems = [...items].sort((a, b) => b.url.length - a.url.length);
  const currentItem = sortedItems.find((item) => pathname.startsWith(item.url));
  const currentUrl = currentItem?.url;

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = item.url === currentUrl;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={`data-[slot=sidebar-menu-button]:p-2 transition-colors rounded-md hover:bg-muted ${
                isActive ? "bg-muted text-primary hover:bg-muted" : ""
              }`}
            >
              <Link href={item.url} className="flex items-center gap-2">
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
