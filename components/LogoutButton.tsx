"use client";

import { useTransition } from "react";
import { logout } from "@/app/api/auth/actions/logout";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toastNotify";

export function LogoutButton({ type }: { type: "jwt" | "oauth" }) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        if (type === "jwt") {
          await logout();
          notify("success", "Đăng xuất thành công!");
        } else {
          notify("success", "Đăng xuất thành công!");
          setTimeout(() => {
            signOut({ callbackUrl: "/" });
          }, 1000); // Cho thời gian để hiện toast
        }
      } catch {
        notify("error", "Đăng xuất thất bại.");
      }
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending} variant="outline">
      {isPending ? "Đang thoát..." : "Logout"}
    </Button>
  );
}
