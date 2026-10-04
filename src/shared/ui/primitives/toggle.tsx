import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as TogglePrimitive from "@radix-ui/react-toggle";

export const Toggle = React.forwardRef<
  HTMLElement,
  TogglePrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn("inline-flex h-4 w-8 items-center justify-center rounded-full border border-bg bg-background", className)}
    {...props}
  >
    <TogglePrimitive.Thumb className="block h-3 w-3 rounded-full bg-ring transition-[transform] duration-200" />
  </TogglePrimitive.Root>
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export const ToggleThumb = TogglePrimitive.Thumb;