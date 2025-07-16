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
  MessageCircleQuestion,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "../login/LogoutButton";
import { useEffect, useState } from "react";
import { User } from "@/types/user/User";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // dùng helper cn chuẩn nếu đã có

type ProfileMenuProps = {
  user: User;
  type: "jwt" | "oauth";
};
const navItems = [
  { title: "Hồ sơ", icon: CircleUser, href: "/profile" },
  { title: "Danh sách", icon: Heart, href: "/profile/favourite" },
  { title: "Lịch sử", icon: ClipboardList, href: "/profile/order" },
  { title: "Câu hỏi", icon: MessageCircleQuestion, href: "/profile/questions" },
  { title: "Thông báo", icon: Bell, href: "/profile/notification" },
  { title: "Cài đặt", icon: Settings, href: "/profile/settings" },
];
export default function ProfileMenu({ type }: ProfileMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) throw new Error("Lỗi khi fetch user profile");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };

    fetchUser();
  }, []);

  const displayName = user?.full_name || "Người dùng";
  const avatarUrl =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="rounded-full overflow-hidden cursor-pointer">
          <Avatar className="h-10 w-10 border shadow-sm">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName[0] || "?"}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white text-black border shadow-lg rounded-md z-50">
        <DropdownMenuLabel>
          <div>Tài khoản của tôi</div>
          <p className="text-zinc-500 text-sm font-normal">
            {user?.email || "Đang tải..."}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <DropdownMenuItem key={index} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "gap-2 flex items-center w-full px-2 py-1.5 rounded-md hover:bg-zinc-200 active:bg-zinc-300",
                    isActive &&
                      "text-pink-500 font-semibold bg-orange-100 hover:bg-orange-100 active:bg-orange-200"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            );
          })}
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
