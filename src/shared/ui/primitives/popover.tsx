import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export const Popover = React.forwardRef<
  HTMLElement,
  PopoverPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Root
    ref={ref}
    className={cn("relative z-50 max-h-[var(--radix-popover-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  >
    {children}
  </PopoverPrimitive.Root>
));
Popover.displayName = PopoverPrimitive.Root.displayName;

export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverContent = PopoverPrimitive.Content;
export const PopoverArrow = PopoverPrimitive.Arrow;
export const PopoverClose = PopoverPrimitive.Close;