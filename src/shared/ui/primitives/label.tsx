import * as React from "react";
import { cn } from "@/shared/utils/cn";

export const Label = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    className={cn("text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)}
    ref={ref}
    {...props}
  />
));
Label.displayName = "Label";