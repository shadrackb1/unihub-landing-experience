"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/lib/utils";

/**
 * Zod schema for a property listing form.
 * This schema defines validation rules and serves as the single source of truth
 * for both client and server validation.
 */
export const ListingFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  location: z.string().min(3, "Location is required").max(100, "Location too long"),
  category: z.enum(["HOSTEL", "BEDSITTER", "SINGLE_ROOM", "STUDIO", "SHARED_APARTMENT"], {
    error: "Category is required",
  }),
  price: z.coerce
    .number()
    .int()
    .positive("Price must be a positive number")
    .max(1000000, "Price too high"),
  deposit: z.coerce
    .number()
    .int()
    .min(0, "Deposit cannot be negative")
    .max(1000000, "Deposit too high")
    .optional(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description too long"),
  amenities: z.string().optional(),
  whatsappNumber: z
    .string()
    .regex(/^254[0-9]{9}$/, "WhatsApp number must be in format 2547XXXXXXXXX")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  videoClip: z.string().optional(),
});

export type ListingFormData = z.infer<typeof ListingFormSchema>;

interface ListingFormProps {
  /** Initial values when editing an existing listing */
  initialData?: Partial<ListingFormData>;
  /** Called on successful submit with validated data */
  onSubmit: (data: ListingFormData) => Promise<void>;
  /** Submit button label */
  submitLabel?: string;
  /** Whether the form is in a loading state */
  isLoading?: boolean;
}

/**
 * A validated listing form using React Hook Form + Zod.
 *
 * This component demonstrates the validated form pattern required for CAT 1:
 * - Zod schema defines validation rules (single source of truth)
 * - React Hook Form handles form state and validation
 * - @hookform/resolvers/zod connects the two
 * - Server-side validation mirrors the same schema via the API route
 */
export function ListingForm({
  initialData,
  onSubmit,
  submitLabel = "Save Listing",
  isLoading = false,
}: ListingFormProps) {
  const form = useForm<z.input<typeof ListingFormSchema>, unknown, ListingFormData>({
    resolver: zodResolver(ListingFormSchema),
    defaultValues: {
      title: "",
      location: "",
      category: "BEDSITTER",
      price: 0,
      deposit: 0,
      description: "",
      amenities: "",
      whatsappNumber: "",
      email: "",
      videoClip: "",
      ...initialData,
    },
    mode: "onBlur",
  });

  const onSubmitHandler = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done by the caller
      console.error("Form submit error:", error);
    }
  });

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="e.g., Modern Bedsitter in Juja Town"
            disabled={isLoading}
            aria-invalid={form.formState.errors.title ? "true" : "false"}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" /> {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={form.watch("category")}
            onValueChange={(
              value: "HOSTEL" | "BEDSITTER" | "SINGLE_ROOM" | "STUDIO" | "SHARED_APARTMENT",
            ) => form.setValue("category", value)}
            disabled={isLoading}
          >
            <SelectTrigger
              id="category"
              aria-invalid={form.formState.errors.category ? "true" : "false"}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOSTEL">Hostel</SelectItem>
              <SelectItem value="BEDSITTER">Bedsitter</SelectItem>
              <SelectItem value="SINGLE_ROOM">Single Room</SelectItem>
              <SelectItem value="STUDIO">Studio</SelectItem>
              <SelectItem value="SHARED_APARTMENT">Shared Apartment</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" />{" "}
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (KES/month) *</Label>
          <Input
            id="price"
            type="number"
            {...form.register("price")}
            placeholder="9500"
            disabled={isLoading}
            aria-invalid={form.formState.errors.price ? "true" : "false"}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" /> {form.formState.errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deposit">Deposit (KES)</Label>
          <Input
            id="deposit"
            type="number"
            {...form.register("deposit")}
            placeholder="9500"
            disabled={isLoading}
            aria-invalid={form.formState.errors.deposit ? "true" : "false"}
          />
          {form.formState.errors.deposit && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" /> {form.formState.errors.deposit.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...form.register("location")}
            placeholder="e.g., Near JKUAT, Juja"
            disabled={isLoading}
            aria-invalid={form.formState.errors.location ? "true" : "false"}
          />
          {form.formState.errors.location && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" />{" "}
              {form.formState.errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            rows={4}
            placeholder="Describe the property in detail..."
            disabled={isLoading}
            aria-invalid={form.formState.errors.description ? "true" : "false"}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" />{" "}
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input
            id="amenities"
            {...form.register("amenities")}
            placeholder="Wifi, Water, Security, Parking, Laundry"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            {...form.register("whatsappNumber")}
            placeholder="2547XXXXXXXXX"
            disabled={isLoading}
            aria-invalid={form.formState.errors.whatsappNumber ? "true" : "false"}
          />
          {form.formState.errors.whatsappNumber && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" />{" "}
              {form.formState.errors.whatsappNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="landlord@example.com"
            disabled={isLoading}
            aria-invalid={form.formState.errors.email ? "true" : "false"}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive" role="alert">
              <AlertCircle className="inline size-3 mr-1" /> {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading || form.formState.isSubmitting}
          className={cn("gap-2", isLoading && "opacity-50 cursor-not-allowed")}
        >
          {isLoading || form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
