import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const AlertDialog = React.forwardRef<
  HTMLElement,
  AlertDialogPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <AlertDialogPrimitive.Root
    ref={ref}
    className={cn("fixed inset-0 z-50 grid items-center pointer-events-none", className)}
    {...props}
  >
    <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[-1]" />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-xl border-t border-bg bg-card shadow-lg focus-visible:outline-none",
        className
      )}
      {...props}
    />
  </AlertDialogPrimitive.Root>
));
AlertDialog.displayName = AlertDialogPrimitive.Root.displayName;

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogContent = React.forwardRef<
  HTMLElement,
  AlertDialogPrimitive.ContentProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Content
    ref={ref}
    className={cn(
      "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] w-full overflow-y-auto rounded-t-xl border-t border-bg bg-card shadow-lg focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export const AlertDialogHeader = React.forwardRef<
  HTMLElement,
  AlertDialogPrimitive.HeaderProps
>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-4", className)} ref={ref} {...props} />
));
AlertDialogHeader.displayName = AlertDialogPrimitive.Header.displayName;

export const AlertDialogTitle = React.forwardRef<
  HTMLElement,
  AlertDialogPrimitive.TitleProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export const AlertDialogDescription = React.forwardRef<
  HTMLElement,
  AlertDialogPrimitive.DescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

export const AlertDialogFooter = React.forwardRef<
  HTMLElement,
  AlertDialogPrimitive.FooterProps
>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-4", className)} ref={ref} {...props} />
));
AlertDialogFooter.displayName = AlertDialogPrimitive.Footer.displayName;