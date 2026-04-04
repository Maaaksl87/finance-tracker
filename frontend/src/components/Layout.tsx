import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout() {
  const location = useLocation();

  const pagesWithoutScroll = ["/saving-plans"];
  const shouldHaveScroll = !pagesWithoutScroll.includes(location.pathname);

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "var(--bg-gradient)",
        }}
      />
      <SidebarProvider className="relative isolate h-dvh">
        <AppSidebar />
        <SidebarInset className="relative z-10 flex flex-col h-full">
          <div
            className={`flex-1 h-0 ${shouldHaveScroll ? "overflow-y-auto p-4" : "overflow-hidden"}`}
          >
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
