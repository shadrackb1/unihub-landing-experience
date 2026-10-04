import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export const Switch = React.forwardRef<
  HTMLElement,
  SwitchPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn("inline-flex h-4 w-8 items-center justify-center rounded-full border border-bg bg-background", className)}
    {...props}
  >
    <SwitchPrimitive.Thumb className="block h-3 w-3 rounded-full bg-ring transition-[transform] duration-200" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export const SwitchThumb = SwitchPrimitive.Thumb;