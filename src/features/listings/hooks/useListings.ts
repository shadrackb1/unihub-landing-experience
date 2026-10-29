import { useEffect, useState } from "react";
import { sampleListings, type SampleListing } from "@/data/listings";
import type { Property, Hostel } from "@/shared/types/admin";

export function useListings(): SampleListing[] {
  const [listings, setListings] = useState<SampleListing[]>(sampleListings);

  useEffect(() => {
    let live = true;
    import("@/legacy/services/firestore")
      .then(async (m) => {
        try {
          const [properties, hostels] = await Promise.all([
            m.getProperties("available"),
            m.getHostels(),
          ]);
          const mapped: SampleListing[] = [
            ...properties.map((p: Property) => ({
              id: p.id,
              title: p.title,
              location: p.location,
              category: p.categoryId ?? "Room",
              price: `KES ${Number(p.price ?? 0).toLocaleString()}`,
              deposit: p.deposit
                ? `Deposit: KES ${Number(p.deposit).toLocaleString()}`
                : "Deposit: 1 month",
              image: p.media?.[0]?.secure_url ?? sampleListings[0]!.image,
            })),
            ...hostels.map((h: Hostel) => ({
              title: h.name,
              location: h.location,
              category:
                h.hostel_type === "girls"
                  ? "Girls hostel"
                  : h.hostel_type === "boys"
                    ? "Boys hostel"
                    : "Hostel",
              price: "KES —",
              deposit: "Shared facilities",
              image: h.images?.[0]?.secure_url ?? sampleListings[1]!.image,
            })),
          ];
          if (live && mapped.length > 0) setListings(mapped);
        } catch {
          // offline or empty — keep sample listings
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return listings;
}
