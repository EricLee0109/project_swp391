import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { notFound } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAuth = await auth();
  if (!userAuth) {
    // Redirect to login or handle unauthenticated state
    notFound();
  }

  return (
    <SidebarProvider>
      <SessionProvider>
        <AppSidebar className="h-screen" />
        <SidebarInset>{children}</SidebarInset>
        <Toaster />
      </SessionProvider>
    </SidebarProvider>
  );
}
