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

const defaultUser: User = {
  email: "consultant1@gmail.com",
  exp: 1750675866,
  fullName: "consultant1",
  iat: 1750668666,
  isActive: true,
  isVerified: true,
  role: "Consultant",
  sub: "fbc86115-b464-41f4-8f31-5d326102d73b",
};
// Define the component's props
interface AppSidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null; // User can be null if not logged in
}

export function AppSidebarClient({ user, ...props }: AppSidebarClientProps) {
  const displayUser = user || defaultUser;

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
  console.log(user?.role, "user in sidebar");
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
