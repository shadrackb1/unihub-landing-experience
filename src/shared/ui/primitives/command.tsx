import * as React from "react";
import { cn } from "@/shared/utils/cn";
import * as CommandPrimitive from "@radix-ui/react-command";

const Command = React.forwardRef<
  HTMLElement,
  CommandPrimitive.RootProps
>(({ className, children, ...props }, ref) => (
  <CommandPrimitive.Root
    ref={ref}
    className={cn("relative w-full max-w-[320px]", className)}
    {...props}
  >
    {children}
  </CommandPrimitive.Root>
));
Command.displayName = CommandPrimitive.Root.displayName;

const CommandDialog = CommandPrimitive.Dialog;
const CommandEmpty = CommandPrimitive.Empty;
const CommandGroup = CommandPrimitive.Group;
const CommandItem = CommandPrimitive.Item;
const CommandInput = CommandPrimitive.Input;
const CommandList = CommandPrimitive.List;
const CommandPicker = CommandPrimitive.Picker;
const CommandSeparator = CommandPrimitive.Separator;
const CommandShortcut = CommandPrimitive.Shortcut;
const CommandViewport = CommandPrimitive.Viewport;

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
  CommandPicker,
  CommandSeparator,
  CommandShortcut,
  CommandViewport,
};