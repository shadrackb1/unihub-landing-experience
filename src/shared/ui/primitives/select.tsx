import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as SelectPrimitive from "@radix-ui/react-select";

export const Select = React.forwardRef<
  HTMLElement,
  SelectPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Root
    ref={ref}
    className={cn("relative w-[var(--radix-select-trigger-width)] min-w-[8rem]", className)}
    {...props}
  >
    <SelectPrimitive.Group className="flex flex-col space-y-1">{children}</SelectPrimitive.Group>
  </SelectPrimitive.Root>
));
Select.displayName = SelectPrimitive.Root.displayName;

export const SelectTrigger = SelectPrimitive.Trigger;
export const SelectValue = SelectPrimitive.Value;
export const SelectContent = SelectPrimitive.Content;
export const SelectItem = SelectPrimitive.Item;
export const SelectSeparator = SelectPrimitive.Separator;
export const SelectGroup = SelectPrimitive.Group;
export const SelectScrollUpButton = SelectPrimitive.ScrollUpButton;
export const SelectScrollDownButton = SelectPrimitive.ScrollDownButton;