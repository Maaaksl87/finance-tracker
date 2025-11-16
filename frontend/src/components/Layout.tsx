import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger /> {/* button-icon for toggle sidebar */}
        {children}
      </main>

      <div className="fixed bottom-4 right-4">
        <ModeToggle />
      </div>
    </SidebarProvider>
  );
}
