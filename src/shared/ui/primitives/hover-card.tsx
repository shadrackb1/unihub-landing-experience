import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export const HoverCard = React.forwardRef<
  HTMLElement,
  HoverCardPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <HoverCardPrimitive.Root
    ref={ref}
    className={cn("inline-block", className)}
    {...props}
  >
    {children}
  </HoverCardPrimitive.Root>
));
HoverCard.displayName = HoverCardPrimitive.Root.displayName;

export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export const HoverCardContent = React.forwardRef<
  HTMLElement,
  HoverCardPrimitive.ContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    className={cn(
      "animate-in fade-in-0 zoom-in-95",
      "right-side-offset-[calc(100%+var(--radix-hover-card-side-offset))]",
      "top-side-offset-[calc(100%+var(--radix-hover-card-side-offset))]",
      "bottom-side-offset-[calc(100%+var(--radix-hover-card-side-offset))]",
      "left-side-offset-[calc(100%+var(--radix-hover-card-side-offset))]",
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
    style={{ "--radix-hover-card-side-offset": sideOffset }}
    ref={ref}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;