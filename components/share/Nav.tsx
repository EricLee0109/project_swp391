import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import electricGuitarImage from "@/assets/imgs/electric-guitar.png";
import React from "react";
import { cn } from "@/lib/utils";
import brandData from "@/data/brands.json"; // Adjust the path as necessary
import MaxWidthWrapper from "../profile/MaxWidthWrapper";
import Image from "next/image";
const Navbar = () => {
  const brands: { title: string; href: string; description?: string }[] =
    brandData.map((brand: any) => ({
      title: brand.brandName,
      href: `/search?brand=${brand.id}`,
    }));
  return (
    <div className="bg-orange-600 transition-all duration-300">
      <MaxWidthWrapper className="flex justify-evenly gap-5 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold">
                Danh mục
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/search?category=1"
                      >
                        <Image
                          src={electricGuitarImage}
                          alt="Electric Guitar"
                          className="mb-5"
                          width={500}
                          height={300}
                        />

                        <div className="mb-2 mt-4 text-lg font-medium">
                          Guitar Điện
                        </div>
                        <p className="text-xs leading-tight text-muted-foreground">
                          Sử dụng bộ phận thu điện để chuyển đổi độ rung của dây
                          đàn thành tín hiệu điện, phù hợp với nhiều phong cách
                          âm nhạc khác nhau.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/search?category=9" title="Acoustic Guitars">
                    Tạo ra âm thanh thông qua sự rung động của dây đàn và thân
                    đàn guitar.
                  </ListItem>
                  <ListItem href="/search?category=2" title="Bass Guitars">
                    Cung cấp âm thanh tần số thấp cần thiết cho nhịp điệu và sự
                    hòa âm trong âm nhạc.
                  </ListItem>
                  <ListItem href="/search?category=4" title="Phụ kiện">
                    Nâng cao trải nghiệm chơi guitar của bạn
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold">
                Thương hiệu
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px] ">
                  {brands.map((brand) => (
                    <ListItem
                      key={brand.title}
                      title={brand.title}
                      href={brand.href}
                    >
                      {brand.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/second-hand"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                )}
              >
                Hàng cũ
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/course"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                )}
              >
                Khóa học guitar
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/tuner"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-white hover:text-white hover:bg-white/20 rounded-none uppercase font-bold"
                )}
              >
                Online tuner
              </NavigationMenuLink>
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

export default Navbar;
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
