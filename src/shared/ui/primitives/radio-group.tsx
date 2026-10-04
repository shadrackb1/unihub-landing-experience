import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export const RadioGroup = React.forwardRef<
  HTMLElement,
  RadioGroupPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  >
    {children}
  </RadioGroupPrimitive.Root>
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = RadioGroupPrimitive.Item;
export const RadioGroupLabel = RadioGroupPrimitive.Label;