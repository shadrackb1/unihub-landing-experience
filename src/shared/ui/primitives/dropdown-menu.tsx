import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = React.forwardRef<
  HTMLElement,
  DropdownMenuPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Root>
));
DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName;

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = DropdownMenuPrimitive.Content;
export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
export const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSubContent = DropdownMenuPrimitive.SubContent;
export const DropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger;