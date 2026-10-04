import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const Tooltip = React.forwardRef<
  HTMLElement,
  TooltipPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Root
    ref={ref}
    className={cn("relative inline-block", className)}
    {...props}
  >
    {children}
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Tooltip />
    </TooltipPrimitive.Provider>
  </TooltipPrimitive.Root>
));
Tooltip.displayName = TooltipPrimitive.Root.displayName;

export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = React.forwardRef<
  HTMLElement,
  TooltipPrimitive.ContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    className={cn(
      "animate-in fade-in-0 zoom-in-95",
      "right-side-offset-[calc(100%+var(--radix-tooltip-side-offset))]",
      "top-side-offset-[calc(100%+var(--radix-tooltip-side-offset))]",
      "bottom-side-offset-[calc(100%+var(--radix-tooltip-side-offset))]",
      "left-side-offset-[calc(100%+var(--radix-tooltip-side-offset))]",
      "data-state=open:animate-in",
      "data-state=closed:fade-out-0",
      "data-state=closed:zoom-out-95",
      "data-state=closed:fade-in-0",
      "data-state=open:zoom-in-95",
      "data-state=closed:zoom-in-95",
      "data-state=open:fade-in-0",
      "data-state=animate-out:fade-out-0",
      "data-state=animate-out:zoom-out-95",
      className
    )}
    style={{ "--radix-tooltip-side-offset": sideOffset }}
    ref={ref}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;