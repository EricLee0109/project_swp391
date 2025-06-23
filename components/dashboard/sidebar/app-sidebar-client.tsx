"use client";

import * as React from "react";
import { ChartPie, CircleUserRound, RectangleEllipsis } from "lucide-react";

import { NavMain } from "./nav-main";

import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/ServiceType/HealthServiceType";

const navMain = [
  {
    title: "Tổng quan",
    url: "/dashboard",
    icon: ChartPie,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard", // same as main
      },
    ],
  },
  {
    title: "Người dùng",
    url: "/dashboard/user",
    icon: CircleUserRound,
    isActive: true,
    items: [
      {
        title: "Tài khoản",
        url: "/dashboard/user",
      },
      {
        title: "Nhân viên (Quản lý cuộc hẹn)",
        url: "/dashboard/appointment/view",
      },
      {
        title: "Nhân viên (Quản lý vận chuyển)",
        url: "/dashboard/shipping/view",
      },
      {
        title: "Khách hàng",
        url: "/dashboard/customer",
      },
    ],
  },
  {
    title: "Đặt lịch",
    url: "/dashboard/schedule",
    icon: CircleUserRound,
    isActive: true,
    items: [
      {
        title: "Tư vấn viên khách hàng",
        url: "/dashboard/schedule",
      },
    ],
  },
  {
    title: "Khác",
    url: "#",
    icon: RectangleEllipsis,
    items: [
      {
        title: "Blog",
        url: "/blog",
      },
    ],
  },
];

const defaultUser: User = {
  user_id: "default-user-id",
  email: "email@gmail.com",
  full_name: "Default User",
  fullName: "Default User", // Alias for full_name
  phone_number: "09291838293",
  // Avatar is not in the User schema, but added here for UI display purposes.
  // In a real app, this might come from a separate profile table or a CDN URL.
  avatar: "/avatars/shadcn.jpg",
  // role: "Admin",
};
// Define the component's props
interface AppSidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null; // User can be null if not logged in
}

export function AppSidebarClient({ user, ...props }: AppSidebarClientProps) {
  const displayUser = user || defaultUser;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-pink-500  text-sidebar-primary-foreground">
              <Image
                src="/logo.png"
                alt="Logo"
                width={24}
                height={24}
                className="size-6 "
              />
            </div>
            <Link href="/">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text font-bold">
                  <span className="text-pink-500">YC</span>Directory
                </span>
                <span className="truncate text-xs">Welcome back </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
