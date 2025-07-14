"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { notify } from "@/lib/toastNotify";
import { cn } from "@/lib/utils"; // Nếu dùng Tailwind để hợp nhất className

export function LogoutButton({
  type,
  className,
}: {
  type: "jwt" | "oauth";
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        notify("success", "Đăng xuất thành công!");

        if (type === "jwt") {
          // await logout();
          await signOut();
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          setTimeout(() => {
            signOut({ callbackUrl: "/" });
          });
        }
      } catch {
        notify("error", "Đăng xuất thất bại.");
      }
    });
  };

  return (
    <p
      onClick={handleLogout}
      className={cn(
        "text-red-600 cursor-pointer hover:underline",
        isPending && "opacity-50 pointer-events-none",
        className
      )}
    >
      {isPending ? "Đang thoát..." : "Đăng xuất"}
    </p>
  );
}
