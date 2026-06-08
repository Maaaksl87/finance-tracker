import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DotBackground from "./dot-bg/DotBackground";

export default function Layout() {
  const location = useLocation();

  const pagesWithoutScroll = ["/saving-plans"];
  const shouldHaveScroll = !pagesWithoutScroll.includes(location.pathname);

  return (
    // <div className="min-h-screen w-full relative">
    <DotBackground>
      <SidebarProvider className="relative isolate h-screen">
        <AppSidebar />
        {/* <SidebarInset className="relative z-10 flex flex-col h-full"> */}
        <div
          className={`flex-1 relative z-10 flex flex-col h-full ${shouldHaveScroll ? "overflow-y-auto p-4" : "overflow-hidden"}`}
        >
          <Outlet />
        </div>
        {/* </SidebarInset> */}
      </SidebarProvider>
    </DotBackground>
    // </div>
  );
}
