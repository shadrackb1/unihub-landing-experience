import * as React from "react";
import { cn } from "@/shared/utils/cn";

export const Avatar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn(
      "flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  HTMLElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    className={cn(
      "h-full w-full rounded-full",
      className
    )}
    ref={ref}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "h-full w-full flex items-center justify-center rounded-full bg-primary text-primary-foreground",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";