import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const FIRST_NAME = "Nattapat";
const LAST_NAME = "Srirung";
const STUDENT_ID = "680610675";

export default function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium">จัดการวิชาเรียนและสถานะนักศึกษา</span>
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <Footer
          firstName={FIRST_NAME}
          lastName={LAST_NAME}
          studentId={STUDENT_ID}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
