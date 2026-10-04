import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

export const Separator = React.forwardRef<
  HTMLElement,
  SeparatorPrimitive.RootProps
>(({ className, orientation = "horizontal", ...props }, ref) => {
  const [horizontalClass] =
    orientation === "vertical"
      ? ["h-full w-[1px]"]
      : ["w-full h-[1px]"];

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      className={cn(horizontalClass, className)}
      {...props}
    />
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName;