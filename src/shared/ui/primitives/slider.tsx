import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as SliderPrimitive from "@radix-ui/react-slider";

export const Slider = React.forwardRef<
  HTMLElement,
  SliderPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative w-full touch-none", className)}
    {...props}
  >
    {children}
    <SliderPrimitive.Track className="h-0.5 bg-bg" />
    <SliderPrimitive.Range className="h-0.5 bg-primary" />
    <SliderPrimitive.Thumb className="shrink-0 box-content size-4 rounded-full bg-primary ring-4 ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=disabled]:pointer-events-none" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export const SliderTrack = SliderPrimitive.Track;
export const SliderRange = SliderPrimitive.Range;
export const SliderThumb = SliderPrimitive.Thumb;