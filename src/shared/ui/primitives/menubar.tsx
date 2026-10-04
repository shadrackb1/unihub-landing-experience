import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as MenuBarPrimitive from "@radix-ui/react-menubar";

export const Menubar = React.forwardRef<
  HTMLElement,
  MenuBarPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <MenuBarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center gap-2", className)}
    {...props}
  >
    {children}
  </MenuBarPrimitive.Root>
));
Menubar.displayName = MenuBarPrimitive.Root.displayName;

export const MenubarTrigger = MenuBarPrimitive.Trigger;
export const MenubarContent = MenuBarPrimitive.Content;
export const MenubarItem = MenuBarPrimitive.Item;
export const MenubarCheckboxItem = MenuBarPrimitive.CheckboxItem;
export const MenubarRadioGroup = MenuBarPrimitive.RadioGroup;
export const MenubarRadioItem = MenuBarPrimitive.RadioItem;
export const MenubarSeparator = MenuBarPrimitive.Separator;
export const MenubarSubContent = MenuBarPrimitive.SubContent;
export const MenubarSubTrigger = MenuBarPrimitive.SubTrigger;