import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = React.forwardRef<
  HTMLElement,
  TabsPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  >
    {children}
  </TabsPrimitive.Root>
));
Tabs.displayName = TabsPrimitive.Root.displayName;

export const TabsList = TabsPrimitive.List;
export const TabsTrigger = TabsPrimitive.Trigger;
export const TabsContent = TabsPrimitive.Content;