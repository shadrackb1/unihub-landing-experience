import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = DialogPrimitive.Overlay;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = React.forwardRef<
  HTMLElement,
  DialogPrimitive.ContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 grid max-h-[90vh] w-full items-center justify-center",
      "border border-bg bg-card shadow-lg",
      "sm:rounded-xl",
      className
    )}
    {...props}
  />
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-2", className)} ref={ref} {...props} />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div className={cn("text-lg font-semibold leading-none tracking-tight", className)} ref={ref} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div className={cn("text-sm text-muted-foreground", className)} ref={ref} {...props} />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-2", className)} ref={ref} {...props} />
));
DialogFooter.displayName = "DialogFooter";

export {
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};