import * as React from "react";
import { cn } from "@/shared/utils/cn";

export const Resizable = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn("relative", className)}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
Resizable.displayName = "Resizable";

export const ResizableHandle = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("absolute inset-0", className)}
    ref={ref}
    {...props}
  >
  </div>
));
ResizableHandle.displayName = "ResizableHandle";