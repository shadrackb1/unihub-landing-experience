import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as SheetPrimitive from "@radix-ui/react-sheet";

export const Sheet = React.forwardRef<
  HTMLElement,
  SheetPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Root
    ref={ref}
    className={cn("fixed inset-0 z-50 grid items-end justify-center pointer-events-none", className)}
    {...props}
  >
    <SheetPrimitive.Overlay className="fixed inset-0 z-[-1]" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-xl border-t border-bg bg-card shadow-lg focus-visible:outline-none",
        className
      )}
      {...props}
    />
  </SheetPrimitive.Root>
));
Sheet.displayName = SheetPrimitive.Root.displayName;

export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetContent = React.forwardRef<
  HTMLElement,
  SheetPrimitive.ContentProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Content
    ref={ref}
    className={cn(
      "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-xl border-t border-bg bg-card shadow-lg focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

export const SheetHeader = React.forwardRef<
  HTMLElement,
  SheetPrimitive.HeaderProps
>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-4", className)} ref={ref} {...props} />
));
SheetHeader.displayName = SheetPrimitive.Header.displayName;

export const SheetFooter = React.forwardRef<
  HTMLElement,
  SheetPrimitive.FooterProps
>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-4", className)} ref={ref} {...props} />
));
SheetFooter.displayName = SheetPrimitive.Footer.displayName;