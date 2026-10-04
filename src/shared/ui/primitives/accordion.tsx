import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

export const Accordion = React.forwardRef<
  HTMLElement,
  AccordionPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Root>
));
Accordion.displayName = AccordionPrimitive.Root.displayName;

export const AccordionItem = AccordionPrimitive.Item;
export const AccordionHeader = AccordionPrimitive.Header;
export const AccordionTrigger = AccordionPrimitive.Trigger;
export const AccordionContent = AccordionPrimitive.Content;