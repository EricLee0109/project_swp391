"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Bell,
  CircleUser,
  ClipboardList,
  Heart,
  MessageCircleQuestion,
  Settings,
} from "lucide-react";
import { LogoutButton } from "@/components/login/LogoutButton";
import { User } from "@/types/user/User";

type ProfileUserType = {
  full_name: string;
  email: string;
  image: string | null;
};

interface ProfileLayoutProps {
  children: React.ReactNode;
  user: ProfileUserType;
  type: string;
}

const navItems = [
  { title: "Hồ sơ", icon: CircleUser, href: "/profile" },
  { title: "Danh sách", icon: Heart, href: "/profile/ComingSoon" },
  { title: "Lịch sử", icon: ClipboardList, href: "/profile/order" },
  { title: "Câu hỏi", icon: MessageCircleQuestion, href: "/profile/questions" },
  { title: "Thông báo", icon: Bell, href: "/profile/ComingSoon" },
  { title: "Cài đặt", icon: Settings, href: "/profile/settings" },
];
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu profile");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const displayName = user?.full_name || "User";
  const displayEmail = user?.email || "user@example.com";
  const avatarUrl =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  return (
    <MaxWidthWrapper>
      <div className="grid grid-cols-12 gap-3">
        {/* Sidebar */}
        <div className="col-span-3 py-5">
          <div className="mb-5 flex gap-3 items-center">
            <Avatar className="h-10 w-10 border shadow-sm">
              {loading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <>
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{displayName[0]}</AvatarFallback>
                </>
              )}
            </Avatar>
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="font-semibold text-lg">{displayName}</div>
                  <div className="text-zinc-500 text-sm">{displayEmail}</div>
                </>
              )}
            </div>
          </div>

          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex gap-3 p-3 w-full hover:bg-zinc-200 active:bg-zinc-300",
                    pathname === item.href &&
                      "text-pink-500 font-semibold bg-orange-100 hover:bg-orange-100 active:bg-orange-200"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="my-3" />
          <div className="px-2 pb-2">
            <LogoutButton type="jwt" />
          </div>
        </div>

        {/* Content */}
        <div className="col-span-9">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
