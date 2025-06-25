"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Bell, CircleUser, ClipboardList, Heart, Settings } from "lucide-react";
import { LogoutButton } from "@/components/login/LogoutButton";

type UserType = {
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  avatar?: string | null;
};

const navItems = [
  {
    title: "Hồ sơ",
    icon: CircleUser,
    href: "/profile",
  },
  {
    title: "Danh sách ",
    icon: Heart,
    href: "/profile/favourite",
  },
  {
    title: "Lịch sử ",
    icon: ClipboardList,
    href: "/profile/order",
  },
  {
    title: "Thông báo",
    icon: Bell,
    href: "/profile/notification",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/profile/settings",
  },
];

export default function ProfileLayout({
  children,
  user,
  type,
}: {
  children: React.ReactNode;
  user: UserType;
  type: "jwt" | "oauth";
}) {
  const pathname = usePathname();
  const displayName = user?.fullName || user?.name || "User";
  const displayEmail = user?.email || "user@example.com";
  const avatarUrl =
    user?.avatar || `https://ui-avatars.com/api/?name=${displayName}`;

  return (
    <MaxWidthWrapper className="">
      <div className="grid grid-cols-12 gap-3">
        {/* Sidebar */}
        <div className="col-span-3 py-5">
          <div className="mb-5 flex gap-3 items-center">
            <Avatar className="h-10 w-10 border shadow-sm">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{displayName}</div>
              <div className="text-zinc-500 text-sm">{displayEmail}</div>
            </div>
          </div>

          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={index}>
                <button
                  className={cn(
                    "flex gap-3 p-3 w-full hover:bg-zinc-200 active:bg-zinc-300",
                    pathname === item.href &&
                      "text-orange-600 font-semibold bg-orange-100 hover:bg-orange-100 active:bg-orange-200"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </button>
              </li>
            ))}
          </ul>

          <hr className="my-3" />
          <div className="px-2 pb-2">
            <LogoutButton type={type} />
          </div>
        </div>

        {/* Content */}
        <div className="col-span-9">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
