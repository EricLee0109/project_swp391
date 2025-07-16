"use client";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface CategoryItem {
  id: number;
  title: string;
}

export const Categories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const services: { category: string }[] = await res.json();

        const unique = Array.from(
          new Set(services.map((s) => s.category).filter(Boolean))
        );

        const mapped = unique.map((c, i) => ({ id: i + 1, title: c }));
        setCategories(mapped);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold">
        Các loại STIs
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white text-black">
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
          {categories.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              href={`/sexualHealthServices?category=${encodeURIComponent(
                item.title
              )}`}
            />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

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
