import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export const ContextMenu = React.forwardRef<
  HTMLElement,
  ContextMenuPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  >
    {children}
  </ContextMenuPrimitive.Root>
));
ContextMenu.displayName = ContextMenuPrimitive.Root.displayName;

export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuContent = ContextMenuPrimitive.Content;
export const ContextMenuItem = ContextMenuPrimitive.Item;
export const ContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
export const ContextMenuRadioItem = ContextMenuPrimitive.RadioItem;
export const ContextMenuSeparator = ContextMenuPrimitive.Separator;
export const ContextMenuSubTrigger = ContextMenuPrimitive.SubTrigger;
export const ContextMenuSubContent = ContextMenuPrimitive.SubContent;