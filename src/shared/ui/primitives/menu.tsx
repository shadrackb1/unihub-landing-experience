import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as MenuPrimitive from "@radix-ui/react-menu";

export const Menu = React.forwardRef<
  HTMLElement,
  MenuPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.Root
    ref={ref}
    className={cn("relative z-50 max-h-[var(--radix-menu-content-available-height)] min-w-[64px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  >
    {children}
  </MenuPrimitive.Root>
));
Menu.displayName = MenuPrimitive.Root.displayName;

export const MenuTrigger = MenuPrimitive.Trigger;
export const MenuContent = MenuPrimitive.Content;
export const MenuItem = MenuPrimitive.Item;
export const MenuCheckboxItem = MenuPrimitive.CheckboxItem;
export const MenuRadioGroup = MenuPrimitive.RadioGroup;
export const MenuRadioItem = MenuPrimitive.RadioItem;
export const MenuSeparator = MenuPrimitive.Separator;
export const MenuSubContent = MenuPrimitive.SubContent;
export const MenuSubTrigger = MenuPrimitive.SubTrigger;