"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CircleUser,
  ClipboardList,
  DoorOpen,
  Heart,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "../login/LogoutButton";

type UserType = {
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  avatar?: string | null;
  full_name?: string | null;
};

const navItems = [
  { title: "Hồ sơ", icon: CircleUser, href: "/profile" },
  { title: "Danh sách", icon: Heart, href: "/profile/favourite" },
  { title: "Lịch sử", icon: ClipboardList, href: "/profile/order" },
  { title: "Thông báo", icon: Bell, href: "/profile/notification" },
  { title: "Cài đặt", icon: Settings, href: "/profile/settings" },
];

export default function ProfileMenu({
  user,
  type,
}: {
  user: UserType;
  type: "jwt" | "oauth";
}) {
  const displayName = user?.fullName || user?.name || user.full_name || "User";
  const displayEmail = user?.email || "user@example.com";
  const avatarUrl =
    user?.avatar || `https://ui-avatars.com/api/?name=${displayName}`;
  // console.log("user" + type, user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="rounded-full overflow-hidden cursor-pointer">
          <Avatar className="h-10 w-10 border shadow-sm">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName[0]}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white text-black border shadow-lg rounded-md z-50">
        <DropdownMenuLabel>
          <div>Tài khoản của tôi</div>
          <p className="text-zinc-500 text-sm font-normal">{displayEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {navItems.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                href={item.href}
                className="cursor-pointer gap-2 flex items-center"
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 cursor-pointer gap-2">
          <DoorOpen className="h-4 w-4" />
          <div className="pl-1">
            <LogoutButton type={type} />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
