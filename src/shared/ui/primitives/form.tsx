import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/shared/utils/cn";
import { Label } from "@/shared/ui/primitives/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  fieldName: TName;
  field: ControllerProps<TFieldValues, TName>["control"];
  form: ReturnType<typeof useFormContext<TFieldValues>>;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export const FormField = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(FormFieldContext);
  const Comp = context?.asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {context ? (
        <>
          <Label htmlFor={context.fieldName}>
            {context.fieldName as unknown as string}
          </Label>
          <Controller
            asChildren={false}
            name={context.fieldName as string}
            control={context.field.control}
            render={({ field }) => (
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                {children(field)}
              </div>
            )}
          />
          {context.fieldName in context.form.formState.errors && (
            <p className="text-sm text-destructive">
              {context.form.formState.errors[context.fieldName as keyof typeof context.form.formState.errors]?.message}
            </p>
          )}
        </>
      ) : (
        <>
          <slot name="label" />
          <slot name="control" />
          <slot name="error" />
        </>
      )}
    </Comp>
  );
});
FormField.displayName = "FormField";