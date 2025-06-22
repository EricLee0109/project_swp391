import { AppSidebarClient } from "@/components/dashboard/sidebar/app-sidebar-client";
import { Sidebar } from "@/components/ui/sidebar";
import { authJWT } from "@/lib/auth";

// This is a Server Component, so it can be async
export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // 1. Fetch data on the server
  const session = await authJWT();
  const user = session?.user || null;

  // 2. Render the client component and pass the data as a prop
  return <AppSidebarClient user={user} {...props} />;
}
