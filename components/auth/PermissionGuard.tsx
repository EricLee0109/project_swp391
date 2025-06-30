"use client";
import Loading from "@/app/(root)/loading";
import { Role } from "@/types/user/User";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole: Role | undefined;
  fallbackPath?: string;
}

const PermissionGuard = ({
  children,
  requiredRole,
  fallbackPath,
}: PermissionGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("Current user role:", session?.user?.role);
  console.log("Required role:", requiredRole);
  console.log("Session status:", status);

  useEffect(() => {
    // Don't redirect while loading
    if (status === "loading") return;

    // If no session, redirect to login
    if (!session) {
      router.push("/login");
      return;
    }

    // If requiredRole is undefined, allow access (optional protection)
    if (requiredRole === undefined) {
      console.log("No required role specified, allowing access");
      return;
    }

    // If user doesn't have the required role, redirect to their dashboard
    if (session.user.role !== requiredRole) {
      if (session.user.role === "Customer") {
        router.push("/");
        return;
      }
      const redirectPath =
        fallbackPath || `/${session.user.role.toLowerCase()}/dashboard`;
      console.log("Redirecting to:", redirectPath);
      router.push(redirectPath);
      return;
    }

    console.log("Access granted - user has required role");
  }, [session, status, requiredRole, router, fallbackPath]);

  // Show loading while session is being fetched
  if (status === "loading") {
    return <Loading />;
  }

  // If no session, show nothing (will redirect to login)
  if (!session) {
    return null;
  }

  // If requiredRole is undefined, allow access
  if (requiredRole === undefined) {
    return <>{children}</>;
  }

  // If user doesn't have required role, show nothing (will redirect)
  if (session.user.role !== requiredRole) {
    return null;
  }

  // User has the required role, show the protected content
  return <>{children}</>;
};

export default PermissionGuard;
