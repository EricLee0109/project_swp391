import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { auth } from "@/auth";
import { authJWT } from "@/lib/auth";
import React from "react";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "../profile/MaxWidthWrapper";
import Link from "next/link";

import { Categories } from "./Categories";


export default async function Nav() {
  const session = await authJWT();
  const ggSession = await auth();
  const role = ggSession?.user.role;
  let user = null;
  let type: "jwt" | "oauth" | null = null;
  if (session?.user) {
    user = session.user;
    type = "jwt";
  } else if (ggSession?.user) {
    user = ggSession.user;
    type = "oauth";
  }

  const isStaffConsultantRole =
    role === "Staff" || role === "Consultant" ? true : false;

  return (
    <div className="bg-black transition-all duration-300">
      <MaxWidthWrapper className="flex justify-evenly gap-5 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {isStaffConsultantRole && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/dashboard"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                    )}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

           <Categories />

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                  )}
                >
                  Bài đăng
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/sexualHealthServices"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                  )}
                >
                  Dịch vụ y tế
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/consultant"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                  )}
                >
                  Tư vấn viên
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {user && type && !isStaffConsultantRole && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/menstrualCycle"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                    )}
                  >
                    Chu kỳ kinh nguyệt
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </MaxWidthWrapper>
    </div>
  );
}
