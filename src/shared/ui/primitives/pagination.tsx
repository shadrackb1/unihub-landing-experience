import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as PaginationPrimitive from "@radix-ui/react-pagination";

export const Pagination = React.forwardRef<
  HTMLElement,
  PaginationPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <PaginationPrimitive.Root
    ref={ref}
    className={cn("inline-flex items-center justify-center rounded-md border border-bg bg-card px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent/10 data-[state=active]:bg-accent/20", className)}
    {...props}
  >
    {children}
  </PaginationPrimitive.Root>
));
Pagination.displayName = PaginationPrimitive.Root.displayName;

export const PaginationContent = PaginationPrimitive.Content;
export const PaginationList = PaginationPrimitive.List;
export const PaginationNext = PaginationPrimitive.Next;
export const PaginationPrevious = PaginationPrimitive.Previous;