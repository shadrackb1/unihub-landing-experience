import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as AlertPrimitive from "@radix-ui/react-alert";

const Alert = React.forwardRef<
  HTMLElement,
  AlertPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <AlertPrimitive.Root
    ref={ref}
    className={cn("rounded-border border border-bg bg-card p-6", className)}
    {...props}
  />
));
Alert.displayName = AlertPrimitive.Root.displayName;

const AlertTitle = React.forwardRef<
  HTMLElement,
  AlertPrimitive.TitleProps
>(({ className, ...props }, ref) => (
  <AlertPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = AlertPrimitive.Title.displayName;

const AlertDescription = React.forwardRef<
  HTMLElement,
  AlertPrimitive.DescriptionProps
>(({ className, ...props }, ref) => (
  <AlertPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDescription.displayName = AlertPrimitive.Description.displayName;

export { Alert, AlertTitle, AlertDescription };