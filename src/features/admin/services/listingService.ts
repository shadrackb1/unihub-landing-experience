import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/server/db";
import { requireRole } from "@/server/authz";
import { ListingFormSchema, type ListingFormData } from "@/features/admin/components/ListingForm";

/**
 * Server function to create a new listing.
 * Validates input with the same Zod schema used by the client form.
 * Only ADMIN role can call this.
 */
export const createListing = createServerFn({ method: "POST" })
  .validator(ListingFormSchema)
  .handler(async ({ data }) => {
    const user = await requireRole(await fetch("/api/auth/session").then(r => r.headers), ["ADMIN"]);

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        location: data.location,
        category: data.category,
        price: data.price * 100, // convert to cents
        deposit: data.deposit ? data.deposit * 100 : 0,
        description: data.description,
        amenities: data.amenities ?? "[]",
        whatsappNumber: data.whatsappNumber ?? "",
        email: data.email ?? "",
        videoClip: data.videoClip ?? "",
        status: "AVAILABLE",
        isVerified: false,
        landlordId: user.id,
        userId: user.id,
      },
    });

    return { id: listing.id, success: true };
  });

/**
 * Server function to update an existing listing.
 * Only the listing owner or ADMIN can call this.
 */
export const updateListing = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string().cuid(),
    ...ListingFormSchema.shape,
  }))
  .handler(async ({ data }) => {
    const user = await requireRole(await fetch("/api/auth/session").then(r => r.headers), ["ADMIN", "LANDLORD"]);

    const existing = await prisma.listing.findUnique({ where: { id: data.id } });
    if (!existing) throw new Error("Listing not found");

    if (user.role !== "ADMIN" && existing.landlordId !== user.id) {
      throw new Error("Not authorised to edit this listing");
    }

    const { id, ...updateData } = data;
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        title: updateData.title,
        location: updateData.location,
        category: updateData.category,
        price: updateData.price * 100,
        deposit: updateData.deposit ? updateData.deposit * 100 : 0,
        description: updateData.description,
        amenities: updateData.amenities ?? "[]",
        whatsappNumber: updateData.whatsappNumber ?? "",
        email: updateData.email ?? "",
        videoClip: updateData.videoClip ?? "",
      },
    });

    return { id: listing.id, success: true };
  });