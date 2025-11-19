import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full">
        <div className="flex items-center p-4 border-b">
          <SidebarTrigger /> {/* button-icon for toggle sidebar */}
          <span className="ml-4 font-semibold">Expense Tracker</span>
        </div>
        {/* Outlet для рендирингу потрібних сторінок */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      <div className="fixed bottom-4 right-4">
        <ModeToggle /> {/* button-icon for toggle theme */}
      </div>
    </SidebarProvider>
  );
}
