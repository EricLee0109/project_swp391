import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { auth } from "@/auth";
import { authJWT } from "@/lib/auth";
import React from "react";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "../profile/MaxWidthWrapper";

const stisCategories = [
  { id: 1, title: "Chlamydia" },
  { id: 2, title: "Gonorrhea" },
  { id: 3, title: "Syphilis" },
  { id: 4, title: "Herpes" },
  { id: 5, title: "HPV" },
  { id: 6, title: "HIV/AIDS" },
  { id: 7, title: "Trichomoniasis" },
  { id: 8, title: "Viêm gan B" },
];

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
                <NavigationMenuLink
                  href="/dashboard"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                  )}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold">
                Các loại STIs
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white text-black">
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  {stisCategories.map((item) => (
                    <ListItem
                      key={item.id}
                      title={item.title}
                      href={`/stis/${item.id}`}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blog"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                )}
              >
                Bài đăng
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/sexualHealthServices"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                )}
              >
                Dịch vụ y tế
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/consultant"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                )}
              >
                Tư vấn viên
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && type && !isStaffConsultantRole && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/menstrualCycle"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                  )}
                >
                  Chu kỳ kinh nguyệt
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </MaxWidthWrapper>
    </div>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
