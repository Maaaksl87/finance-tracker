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
          background: `
            radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
                radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
                radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
                radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
                linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
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
