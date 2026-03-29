import { Brain, Home, Inbox, Search, Settings, Wallet, Coins } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

// Menu items.
const items = [
  {
    title: "Головна",
    url: "/",
    icon: Home,
  },
  {
    title: "Транзакції",
    url: "/transactions",
    icon: Inbox,
  },
  {
    title: "Джерела",
    url: "/sources",
    icon: Wallet,
  },
  {
    title: "Аналітика",
    url: "/stats",
    icon: Search,
  },
  // {
  //   title: "Бюджети",
  //   url: "/budgets",
  //   icon: Settings,
  // },
  {
    title: "Плани заощаджень",
    url: "/saving-plans",
    icon: Coins,
  },

  {
    title: "AI Асистент",
    url: "/ai",
    icon: Brain,
  },
  {
    title: "Налаштування", // TODO: Перемістити вниз sidebar-menu
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarHeader className="relative h-12 flex flex-row items-center overflow-hidden pr-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pr-2">
        <span className="min-w-0 flex-1 text-lg font-bold font-heading truncate group-data-[collapsible=icon]:hidden">
          PennyWise
        </span>
        <SidebarTrigger className="absolute  top-1/2 right-2 size-8 shrink-0 -translate-y-1/2 transition-[right,transform] duration-200 ease-linear group-data-[collapsible=icon]:right-1/2 group-data-[collapsible=icon]:translate-x-1/2" />
      </SidebarHeader>
      <div className="mx-2 border-b border-sidebar-border/80" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/"
                        ? pathname === "/"
                        : pathname === item.url || pathname.startsWith(`${item.url}/`)
                    }
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
