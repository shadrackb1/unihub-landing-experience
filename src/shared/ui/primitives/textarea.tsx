import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as TextareaPrimitive from "@radix-ui/react-textarea";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaPrimitive.RootProps
>(({ className, ...props }, ref) => (
  <TextareaPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-[8rem] w-full rounded-md border border-bg bg-background px-3 py-2 text-sm ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = TextareaPrimitive.Root.displayName;