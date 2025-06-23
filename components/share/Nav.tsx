import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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

const   Nav = () => {
  return (
    <div className="bg-black transition-all duration-300">
      <MaxWidthWrapper className="flex justify-evenly gap-5 items-center">
        <NavigationMenu>
          <NavigationMenuList>
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
          </NavigationMenuList>
        </NavigationMenu>
      </MaxWidthWrapper>
    </div>
  );
};

export default Nav;

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
