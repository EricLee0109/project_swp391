import { auth } from "@/auth";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { RoleTypeEnums } from "@/types/enums/HealthServiceEnums";

export default async function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSession = await auth();
  const userRole = userSession?.user.role;

  return (
    <PermissionGuard
      requiredRole={RoleTypeEnums.Staff}
      fallbackPath={`/${userRole?.toLowerCase()}/dashboard`}
    >
      {children}
    </PermissionGuard>
  );
}
