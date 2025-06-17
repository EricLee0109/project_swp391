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

const data = {
  user: {
    name: "Admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/dashboard",
      icon: ChartPie,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },

    {
      title: "Người dùng",
      url: "dashboard/user",
      icon: CircleUserRound,
      isActive: true,
      items: [
        {
          title: "Tài khoản",
          url: "dashboard/user",
        },
        {
          title: "Nhân viên",
          url: "/user/staff",
        },
        {
          title: "Khách hàng",
          url: "/user/customer",
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-pink-500  text-sidebar-primary-foreground">
             <Image src="/logo.png" alt="Logo" width={24} height={24} className="size-6 " />

            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text font-bold">
                <span className="text-pink-500">YC</span>Directory
              </span>
              <span className="truncate text-xs">Welcome back </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
