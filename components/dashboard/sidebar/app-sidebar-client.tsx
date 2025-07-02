"use client";

import * as React from "react";
import {
  ChartPie,
  LucideHospital,
  LucideIcon,
  ShipIcon,
  TimerIcon,
  Users,
} from "lucide-react";

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
  user_id: "fbc86115-b464-41f4-8f31-5d326102d73b",
  email: "consultant1@gmail.com",
  exp: 1750675866,
  fullName: "consultant1",
  iat: 1750668666,
  isActive: true,
  isVerified: true,
  role: "Consultant",
  sub: "fbc86115-b464-41f4-8f31-5d326102d73b",
  created_at: "2024-06-22T07:31:06.000Z",
  updated_at: "2024-06-22T07:31:06.000Z",
  avatar:
    "https://plus.unsplash.com/premium_photo-1681426472026-60d4bf7b69a1?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  phone_number: "0123456789",
  is_active: true,
  is_verified: true,
};
// Define the component's props
interface AppSidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null; // User can be null if not logged in
}

interface SubNavItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SubNavItem[]; // Made optional, but ensure it's explicitly defined or handled where used
}

export function AppSidebarClient({ user, ...props }: AppSidebarClientProps) {
  const displayUser = user || defaultUser;

  // Define navigation items for each role
  const getNavigationByRole = (role: string): NavItem[] => {
    const baseNavigation: NavItem[] = [
      {
        title: "Tổng quan",
        url: `/${role.toLowerCase()}/dashboard`,
        icon: ChartPie,
        isActive: true,
        items: [
          {
            title: "Dashboard",
            url: `/${role.toLowerCase()}/dashboard`,
          },
        ],
      },
    ];

    switch (role) {
      case "Admin":
        return [
          ...baseNavigation,
          {
            title: "Quản lý người dùng",
            url: "/admin/dashboard/user",
            icon: Users,
            isActive: true,
            items: [
              {
                title: "Danh sách người dùng",
                url: "/admin/dashboard/user",
              },
            ],
          },
        ];

      case "Manager":
        return [
          ...baseNavigation,
          {
            title: "Quản lý nhân viên",
            url: "/manager/dashboard/healthServices",
            icon: LucideHospital,
            isActive: true,
            items: [
              {
                title: "Danh sách các dịch vụ",
                url: "/manager/dashboard/healthServices/view",
              },
            ],
          },
           {
            title: "Quản lý tư vấn viên",
            url: "/manager/dashboard/consultant-check",
            icon: LucideHospital,
            isActive: true,
            items: [
              {
                title: "Danh sách tư vấn viên",
                url: "/manager/dashboard/consultant-check/view",
              },
            ],
          },
          {
            title: "Quản lý người dùng",
            url: "/manager/dashboard/user",
            icon: Users,
            isActive: true,
            items: [
              {
                title: "Danh sách người dùng",
                url: "/manager/dashboard/user",
              },
            ],
          },
        ];

      case "Consultant":
        return [
          ...baseNavigation,
          {
            title: "Lịch hẹn của tư vấn viên",
            url: "/consultant/dashboard/schedule",
            icon: Users,
            isActive: true,
            items: [
              {
                title: "Lịch hẹn",
                url: "/consultant/dashboard/schedule",
              },
            ],
          },
        ];

      case "Staff":
        return [
          ...baseNavigation,
          {
            title: "Quản lý các cuộc hẹn",
            url: "/staff/dashboard/appointment",
            icon: TimerIcon,
            isActive: true,
            items: [
              {
                title: "Danh sách các cuộc hẹn",
                url: "/staff/dashboard/appointment/view",
              },
            ],
          },
          {
            title: "Quản lý các đơn của khách hàng",
            url: "/staff/dashboard/shipping",
            icon: ShipIcon,
            isActive: true,
            items: [
              {
                title: "Danh sách các đơn của khách hàng",
                url: "/staff/dashboard/shipping/view",
              },
            ],
          },
        ];
      default:
        return baseNavigation;
    }
  };

  // Get navigation items based on user role
  const navMain = React.useMemo(() => {
    if (!user || !user.role) {
      return getNavigationByRole("default");
    }
    return getNavigationByRole(user.role);
  }, [user]);

  console.log("User role in sidebar:", user?.role);
  console.log("Navigation items:", navMain);

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
