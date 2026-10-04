import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as CarouselPrimitive from "@radix-ui/react-carousel";

export const Carousel = React.forwardRef<
  HTMLElement,
  CarouselPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <CarouselPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    {children}
  </CarouselPrimitive.Root>
));
Carousel.displayName = CarouselPrimitive.Root.displayName;

export const CarouselContent = CarouselPrimitive.Content;
export const CarouselItem = CarouselPrimitive.Item;
export const CarouselNext = CarouselPrimitive.Next;
export const CarouselPrevious = CarouselPrimitive.Previous;
export const CarouselIndicator = CarouselPrimitive.Indicator;
export const CarouselIndicatorGroup = CarouselPrimitive.IndicatorGroup;