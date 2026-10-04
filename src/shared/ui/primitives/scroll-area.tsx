import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export const ScrollArea = React.forwardRef<
  HTMLElement,
  ScrollAreaPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative", className)}
    {...props}
  >
    {children}
    <ScrollAreaPrimitive.Scrollbar />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export const ScrollAreaScrollbar = ScrollAreaPrimitive.Scrollbar;
export const ScrollAreaCorner = ScrollAreaPrimitive.Corner;
export const ScrollAreaViewport = ScrollAreaPrimitive.Viewport;