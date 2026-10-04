import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as ProgressPrimitive from "@radix-ui/react-progress";

export const Progress = React.forwardRef<
  HTMLElement,
  ProgressPrimitive.RootProps
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("h-1.5 w-full rounded-full bg-border", className)}
    {...props}
  />
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export const ProgressIndicator = ProgressPrimitive.Indicator;
export const ProgressMarker = ProgressPrimitive.Marker;
export const ProgressLabel = ProgressPrimitive.Label;