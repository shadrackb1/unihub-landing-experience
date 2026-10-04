import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as BadgePrimitive from "@radix-ui/react-badge";

export const Badge = React.forwardRef<
  HTMLElement,
  BadgePrimitive.RootProps
>(({ className, variant = "default", ...props }, ref) => {
  const [variantClass] =
    variant === "outline"
      ? ["border-transparent"]
      : ["bg-accent text-accent-foreground"];

  return (
    <BadgePrimitive.Root
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-border border border-bg bg-muted px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClass,
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = BadgePrimitive.Root.displayName;