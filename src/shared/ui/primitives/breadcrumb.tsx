import * as React from "react";
import { cn } from "@/shared/utils/cn";

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, children, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("inline-flex items-center space-x-1 text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </ol>
));
Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbItem = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  >
    {children}
  </li>
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn("rounded-md px-2 py-1 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent", className)}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbSeparator = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("mx-2", className)}
    {...props}
  />
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbEllipsis = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("mx-2", className)}
    {...props}
  />
));
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export const BreadcrumbPage = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("px-2 py-1 text-sm font-semibold", className)}
    {...props}
  >
    {children}
  </span>
));
BreadcrumbPage.displayName = "BreadcrumbPage";