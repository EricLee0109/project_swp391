import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { authJWT } from "@/lib/auth";
import { notFound } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSession = await authJWT();
  if (!userSession) {
    // Redirect to login or handle unauthenticated state
    notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar className="h-screen" />
      <SidebarInset>{children}</SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
