import { Brain, Home, Inbox, Search, Settings, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  {
    title: "Бюджети",
    url: "/budgets",
    icon: Settings,
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
  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Трекер витрат</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
    </Sidebar>
  );
}