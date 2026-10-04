import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

export const ToggleGroup = React.forwardRef<
  HTMLElement,
  ToggleGroupPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("inline-flex items-center rounded-md border border-input bg-background px-2 py-0.5 text-sm font-medium transition-colors hover:bg-accent/10 data-[state=active]:bg-accent/20", className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export const ToggleGroupItem = ToggleGroupPrimitive.Item;