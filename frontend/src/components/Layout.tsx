import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "./ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "./ui/breadcrumb";
import { BackgroundGlow } from "./BackgroundGlow";

export default function Layout() {
  const location = useLocation();

  // Сторінки без скролу
  // TODO: ЗАРЕФАКТОРИТИ ТА ЗНАЙТИ ОПТИМАЛЬНИЙ СПОСІБ
  const pagesWithoutScroll = ["/saving-plans"];
  const shouldHaveScroll = !pagesWithoutScroll.includes(location.pathname);

  // const currentRoute = matches[matches.length - 1];
  // const pageTitle = (currentRoute?.handle as { title?: string })?.title || 'Сторінка';
  return (
    <SidebarProvider className="relative isolate h-dvh">
      <BackgroundGlow />
      <AppSidebar />
      <SidebarInset className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between h-16 gap-2 px-4 shrink-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  {/* <BreadcrumbPage>{pageTitle}</BreadcrumbPage> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <div
          className={`flex-1 h-0 ${shouldHaveScroll ? "overflow-y-auto px-4" : "overflow-hidden"}`}
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
