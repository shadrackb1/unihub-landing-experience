import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

export const Collapsible = React.forwardRef<
  HTMLElement,
  CollapsiblePrimitive.RootProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={cn("collapse-collapse", className)}
    {...props}
  />
));
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = React.forwardRef<
  HTMLElement,
  CollapsiblePrimitive.ContentProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn("collapse-content", className)}
    {...props}
  />
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;