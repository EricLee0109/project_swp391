import { auth } from "@/auth";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { RoleTypeEnums } from "@/types/enums/HealthServiceEnums";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSession = await auth();
  const userRole = userSession?.user.role;

  return (
    <PermissionGuard
      requiredRole={RoleTypeEnums.Admin}
      fallbackPath={`/${userRole?.toLowerCase()}/dashboard`}
    >
      {children}
    </PermissionGuard>
  );
}
