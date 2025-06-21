import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { authJWT } from "@/lib/auth";
import { notFound } from "next/navigation";

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
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
