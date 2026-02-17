import { Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Сторінки без скролу
  // TODO: ЗАРЕФАКТОРИТИ ТА ЗНАЙТИ ОПТИМАЛЬНИЙ СПОСІБ
  const pagesWithoutScroll = ["/saving-plans"];
  const shouldHaveScroll = !pagesWithoutScroll.includes(location.pathname);

  return (
    <SidebarProvider className="bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div
          className={`flex-1 p-4 ${shouldHaveScroll ? "overflow-y-auto" : "overflow-hidden"}`}>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
