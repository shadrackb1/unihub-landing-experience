import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export const AspectRatio = React.forwardRef<
  HTMLElement,
  AspectRatioPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn("relative block max-w-full", className)}
    {...props}
  >
    <AspectRatioPrimitive.AspectRatio>{children}</AspectRatioPrimitive.AspectRatio>
  </AspectRatioPrimitive.Root>
));
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;