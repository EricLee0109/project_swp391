import { auth } from "@/auth";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { RoleTypeEnums } from "@/types/enums/HealthServiceEnums";

export default async function ConsultantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSession = await auth();
  const userRole = userSession?.user.role;

  return (
    <PermissionGuard
      requiredRole={RoleTypeEnums.Consultant}
      fallbackPath={`/${userRole?.toLowerCase()}/dashboard`}
    >
      {children}
    </PermissionGuard>
  );
}
