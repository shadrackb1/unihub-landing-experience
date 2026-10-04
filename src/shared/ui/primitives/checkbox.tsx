import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  CheckboxPrimitive.RootProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex h-4 w-4 items-center justify-center rounded-border border-border bg-background text-primary-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent/20 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;