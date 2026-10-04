import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export const NavigationMenu = React.forwardRef<
  HTMLElement,
  NavigationMenuPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative w-full flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

export const NavigationMenuContent = NavigationMenuPrimitive.Content;
export const NavigationMenuIndicator = NavigationMenuPrimitive.Indicator;
export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export const NavigationMenuLink = NavigationMenuPrimitive.Link;
export const NavigationMenuList = NavigationMenuPrimitive.List;
export const NavigationMenuViewport = NavigationMenuPrimitive.Viewport;